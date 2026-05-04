import winston from "winston";
import config from "./index.js";

const logger = winston.createLogger({
    level: config.node_env === "production" ? "info" : "debug",
    defaultMeta: { service: "api_monitoring_system" },

    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
    ),

    transports: [
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
            format: winston.format.json(),
        }),
        new winston.transports.File({
            filename: "logs/combined.log",
            format: winston.format.json(),
        }),
    ],
});

// ==================== BEAUTIFUL CONSOLE FORMAT ====================
if (config.node_env !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.printf(
                ({ timestamp, level, message, stack, ...meta }) => {
                    // Color the level
                    const levelColor =
                        {
                            error: "\x1b[31m", // red
                            warn: "\x1b[33m", // yellow
                            info: "\x1b[36m", // cyan
                            debug: "\x1b[35m", // magenta
                        }[level] || "\x1b[37m";

                    let output = `${timestamp} ${levelColor}${level.toUpperCase()}\x1b[0m`;

                    // Main message
                    output += ` : ${message || meta.error || "An error occurred"}`;

                    // Show method + path nicely
                    if (meta.method && meta.path) {
                        output += ` | ${meta.method} ${meta.path}`;
                    }

                    // Status Code
                    if (meta.statusCode) {
                        const statusColor =
                            meta.statusCode >= 500 ? "\x1b[31m" : "\x1b[33m";
                        output += ` | ${statusColor}Status: ${meta.statusCode}\x1b[0m`;
                    }

                    // Stack trace (only for errors)
                    if (stack) {
                        output += `\n\n${stack}`;
                    }
                    // Or if stack is inside meta
                    else if (meta.stack) {
                        output += `\n\n${meta.stack}`;
                    }

                    // Remaining metadata (clean)
                    const remaining = { ...meta };
                    delete remaining.method;
                    delete remaining.path;
                    delete remaining.statusCode;
                    delete remaining.stack;
                    delete remaining.service;
                    delete remaining.timestamp;

                    if (Object.keys(remaining).length > 0) {
                        output += `\n${JSON.stringify(remaining, null, 2)}`;
                    }

                    return output;
                },
            ),
        }),
    );
}

export default logger;
