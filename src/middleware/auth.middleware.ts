import { Response, NextFunction } from 'express';
import { AuthModel } from '../modules/auth/auth.model';
import { responseHelper } from '../utils/response.helper';
import { asyncMiddleware } from './middleware.helper';
import { AuthMiddleware, RequestWithOptionalUser } from '../types/request.types';

interface UserJwtPayload {
    userId: string;
    email: string;
    type: 'user';
}

export const authMiddleware: AuthMiddleware = asyncMiddleware(async (req: RequestWithOptionalUser, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader?.startsWith('Bearer ')) {
            responseHelper.error(res, 'Authorization header must start with Bearer', 401);
            return;
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            responseHelper.error(res, 'No token provided', 401);
            return;
        }

        try {
            const userId = await AuthModel.validateToken(token);
            req.user = {
                id: userId,
                type: 'user'
            };
            next();
        } catch (error) {
            if (error instanceof Error && error.message === 'Token has expired') {
                responseHelper.error(res, 'Token has expired', 401);
                return;
            }
            responseHelper.error(res, 'Invalid token', 401);
        }
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        responseHelper.error(res, 'Internal server error', 500);
    }
}) as AuthMiddleware; 