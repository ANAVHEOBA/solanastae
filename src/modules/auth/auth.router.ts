import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateLoginInput, validateRegisterInput } from './auth.validator';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', validateRegisterInput, authController.register);
router.post('/login', validateLoginInput, authController.login);

export const authRouter = router; 