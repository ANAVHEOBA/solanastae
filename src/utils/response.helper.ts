import { Response } from 'express';

export const responseHelper = {
    success: (res: Response, data: any, message: string = 'Success') => {
        return res.status(200).json({
            success: true,
            message,
            data
        });
    },

    error: (res: Response, error: any, statusCode: number = 400) => {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return res.status(statusCode).json({
            success: false,
            message,
            error: error instanceof Error ? error.stack : error
        });
    }
};
