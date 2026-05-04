import BaseClientRepository from "./baseClientRepositories.js";
import Client from "#src/shared/models/client.js";
import logger from "#src/shared/config/logger.js";

class MongoClientRepository extends BaseClientRepository {
    constructor() {
        super(Client);
    }

    async create(clientData) {
        try {
            const client = new this.model(clientData);
            await client.save();

            logger.info("Client create successfully");
            return client;
        } catch (error) {
            logger.error("Error creating client in database");
            throw error;
        }
    }

    async findById(clientId) {
        try {
            const client = await this.model.findById(clientId);
            logger.info("Client found successfully");

            return client;
        } catch (error) {
            logger.error("Error finding client in database");
            throw error;
        }
    }

    async findBySlug(slug) {
        try {
            const client = await this.model.findOne({ slug });
            return client;
        } catch (error) {
            logger.error("Error finding client by slug:", error);
            throw error;
        }
    }

    async find(filters = {}, options = {}) {
        try {
            const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;

            const clients = await this.model
                .find(filters)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select("-__v");

            return clients;
        } catch (error) {
            logger.error("Error finding clients:", error);
            throw error;
        }
    }

    async count(filters = {}) {
        try {
            const count = await this.model.countDocuments(filters);
            return count;
        } catch (error) {
            logger.error("Error counting clients:", error);
            throw error;
        }
    }
}

export default new MongoClientRepository();
