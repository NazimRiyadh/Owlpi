import express from "express";
import clientDependencies from "../dependencies/dependencies.js";
import authenticate from "#src/shared/middlewares/authenticate.js";
import validate from "#src/shared/middlewares/validate.js";
import { createClientSchema } from "../validate/clientSchema.js";

const router = express.Router();

const { clientController } = clientDependencies.controllers;

router.post(
    "/admin/clients/onboard",
    authenticate,
    validate(createClientSchema),
    async (req, res, next) => {
        clientController.createClient(req, res, next);
    },
);

export default router;
