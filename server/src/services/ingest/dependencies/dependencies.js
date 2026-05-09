import authContainer from "#src/services/auth/dependencies/authDependency.js";
import createEventProducer from "#src/shared/events/producer/createEventproducer.js";
import IngestController from "../controllers/ingestController.js";
import { IngestService } from "../services/ingestService.js";

class Container {
    static init() {
        const eventProducer = createEventProducer();
        const services = {
            ingestService: new IngestService({ eventProducer }),
        };
        const controllers = {
            ingestController: new IngestController(services),
        };

        return { controllers, services };
    }
}

const initialized = Container.init();
export default {
    initialized,
    ingestService: initialized.services.ingestService,
    ingestController: initialized.controllers.ingestController,
};
