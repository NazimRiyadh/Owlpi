import dotenv from "dotenv";

dotenv.config();

const readInt = (val, fallback) => {
    if (val == null || val.toString() === "") return fallback;

    const value = Number.parseInt(val.toString(), 10);
    if (Number.isNaN(value)) {
        throw new Error(`Invalid integer: ${val}`);
    }

    return value;
};

const config = {
    // Server
    node_env: process.env.NODE_ENV || "development",
    port: readInt(process.env.PORT, 5000),

    // MOngodb
    mongo: {
        uri: process.env.MONGO_URI,
        dbName: process.env.MONGO_DB_NAME || "api_monitoring_system",
    },

    // postgreSQL
    postgres: {
        host: process.env.PG_HOST,
        port: readInt(process.env.PG_PORT, 5432),
        database: process.env.PG_DATABASE,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
    },

    // RabbitMQ
    rabbitmq: {
        uri: process.env.RABBITMQ_URL || "amqp://localhost:5672",
        queue: process.env.RABBITMQ_QUEUE || "api_hits",
        publisherConfirms:
            process.env.RABBITMQ_PUBLISHER_CONFIRMS === "true" || false, // MSGS LOST
        retryAttempts: readInt(process.env.RABBITMQ_RETRY_ATTEMPTS, 3),
        retryDelay: readInt(process.env.RABBITMQ_RETRY_DELAY, 1000),
    },

    jwt: {
        secret:
            process.env.JWT_SECRET ||
            (process.env.NODE_ENV === "production"
                ? undefined
                : "owlpi-dev-jwt-secret-change-me"),
        expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    },

    // Rate Limit
    rateLimit: {
        windowMs: readInt(process.env.RATE_LIMIT_WINDOW_MS, 900000), // 15 minutes
        maxRequests: readInt(process.env.RATE_LIMIT_MAX_REQUESTS, 1000), // 1000 req / 15 min per IP
    },

    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expiresIn: 24 * 60 * 60 * 1000,
    },
};

if (config.node_env === "production" && !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required in production");
}

export default config;
