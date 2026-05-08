import express from "express";
import clientDependencies from "../dependencies/dependencies.js";
import authenticate from "#src/shared/middlewares/authenticate.js";
import validate from "#src/shared/middlewares/validate.js";
import {
    createClientSchema,
    createUserSchema,
    createApiKeySchema,
} from "../validate/clientSchema.js";


const router = express.Router();
const { clientController } = clientDependencies.initialized.controllers;

router.use(authenticate);

router.post(
    "/admin/clients/onboard",
    validate(createClientSchema),
    async (req, res, next) => {
        clientController.createClient(req, res, next);
    },
);

router.post(
    "/admin/clients/:clientId/users",
    validate(createUserSchema),
    async (req, res, next) => {
        clientController.createClientUser(req, res, next);
    },
);

router.post(
    "/admin/clients/:clientId/api/keys",
    validate(createApiKeySchema),
    (req, res, next) => clientController.createApiKey(req, res, next),
);

router.get("/admin/clients/:clientId/api/keys", (req, res, next) =>
    clientController.getClientApiKeys(req, res, next),
);

export default router;
