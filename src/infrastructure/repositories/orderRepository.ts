import pool from "../../app/config/database";
import { IOrder } from "../../domain/models/order";

export default class OrderRepository {
    async testApi(): Promise<string> {
        return "Hello";
    }

    async listOrders(
        filters: Partial<IOrder>,
        page: number,
        limit: number
    ): Promise<{ data: IOrder[]; total: number }> {
        const { order_id, user_id, school_code } = filters;

        const offset = (page - 1) * limit;

        let query = `SELECT * FROM order_details WHERE 1=1`;
        const params: (string | number)[] = [];

        if (order_id) {
            query += ` AND order_id = $${params.length + 1}`;
            params.push(order_id);
        }

        if (user_id) {
            query += ` AND user_id = $${params.length + 1}`;
            params.push(user_id);
        }

        if (school_code) {
            query += ` AND school_code = $${params.length + 1}`;
            params.push(school_code);
        }

        const totalQuery = `SELECT COUNT(*) AS total FROM (${query}) AS filtered`;
        const totalResult = await pool.query(totalQuery, params);
        const total = parseInt(totalResult.rows[0].total, 10);

        // Add LIMIT and OFFSET for pagination
        query += ` ORDER BY school_code DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        // Execute the query with pagination
        const result = await pool.query(query, params);

        return { data: result.rows, total };
    }

    async createOrder(order: IOrder): Promise<void> {
        const {
            user_id, user_name, school_name, school_code, product_name, mode, year,
            start_date, end_date, payment_status, status, is_archive, archive_id,
            archive_date, order_key, created_by, updated_by
        } = order;

        const query = `
            INSERT INTO order_details (
                user_id, user_name, school_name, school_code, product_name, mode, year,
                start_date, end_date, payment_status, status, is_archive, archive_id,
                archive_date, order_key, created_by, updated_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        `;

        await pool.query(query, [
            user_id, user_name, school_name, school_code, product_name, mode, year,
            start_date, end_date, payment_status ?? false, status ?? true,
            is_archive ?? false, archive_id ?? null, archive_date ?? null, order_key,
            created_by, updated_by ?? null
        ]);
    }   

    async findOrderByOrderKey(order_key: string): Promise<IOrder | null> {
        const query = `SELECT * FROM order_details 
            WHERE order_key = $1`;
        const result = await pool.query(query, [order_key]);
        return result.rows.length ? result.rows[0] : null;
    }
}
