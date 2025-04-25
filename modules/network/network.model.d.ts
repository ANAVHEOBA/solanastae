import { EpochInfo, EpochInfoParams, NetworkStats, InflationRate, InflationReward, InflationRewardParams, AccountInfoParams, ProgramAccountsParams, BalanceResponse, TokenAccountBalance, AccountSubscribeParams, AccountSubscription, VoteSubscription, SlotSubscription, PerformanceSample, BlockProductionParams, BlockProductionResponse, PaginationParams, ClusterNodesResponse, SupplyParams, SupplyResponse, VersionResponse, AccountInfo, ProgramAccount } from './network.schema';
export declare class NetworkModel {
    private static cache;
    private static CACHE_TTL;
    private static REWARDS_CACHE_TTL;
    static getEpochInfo(params?: EpochInfoParams): Promise<EpochInfo>;
    static getInflationRate(): Promise<InflationRate>;
    static getInflationReward(params: InflationRewardParams): Promise<(InflationReward | null)[]>;
    static getNetworkStats(): Promise<NetworkStats>;
    static getAccountInfo(pubkey: string, params: Omit<AccountInfoParams, 'pubkey'>): Promise<AccountInfo>;
    static getBalance(pubkey: string, params?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
    }): Promise<BalanceResponse>;
    static getTokenAccountBalance(pubkey: string, params?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
    }): Promise<TokenAccountBalance>;
    static getProgramAccounts(programId: string, params: Omit<ProgramAccountsParams, 'programId'>): Promise<ProgramAccount[]>;
    static subscribeToAccount(pubkey: string, params?: AccountSubscribeParams): Promise<AccountSubscription>;
    static unsubscribeFromAccount(subscriptionId: number): Promise<boolean>;
    static subscribeToVotes(): Promise<VoteSubscription>;
    static unsubscribeFromVotes(subscriptionId: number): Promise<boolean>;
    static subscribeToSlots(): Promise<SlotSubscription>;
    static unsubscribeFromSlots(subscriptionId: number): Promise<boolean>;
    static getRecentPerformanceSamples(limit?: number): Promise<PerformanceSample[]>;
    static getBlockProduction(params?: BlockProductionParams): Promise<BlockProductionResponse>;
    static getClusterNodes(params?: PaginationParams): Promise<ClusterNodesResponse>;
    static getSupply(params?: SupplyParams, pagination?: PaginationParams): Promise<SupplyResponse>;
    static getVersion(): Promise<VersionResponse>;
    static getHealth(): Promise<string>;
    private static isCacheValid;
    private static isRewardsCacheValid;
    static clearCache(): void;
}
//# sourceMappingURL=network.model.d.ts.map