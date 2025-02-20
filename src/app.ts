import { startServer } from "./app/config";
import { container } from "./app/config/microservice";
import { logger } from "./config/logger";

(async () => {
    try {
        // Validate environment variables
        if (!process.env.JWT_SECRET) {
            logger.warn("JWT_SECRET is not defined in the environment variables.");
        }

        if (!process.env.PORT) {
            logger.warn("PORT is not defined. Defaulting to 5000.");
        }

        // Start server with DI container
        await startServer(container);
    } catch (error) {
        logger.error("Failed to initialize application:", error);

        // Exit process with a failure code
        process.exit(1);
    }
})();