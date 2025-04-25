import { rpcService } from '../../services/rpc.service';
import { EpochInfo, EpochInfoParams, NetworkStats, InflationRate, InflationReward, InflationRewardParams, AccountInfoParams, ProgramAccountsParams, BalanceResponse, TokenAccountBalance, AccountSubscribeParams, AccountSubscription, VoteSubscription, VoteNotification, SlotSubscription, SlotNotification, PerformanceSample, BlockProductionParams, BlockProductionResponse, ClusterNode, PaginationParams, ClusterNodesResponse, SupplyParams, SupplyResponse, VersionResponse, AccountInfo, ProgramAccount } from './network.schema';

export class NetworkModel {
    private static cache: {
        epochInfo?: EpochInfo;
        networkStats?: NetworkStats;
        inflationRate?: InflationRate;
        inflationRewards?: Map<string, InflationReward>;
        lastUpdated?: number;
    } = {};

    private static CACHE_TTL = 10 * 1000; // 10 seconds cache for network info
    private static REWARDS_CACHE_TTL = 60 * 1000; // 1 minute cache for rewards

    static async getEpochInfo(params?: EpochInfoParams): Promise<EpochInfo> {
        if (this.isCacheValid() && this.cache.epochInfo) {
            return this.cache.epochInfo;
        }

        const epochInfo = await rpcService.getEpochInfo(params);
        this.cache.epochInfo = epochInfo;
        this.cache.lastUpdated = Date.now();
        
        return epochInfo;
    }

    static async getInflationRate(): Promise<InflationRate> {
        if (this.isCacheValid() && this.cache.inflationRate) {
            return this.cache.inflationRate;
        }

        const inflationRate = await rpcService.getInflationRate();
        this.cache.inflationRate = inflationRate;
        this.cache.lastUpdated = Date.now();

        return inflationRate;
    }

    static async getInflationReward(params: InflationRewardParams): Promise<(InflationReward | null)[]> {
        // Initialize rewards cache if not exists
        if (!this.cache.inflationRewards) {
            this.cache.inflationRewards = new Map();
        }

        // Check cache for each address
        const cachedRewards = new Map<string, InflationReward>();
        const addressesToFetch: string[] = [];

        params.addresses.forEach(address => {
            const cachedReward = this.cache.inflationRewards?.get(address);
            if (cachedReward && this.isRewardsCacheValid()) {
                cachedRewards.set(address, cachedReward);
            } else {
                addressesToFetch.push(address);
            }
        });

        // If all rewards are cached, return them
        if (addressesToFetch.length === 0) {
            return params.addresses.map(addr => cachedRewards.get(addr) || null);
        }

        // Fetch rewards for addresses not in cache
        const rewards = await rpcService.getInflationReward(addressesToFetch, {
            commitment: params.commitment,
            epoch: params.epoch
        });

        // Update cache with new rewards
        addressesToFetch.forEach((address, index) => {
            if (rewards[index]) {
                this.cache.inflationRewards?.set(address, rewards[index]!);
            }
        });

        // Combine cached and fetched rewards in original order
        return params.addresses.map(addr => {
            return cachedRewards.get(addr) || 
                   this.cache.inflationRewards?.get(addr) || 
                   null;
        });
    }

    static async getNetworkStats(): Promise<NetworkStats> {
        if (this.isCacheValid() && this.cache.networkStats) {
            return this.cache.networkStats;
        }

        const [epochInfo, inflationRate] = await Promise.all([
            this.getEpochInfo({ commitment: 'finalized' }),
            this.getInflationRate()
        ]);
        
        const stats: NetworkStats = {
            ...epochInfo,
            currentEpochProgress: (epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100,
            averageSlotTime: 0.4, // Solana's target slot time
            currentSlotTime: 0.4, // You could calculate this from recent blocks
            inflationRate
        };

        this.cache.networkStats = stats;
        return stats;
    }

    static async getAccountInfo(pubkey: string, params: Omit<AccountInfoParams, 'pubkey'>): Promise<AccountInfo> {
        return rpcService.getAccountInfo(pubkey, params);
    }

    static async getBalance(pubkey: string, params?: { commitment?: 'processed' | 'confirmed' | 'finalized' }): Promise<BalanceResponse> {
        return rpcService.getBalance(pubkey, params);
    }

    static async getTokenAccountBalance(pubkey: string, params?: { commitment?: 'processed' | 'confirmed' | 'finalized' }): Promise<TokenAccountBalance> {
        return rpcService.getTokenAccountBalance(pubkey, params);
    }

    static async getProgramAccounts(programId: string, params: Omit<ProgramAccountsParams, 'programId'>): Promise<ProgramAccount[]> {
        return rpcService.getProgramAccounts(programId, params);
    }

    static async subscribeToAccount(pubkey: string, params?: AccountSubscribeParams): Promise<AccountSubscription> {
        const subscriptionId = await rpcService.subscribeToAccount(pubkey, params);
        
        const subscription: AccountSubscription = {
            id: subscriptionId,
            pubkey,
            params: params || { encoding: 'jsonParsed', commitment: 'finalized' }
        };

        return subscription;
    }

    static async unsubscribeFromAccount(subscriptionId: number): Promise<boolean> {
        return rpcService.unsubscribeFromAccount(subscriptionId);
    }

    static async subscribeToVotes(): Promise<VoteSubscription> {
        try {
            const subscriptionId = await rpcService.subscribeToVotes();
            
            const subscription: VoteSubscription = {
                id: subscriptionId
            };

            // Set up vote notification listener
            rpcService.on('vote', (notification: VoteNotification) => {
                console.log('[NetworkModel] Vote notification received:', notification);
                // You can add additional processing here if needed
            });

            return subscription;
        } catch (error) {
            if (error instanceof Error && error.message.includes('not supported')) {
                throw new Error('Vote subscription is not supported by the current RPC endpoint (Helius)');
            }
            throw error;
        }
    }

    static async unsubscribeFromVotes(subscriptionId: number): Promise<boolean> {
        return rpcService.unsubscribeFromVotes(subscriptionId);
    }

    static async subscribeToSlots(): Promise<SlotSubscription> {
        try {
            const subscriptionId = await rpcService.subscribeToSlots();
            
            const subscription: SlotSubscription = {
                id: subscriptionId
            };

            // Set up slot notification listener
            rpcService.on('slot', (notification: SlotNotification) => {
                console.log('[NetworkModel] Slot notification received:', notification);
                // You can add additional processing here if needed
            });

            return subscription;
        } catch (error) {
            console.error('[NetworkModel] Error subscribing to slots:', error);
            throw error;
        }
    }

    static async unsubscribeFromSlots(subscriptionId: number): Promise<boolean> {
        try {
            return await rpcService.unsubscribeFromSlots(subscriptionId);
        } catch (error) {
            console.error('[NetworkModel] Error unsubscribing from slots:', error);
            throw error;
        }
    }

    static async getRecentPerformanceSamples(limit?: number): Promise<PerformanceSample[]> {
        try {
            console.log('[NetworkModel] Getting recent performance samples', { limit });
            return await rpcService.getRecentPerformanceSamples(limit);
        } catch (error) {
            console.error('[NetworkModel] Error getting recent performance samples:', error);
            throw error;
        }
    }

    static async getBlockProduction(params?: BlockProductionParams): Promise<BlockProductionResponse> {
        try {
            console.log('[NetworkModel] Getting block production', { params });
            const response = await rpcService.getBlockProduction(params);
            if (!response.result || !response.result.context || !response.result.value) {
                throw new Error('Invalid block production response format');
            }
            return {
                context: response.result.context,
                value: {
                    byIdentity: response.result.value.byIdentity,
                    range: response.result.value.range
                }
            };
        } catch (error) {
            console.error('[NetworkModel] Error getting block production:', error);
            throw error;
        }
    }

    static async getClusterNodes(params?: PaginationParams): Promise<ClusterNodesResponse> {
        try {
            console.log('[NetworkModel] Getting cluster nodes with pagination:', params);
            const response = await rpcService.getClusterNodes();
            
            const nodes = response.result;
            const page = params?.page || 1;
            const limit = params?.limit || 20;
            const total = nodes.length;
            const totalPages = Math.ceil(total / limit);
            
            // Calculate start and end indices for the current page
            const startIndex = (page - 1) * limit;
            const endIndex = Math.min(startIndex + limit, total);
            
            // Get nodes for the current page
            const paginatedNodes = nodes.slice(startIndex, endIndex);
            
            console.log('[NetworkModel] Paginated response:', {
                nodesCount: paginatedNodes.length,
                page,
                totalPages
            });

            return {
                data: paginatedNodes,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages
                }
            };
        } catch (error) {
            console.error('[NetworkModel] Error getting cluster nodes:', error);
            throw error;
        }
    }

    static async getSupply(params?: SupplyParams, pagination?: PaginationParams): Promise<SupplyResponse> {
        try {
            console.log('[NetworkModel] Getting supply information');
            const response = await rpcService.getSupply(params);
            
            // Handle pagination for nonCirculatingAccounts if they exist
            let paginatedAccounts = response.result.value.nonCirculatingAccounts || [];
            let total = paginatedAccounts.length;

            if (pagination && paginatedAccounts.length > 0) {
                const { page = 1, limit = 50 } = pagination;
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                paginatedAccounts = paginatedAccounts.slice(startIndex, endIndex);
            }

            // Transform the RPC response to match our schema
            return {
                context: {
                    slot: response.result.context.slot
                },
                value: {
                    total: response.result.value.total,
                    circulating: response.result.value.circulating,
                    nonCirculating: response.result.value.nonCirculating,
                    nonCirculatingAccounts: paginatedAccounts
                },
                pagination: pagination ? {
                    total,
                    page: pagination.page || 1,
                    limit: pagination.limit || 50,
                    totalPages: Math.ceil(total / (pagination.limit || 50))
                } : undefined
            };
        } catch (error) {
            console.error('[NetworkModel] Error getting supply:', error);
            throw error;
        }
    }

    static async getVersion(): Promise<VersionResponse> {
        try {
            console.log('[NetworkModel] Getting version information');
            const response = await rpcService.getVersion();
            
            // Transform the RPC response to match our schema
            return {
                'solana-core': response.result.version,
                'feature-set': response.result.feature_set
            };
        } catch (error) {
            console.error('[NetworkModel] Error getting version:', error);
            throw error;
        }
    }

    static async getHealth(): Promise<string> {
        try {
            console.log('[NetworkModel] Getting health status');
            const response = await rpcService.getHealth();
            return response.result;
        } catch (error) {
            console.error('[NetworkModel] Error getting health status:', error);
            throw error;
        }
    }

    private static isCacheValid(): boolean {
        return !!(
            this.cache.lastUpdated &&
            Date.now() - this.cache.lastUpdated < this.CACHE_TTL
        );
    }

    private static isRewardsCacheValid(): boolean {
        return !!(
            this.cache.lastUpdated &&
            Date.now() - this.cache.lastUpdated < this.REWARDS_CACHE_TTL
        );
    }

    static clearCache(): void {
        this.cache = {};
    }
}
