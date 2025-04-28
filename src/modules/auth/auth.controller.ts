import { Request, Response } from 'express';
import { AuthModel } from './auth.model';
import { RegisterInput, LoginInput, User } from './auth.schema';
import { responseHelper } from '../../utils/response.helper';

export class AuthController {
    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: RegisterInput = req.body;
            const user = await AuthModel.register(input);
            
            responseHelper.success(res, { 
                message: 'Registration successful',
                user: {
                    id: user.id,
                    email: user.email
                }
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'User already exists') {
                responseHelper.error(res, 'Email already registered', 400);
                return;
            }
            responseHelper.error(res, error);
        }
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: LoginInput = req.body;
            const token = await AuthModel.login(input);
            
            responseHelper.success(res, { 
                message: 'Login successful',
                token,
                expiresIn: '24h'
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Invalid credentials') {
                responseHelper.error(res, 'Invalid email or password', 401);
                return;
            }
            responseHelper.error(res, error);
        }
    }
}