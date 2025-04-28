import { Router } from 'express';
import { WhaleMonitorController } from './whale-monitor.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { RequestHandler } from 'express';

const router = Router();
const whaleMonitorController = new WhaleMonitorController();

// Protected routes - all routes require authentication
router.use(authMiddleware);

// Watchlist Routes
router.post('/watchlist', whaleMonitorController.createWatchlistItem as RequestHandler);
router.get('/watchlist', whaleMonitorController.getWatchlist as RequestHandler);
router.put('/watchlist/:itemId', whaleMonitorController.updateWatchlistItem as RequestHandler);
router.delete('/watchlist/:itemId', whaleMonitorController.deleteWatchlistItem as RequestHandler);

// Alert Config Routes
router.post('/alerts', whaleMonitorController.setAlertConfig as RequestHandler);
router.get('/alerts', whaleMonitorController.getAlertConfig as RequestHandler);

// Activity Routes
router.get('/activity', whaleMonitorController.getWhaleActivity as RequestHandler);

export const whaleMonitorRouter = router; 