import amqp from "amqplib";
import config from "./index.js";
import logger from "./logger.js";

class RabbitMQConnection {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.isConnecting = false;
    }
    async connect() {
        if (this.connection) {
            logger.info("RabbitMQ connection already exists");
            return this.channel;
        }

        if (this.isConnecting) {
            logger.info("RabbitMQ is already connecting...");
            await new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (!this.isConnecting) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            });
            return this.channel;
        }

        try {
            this.isConnecting = true;
            this.connection = await amqp.connect(config.rabbitmq.uri);
            this.channel = await this.connection.createChannel();

            const deadLetterQueue = `${config.rabbitmq.queue}.dlq`;
            await this.channel.assertQueue(deadLetterQueue, { durable: true });

            const normalQueue = `${config.rabbitmq.queue}`;
            await this.channel.assertQueue(normalQueue, {
                durable: true,
                arguments: {
                    "x-dead-letter-exchange": "",
                    "x-dead-letter-routing-key": deadLetterQueue,
                },
            });
            logger.info("RabbitMQ connected, Queue: ", config.rabbitmq.queue);

            this.connection.on("close", () => {
                logger.warn("RabbitMQ connection closed");
                this.connection = null;
                this.channel = null;
                this.isConnecting = false;
            });

            this.connection.on("error", () => {
                logger.error("RabbitMQ connection error");
                this.connection = null;
                this.channel = null;
            });

            this.isConnecting = false;
            return this.channel;
        } catch (error) {
            this.isConnecting = false;
            logger.error("RabbitMq failed to Connect", error);
            throw error;
        }
    }

    getChannel() {
        if (this.channel) return this.channel;
        throw new Error("RabbitMQ channel not initialized");
    }

    getStatus() {
        if (!this.channel) return "disconnected";

        if (this.isConnecting) return "Connecting";

        return "Connected";
    }
    async close() {
        try {
            if (this.channel) {
                await this.channel.close();
                this.channel = null;
            }
            if (this.connection) {
                await this.connection.close();
                this.connection = null;
            }

            logger.info("RabbitMQ connection closed");
        } catch (error) {
            logger.error("Error in closing RabbitMQ connection:", error);
        }
    }
}

export default new RabbitMQConnection();
