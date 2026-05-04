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
};
