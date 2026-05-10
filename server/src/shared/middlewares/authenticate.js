import config from "../config/index.js";
import ResponseFormat from "../utils/responseFormat.js";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

const authenticate = async (req, res, next) => {
    try {
        let token = null;

        logger.info("DEBUG: Auth attempt", {
            hasHeader: !!req.headers.authorization,
            hasCookie: !!(req.cookies && req.cookies.authToken),
            path: req.path
        });

        // 1. Check Authorization Header (Highest Priority for Cross-Domain)
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
            logger.info("DEBUG: Token found in Header");
        }

        // 2. Fallback to Cookie (If no header is present)
        if (!token && req.cookies && req.cookies.authToken) {
            token = req.cookies.authToken;
            logger.info("DEBUG: Token found in Cookie");
        }

        if (!token) {
            return res
                .status(401)
                .json(
                    ResponseFormat.error(
                        "Authentication token is required",
                        401,
                    ),
                );
        }

        const decoded = jwt.verify(token, config.jwt.secret);

        const { userId, email, username, role, clientId } = decoded;

        req.user = {
            userId,
            email,
            username,
            role,
            clientId,
        };

        next();
    } catch (error) {
        logger.error("Authentication failed", {
            error: error.message,
            path: req.path,
        });

        if (error.name === "TokenExpiredError") {
            return res
                .status(401)
                .json(ResponseFormat.error("Token expired", 401));
        }

        return res.status(401).json(ResponseFormat.error("Invalid token", 401));
    }
};

export default authenticate;
