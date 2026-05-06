import { EventEmitter } from "node:events";

export class ConfirmChannelManager extends EventEmitter {
    constructor(rabbitmq, logger) {
        super();

        if (!rabbitmq) {
            throw new Error(
                "Confirm Channel Manager requires RabbitMQ connection",
            );
        }

        this._rabbitmq = rabbitmq;
        this._logger = logger;
        this._channel = null;
        this._connecting = false;
        this._connectWaiters = [];
    }

    async getChannel() {
        if (this._channel) {
            return this.channel;
        }
        if (this._connecting) {
            return new Promise((resolve, reject) => {
                this._connectWaiters.push({ resolve, reject });
            });
        }
        return this.connect();
    }

    async connect() {
        this._connecting = true;
        try {
            let connection;
            if (this._rabbitmq.connection) {
                connection = this._rabbitmq.connection;
            } else {
                await this._rabbitmq.connect();
                if (!baseChannel?.connection) {
                    throw new Error("Failed to connect RabbitMQ");
                }

                connection = this._rabbitmq.connection;
            }
            const confirmChannel = await connection.createConfirmChannel();

            confirmChannel.on("drain", () => this.emit("drain"));
            confirmChannel.on("error", (error) => {
                (this._logger.error("[Channel Manager] confirm channel error"),
                    {
                        error: error.message,
                        stack: error.stack,
                        code: error.code,
                    });
                this._channel = null;
                this.emit("error", error);
            });

            this._channel = confirmChannel;
            this._logger.info("[Confirm Channel manager] ready");

            for (const w of this._connectWaiters) w.resolve(confirmChannel);
            this._connectWaiters = [];
        } catch (error) {
            for (const w of this._connectWaiters) w.reject(error);
            this._connectWaiters = [];
            return error;
        } finally {
            this._connecting = false;
        }
    }
}
