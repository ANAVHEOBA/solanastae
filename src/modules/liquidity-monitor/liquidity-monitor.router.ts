import { Router } from 'express';
import { liquidityMonitorController } from './liquidity-monitor.controller';

const router = Router();

// GET /api/v1/liquidity-monitor/changes
router.get('/changes', liquidityMonitorController.getLiquidityChanges.bind(liquidityMonitorController));

// GET /api/v1/liquidity-monitor/volume
router.get('/volume', liquidityMonitorController.getVolumeAnomalies.bind(liquidityMonitorController));

// GET /api/v1/liquidity-monitor/swaps
router.get('/swaps', liquidityMonitorController.getSwapActivities.bind(liquidityMonitorController));



// POST /api/v1/liquidity-monitor/start
router.post('/start', liquidityMonitorController.startMonitoring.bind(liquidityMonitorController));

export default router;