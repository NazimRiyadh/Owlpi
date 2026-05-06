import config from "#src/shared/config/index.js";
import logger from "#src/shared/config/logger.js";
import rabbitmq from "#src/shared/config/rabbitmq.js";

import { CircuitBreaker } from "./circuitBreaker.js";
import { ConfirmChannelManager } from "./confirmChannelmanager.js";
import { RetryStrategy } from "./retryStrategy.js";
import { EventProducer } from "./eventproducer.js";

export function createEventProducer(overrides = {}) {
    const log = overrides.logger ?? logger;
    const rmq = overrides.rabbitmq ?? rabbitmq;
    const queueName = overrides.queueName ?? config.rabbitmq.queue;

    // Validate critical dependencies
    if (!rmq) throw new Error("RabbitMQ connection manager is required");
    if (!queueName) throw new Error("Queue name must be specified");
    if (!config.rabbitmq.retryAttempts || config.rabbitmq.retryAttempts < 0) {
        throw new Error("Invalid retry attempts configuration");
    }

    const channelManager =
        overrides.channelManager ??
        new ConfirmChannelManager({ rabbitmq: rmq, logger: log });

    const circuitBreaker =
        overrides.circuitBreaker ??
        new CircuitBreaker({
            failureThreshold: 2,
            cooldownMs: 30_000,
            halfOpenMaxAttempts: 3,
            logger: log,
        });

    const retryStrategy =
        overrides.retryStrategy ??
        new RetryStrategy({
            maxRetries: config.rabbitmq.retryAttempts,
            baseDelayMs: config.rabbitmq.retryDelay,
            maxDelayMs: 5_000,
            jitterFactor: 0.3,
        });
    return new EventProducer({
        channelManager,
        circuitBreaker,
        retryStrategy,
        logger: log,
        queueName,
    });
}
