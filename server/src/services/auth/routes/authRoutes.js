import express from "express";
import validate from "#src/shared/middlewares/validate.js";
import requestLogger from "#src/shared/middlewares/reqLogger.js";
import authenticate from "#src/shared/middlewares/authenticate.js";
import authDependency from "../dependencies/authDependency.js";
import {
    onboardSuperAdminSchema,
    loginSchema,
    registrationSchema,
} from "../validate/authSchema.js";
import { APPLICATION_ROLES } from "#src/shared/constants/roles.js";

const authRouter = express.Router();
const { controllers } = authDependency.initialized;
const authController = controllers.authController;

authRouter.post(
    "/onboard-super-admin",
    requestLogger,
    validate(onboardSuperAdminSchema),
    (req, res, next) => authController.onBoardSuperAdmin(req, res, next),
);

authRouter.post(
    "/register",
    requestLogger,
    validate(registrationSchema),
    (req, res, next) => authController.Register(req, res, next),
);

authRouter.post(
    "/login",
    requestLogger,
    validate(loginSchema),
    (req, res, next) => authController.Login(req, res, next),
);

authRouter.get("/profile", requestLogger, authenticate, (req, res, next) =>
    authController.getProfile(req, res, next),
);

authRouter.post("/logout", requestLogger, (req, res, next) =>
    authController.logout(req, res, next),
);

export default authRouter;
