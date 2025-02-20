import { createContainer, asClass } from "awilix";
import OrderService from "../../domain/services/orderService";
import OrderRepository from "../../infrastructure/repositories/orderRepository";
import OrderController from "../../presentation/controllers/orderController";

export const container = createContainer();

container.register({
    orderService: asClass(OrderService).singleton(),
    orderRepository: asClass(OrderRepository).scoped(),
    orderController: asClass(OrderController).scoped(),
})