import { LiquidityChange, LiquidityMonitorRequest, LiquidityMonitorResponse,
     VolumeMonitorRequest, VolumeMonitorResponse,
     SwapMonitorRequest,
     SwapMonitorResponse } from './liquidity-monitor.schema';
import { liquidityMonitorService } from './liquidity-monitor.service';

export class LiquidityMonitorModel {
    async getLiquidityChanges(request: LiquidityMonitorRequest): Promise<LiquidityMonitorResponse> {
        return liquidityMonitorService.getLiquidityChanges(request);
    }

    async getVolumeAnomalies(request: VolumeMonitorRequest): Promise<VolumeMonitorResponse> {
        return liquidityMonitorService.getVolumeAnomalies(request);
    }

    async startMonitoring(poolAddress: string): Promise<void> {
        await liquidityMonitorService.startMonitoring(poolAddress);
    }

    async getSwapActivities(request: SwapMonitorRequest): Promise<SwapMonitorResponse> {
        return liquidityMonitorService.getSwapActivities(request);
    }
}

export const liquidityMonitorModel = new LiquidityMonitorModel(); 