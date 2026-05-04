import MongoUserRepo from "#src/services/auth/repositories/userRepository.js";
import { ClientController } from "../controllers/clientController.js";
import mongoApiKeyRepository from "../repositories/mongoApiKeyRepository.js";
import MongoClientRepo from "../repositories/mongoClientRepo.js";
import ClientService from "../services/clientService.js";
import authContainer from "../../auth/dependencies/authDependency.js";

class Container {
    static init() {
        const repositories = {
            clientRepository: MongoClientRepo,
            apiKeyRepository: mongoApiKeyRepository,
            userRepository: MongoUserRepo,
        };

        const services = {
            clientService: new ClientService({
                clientRepository: repositories.clientRepository,
                apiKeyRepository: repositories.apiKeyRepository,
                userRepository: repositories.userRepository,
            }),
        };


        const controllers = {
            clientController: new ClientController(
                services.clientService,
                authContainer.services.authService,
            ),
        };
        return { repositories, services, controllers };
    }
}

const initialized = Container.init();
export { Container };
export default initialized;
