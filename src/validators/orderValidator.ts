import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { AppError } from "../utils/appError";
import { STATUS_CODES } from "../config/constants/httpStatusCodes";
import { ERROR_MESSAGES } from "../config/constants/apiErrorMessages";

// Define allowed values for certain fields
const allowedProducts = ["MSM", "MSS", "MSE", "CARES"];
const allowedModes = ["online", "offline", "combine"];

const createOrderSchema = Joi.object({
    user_id: Joi.number().integer().required().label("User ID"),
    user_name: Joi.string()
        .pattern(/^[a-zA-Z0-9]+$/)
        .min(3)
        .max(50)
        .required()
        .label("User Name"),
    school_name: Joi.string().min(3).max(100).required().label("School Name"),
    school_code: Joi.string()
        .length(6)
        .pattern(/^\d+$/)
        .required()
        .label("School Code"),
    product_name: Joi.string()
        .valid(...allowedProducts)
        .required()
        .label("Product Name"),
    mode: Joi.string()
        .valid(...allowedModes)
        .required()
        .label("Mode"),
    year: Joi.number()
        .integer()
        .min(2020)
        .max(2100)
        .required()
        .label("Year"),
    start_date: Joi.date().iso().required().label("Start Date"),
    end_date: Joi.date().iso().min(Joi.ref("start_date")).required().label("End Date"),
    payment_status: Joi.boolean().default(false).label("Payment Status"),
    is_archive: Joi.boolean().default(false).label("Is Archive"),
    created_by: Joi.string().label("Created By"),
});

const validateRequest = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const validationErrors = error.details.map((err, index) => (index === 0 ? `⚠️ ${err.message}` : err.message)).join(", ⚠️ ");
        next(
            new AppError(
                `${ERROR_MESSAGES.ORDER.VALIDATION_FAILED}: ${validationErrors}`,
                STATUS_CODES.BAD_REQUEST
            )
        );
    } else {
        next();
    }
};

export const validateCreateOrder = validateRequest(createOrderSchema);