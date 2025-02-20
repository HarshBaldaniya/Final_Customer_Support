import { IOrder, IOrderResponse } from "../models/order";

export interface IOrderRepository {
    createOrder(order: IOrder): Promise<IOrderResponse>;
    getOrderById(order_id: number): Promise<IOrderResponse | null>;
    getOrdersByUser(user_id: number, page: number, limit: number): Promise<{ totalCount: number; orders: IOrderResponse[] }>;
    updateOrder(order_id: number, order: Partial<IOrder>): Promise<boolean>;
    deleteOrder(order_id: number): Promise<boolean>;
}
