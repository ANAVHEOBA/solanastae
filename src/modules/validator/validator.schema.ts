export interface ValidatorStats {
    totalActiveStake: number;
    totalDelinquentStake: number;
    averageCommission: number;
    totalValidators: number;
    activeValidators: number;
    delinquentValidators: number;
}

export interface ValidatorPerformance {
    votePubkey: string;
    nodePubkey: string;
    activatedStake: number;
    commission: number;
    lastVote: number;
    rootSlot: number;
    epochVoteAccount: boolean;
    status: 'active' | 'delinquent';
    epochCredits: {
        epoch: number;
        credits: number;
        previousCredits: number;
    }[];
}

export interface ValidatorFilters {
    status?: 'active' | 'delinquent' | 'all';
    minStake?: number;
    maxCommission?: number;
    votePubkey?: string;
}

export interface TransactionMessage {
    accountKeys: string[];
    header: {
        numReadonlySignedAccounts: number;
        numReadonlyUnsignedAccounts: number;
        numRequiredSignatures: number;
    };
    instructions: {
        accounts: number[];
        data: string;
        programIdIndex: number;
    }[];
    recentBlockhash: string;
}

export interface TransactionMeta {
    err: any | null;
    fee: number;
    innerInstructions: any[];
    postBalances: number[];
    preBalances: number[];
    rewards: {
        pubkey: string;
        lamports: number;
        postBalance: number;
        rewardType: string;
    }[];
}

export interface Transaction {
    slot: number;
    transaction: {
        message: TransactionMessage;
        signatures: string[];
    };
    meta: TransactionMeta;
}

export interface TransactionResponse {
    jsonrpc: string;
    id: string;
    result: Transaction | null;
}

export interface TransactionPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TransactionResult {
    data: Transaction | null;
    pagination: TransactionPagination;
}

export interface PrioritizationFee {
    slot: number;
    prioritizationFee: number;
}

export interface PrioritizationFeesResponse {
    jsonrpc: string;
    id: string;
    result: PrioritizationFee[];
    error?: {
        code: number;
        message: string;
    };
}

export interface SlotResponse {
    jsonrpc: string;
    id: string;
    result: number;
    error?: {
        code: number;
        message: string;
    };
}

export interface BlockTimeResponse {
    jsonrpc: string;
    id: string;
    result: number | null;
    error?: {
        code: number;
        message: string;
    };
}

export interface ValidatorInfo {
    pubkey: string;
    commission: number;
    stake: number;
    isActive: boolean;
    lastVote: number;
    rootSlot: number;
    credits: number;
    version: string;
}

export interface LeaderSchedule {
    [pubkey: string]: number[] | null;
}

export interface PaginatedResponse<T> {
    data: T;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface TokenAccountInfo {
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
}

export interface TokenAccount {
    pubkey: string;
    account: {
        lamports: number;
        owner: string;
        data: {
            program: string;
            parsed: {
                info: TokenAccountInfo;
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

export interface TokenSupplyResponse {
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

export interface MultipleAccountsResponse {
    context: {
        apiVersion: string;
        slot: number;
    };
    value: (AccountInfo | null)[];
}

export interface AccountInfo {
    data: string | null;
    executable: boolean;
    lamports: number;
    owner: string;
    rentEpoch: number;
}

export interface SignatureSubscribeParams {
    commitment?: 'processed' | 'confirmed' | 'finalized';
    enableReceivedNotification?: boolean;
}

export interface SignatureNotification {
    context: {
        slot: number;
    };
    value: {
        err: any | null;
    } | 'receivedSignature';
}
