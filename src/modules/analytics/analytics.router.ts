import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';

const router = Router();
const analyticsController = new AnalyticsController();

router.get('/pnl/:address', analyticsController.calculatePnL.bind(analyticsController));
router.get('/drawdown/:address', analyticsController.calculateDrawdown.bind(analyticsController));
router.get('/sharpe-ratio/:address', analyticsController.calculateSharpeRatio.bind(analyticsController));
router.get('/volatility/:address', analyticsController.calculateVolatility.bind(analyticsController));
router.get('/sortino-ratio/:address', analyticsController.calculateSortinoRatio.bind(analyticsController));



export const analyticsRouter = router; 