import { AuthService } from "../services/authService.js";
import AuthController from "../controllers/authController.js";
import MongoUserRepo from "../repositories/userRepository.js";

class Container {
    static init() {
        const repositories = {
            userRepository: MongoUserRepo,
        };

        const services = {
            authService: new AuthService(repositories.userRepository),
        };

        const controllers = {
            authController: new AuthController(services.authService),
        };
        return { repositories, services, controllers };
    }
}

const initialized = Container.init();
export { Container };
export default initialized;
