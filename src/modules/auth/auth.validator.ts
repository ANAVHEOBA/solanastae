import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from './auth.schema';
import { responseHelper } from '../../utils/response.helper';

export const validateRegisterInput = (req: Request, res: Response, next: NextFunction) => {
    try {
        registerSchema.parse(req.body);
        next();
    } catch (error) {
        responseHelper.error(res, error);
    }
};

export const validateLoginInput = (req: Request, res: Response, next: NextFunction) => {
    try {
        loginSchema.parse(req.body);
        next();
    } catch (error) {
        responseHelper.error(res, error);
    }
}; 