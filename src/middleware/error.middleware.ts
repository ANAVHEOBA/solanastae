import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', error);

    // Handle specific error types
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: error.message
        });
    }

    // Default error response
    return res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
    });
};
