import { ERROR_MESSAGES } from "../../config/constants/apiErrorMessages";
import { STATUS_CODES } from "../../config/constants/httpStatusCodes";
import OrderRepository from "../../infrastructure/repositories/orderRepository";
import { AppError } from "../../utils/appError";
import { IOrder } from "../models/order";

export default class OrderService {
    private orderRepository: OrderRepository;

    constructor({ orderRepository }: { orderRepository: OrderRepository }) {
        this.orderRepository = orderRepository;
    }

    async testApi(): Promise<string> {
        return await this.orderRepository.testApi();
    }

    async listOrders(filters: Partial<IOrder>, page: number, limit: number): Promise<{ data: IOrder[]; total: number }> {
        const { data, total } = await this.orderRepository.listOrders(filters, page, limit);
        return { data, total };
    }

    async createOrder(order: IOrder): Promise<void> {

        const existingOrder = await this.orderRepository.findOrderByOrderKey(order.order_key);
        if (existingOrder) {
            if (existingOrder.order_key === order.order_key) {
                throw new AppError(ERROR_MESSAGES.ORDER.DUPLICATE_ORDER_KEY, STATUS_CODES.CONFLICT);
            }
        }

        await this.orderRepository.createOrder(order);
    }
}
