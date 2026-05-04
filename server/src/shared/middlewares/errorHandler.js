import logger from "../config/logger.js";
import ResponseFormat from "../utils/responseFormat.js";

const errorhandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "internal Server Error";
    let errors = err.errors || null;

    logger.error("Error occurred:", {
        message: err.message,
        statusCode,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation Error";
        errors = Object.values(err.errors).map((e) => e.message);
    } else if (err.name === "MongoServerError" && err.code === 11000) {
        statusCode = 409;
        message = "Duplicate key error";
    } else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    } else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }

    res.status(statusCode).json(
        ResponseFormat.error(message, statusCode, errors),
    );
};

export default errorhandler;
