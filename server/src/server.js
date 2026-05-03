import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import config from "./shared/config/index.js";
import mongo from "./shared/config/mongo.js";
import logger from "./shared/config/logger.js";
import postgres from "./shared/config/postgres.js";
import rabbitmq from "./shared/config/rabbitmq.js";
import errorhandler from "./shared/middlewares/errorHandler.js";
import ResponseFormat from "./shared/utils/responseFormat.js";
import cookieParser from "cookie-parser";

import authRouter from "./services/auth/routes/authRoutes.js";

const app = express();

app.use(helmet());
app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    next();
});

app.get("/health", (req, res) => {
    res.status(200).json(
        ResponseFormat.success(
            {
                status: "healthy",
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
            },
            "Service is healthy",
        ),
    );
});

app.get("/", (req, res) => {
    res.status(200).json(
        ResponseFormat.success(
            {
                service: "API Hit Monitoring System",
                version: "1.0.0",
                endpoints: {
                    health: "/health",
                    auth: "/api/auth",
                    ingest: "/api/hit",
                    analytics: "/api/analytics",
                },
            },
            "API Hit Monitoring Service",
        ),
    );
});

app.use("/api/auth", authRouter);

app.use((req, res) => {
    res.status(404).json(ResponseFormat.error("Endpoint not found", 404));
});

app.use(errorhandler);

async function initializeConnection() {
    try {
        logger.info("Initializing database connections...");

        await mongo.connect();

        await postgres.testConnection();

        await rabbitmq.connect();

        logger.info("All connections established successfully");
    } catch (error) {
        logger.error("Failed to initialize connections:", error);
        throw error;
    }
}

async function startServer() {
    try {
        await initializeConnection();

        const server = app.listen(config.port, () => {
            logger.info(`Server started on port ${config.port}`);
            logger.info(`Environment: ${config.node_env}`);
            logger.info(`API available at: http://localhost:${config.port}`);
        });

        const gracefulShutdown = async (signal) => {
            logger.info(`${signal} received, shutting down gracefully!`);
            server.close(async () => {
                logger.info("Closing HTTP request....");
            });
            try {
                await mongo.disconnect();
                await postgres.close();
                await rabbitmq.close();
                logger.info("All connections closed, exiting process");
                process.exit(0);
            } catch (error) {
                logger.error("Error during shutdown:", error);
                process.exit(1);
            }
        };

        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));

        process.on("uncaughtException", (error) => {
            logger.error("Uncaught Exception:", error);
            gracefulShutdown("uncaughtException");
        });

        process.on("unhandledRejection", (reason, promise) => {
            logger.error("Unhandled Rejection at:", promise, "reason:", reason);
            gracefulShutdown("unhandledRejection");
        });
    } catch (error) {
        logger.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
