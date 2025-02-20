import { Request, Response, NextFunction } from "express";
import OrderService from "../../domain/services/orderService";
import { AppError } from "../../utils/appError";
import { ERROR_MESSAGES } from "../../config/constants/apiErrorMessages";
import { STATUS_CODES } from "../../config/constants/httpStatusCodes";
import { successResponse } from "../../app/middleware/responseMiddleware";
import { SUCCESS_MESSAGES } from "../../config/constants/apiSuccessMessages";
import { IPagination } from "../../domain/models/pagination";

export default class OrderController {
    private orderService: OrderService;

    constructor({ orderService }: { orderService: OrderService }) {
        this.orderService = orderService;
    }

    testApi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await this.orderService.testApi();
            console.log(data);
            successResponse(res, STATUS_CODES.CREATED, SUCCESS_MESSAGES.ORDER.CREATED, data);
        } catch (error) {
            next(error);
        }
    }

    listOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { order_id, user_id, school_code, page = 1, limit = 10 } = req.query;

            const page_number = parseInt(page as string, 10);
            const page_size = parseInt(limit as string, 10);

            if (isNaN(page_number) || isNaN(page_size) || page_number < 1 || page_size < 1) {
                throw new AppError(ERROR_MESSAGES.PAGINATION.INVALID_PARAMETERS, STATUS_CODES.BAD_REQUEST);
            }

            const filters = {
                order_id: order_id ? parseInt(order_id as string, 10) : undefined,
                user_id: user_id ? parseInt(user_id as string, 10) : undefined,
                school_code: school_code as string | undefined,
            };

            const { data, total } = await this.orderService.listOrders(filters, page_number, page_size);

            const total_pages = Math.ceil(total / page_size);

            if (page_number > total_pages && total > 0) {
                throw new AppError(
                    `${ERROR_MESSAGES.PAGINATION.NO_DATA_ON_PAGE} ${page_number}. ${ERROR_MESSAGES.PAGINATION.TOTAL_PAGES_AVAILABLE} ${total_pages}.`,
                    STATUS_CODES.NOT_FOUND
                );
            }

            const pagination: IPagination = {
                current_page: page_number,
                current_page_records: data.length,
                page_size: page_size,
                total_pages: total_pages,
                total_records: total,
            };

            successResponse(res, STATUS_CODES.OK, SUCCESS_MESSAGES.ORDER.LIST_RETRIEVED, { orders: data, pagination });
        } catch (error) {
            next(error);
        }
    };

    createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {
                user_id, user_name, school_name, school_code, product_name, mode,
                year, start_date, end_date, payment_status, is_archive
            } = req.body;


            // Validate required fields
            if (!user_id || !user_name || !school_name || !school_code || !product_name || !mode ||
                !year || !start_date || !end_date) {
                throw new AppError(ERROR_MESSAGES.ORDER.VALIDATION_FAILED, STATUS_CODES.BAD_REQUEST);
            }

            // Generate the unique order_key
            const order_key = "12345"
            const created_by = "harsh"

            const order = {
                user_id,
                user_name,
                school_name,
                school_code,
                product_name,
                mode,
                year,
                start_date,
                end_date,
                payment_status,
                is_archive,
                created_by,
                updated_by: created_by,
                order_key,
            };

            await this.orderService.createOrder(order);
            successResponse(res, STATUS_CODES.CREATED, SUCCESS_MESSAGES.ORDER.CREATED);
        } catch (error) {
            next(error);
        }
    };
}
