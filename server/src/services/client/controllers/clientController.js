import ResponseFormat from "#src/shared/utils/responseFormat.js";

export class ClientController {
    constructor(clientService, authService) {
        if (!clientService || !authService) {
            throw new Error("Service is required");
        }

        this.clientService = clientService;
        this.authService = authService;
    }

    async createClient(req, res, next) {
        try {
            const isSuperAdmin = await this.authService.checkSuperAdmin(
                req.user.userId,
            );
            if (!isSuperAdmin) {
                return res
                    .status(403)
                    .json(ResponseFormat.error("Access denied", 403));
            }

            const client = await this.clientService.createClient(
                req.body,
                req.user,
            );

            return res
                .status(201)
                .json(
                    ResponseFormat.success(
                        client,
                        "Client created succesfully",
                        201,
                    ),
                );
        } catch (error) {
            next(error);
        }
    }
}
