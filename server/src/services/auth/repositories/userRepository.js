import logger from "#src/shared/config/logger.js";
import BaseRepository from "./baseRepository.js";
import User from "#src/shared/models/user.js";

class MongoUserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async create(userData) {
        try {
            let data = { ...userData };
            if (data.role === "super_admin" && !data.permissions) {
                data.permissions = {
                    canCreateApiKeys: true,
                    canManageUsers: true,
                    canViewAnalytics: true,
                    canExportData: true,
                };
            }
            const user = new this.model(data);
            await user.save();
            logger.info(`User created: ${user.username}`);
            return user;
        } catch (error) {
            logger.error("User creation failed", error.message);
            throw error;
        }
    }

    async findById(userId) {
        try {
            const user = await this.model.findById(userId);
            return user;
        } catch (error) {
            logger.error("Error finding user by id", error);
            throw error;
        }
    }

    async findByUsername(username) {
        try {
            const user = await this.model.findOne({ username });
            return user;
        } catch (error) {
            logger.error("Error finding user by username", error);
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            const user = await this.model.findOne({ email });
            return user;
        } catch (error) {
            logger.error("Error finding user by email", error);
            throw error;
        }
    }

    async findSuperAdmin() {
        try {
            return await this.model.findOne({ role: "super_admin" });
        } catch (error) {
            logger.error("Error finding super admin", error);
            throw error;
        }
    }

    async findAll() {
        try {
            const user = await this.model
                .find({ isActive: true })
                .select("-password");
            return user;
        } catch (error) {
            logger.error("Error finding users", error);
            throw error;
        }
    }
}
const MongoUserRepo = new MongoUserRepository();
export default MongoUserRepo;
