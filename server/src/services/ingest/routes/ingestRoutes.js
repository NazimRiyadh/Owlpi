import express from "express";
import config from "#src/shared/config/index.js";
import ResponseFormat from "#src/shared/utils/responseFormat.js";
import validateApiKey from "#src/shared/middlewares/validateApiKey.js";
import ingestDependencies from "../dependencies/dependencies.js";
import rateLimit from "express-rate-limit";

const { ingestController } = ingestDependencies;

const router = express.Router();

const ingestLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: ResponseFormat.error(
        "Too many requests, please try again later",
        429,
    ),
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.headers["x-api-key"];
    },
});

router.post("/", validateApiKey, ingestLimiter, (req, res, next) => {
    ingestController.ingestHit(req, res, next);
});

export default router;
