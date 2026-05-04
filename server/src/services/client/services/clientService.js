import AppError from "#src/shared/utils/appError.js";

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
            .trim();
    }
    async createClient(clientData, adminData) {
        try {
            const { name, email, description, website } = clientData;

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
            return client;
        } catch (error) {
            throw error;
        }
    }
}

export default ClientService;
