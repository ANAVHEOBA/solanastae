import { Router } from 'express';
import { ValidatorController } from './validator.controller';

const router = Router();
const validatorController = new ValidatorController();

// Get validator statistics
router.get('/stats', validatorController.getValidatorStats.bind(validatorController));

// Get validators with optional filters
router.get('/', validatorController.getValidators.bind(validatorController));

router.get('/stake-minimum-delegation', validatorController.getStakeMinimumDelegation.bind(validatorController));

router.get('/largest-accounts', validatorController.getLargestAccounts.bind(validatorController));

router.get('/leader-schedule', validatorController.getLeaderSchedule.bind(validatorController));

router.get('/signature-statuses', validatorController.getSignatureStatuses.bind(validatorController));

router.get('/slot-leaders', validatorController.getSlotLeaders.bind(validatorController));

router.get('/transaction', validatorController.getTransaction.bind(validatorController));

router.get('/prioritization-fees', validatorController.getPrioritizationFees.bind(validatorController));

router.get('/token-accounts-by-owner', validatorController.getTokenAccountsByOwner.bind(validatorController));

router.get('/token-supply', validatorController.getTokenSupply.bind(validatorController));

export const validatorRouter = router;
