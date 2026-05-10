import mongoClientRepo from "#src/services/client/repositories/mongoClientRepo.js";
import processorContainer from "#src/services/processor/dependencies/dependencies.js";
import authContainer from "#src/services/auth/dependencies/authDependency.js";
import AnalyticsService from "../services/analyticsService.js";
import { AnalyticsController } from "../controllers/analyticsController.js";

class Container {
    static init() {
        const repositories = {
            clientRepository: mongoClientRepo,
            metricsRepository: processorContainer.repositories.metricsRepository,
            apiHitRepository: processorContainer.repositories.apiHitRepository,
        };

        const services = {
            analyticsService: new AnalyticsService(
                repositories.metricsRepository,
                repositories.apiHitRepository,
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