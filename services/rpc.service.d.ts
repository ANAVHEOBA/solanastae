import { EventEmitter } from 'events';
import { ClusterNode } from '../modules/network/network.schema';
import { Transaction } from '../modules/validator/validator.schema';
interface VoteAccountParams {
    votePubkey?: string;
    keepUnstakedDelinquents?: boolean;
    delinquentSlotDistance?: number;
}
interface EpochInfo {
    absoluteSlot: number;
    blockHeight: number;
    epoch: number;
    slotIndex: number;
    slotsInEpoch: number;
    transactionCount: number;
}
interface EpochInfoParams {
    commitment?: 'processed' | 'confirmed' | 'finalized';
    minContextSlot?: number;
}
interface EpochCredit {
    epoch: number;
    credits: number;
    previousCredits: number;
}
interface VoteAccount {
    votePubkey: string;
    nodePubkey: string;
    activatedStake: number;
    epochVoteAccount: boolean;
    commission: number;
    lastVote: number;
    epochCredits: EpochCredit[];
    rootSlot: number;
}
interface VoteAccountsResponse {
    current: VoteAccount[];
    delinquent: VoteAccount[];
}
interface RPCResponse<T> {
    jsonrpc: string;
    id: number;
    result: T;
    error?: {
        code: number;
        message: string;
    };
}
interface InflationRate {
    total: number;
    validator: number;
    foundation: number;
    epoch: number;
}
interface InflationReward {
    epoch: number;
    effectiveSlot: number;
    amount: number;
    postBalance: number;
    commission?: number;
}
interface AccountInfo {
    data: string | null;
    executable: boolean;
    lamports: number;
    owner: string;
    rentEpoch: number;
}
interface AccountInfoParams {
    encoding?: 'base58' | 'base64' | 'jsonParsed';
    commitment?: 'processed' | 'confirmed' | 'finalized';
    dataSlice?: {
        offset: number;
        length: number;
    };
    minContextSlot?: number;
}
interface ProgramAccount {
    pubkey: string;
    account: {
        lamports: number;
        owner: string;
        data: [string, string];
        executable: boolean;
        rentEpoch: number;
        space: number;
    };
}
interface ProgramAccountsParams {
    encoding?: 'base58' | 'base64' | 'jsonParsed';
    commitment?: 'processed' | 'confirmed' | 'finalized';
    dataSlice?: {
        offset: number;
        length: number;
    };
    filters?: Array<{
        memcmp?: {
            offset: number;
            bytes: string;
        };
        dataSize?: number;
    }>;
    minContextSlot?: number;
}
interface BalanceResponse {
    context: {
        slot: number;
    };
    value: number;
}
interface TokenAccountBalance {
    context: {
        slot: number;
    };
    value: {
        amount: string;
        decimals: number;
        uiAmount: number;
        uiAmountString: string;
    };
}
interface AccountSubscribeParams {
    encoding?: 'base58' | 'base64' | 'base64+zstd' | 'jsonParsed';
    commitment?: 'processed' | 'confirmed' | 'finalized';
}
interface BlockProductionParams {
    commitment?: 'processed' | 'confirmed' | 'finalized';
    minContextSlot?: number;
}
interface BlockProductionResponse {
    context: {
        slot: number;
    };
    value: {
        byIdentity: {
            [key: string]: [number, number];
        };
        range: {
            firstSlot: number;
            lastSlot: number;
        };
    };
}
interface SupplyParams {
    commitment?: 'processed' | 'confirmed' | 'finalized';
    minContextSlot?: number;
}
interface RPCSupplyResponse {
    context: {
        slot: number;
    };
    value: {
        total: number;
        circulating: number;
        nonCirculating: number;
        nonCirculatingAccounts?: string[];
    };
}
interface RPCVersionResponse {
    version: string;
    feature_set: number;
}
interface LargestAccount {
    lamports: number;
    address: string;
}
export interface SignatureStatus {
    slot: number;
    confirmations: number | null;
    err: any | null;
    status: {
        Ok: null;
    } | {
        Err: any;
    } | null;
}
interface PrioritizationFee {
    account: string;
    fee: number;
    slot: number;
}
export interface TokenAccount {
    pubkey: string;
    account: {
        lamports: number;
        owner: string;
        data: {
            program: string;
            parsed: {
                info: {
                    isNative: boolean;
                    mint: string;
                    owner: string;
                    state: string;
                    tokenAmount: {
                        amount: string;
                        decimals: number;
                        uiAmount: number;
                        uiAmountString: string;
                    };
                };
            };
            space: number;
        };
        executable: boolean;
        rentEpoch: number;
        space: number;
    };
}
export interface TokenAccountsResponse {
    context: {
        apiVersion: string;
        slot: number;
    };
    value: TokenAccount[];
}
interface TokenSupplyResponse {
    context: {
        slot: number;
    };
    value: {
        amount: string;
        decimals: number;
        uiAmount: number;
        uiAmountString: string;
    };
}
interface MultipleAccountsResponse {
    context: {
        apiVersion: string;
        slot: number;
    };
    value: (AccountInfo | null)[];
}
interface SignatureSubscribeParams {
    commitment?: 'processed' | 'confirmed' | 'finalized';
    enableReceivedNotification?: boolean;
}
declare class RPCService extends EventEmitter {
    private readonly rpcUrl;
    private readonly apiKey;
    private readonly maxRetries;
    private readonly timeout;
    private readonly httpsAgent;
    private ws;
    private subscriptions;
    private nextSubscriptionId;
    private reconnectAttempts;
    constructor();
    private initializeWebSocket;
    subscribeToAccount(pubkey: string, params?: AccountSubscribeParams): Promise<number>;
    unsubscribeFromAccount(subscriptionId: number): Promise<boolean>;
    subscribeToVotes(): Promise<number>;
    unsubscribeFromVotes(subscriptionId: number): Promise<boolean>;
    subscribeToSlots(): Promise<number>;
    unsubscribeFromSlots(subscriptionId: number): Promise<boolean>;
    private retryRequest;
    private getFullUrl;
    getVoteAccounts(params?: VoteAccountParams): Promise<VoteAccountsResponse>;
    getEpochInfo(params?: EpochInfoParams): Promise<EpochInfo>;
    getInflationRate(): Promise<InflationRate>;
    getInflationReward(addresses: string[], params?: {
        commitment?: string;
        epoch?: number;
    }): Promise<(InflationReward | null)[]>;
    getAccountInfo(pubkey: string, params?: AccountInfoParams): Promise<AccountInfo>;
    getProgramAccounts(programId: string, params?: ProgramAccountsParams): Promise<ProgramAccount[]>;
    getBalance(pubkey: string, params?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
    }): Promise<BalanceResponse>;
    getTokenAccountBalance(pubkey: string, params?: {
        commitment?: 'processed' | 'confirmed' | 'finalized';
    }): Promise<TokenAccountBalance>;
    getRecentPerformanceSamples(limit?: number): Promise<any[]>;
    getBlockProduction(params?: BlockProductionParams): Promise<RPCResponse<BlockProductionResponse>>;
    getClusterNodes(): Promise<RPCResponse<ClusterNode[]>>;
    private getAxiosConfig;
    getSupply(params?: SupplyParams): Promise<RPCResponse<RPCSupplyResponse>>;
    getVersion(): Promise<RPCResponse<RPCVersionResponse>>;
    getHealth(): Promise<RPCResponse<string>>;
    getStakeMinimumDelegation(): Promise<number>;
    getLargestAccounts(params?: {
        commitment?: string;
        filter?: string;
    }): Promise<LargestAccount[]>;
    getLeaderSchedule(epoch?: number): Promise<{
        [key: string]: number[];
    } | null>;
    getSlotLeaders(startSlot: number, limit: number): Promise<string[]>;
    getSignatureStatuses(signatures: string[], searchTransactionHistory?: boolean): Promise<(SignatureStatus | null)[]>;
    getTransaction(signature: string, encoding?: 'json' | 'base58' | 'base64'): Promise<Transaction | null>;
    getRecentPrioritizationFees(accounts?: string[]): Promise<PrioritizationFee[]>;
    getSlot(commitment?: 'processed' | 'confirmed' | 'finalized'): Promise<number>;
    getBlockTime(slot: number): Promise<number | null>;
    getTokenAccountsByOwner(owner: string, programId?: string, encoding?: 'jsonParsed' | 'base58' | 'base64'): Promise<TokenAccountsResponse>;
    getTokenSupply(mint: string): Promise<TokenSupplyResponse>;
    getMultipleAccounts(pubkeys: string[]): Promise<MultipleAccountsResponse>;
    subscribeToSignature(signature: string, params?: SignatureSubscribeParams): Promise<number>;
}
export declare const rpcService: RPCService;
export {};
//# sourceMappingURL=rpc.service.d.ts.map