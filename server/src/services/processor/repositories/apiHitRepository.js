import BaseRepository from "./baseProcessorRepository.js";

class ApiHitRepository extends BaseRepository {
    constructor({ model, logger: l = console } = {}) {
        super({ logger: l });
        this.model = model;
        if (!model) throw new Error("Model is required");
    }

    async save(eventData) {
        try {
            const doc = new this.model(eventData);
            await doc.save();
            return doc;
        } catch (error) {
            if (error && error.code === 11000) {
                this.logger.warn("Duplicate API hit", {
                    eventId: eventData?.eventId,
                });
                return null;
            }
            this.logger.error("Failed to save API hit", {
                eventId: eventData?.eventId,
                error: error.message,
            });
            throw error;
        }
    }

    async find(filter = {}, options = {}) {
        try {
            const {
                limit = 100,
                skip = 0,
                sort = { timestamp: -1 },
            } = options;
            const hits = await this.model
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean();
            return hits;
        } catch (error) {
            this.logger.error("Failed to find API hits", {
                filter,
                options,
                error: error.message,
            });
            throw error;
        }
    }

    async count(filter = {}) {
        try {
            const count = await this.model.countDocuments(filter);
            return count;
        } catch (error) {
            this.logger.error("Failed to count API hits", {
                filter,
                error: error.message,
            });
            throw error;
        }
    }

    async deleteOldHits(cutoffTime) {
        try {
            this.logger.warn("Deleting old hits", {
                cutoffTime: cutoffTime.toISOString(),
                model: this.model.modelName,
            });
            const result = await this.model.deleteMany({
                timestamp: { $lt: cutoffTime },
            });
            this.logger.warn("Deleted old hits", {
                cutoffTime: cutoffTime.toISOString(),
                model: this.model.modelName,
                deletedCount: result.deletedCount,
            });
            return result.deletedCount;
        } catch (error) {
            this.logger.error("Failed to delete old hits", {
                cutoffTime,
                error: error.message,
            });
            throw error;
        }
    }
}

export default ApiHitRepository;
