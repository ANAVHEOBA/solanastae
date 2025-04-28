import { SolscanService } from '../solscan/solscan.service';
import { 
    LiquidityMonitorResponse, 
    LiquidityMonitorRequest, 
    LiquidityChange, 
    VolumeMonitorResponse, 
    VolumeMonitorRequest, 
    VolumeAnomaly,
    SwapMonitorRequest,
    SwapMonitorResponse,
    SwapActivity
} from './liquidity-monitor.schema';

export class LiquidityMonitorService {
    private readonly solscanService: SolscanService;
    private readonly monitoredPools: Set<string>;
    private readonly liquidityChanges: Map<string, LiquidityChange[]>;
    private readonly volumeAnomalies: Map<string, VolumeAnomaly[]>;
    private readonly volumeHistory: Map<string, { volume: number; trades: number; timestamp: number }[]>;
    private readonly swapActivities: Map<string, SwapActivity[]>;

    constructor() {
        this.solscanService = new SolscanService();
        this.monitoredPools = new Set();
        this.liquidityChanges = new Map();
        this.volumeAnomalies = new Map();
        this.volumeHistory = new Map();
        this.swapActivities = new Map();
    }

    async startMonitoring(poolAddress: string): Promise<void> {
        if (this.monitoredPools.has(poolAddress)) {
            return;
        }

        this.monitoredPools.add(poolAddress);
        await this.initializePoolData(poolAddress);
        this.startPolling(poolAddress);
    }

    private async initializePoolData(poolAddress: string): Promise<void> {
        try {
            const marketInfo = await this.solscanService.getMarketInfo({ address: poolAddress });
            if (marketInfo.success) {
                this.liquidityChanges.set(poolAddress, []);
                this.swapActivities.set(poolAddress, []); 
            await this.checkSwapActivities(poolAddress); 
            }
        } catch (error) {
            console.error(`Failed to initialize pool data for ${poolAddress}:`, error);
            this.monitoredPools.delete(poolAddress);
        }
    }

    private startPolling(poolAddress: string): void {
        setInterval(async () => {
            try {
                await this.checkLiquidityChanges(poolAddress);
                await this.checkVolumeAnomalies(poolAddress);
                await this.checkSwapActivities(poolAddress);
            } catch (error) {
                console.error(`Error polling for ${poolAddress}:`, error);
            }
        }, 30000); // Poll every 30 seconds
    }

    private async checkLiquidityChanges(poolAddress: string): Promise<void> {
        try {
            const marketInfo = await this.solscanService.getMarketInfo({ address: poolAddress });
            if (!marketInfo.success) return;

            const currentChanges = this.liquidityChanges.get(poolAddress) || [];
            const newChange: LiquidityChange = {
                pool_address: poolAddress,
                program_id: marketInfo.data.program_id,
                token1: marketInfo.data.tokens_info[0].token,
                token2: marketInfo.data.tokens_info[1].token,
                token1_amount: marketInfo.data.tokens_info[0].amount,
                token2_amount: marketInfo.data.tokens_info[1].amount,
                token1_change: 0, // Calculate based on previous state
                token2_change: 0, // Calculate based on previous state
                timestamp: Date.now(),
                tx_hash: '', // Get from transaction data
                type: 'add' // Determine based on changes
            };

            currentChanges.push(newChange);
            this.liquidityChanges.set(poolAddress, currentChanges);
        } catch (error) {
            console.error(`Error checking liquidity changes for ${poolAddress}:`, error);
        }
    }

    private async checkVolumeAnomalies(poolAddress: string): Promise<void> {
        try {
            const marketVolume = await this.solscanService.getMarketVolume({ address: poolAddress });
            if (!marketVolume.success) return;

            const currentVolume = marketVolume.data;
            const history = this.volumeHistory.get(poolAddress) || [];
            
            // Calculate anomaly score based on volume and trades changes
            const volumeChange = currentVolume.total_volume_change_24h;
            const tradesChange = currentVolume.total_trades_change_24h;
            const anomalyScore = Math.max(
                Math.abs(volumeChange),
                Math.abs(tradesChange)
            );

            // Only record if anomaly score is significant
            if (anomalyScore > 50) { // 50% change threshold
                const marketInfo = await this.solscanService.getMarketInfo({ address: poolAddress });
                if (!marketInfo.success) return;

                const newAnomaly: VolumeAnomaly = {
                    pool_address: poolAddress,
                    program_id: marketInfo.data.program_id,
                    token1: marketInfo.data.tokens_info[0].token,
                    token2: marketInfo.data.tokens_info[1].token,
                    volume_24h: currentVolume.total_volume_24h,
                    volume_change_24h: currentVolume.total_volume_change_24h,
                    trades_24h: currentVolume.total_trades_24h,
                    trades_change_24h: currentVolume.total_trades_change_24h,
                    timestamp: Date.now(),
                    anomaly_score: anomalyScore,
                    type: Math.abs(volumeChange) > Math.abs(tradesChange) ? 'volume' : 'trades'
                };

                const currentAnomalies = this.volumeAnomalies.get(poolAddress) || [];
                currentAnomalies.push(newAnomaly);
                this.volumeAnomalies.set(poolAddress, currentAnomalies);

                // Keep history for trend analysis
                history.push({
                    volume: currentVolume.total_volume_24h,
                    trades: currentVolume.total_trades_24h,
                    timestamp: Date.now()
                });
                this.volumeHistory.set(poolAddress, history.slice(-24)); // Keep last 24 hours
            }
        } catch (error) {
            console.error(`Error checking volume anomalies for ${poolAddress}:`, error);
        }
    }



    private async checkSwapActivities(poolAddress: string): Promise<void> {
        try {
            const activities = await this.solscanService.getDefiActivities({
                address: poolAddress,
                activity_type: ['ACTIVITY_TOKEN_SWAP', 'ACTIVITY_AGG_TOKEN_SWAP']
            });
    
            if (!activities.success) return;
    
            const currentSwaps = this.swapActivities.get(poolAddress) || [];
            
            for (const activity of activities.data) {
                if (activity.activity_type.includes('SWAP') && 
                    activity.sources?.[0] && 
                    activity.routers?.token1 && 
                    activity.routers?.token2 && 
                    activity.routers?.amount1 !== undefined && 
                    activity.routers?.amount2 !== undefined) {
                    
                    const newSwap: SwapActivity = {
                        pool_address: poolAddress,
                        program_id: activity.sources[0],
                        token1: activity.routers.token1,
                        token2: activity.routers.token2,
                        token1_amount: activity.routers.amount1,
                        token2_amount: activity.routers.amount2,
                        from_address: activity.from_address || '',
                        block_time: activity.block_time,
                        tx_hash: activity.trans_id,
                        timestamp: Date.now(),
                        value: activity.value || 0
                    };
                    currentSwaps.push(newSwap);
                }
            }
    
            this.swapActivities.set(poolAddress, currentSwaps);
        } catch (error) {
            console.error(`Error checking swap activities for ${poolAddress}:`, error);
        }
    }

    async getLiquidityChanges(request: LiquidityMonitorRequest): Promise<LiquidityMonitorResponse> {
        try {
            let changes: LiquidityChange[] = [];

            if (request.pool_address) {
                changes = this.liquidityChanges.get(request.pool_address) || [];
            } else {
                for (const poolChanges of this.liquidityChanges.values()) {
                    changes = changes.concat(poolChanges);
                }
            }

            // Apply filters
            if (request.program_id) {
                changes = changes.filter(change => change.program_id === request.program_id);
            }
            if (request.token_address) {
                changes = changes.filter(change => 
                    change.token1 === request.token_address || 
                    change.token2 === request.token_address
                );
            }
            if (typeof request.from_time === 'number') {
                changes = changes.filter(change => change.timestamp >= request.from_time!);
            }
            if (typeof request.to_time === 'number') {
                changes = changes.filter(change => change.timestamp <= request.to_time!);
            }

            // Apply sorting
            const sortOrder = request.sort_order === 'asc' ? 1 : -1;
            changes.sort((a, b) => (a.timestamp - b.timestamp) * sortOrder);

            // Apply pagination
            const page = request.page || 1;
            const pageSize = request.page_size || 10;
            const startIndex = (page - 1) * pageSize;
            const paginatedChanges = changes.slice(startIndex, startIndex + pageSize);

            return {
                success: true,
                data: paginatedChanges,
                metadata: {
                    total_changes: changes.length,
                    last_updated: Date.now()
                }
            };
        } catch (error) {
            console.error('Error getting liquidity changes:', error);
            throw error;
        }
    }

    async getVolumeAnomalies(request: VolumeMonitorRequest): Promise<VolumeMonitorResponse> {
        try {
            let anomalies: VolumeAnomaly[] = [];

            if (request.pool_address) {
                anomalies = this.volumeAnomalies.get(request.pool_address) || [];
            } else {
                for (const poolAnomalies of this.volumeAnomalies.values()) {
                    anomalies = anomalies.concat(poolAnomalies);
                }
            }

            // Apply filters
            if (request.program_id) {
                anomalies = anomalies.filter(anomaly => anomaly.program_id === request.program_id);
            }
            if (request.token_address) {
                anomalies = anomalies.filter(anomaly => 
                    anomaly.token1 === request.token_address || 
                    anomaly.token2 === request.token_address
                );
            }
            if (typeof request.from_time === 'number') {
                anomalies = anomalies.filter(anomaly => anomaly.timestamp >= request.from_time!);
            }
            if (typeof request.to_time === 'number') {
                anomalies = anomalies.filter(anomaly => anomaly.timestamp <= request.to_time!);
            }
            if (typeof request.min_anomaly_score === 'number') {
                anomalies = anomalies.filter(anomaly => anomaly.anomaly_score >= request.min_anomaly_score!);
            }

            // Apply sorting
            const sortOrder = request.sort_order === 'asc' ? 1 : -1;
            anomalies.sort((a, b) => {
                if (request.sort_by === 'anomaly_score') {
                    return (a.anomaly_score - b.anomaly_score) * sortOrder;
                }
                return (a.timestamp - b.timestamp) * sortOrder;
            });

            // Apply pagination
            const page = request.page || 1;
            const pageSize = request.page_size || 10;
            const startIndex = (page - 1) * pageSize;
            const paginatedAnomalies = anomalies.slice(startIndex, startIndex + pageSize);

            return {
                success: true,
                data: paginatedAnomalies,
                metadata: {
                    total_anomalies: anomalies.length,
                    last_updated: Date.now()
                }
            };
        } catch (error) {
            console.error('Error getting volume anomalies:', error);
            throw error;
        }
    }





    async getSwapActivities(request: SwapMonitorRequest): Promise<SwapMonitorResponse> {
        try {
            let swaps: SwapActivity[] = [];
    
            if (request.pool_address) {
                swaps = this.swapActivities.get(request.pool_address) || [];
            } else {
                for (const poolSwaps of this.swapActivities.values()) {
                    swaps = swaps.concat(poolSwaps);
                }
            }


             // Apply filters
        if (request.program_id) {
            swaps = swaps.filter(swap => swap.program_id === request.program_id);
        }
        if (request.token_address) {
            swaps = swaps.filter(swap => 
                swap.token1 === request.token_address || 
                swap.token2 === request.token_address
            );
        }
        if (typeof request.from_time === 'number') {
            swaps = swaps.filter(swap => swap.timestamp >= request.from_time!);
        }
        if (typeof request.to_time === 'number') {
            swaps = swaps.filter(swap => swap.timestamp <= request.to_time!);
        }
        if (typeof request.min_value === 'number') {
            swaps = swaps.filter(swap => swap.value >= request.min_value!);
        }


         // Apply sorting
         const sortOrder = request.sort_order === 'asc' ? 1 : -1;
         swaps.sort((a, b) => {
             if (request.sort_by === 'value') {
                 return (a.value - b.value) * sortOrder;
             }
             return (a.timestamp - b.timestamp) * sortOrder;
         });
 
         // Apply pagination
         const page = request.page || 1;
         const pageSize = request.page_size || 10;
         const startIndex = (page - 1) * pageSize;
         const paginatedSwaps = swaps.slice(startIndex, startIndex + pageSize);
 
         return {
             success: true,
             data: paginatedSwaps,
             metadata: {
                 total_swaps: swaps.length,
                 last_updated: Date.now()
             }
         };
     } catch (error) {
         console.error('Error getting swap activities:', error);
         throw error;
     }
}
}

export const liquidityMonitorService = new LiquidityMonitorService(); 