import { Router } from 'express';
import { SolanaFMController } from './solanafm.controller';

const router = Router();
const solanaFMController = new SolanaFMController();

router.post('/tagged-accounts', solanaFMController.getTaggedAccounts.bind(solanaFMController));
router.get('/account-fees/:accountHash', solanaFMController.getAccountFees.bind(solanaFMController));
router.get('/account-transactions/:accountHash', solanaFMController.getAccountTransactions.bind(solanaFMController));
router.get('/owner-token-accounts/:accountHash', solanaFMController.getOwnerTokenAccounts.bind(solanaFMController));
router.get('/token-info/:tokenHash', solanaFMController.getTokenInfo.bind(solanaFMController));
router.get('/token-supply/:tokenHash', solanaFMController.getTokenSupply.bind(solanaFMController));
router.get('/actions', solanaFMController.getActions.bind(solanaFMController));
router.get('/transfer/:hash', solanaFMController.getTransfer.bind(solanaFMController));

export const solanaFMRouter = router; 