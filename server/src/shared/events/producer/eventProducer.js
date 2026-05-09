import { EVENT_TYPES } from "../eventContracts.js";
import { isRetryable } from "./retryStrategy.js";

export default class EventProducer {
    constructor({
        channelManager,
        circuitBreaker,
        retryStrategy,
        logger,
        queueName,
    }) {
        if (!channelManager)
            throw new Error("EventProducer requires channelManager");
        if (!circuitBreaker)
            throw new Error("EventProducer requires circuitBreaker");
        if (!retryStrategy)
            throw new Error("EventProducer requires retryStrategy");
        if (!queueName) throw new Error("EventProducer requires queueName");

        this._channelManager = channelManager;
        this._circuitBreaker = circuitBreaker;
        this._retry = retryStrategy;
        this._logger = logger ?? console;
        this._queueName = queueName;

        this._metrics = {
            published: 0,
            failed: 0,
            retriesExhausted: 0,
        };

        this._shuttingDown = false;
    }

    _incrementMetric(metric) {
        this._metrics[metric] = (this._metrics[metric] || 0) + 1;
    }

    async _publish(eventData, { correlationId, attempt }) {
        const channel = await this._channelManager.getChannel();

        const message = {
            type: EVENT_TYPES.API_HIT,
            data: eventData,
            publishedAt: new Date().toISOString(),
            attempt: attempt + 1,
        };

        const buffer = Buffer.from(JSON.stringify(message));

        const publishOptions = {
            persistent: true,
            contentType: "application/json",
            messageId: eventData.eventId,
            correlationId,
            timestamp: Math.floor(Date.now() / 1000),
        };

        return new Promise((resolve, reject) => {
            const written = channel.publish(
                "",
                this._queueName,
                buffer,
                publishOptions,
                (error) => {
                    if (error)
                        return reject(
                            new Error(`Publish nacked, ${error.message}`),
                        );
                    resolve();
                },
            );

            if (!written) {
                this._logger.info(
                    "[Event producer back preassure detected, wait for drain",
                );
            }

            const onDrain = () => {
                channel.removeListener("drain", onDrain);
                this._logger.debug("[Event producer] drain event recieved", {
                    eventId: eventData.eventId,
                });
            };
            channel.once("drain", onDrain);
        });
    }

    async shutdown() {
        this._shuttingDown = true;
        this._logger.info("[Event producer] shutting Down");
        await this._channelManager.close();
        this._logger.info("[Event producer] shut down");
    }

    getStats() {
        return {
            metrics: { ...this._metrics },
            curcuitBreaker: this._circuitBreaker.snapshot(),
        };
    }

    async publishApiHit(eventData, opts = {}) {
        if (this._shuttingDown) {
            const error = new Error("EventProducer is shutting down");
            error.code = "SHUTDOWN_IN_PROGRESS";
            this._logger.info(
                "[EventProducer] publish rejected — shutting down",
                {
                    eventId: eventData.eventId,
                },
            );
            throw error;
        }

        // Check circuit breaker before attempting to publish the event.
        // If the circuit is open, we reject the publish attempt immediately to avoid overwhelming the message broker
        // and to allow it time to recover.
        // This also helps to fail fast and provide quicker feedback to the caller
        // about the unavailability of the service.
        if (!this._circuitBreaker.allowRequest()) {
            this._logger.info(
                "[EventProducer] circuit breaker rejected publish",
                {
                    eventId: eventData.eventId,
                    state: this._circuitBreaker.state,
                },
            );
            return false;
        }

        const correlationId = opts.correlationId ?? eventData.eventId;
        const startMs = Date.now();
        let attempt = 0;

        while (true) {
            try {
                await this._publish(eventData, { correlationId, attempt });
                const latencyMs = Date.now() - startMs;
                this._circuitBreaker.onSuccess();
                this._incrementMetric("published");

                this._logger.info("[EventProducer] published", {
                    eventId: eventData.eventId,
                    correlationId,
                    attempt: attempt + 1,
                    latencyMs,
                    endpoint: eventData.endpoint,
                });

                return true;
            } catch (error) {
                this._logger.error("[EventProducer] publish attempt failed", {
                    eventId: eventData.eventId,
                    correlationId,
                    attempt: attempt + 1,
                    error: error.message,
                });

                const canRetry =
                    isRetryable(error) && this._retry.shouldRetry(attempt);

                if (!canRetry) {
                    this._circuitBreaker.onFailure();
                    this._incrementMetric("failed");
                    if (!this._retry.shouldRetry(attempt)) {
                        this._incrementMetric("retriesExhausted");
                    }
                    throw error;
                }

                await this._retry.wait(attempt);
                attempt++;
            }
        }
    }
}
