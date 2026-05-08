import { ProcessorService } from "../services/processService.js";

import MetricsRepository from "../repositories/metricsRepository.js";
import ApiHit from "#src/shared/models/apihits.js";
import postgres from "#src/shared/config/postgres.js";
import logger from "#src/shared/config/logger.js";
import ApiHitRepository from "../repositories/apiHitRepository.js";

class Container {
    static init() {
        const repositories = {
            apiHitRepository: new ApiHitRepository({ model: ApiHit, logger }),
            metricsRepository: new MetricsRepository({ postgres, logger }),
        };

        const services = {
            processorService: new ProcessorService({
                apiHitRepository: repositories.apiHitRepository,
                metricsRepository: repositories.metricsRepository,
            }),
        };

        return { repositories, services };
    }
}

const initialized = Container.init();
export { Container };
export default initialized;
