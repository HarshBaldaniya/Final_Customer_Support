import { Request, Response, NextFunction } from "express";
import { errorResponse } from "./responseMiddleware";
import { logger } from "../../config/logger";
import { STATUS_CODES } from "../../config/constants/httpStatusCodes";
import { AppError } from "../../utils/appError";

export const errorMiddleware = (
    error: AppError | Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (error instanceof AppError) {
        const errorDetails = error.exposeError ? error.message : null;

        // Handle known application errors
        errorResponse(res, error.message, error.status_code, errorDetails);
    } else {
        // Log unexpected errors for debugging purposes
        logger.error("Unexpected Error:", error);

        // Handle unexpected errors with a generic message
        errorResponse(
            res,
            "An unexpected error occurred.",
            STATUS_CODES.INTERNAL_SERVER_ERROR,
            process.env.NODE_ENV === "development" ? error.message : null // Include error details only in development
        );
    }

    return; 
};
