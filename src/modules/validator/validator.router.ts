import { Router } from 'express';
import { ValidatorController } from './validator.controller';

const router = Router();
const validatorController = new ValidatorController();

// Get validator statistics
router.get('/stats', validatorController.getValidatorStats.bind(validatorController));

// Get validators with optional filters
router.get('/', validatorController.getValidators.bind(validatorController));

export const validatorRouter = router;
