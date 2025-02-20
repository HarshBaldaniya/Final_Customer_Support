import { Response } from "express";
import { IApiResponse } from "../../domain/interfaces/IApiResponse";

export const successResponse = (
    res: Response,
    status_code: number,
    message: string,
    data?: any
): Response<IApiResponse> => {
    return res.status(status_code).json({
        success: true,
        status_code,
        message,
        ...(data && { data }),
    });
};

export const errorResponse = (
    res: Response,
    message: string,
    status_code: number,
    error: any = null
): Response<IApiResponse> => {
    const response: IApiResponse = {
        success: false,
        status_code,
        message,
    };

    // Include error only if it exists
    if (error) {
        response.error = error;
    }

    return res.status(status_code).json(response);
};
