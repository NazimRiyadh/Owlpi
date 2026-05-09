export const createClientSchema = {
    name: {
        required: true,
        minLength: 2,
    },
    email: {
        required: true,
    },
    website: {
        required: false,
    },
    description: {
        required: false,
    },
    adminUsername: {
        required: true,
        minLength: 5,
    },
    adminPassword: {
        required: true,
        minLength: 8,
    },
};
export const createUserSchema = {
    username: {
        required: true,
        minLength: 5,
    },
    email: {
        required: true,
    },
    password: {
        required: true,
        minLength: 8,
    },
    role: {
        required: false,
    },
};
export const createApiKeySchema = {
    name: {
        required: true,
        minLength: 3,
    },
    description: {
        required: false,
    },
    environment: {
        required: false,
    },
};
