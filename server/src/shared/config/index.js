import dotenv from "dotenv";

dotenv.config();

const readInt = (name, fallback) => {
    const raw = process.env[name];
    if (raw == null || raw === "") return fallback;

    const value = Number.parseInt(raw, 10);
    if (Number.isNaN(value)) {
        throw new Error(`Invalid integer for ${name}: ${raw}`);
    }

    return value;
};

const config = {
    // Server
    node_env: process.env.NODE_ENV || "development",
    port: readInt(process.env.PORT || "5000", 10),

    // MOngodb
    mongo: {
        uri:
            process.env.MONGO_URI ||
            "mongodb://localhost:27017/api_monitoring_system",
        dbName: process.env.MONGO_DB_NAME || "api_monitoring_system",
    },

    // postgreSQL
    postgres: {
        host: process.env.PG_HOST || "localhost",
        port: readInt(process.env.PG_PORT || "5432", 10),
        database: process.env.PG_DATABASE || "api_monitoring",
        user: process.env.PG_USER || "postgres",
        password: process.env.PG_PASSWORD || "postgres",
    },

    // RabbitMQ
    rabbitmq: {
        uri: process.env.RABBITMQ_URL || "amqp://localhost:5672",
        queue: process.env.RABBITMQ_QUEUE || "api_hits",
        publisherConfirms:
            process.env.RABBITMQ_PUBLISHER_CONFIRMS === "true" || false, // MSGS LOST
        retryAttempts: readInt(process.env.RABBITMQ_RETRY_ATTEMPTS || "3", 10),
        retryDelay: readInt(process.env.RABBITMQ_RETRY_DELAY || "1000", 10),
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    },

    // Rate Limit
    rateLimit: {
        windowMs: readInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
        maxRequests: readInt(process.env.RATE_LIMIT_MAX_REQUESTS || "1000", 10), // 1000 req / 15 min per IP
    },

    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expiresIn: 24 * 60 * 60 * 1000,
    },
};

export default config;
