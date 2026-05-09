import { APPLICATION_ROLES } from "#src/shared/constants/roles.js";
import config from "#src/shared/config/index.js";
import ResponseFormat from "#src/shared/utils/responseFormat.js";

class AuthController {
    constructor(authService) {
        if (!authService) {
            throw new Error("User Service is required");
        }
        this.authService = authService;
    }
    async onBoardSuperAdmin(req, res, next) {
        try {
            const { username, email, password } = req.body;

            const superAdminData = {
                username,
                email,
                password,
                role: APPLICATION_ROLES.SUPER_ADMIN,
            };

            const { token, user } =
                await this.authService.onboardSuperAdmin(superAdminData);

            res.cookie("authToken", token, {
                httpOnly: config.cookie.httpOnly,
                secure: config.cookie.secure,
                sameSite: config.cookie.sameSite,
                path: config.cookie.path,
                maxAge: config.cookie.expiresIn,
            });

            res.status(201).json(
                ResponseFormat.success(
                    user,
                    "Super admin created successfully",
                    201,
                ),
            );
        } catch (error) {
            next(error);
        }
    }

    async createSystemAdmin(req, res, next) {
        try {
            // Check if requester is Super Admin
            if (req.user.role !== APPLICATION_ROLES.SUPER_ADMIN) {
                return res.status(403).json(ResponseFormat.error("Only Super Admin can create System Admins", 403));
            }

            const { username, email, password } = req.body;
            const systemAdminData = {
                username,
                email,
                password,
                role: APPLICATION_ROLES.SYSTEM_ADMIN,
            };

            const user = await this.authService.createSystemAdmin(systemAdminData);

            res.status(201).json(
                ResponseFormat.success(
                    user,
                    "System admin created successfully",
                    201,
                ),
            );
        } catch (error) {
            next(error);
        }
    }


    async Login(req, res, next) {
        try {
            const { username, password } = req.body;
            const { user, token } = await this.authService.login(
                username,
                password,
            );

            res.cookie("authToken", token, {
                httpOnly: config.cookie.httpOnly,
                secure: config.cookie.secure,
                sameSite: config.cookie.sameSite,
                path: config.cookie.path,
                maxAge: config.cookie.expiresIn,
            });

            res.status(200).json(
                ResponseFormat.success(
                    user,
                    "User logged in successfullly",
                    200,
                ),
            );
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await this.authService.getProfile(userId);

            res.status(200).json(
                ResponseFormat.success(
                    result,
                    "Profile fetched successfully",
                    200,
                ),
            );
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            res.clearCookie("authToken", {
                path: config.cookie.path,
                sameSite: config.cookie.sameSite,
            });
            res.status(200).json(
                ResponseFormat.success({}, "Logout successful", 200),
            );
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
