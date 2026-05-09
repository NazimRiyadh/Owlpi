import mongoose from "mongoose";
import config from "./index.js";
import logger from "./logger.js";

class MongoConnect {
    constructor() {
        this.connection = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            if (this.isConnected && this.connection) {
                logger.info("MongoDB connection already exists");
                return this.connection;
            }

            const maskedUri = config.mongo.uri ? `${config.mongo.uri.substring(0, 15)}...` : "UNDEFINED";
            logger.info(`Attempting MongoDB connection with URI: ${maskedUri}`);

            await mongoose.connect(config.mongo.uri);

            this.connection = mongoose.connection;
            this.isConnected = true;

            logger.info(`MongoDB connected at: ${config.mongo.dbName}`);

            //catch error after the connection established
            this.connection.on("error", (error) => {
                logger.error("MongoDB connection error:", error);
            });

            this.connection.on("disconnected", () => {
                logger.info("MongoDB disconnected");
                this.isConnected = false;
            });

            return this.connection;
        } catch (error) {
            //catches the error while connecting first time
            logger.error("Failed to connect to MongoDB:", error);
            throw error;
        }
    }

    async disconnect() {
        try {
            if (this.connection) {
                await mongoose.disconnect();
                this.connection = null;
                this.isConnected = false;

                logger.info("MongoDB disconnected");
            }
        } catch (error) {
            logger.error("Failed to disconnect MongoDB:", error);
            throw error;
        }
    }

    getConnection() {
        return this.connection;
    }
}

export default new MongoConnect();
