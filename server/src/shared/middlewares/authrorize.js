import ResponseFormat from "../utils/responseFormat.js";
const authorize =
    (allowedRoles = []) =>
    (req, res, next) => {
        try {
            if (!req.user || !req.user.role) {
                return res
                    .status(403)
                    .json(ResponseFormat.error("Forbidden", 403));
            }

            // skip
            if (allowedRoles.length === 0) {
                next();
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res
                    .status(403)
                    .json(
                        ResponseFormat.error("Insufficient permissions", 403),
                    );
            }

            next();
        } catch (error) {
            return res.status(403).json(ResponseFormat.error("Forbidden", 403));
        }
    };

export default authorize;
