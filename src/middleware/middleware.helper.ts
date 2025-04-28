import { Request, Response, NextFunction } from 'express';

export type AsyncMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>;

export const asyncMiddleware = (fn: AsyncMiddleware) => (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    fn(req, res, next).catch(next);
}; 