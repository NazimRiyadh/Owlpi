import logger from "#src/shared/config/logger.js";
import AppError from "#src/shared/utils/appError.js";
import jwt from "jsonwebtoken";
import config from "#src/shared/config/index.js";
import bcrypt from "bcryptjs";
import { APPLICATION_ROLES } from "#src/shared/constants/roles.js";

export class AuthService {
    constructor(userRepository) {
        if (!userRepository) {
            logger.error("Repository required");
            throw new Error("Repository required");
        }
        this.userRepository = userRepository;
    }

    generateToken(user) {
        const { _id, email, username, role, clientId } = user;

        const payload = {
            userId: _id,
            username,
            email,
            role,
            clientId,
        };

        return jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        });
    }

    async comparePassword(enteredPassword, hashedpassword) {
        return bcrypt.compare(enteredPassword, hashedpassword);
    }

    sanitizeUser(userDoc) {
        const u = userDoc?.toObject ? userDoc.toObject() : { ...userDoc };
        delete u.password;
        return u;
    }

    async onboardSuperAdmin(superAdminData) {
        try {
            const existingUser = await this.userRepository.findAll();

            if (existingUser && existingUser.length > 0) {
                throw new AppError("Super admin onboarding is disabled", 403);
            }

            const user = await this.userRepository.create(superAdminData);
            const token = this.generateToken(user);

            logger.info("Admin onboarded successfully", {
                username: user.username,
            });

            return {
                user: this.sanitizeUser(user),
                token,
            };
        } catch (error) {
            logger.error("Error in onboarding Super admin", error);
            throw error;
        }
    }

    async createSystemAdmin(systemAdminData) {
        try {
            const user = await this.userRepository.create(systemAdminData);
            logger.info("System admin created successfully", {
                username: user.username,
            });
            return this.sanitizeUser(user);
        } catch (error) {
            logger.error("Error creating system admin", error);
            throw error;
        }
    }


    async login(username, password) {
        try {
            const user = await this.userRepository.findByUsername(username);
            if (!user) {
                throw new AppError("Invalid Credentials", 401);
            }
            if (!user.isActive) {
                throw new AppError("User is not active", 403);
            }

            const isPassValid = await this.comparePassword(
                password,
                user.password,
            );

            if (!isPassValid) {
                throw new AppError("Invalid Credentials", 401);
            }

            const token = this.generateToken(user);
            logger.info("User logged in Successfully");
            return {
                user: this.sanitizeUser(user),
                token,
            };
        } catch (error) {
            logger.error("Error in login process", error);
            throw error;
        }
    }
    async getProfile(userId) {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new AppError("User not found", 404);
            }
            const userProfile = user.toObject();
            delete userProfile.password;
            return userProfile;
        } catch (error) {
            logger.error("Error fetching profile", error);
            throw error;
        }
    }

    async checkSuperAdmin(userId) {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new AppError("User not found", 404);
            }
            return user.role === APPLICATION_ROLES.SUPER_ADMIN;
        } catch (error) {
            logger.error("Error checking super admin");
            throw error;
        }
    }
}
