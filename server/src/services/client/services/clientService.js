import AppError from "#src/shared/utils/appError.js";
import {
    APPLICATION_ROLES,
    isValidClientRole,
} from "#src/shared/constants/roles.js";
import logger from "#src/shared/config/logger.js";
import crypto from "node:crypto";
import securityUtils from "#src/shared/utils/securityUtils.js";
import { v4 as uuidv4 } from "uuid";
import ResponseFormat from "#src/shared/utils/responseFormat.js";

class ClientService {
    constructor(dependencies) {
        if (!dependencies) {
            throw new Error("Dependencies are required");
        }

        if (!dependencies.clientRepository) {
            throw new Error("Dependencies are required");
        }

        if (!dependencies.apiKeyRepository) {
            throw new Error("Dependencies are required");
        }

        if (!dependencies.userRepository) {
            throw new Error("Dependencies are required");
        }

        this.clientRepository = dependencies.clientRepository;
        this.apiKeyRepository = dependencies.apiKeyRepository;
        this.userRepository = dependencies.userRepository;
    }

    formatClientResponse(user) {
        const userObject = user.toObject ? user.toObject() : { ...user };
        delete userObject.password;
        return userObject;
    }

    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    canUserAccessClient(user, clientId) {
        if (user.role === APPLICATION_ROLES.SUPER_ADMIN) {
            return true;
        }

        return (
            user.clientId && user.clientId.toString() === clientId.toString()
        );
    }

    generateApiKey() {
        const prefix = "apim";
        const randomBytes = crypto.randomBytes(20).toString("hex");
        return `${prefix}_${randomBytes}`;
    }

    async createClient(clientData, adminData) {
        try {
            const {
                name,
                email,
                description,
                website,
                adminUsername,
                adminPassword,
            } = clientData;

            const slug = this.generateSlug(name);
            const existClient = await this.clientRepository.findBySlug(slug);

            if (existClient) {
                throw new AppError(`Client with ${slug} slug exists`, 400);
            }

            const client = await this.clientRepository.create({
                name,
                slug,
                email,
                description,
                website,
                createdBy: adminData.userId,
            });

            // Create initial client admin
            if (adminUsername && adminPassword) {
                await this.createClientUser(
                    client._id,
                    {
                        username: adminUsername,
                        email: email, // Use client contact email as admin email
                        password: adminPassword,
                        role: APPLICATION_ROLES.CLIENT_ADMIN,
                    },
                    adminData,
                );
            }

            return client;
        } catch (error) {
            throw error;
        }
    }

    async getAllClients(adminUser) {
        try {
            if (adminUser.role !== APPLICATION_ROLES.SUPER_ADMIN) {
                throw new AppError("Access denied", 403);
            }
            return await this.clientRepository.find();
        } catch (error) {
            logger.error("Error getting all clients", error);
            throw error;
        }
    }

    async getClientUsers(clientId, adminUser) {
        try {
            if (!this.canUserAccessClient(adminUser, clientId)) {
                throw new AppError("Access denied", 403);
            }

            const users = await this.userRepository.model
                .find({ clientId })
                .select("-password");
            return users;
        } catch (error) {
            logger.error("Error getting client users", error);
            throw error;
        }
    }

    async createClientUser(clientId, userData, adminUser) {
        try {
            if (!this.canUserAccessClient(adminUser, clientId)) {
                throw new AppError("Access denied", 403);
            }

            // Only Client Admins (and Super Admins) can create users
            if (
                adminUser.role !== APPLICATION_ROLES.SUPER_ADMIN &&
                adminUser.role !== APPLICATION_ROLES.CLIENT_ADMIN
            ) {
                throw new AppError(
                    "Only Client Administrators can create new users",
                    403,
                );
            }

            const {
                username,
                email,
                password,
                role = APPLICATION_ROLES.CLIENT_VIEWER,
            } = userData;

            if (!isValidClientRole(role)) {
                throw new AppError("Invalid role for client user", 400);
            }

            // Prevent privilege escalation
            // Only Super Admins can create new Client Admins
            if (
                role === APPLICATION_ROLES.CLIENT_ADMIN &&
                adminUser.role !== APPLICATION_ROLES.SUPER_ADMIN
            ) {
                throw new AppError(
                    "Only Super Administrators can create Client Admin users",
                    403,
                );
            }

            const client = await this.clientRepository.findById(clientId);
            if (!client) {
                throw new AppError("Client not found", 404);
            }

            // Set permissions based on role
            let permissions = {
                canCreateApiKeys: false,
                canManageUsers: false,
                canViewAnalytics: true,
                canExportData: false,
            };

            if (role === APPLICATION_ROLES.CLIENT_ADMIN) {
                permissions = {
                    canCreateApiKeys: true,
                    canManageUsers: true,
                    canViewAnalytics: true,
                    canExportData: true,
                };
            }

            const user = await this.userRepository.create({
                username,
                email,
                password,
                role,
                clientId,
                permissions,
            });

            logger.info("Client user created", {
                clientId,
                userId: user._id,
                role,
                createdBy: adminUser.userId || adminUser._id,
            });

            return this.formatClientResponse(user);
        } catch (error) {
            logger.error("Error creating client user", error);
            throw error;
        }
    }

    async createApiKey(clientId, keyData, user) {
        try {
            const client = await this.clientRepository.findById(clientId);

            if (!client) {
                throw new AppError("Client not found", 404);
            }

            if (!this.canUserAccessClient(user, clientId)) {
                throw new AppError("Access denied", 403);
            }

            if (
                !(
                    user.role === APPLICATION_ROLES.SUPER_ADMIN ||
                    user.role === APPLICATION_ROLES.CLIENT_ADMIN
                )
            ) {
                throw new AppError(
                    "Access denied - Only Super Admin and Client Admin can create API keys",
                    403,
                );
            }

            const { name, description, environment = "production" } = keyData;

            const keyId = uuidv4();
            const keyValue = this.generateApiKey();

            const apiKey = await this.apiKeyRepository.create({
                keyId,
                keyValue,
                clientId,
                name,
                description,
                environment,
                createdBy: user.userId,
            });

            return apiKey;
        } catch (error) {
            logger.error("Error creating API key", error);
            throw error;
        }
    }

    async getClientApiKeys(clientId, user) {
        try {
            if (!this.canUserAccessClient(user, clientId)) {
                throw new AppError("Access denied to this client", 403);
            }

            const apiKeys =
                await this.apiKeyRepository.findByClientId(clientId);

            const formattedResponse = apiKeys.map((key) => {
                const keyObj = key.toObject
                    ? key.toObject({ virtuals: true })
                    : { ...key };

                return keyObj;
            });

            return formattedResponse;
        } catch (error) {
            logger.error("Error getting client API keys:", error);
            throw error;
        }
    }

    async getClientByApiKey(apiKey) {
        try {
            const key = await this.apiKeyRepository.findByKeyValue(apiKey);

            if (!key) {
                return null;
            }

            if (key.isExpired()) {
                return null;
            }

            // Get the populated client from the key
            const client = key.clientId;

            return {
                client,
                apiKey: key,
            };
        } catch (error) {
            logger.error("Error finding client by API key:", error);
            throw error;
        }
    }
}

export default ClientService;
