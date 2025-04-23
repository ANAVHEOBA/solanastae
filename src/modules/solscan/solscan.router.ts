import { Router } from 'express';
import { SolscanController } from './solscan.controller';

const router = Router();
const solscanController = new SolscanController();

router.get('/account/:address', solscanController.getAccountDetail.bind(solscanController));
router.get('/account/:address/transactions', solscanController.getAccountTransactions.bind(solscanController));
router.get('/account/:address/portfolio', solscanController.getPortfolio.bind(solscanController));
router.get('/account/:address/token-accounts', solscanController.getTokenAccounts.bind(solscanController));
router.get('/account/:address/stake', solscanController.getStakeAccounts.bind(solscanController));
router.get('/account/:address/transfer', solscanController.getTransfers.bind(solscanController));
router.get('/account/:address/defi/activities', solscanController.getDefiActivities.bind(solscanController));



router.get('/token/meta/multi', solscanController.getTokenMetadataMulti.bind(solscanController));
router.get('/token/price/multi', solscanController.getTokenPriceMulti.bind(solscanController));
router.get('/token/holders', solscanController.getTokenHolders.bind(solscanController));
router.get('/token/transfer', solscanController.getTokenTransfer.bind(solscanController));
router.get('/token/defi/activities', solscanController.getTokenDefiActivities.bind(solscanController));

router.get('/transaction/last', solscanController.getLastTransactions.bind(solscanController));
router.get('/transaction/detail', solscanController.getTransactionDetail.bind(solscanController));
router.get('/transaction/actions', solscanController.getTransactionActions.bind(solscanController));
router.get('/block/last', solscanController.getLastBlocks.bind(solscanController));
router.get('/block/transactions', solscanController.getBlockTransactions.bind(solscanController));
router.get('/block/detail', solscanController.getBlockDetail.bind(solscanController));
router.get('/market/list', solscanController.getMarketList.bind(solscanController));
router.get('/market/info', solscanController.getMarketInfo.bind(solscanController));
router.get('/market/volume', solscanController.getMarketVolume.bind(solscanController));



export const solscanRouter = router; 