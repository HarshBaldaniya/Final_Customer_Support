import { Router } from "express";
import { AwilixContainer } from "awilix";
import orderRoutes from "./orderRoutes";

const router = Router();

// Main entry for all microservices, no versioning as requested
export default (container: AwilixContainer): Router => {
  router.use("/v1/orders", orderRoutes(container));
  return router;
};
