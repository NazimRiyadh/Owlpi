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
                return next();
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res
                    .status(403)
                    .json(
                        ResponseFormat.error("Insufficient permissions", 403),
                    );
            }

            return next();
        } catch (error) {
            return next(error);
        }
    };

export default authorize;
