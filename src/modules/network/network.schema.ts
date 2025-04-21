export interface EpochInfo {
    absoluteSlot: number;
    blockHeight: number;
    epoch: number;
    slotIndex: number;
    slotsInEpoch: number;
    transactionCount: number;
}

export interface EpochInfoParams {
    commitment?: 'processed' | 'confirmed' | 'finalized';
    minContextSlot?: number;
}

export interface InflationRate {
    total: number;
    validator: number;
    foundation: number;
    epoch: number;
}

export interface InflationReward {
    epoch: number;
    effectiveSlot: number;
    amount: number;
    postBalance: number;
    commission?: number;
}

export interface InflationRewardParams {
    addresses: string[];
    commitment?: 'processed' | 'confirmed' | 'finalized';
    epoch?: number;
}

export interface NetworkStats extends EpochInfo {
    // Add more network stats as needed
    currentEpochProgress: number; // percentage
    averageSlotTime?: number; // in seconds
    currentSlotTime?: number; // in seconds
    inflationRate?: InflationRate; // Current inflation rates
}

export interface AccountInfoParams {
    pubkey: string;
    encoding?: 'base58' | 'base64' | 'jsonParsed';
    commitment?: 'processed' | 'confirmed' | 'finalized';
    dataSlice?: {
        offset: number;
        length: number;
    };
    minContextSlot?: number;
}

export interface ProgramAccountsParams {
    programId: string;
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

export interface BalanceResponse {
    context: {
        slot: number;
    };
    value: number;
}

export interface TokenAccountBalance {
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

export interface AccountSubscribeParams {
    encoding?: 'base58' | 'base64' | 'base64+zstd' | 'jsonParsed';
    commitment?: 'processed' | 'confirmed' | 'finalized';
}

export interface AccountSubscription {
    id: number;
    pubkey: string;
    params: AccountSubscribeParams;
}

export interface AccountNotification {
    context: {
        slot: number;
    };
    value: {
        data: [string, string] | {
            program: string;
            parsed: any;
        };
        executable: boolean;
        lamports: number;
        owner: string;
        rentEpoch: number;
        space: number;
    };
}

export interface VoteNotification {
    hash: string;
    slots: number[];
    timestamp: number | null;
    signature: string;
    votePubkey: string;
}

export interface VoteSubscription {
    id: number;
}

export interface SlotNotification {
    parent: number;
    root: number;
    slot: number;
}

export interface SlotSubscription {
    id: number;
}

export interface PerformanceSample {
    slot: number;
    numTransactions: number;
    numNonVoteTransactions: number;
    samplePeriodSecs: number;
    numSlots: number;
}

export interface BlockProductionRange {
    firstSlot: number;
    lastSlot: number;
}

export interface BlockProductionParams {
    commitment?: 'processed' | 'confirmed' | 'finalized';
    identity?: string;
    range?: BlockProductionRange;
}

export interface BlockProductionValue {
    byIdentity: {
        [key: string]: [number, number]; // [blocks, slots]
    };
    range: BlockProductionRange;
}

export interface BlockProductionResponse {
    context: {
        slot: number;
    };
    value: BlockProductionValue;
}

export interface ClusterNode {
    pubkey: string;
    gossip: string | null;
    tpu: string | null;
    tpu_vote: string | null;
    rpc: string | null;
    version: string | null;
    feature_set: number | null;
    shred_version: number | null;
    tvu: string | null;
    serve_repair: string | null;
    pubsub: string | null;
    tpu_forwards: string | null;
    tpu_forwards_quic: string | null;
    tpu_quic: string | null;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ClusterNodesResponse extends PaginatedResponse<ClusterNode> {}

export interface SupplyParams {
    commitment?: 'processed' | 'confirmed' | 'finalized';
    excludeNonCirculatingAccountsList?: boolean;
}

export interface SupplyResponse {
    context: {
        slot: number;
    };
    value: {
        total: number;
        circulating: number;
        nonCirculating: number;
        nonCirculatingAccounts?: string[];
    };
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface VersionResponse {
    'solana-core': string;
    'feature-set': number;
}

export interface HealthResponse {
    status: string;
}
