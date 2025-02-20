import { Router } from "express";
import { AwilixContainer } from "awilix";
import OrderController from "../controllers/orderController";
import { validateCreateOrder } from "../../validators/orderValidator";

const orderRoutes = (container: AwilixContainer): Router => {
    const router = Router();
    const orderController = container.resolve("orderController") as OrderController;

    // http://localhost:3000/api/v1/orders -> testApi
    router.get("", orderController.listOrders);

    // http://localhost:3000/api/v1/orders -> testApi
    router.post("", validateCreateOrder, orderController.createOrder);

    // http://localhost:3000/api/v1/orders -> testApi
    router.patch("", orderController.testApi);

    return router;
  };

export default orderRoutes;
