import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                type: 'user';
            };
        }
    }
}

export {};

export interface AuthUser {
    id: string;
    type: 'user';
}

// Base request with optional user
export interface RequestWithOptionalUser extends Request {
    user?: AuthUser;
}

// Request after auth middleware has run
export interface AuthenticatedRequest extends RequestWithOptionalUser {
    user: AuthUser; // Required here
}

export type RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void> | void;

export type AuthenticatedRequestHandler = (
    req: AuthenticatedRequest,
    res: Response,
    next?: NextFunction
) => Promise<void> | void;

export type AuthMiddleware = RequestHandler & {
    (req: RequestWithOptionalUser, res: Response, next: NextFunction): asserts req is AuthenticatedRequest;
}; 