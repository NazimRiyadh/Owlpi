import { isValidRole } from "../../../shared/constants/roles.js";

export const onboardSuperAdminSchema = {
    username: {
        required: true,
    },
    email: {
        required: true,
    },
    password: {
        required: true,
        minLength: 8,
    },
};


export const loginSchema = {
    username: { required: true },
    password: { required: true },
};
