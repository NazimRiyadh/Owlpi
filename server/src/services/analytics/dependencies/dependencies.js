import mongoClientRepo from "#src/services/client/repositories/mongoClientRepo.js";
import processorContainer from "#src/services/processor/dependencies/dependencies.js";
import authContainer from "#src/services/auth/dependencies/authDependency.js";
import AnalyticsService from "../service/analyticsService.js";
import { AnalyticsController } from "../controllers/analyticsController.js";

class Container {
    static init() {
        const repositories = {
            clientRepository: mongoClientRepo,
            metricsRepository: processorContainer.repositories.metricsRepository,
        };

        const services = {
            analyticsService: new AnalyticsService(
                repositories.metricsRepository,
            ),
        };

        const controllers = {
            analyticsController: new AnalyticsController({
                analyticsService: services.analyticsService,
                authService: authContainer.services.authService,
                clientRepository: repositories.clientRepository,
            }),
        };

        return { repositories, services, controllers };
    }
}

const initialized = Container.init();
export { Container };
export default initialized;