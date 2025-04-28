export interface SolscanAccountDetail {
    address: string;
    lamports: number;
    ownerProgram: string;
    data: {
        parsed: any;
        program: string;
        space: number;
    };
    executable: boolean;
    rentEpoch: number;
    tokenInfo?: {
        tokenAmount: {
            amount: string;
            decimals: number;
            uiAmount: number;
            uiAmountString: string;
        };
        mint: string;
        owner: string;
    };
}

export interface SolscanAccountDetailResponse {
    success: boolean;
    data: SolscanAccountDetail;
    message?: string;
}

export interface SolscanError {
    success: boolean;
    message: string;
    error?: any;
}

export interface SolscanTransaction {
    slot: number;
    fee: number;
    status: string;
    signer: string[];
    block_time: number;
    tx_hash: string;
    parsed_instructions: {
        type: string;
        program: string;
        program_id: string;
    }[];
    program_ids: string[];
    time: string;
}

export interface SolscanAccountTransactionsResponse {
    success: boolean;
    data: SolscanTransaction[];
    metadata: Record<string, any>;
}

export interface SolscanAccountTransactionsRequest {
    address: string;
    limit?: number;
}

export interface SolscanToken {
    token_address: string;
    amount: number;
    balance: number;
    token_price: number;
    token_decimals: number;
    token_name: string;
    token_symbol: string;
    token_icon: string;
    value: number;
}

export interface SolscanPortfolio {
    total_value: number;
    native_balance: number | null;
    tokens: SolscanToken[];
}

export interface SolscanPortfolioResponse {
    success: boolean;
    data: SolscanPortfolio;
    metadata: Record<string, any>;
}

export interface SolscanPortfolioRequest {
    address: string;
} 


export interface SolscanTokenAccount {
    token_account: string;
    token_address: string;
    amount: number;
    token_decimals: number;
    owner: string;
}

export interface SolscanTokenMetadata {
    token_address: string;
    token_name: string;
    token_symbol: string;
    token_icon: string;
}

export interface SolscanTokenAccountsResponse {
    success: boolean;
    data: SolscanTokenAccount[];
    metadata: {
        tokens: Record<string, SolscanTokenMetadata>;
    };
}

export interface SolscanTokenAccountsRequest {
    address: string;
    type: 'token' | 'nft';
    page?: number;
    page_size?: 10 | 20 | 30 | 40;
    hide_zero?: boolean;
}


export interface SolscanStakeAccount {
    // Since the example response is empty, we'll define a basic structure
    // that can be expanded later
    stakeAccount: string;
    amount: number;
    validator?: string;
    status?: string;
    activationEpoch?: number;
    deactivationEpoch?: number;
}

export interface SolscanStakeAccountsResponse {
    success: boolean;
    data: SolscanStakeAccount[];
    metadata: Record<string, any>;
}

export interface SolscanStakeAccountsRequest {
    address: string;
    page?: number;
    page_size?: 10 | 20 | 30 | 40;
}



export type ActivityType = 
    'ACTIVITY_SPL_TRANSFER' | 
    'ACTIVITY_SPL_BURN' | 
    'ACTIVITY_SPL_MINT' | 
    'ACTIVITY_SPL_CREATE_ACCOUNT' |
    'ACTIVITY_SPL_TOKEN_WITHDRAW_STAKE';

export interface SolscanTransfer {
    block_id: number;
    trans_id: string;
    block_time: number;
    activity_type: ActivityType;
    from_address: string;
    from_token_account: string;
    to_address: string;
    to_token_account: string;
    token_address: string;
    token_decimals: number;
    amount: number;
    flow: 'in' | 'out';
    value: number;
    time: string;
}

export interface SolscanTokenMetadata {
    token_address: string;
    token_name: string;
    token_symbol: string;
    token_icon: string;
}

export interface SolscanTransferResponse {
    success: boolean;
    data: SolscanTransfer[];
    metadata: {
        tokens: Record<string, SolscanTokenMetadata>;
    };
}

export interface SolscanTransferRequest {
    address: string;
    activity_type?: ActivityType[];
    token_account?: string;
    from?: string;
    to?: string;
    token?: string;
    amount?: [number, number];
    from_time?: number;
    to_time?: number;
    exclude_amount_zero?: boolean;
    flow?: 'in' | 'out';
    page?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
    sort_by?: 'block_time';
    sort_order?: 'asc' | 'desc';
    value?: [number, number];
}

export type DefiActivityType = 
    'ACTIVITY_TOKEN_SWAP' | 
    'ACTIVITY_AGG_TOKEN_SWAP' | 
    'ACTIVITY_TOKEN_ADD_LIQ' | 
    'ACTIVITY_TOKEN_REMOVE_LIQ' | 
    'ACTIVITY_SPL_TOKEN_STAKE' | 
    'ACTIVITY_SPL_TOKEN_UNSTAKE' | 
    'ACTIVITY_TOKEN_DEPOSIT_VAULT' | 
    'ACTIVITY_TOKEN_WITHDRAW_VAULT' | 
    'ACTIVITY_SPL_INIT_MINT' | 
    'ACTIVITY_ORDERBOOK_ORDER_PLACE';

export interface DefiRouter {
    token1: string;
    token1_decimals: number;
    amount1: number;
    token2?: string;
    token2_decimals?: number;
    amount2?: number;
    child_routers?: any[];
}

export interface DefiActivity {
    block_id: number;
    trans_id: string;
    block_time: number;
    activity_type: DefiActivityType;
    from_address: string;
    sources: string[];
    platform: string[];
    value: number;
    routers: DefiRouter;
    time: string;
}

export interface DefiTokenMetadata {
    token_address: string;
    token_name?: string;
    token_symbol?: string;
    token_icon: string;
}

export interface DefiActivitiesResponse {
    success: boolean;
    data: DefiActivity[];
    metadata: {
        tokens: Record<string, DefiTokenMetadata>;
    };
}

export interface DefiActivitiesRequest {
    address: string;
    activity_type?: DefiActivityType[];
    from?: string;
    platform?: string[];
    source?: string[];
    token?: string;
    from_time?: number;
    to_time?: number;
    page?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
    sort_by?: 'block_time';
    sort_order?: 'asc' | 'desc';
}

export interface TokenMetadata {
    address: string;
    name: string;
    symbol: string;
    icon: string;
    decimals: number;
    holder: number;
    creator: string;
    create_tx: string;
    created_time: number;
    metadata: any | null;
    mint_authority: string | null;
    freeze_authority: string | null;
    supply: string;
    price: number;
    volume_24h: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_24h: number;
}

export interface TokenMetadataMultiResponse {
    success: boolean;
    data: TokenMetadata[];
    metadata: Record<string, any>;
}

export interface TokenMetadataMultiRequest {
    address: string[];
}

export interface TokenPrice {
    date: number;
    price: number;
}

export interface TokenPriceData {
    token_address: string;
    prices: TokenPrice[];
}

export interface TokenPriceMultiResponse {
    success: boolean;
    data: TokenPriceData[];
    metadata: Record<string, any>;
}

export interface TokenPriceMultiRequest {
    address: string[];
    from_time?: number;
    to_time?: number;
}

export interface TokenHolder {
    address: string;
    amount: number;
    decimals: number;
    owner: string;
    rank: number;
}

export interface TokenHoldersData {
    total: number;
    items: TokenHolder[];
}

export interface TokenHoldersResponse {
    success: boolean;
    data: TokenHoldersData;
    metadata: Record<string, any>;
}

export interface TokenHoldersRequest {
    address: string;
    page?: number;
    page_size?: 10 | 20 | 30 | 40;
    from_amount?: string;
    to_amount?: string;
}

export type TokenTransferActivityType = 
    'ACTIVITY_SPL_TRANSFER' | 
    'ACTIVITY_SPL_BURN' | 
    'ACTIVITY_SPL_MINT' | 
    'ACTIVITY_SPL_CREATE_ACCOUNT';

export interface TokenTransfer {
    block_id: number;
    trans_id: string;
    block_time: number;
    activity_type: TokenTransferActivityType;
    from_address: string;
    from_token_account: string;
    to_address: string;
    to_token_account: string;
    token_address: string;
    token_decimals: number;
    amount: number;
    value: number;
    time: string;
}

export interface TokenTransferResponse {
    success: boolean;
    data: TokenTransfer[];
    metadata: {
        tokens: Record<string, TokenMetadata>;
    };
}

export interface TokenTransferRequest {
    address: string;
    activity_type?: TokenTransferActivityType[];
    from?: string;
    to?: string;
    amount?: [number, number];
    block_time?: [number, number];
    exclude_amount_zero?: boolean;
    page?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
    sort_by?: 'block_time';
    sort_order?: 'asc' | 'desc';
    value?: [number, number];
}

export type TokenDefiActivityType = 
    'ACTIVITY_TOKEN_SWAP' | 
    'ACTIVITY_AGG_TOKEN_SWAP' | 
    'ACTIVITY_TOKEN_ADD_LIQ' | 
    'ACTIVITY_TOKEN_REMOVE_LIQ' | 
    'ACTIVITY_SPL_TOKEN_STAKE' | 
    'ACTIVITY_SPL_TOKEN_UNSTAKE' | 
    'ACTIVITY_TOKEN_DEPOSIT_VAULT' | 
    'ACTIVITY_TOKEN_WITHDRAW_VAULT' | 
    'ACTIVITY_SPL_INIT_MINT' | 
    'ACTIVITY_ORDERBOOK_ORDER_PLACE';

export interface TokenDefiRouter {
    token1: string;
    token1_decimals: number;
    amount1: string | number;
    token2?: string;
    token2_decimals?: number;
    amount2?: string | number;
    program_address?: string;
    pool_address?: string;
    child_routers?: TokenDefiRouter[];
}

export interface TokenDefiActivity {
    block_id: number;
    trans_id: string;
    block_time: number;
    activity_type: TokenDefiActivityType;
    from_address: string;
    sources: string[];
    platform: string[];
    value: number;
    routers: TokenDefiRouter;
    time: string;
}

export interface TokenDefiActivitiesResponse {
    success: boolean;
    data: TokenDefiActivity[];
    metadata: {
        tokens: Record<string, TokenMetadata>;
    };
}

export interface TokenDefiActivitiesRequest {
    address: string;
    from?: string;
    platform?: string[];
    source?: string[];
    activity_type?: TokenDefiActivityType[];
    token?: string;
    from_time?: number;
    to_time?: number;
    page?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
    sort_by?: 'block_time';
    sort_order?: 'asc' | 'desc';
}

export interface LastTransaction {
    fee: number;
    signer: string[];
    slot: number;
    status: 'Success' | 'Fail';
    block_time: number;
    tx_hash: string;
    parsed_instructions: {
        type: string;
        program: string;
        program_id: string;
    }[];
    program_ids: string[];
    time: string;
}

export interface LastTransactionsResponse {
    success: boolean;
    data: LastTransaction[];
    metadata: Record<string, any>;
}

export interface LastTransactionsRequest {
    limit?: 10 | 20 | 30 | 40 | 60 | 100;
    filter?: 'exceptVote' | 'all';
}






export interface TransactionDetail {
    block_id: number;
    fee: number;
    reward: any[];
    sol_bal_change: {
        address: string;
        pre_balance: string;
        post_balance: string;
        change_amount: string;
    }[];
    token_bal_change: {
        address: string;
        change_type: 'inc' | 'dec';
        change_amount: string;
        decimals: number;
        post_balance: string;
        pre_balance: string;
        token_address: string;
        owner: string;
        post_owner: string;
        pre_owner: string;
    }[];
    tokens_involved: string[];
    parsed_instructions: {
        ins_index: number;
        parsed_type: string;
        type: string;
        program_id: string;
        program: string;
        data_raw: any;
        accounts: string[];
        activities: any[];
        transfers: any[];
        program_invoke_level: number;
        idl_data?: any;
    }[];
    programs_involved: string[];
    signer: string[];
    status: number;
    compute_units_consumed: number;
    priority_fee: number;
    tx_hash: string;
    block_time: number;
    log_message: string[];
    tx_status: string;
}

export interface TransactionDetailResponse {
    success: boolean;
    data: TransactionDetail;
    metadata: {
        tokens: {
            [key: string]: {
                token_address: string;
                token_name: string;
                token_symbol: string;
                token_icon: string;
            };
        };
    };
}



export interface TransactionActionSummary {
    title: {
        activity_type: string;
        program_id: string;
        data: Record<string, any>;
    };
    body: {
        activity_type: string;
        program_id: string;
        data: Record<string, any>;
    }[];
}

export interface TransactionActionTransfer {
    source_owner: string;
    source: string;
    destination: string;
    destination_owner: string;
    transfer_type: string;
    token_address: string;
    decimals: number;
    amount_str: string;
    amount: number;
    program_id: string;
    outer_program_id: string;
    ins_index: number;
    outer_ins_index: number;
    base_value?: {
        token_address: string;
        decimals: number;
        amount: number;
        amount_str: string;
    };
}

export interface TransactionActionActivity {
    name: string;
    activity_type: string;
    program_id: string;
    data: Record<string, any>;
    ins_index: number;
    outer_ins_index: number;
    outer_program_id: string | null;
}

export interface TransactionActions {
    tx_hash: string;
    block_id: number;
    block_time: number;
    time: string;
    fee: number;
    summaries: TransactionActionSummary[];
    transfers: TransactionActionTransfer[];
    activities: TransactionActionActivity[];
}

export interface TransactionActionsResponse {
    success: boolean;
    data: TransactionActions;
    metadata: {
        tokens: {
            [key: string]: {
                token_address: string;
                token_name: string;
                token_symbol: string;
                token_icon: string;
            };
        };
    };
}






export interface LastBlock {
    blockhash: string;
    fee_rewards: number;
    transactions_count: number;
    current_slot: number;
    block_height: number;
    block_time: number;
    time: string;
    parent_slot: number;
    previous_block_hash: string;
}

export interface LastBlocksResponse {
    success: boolean;
    data: LastBlock[];
    metadata: Record<string, any>;
}

export interface LastBlocksRequest {
    limit?: 10 | 20 | 30 | 40 | 60 | 100;
}



export interface BlockTransaction {
    slot: number;
    fee: number;
    status: string;
    signer: string[];
    block_time: number;
    tx_hash: string;
    parsed_instructions: {
        type: string;
        program: string;
        program_id: string;
    }[];
    program_ids: string[];
    time: string;
}

export interface BlockTransactionsData {
    total: number;
    transactions: BlockTransaction[];
}

export interface BlockTransactionsResponse {
    success: boolean;
    data: BlockTransactionsData;
    metadata: Record<string, any>;
}

export interface BlockTransactionsRequest {
    block: number;
    page?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
    exclude_vote?: boolean;
    program?: string;
}










export interface BlockDetail {
    slot: number;
    blockhash: string;
    totalMevRewards: string;
    fee_rewards: number;
    transactions_count: number;
    block_height: number;
    block_time: number;
    time: string;
    parent_slot: number;
    previous_block_hash: string;
}

export interface BlockDetailResponse {
    success: boolean;
    data: BlockDetail;
    metadata: Record<string, any>;
}

export interface BlockDetailRequest {
    block: number;
}





export interface MarketPool {
    pool_address: string;
    program_id: string;
    token1: string;
    token1_account: string;
    token2: string;
    token2_account: string;
    created_time: number;
}

export interface MarketListResponse {
    success: boolean;
    data: MarketPool[];
    metadata: Record<string, any>;
}

export interface MarketListRequest {
    page?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
    program?: string;
    token_address?: string;
    sort_by?: 'created_time' | 'volumes_24h' | 'trades_24h';
    sort_order?: 'asc' | 'desc';
}






export interface MarketTokenInfo {
    token: string;
    token_account: string;
    amount: number;
}

export interface MarketInfo {
    pool_address: string;
    program_id: string;
    tokens_info: MarketTokenInfo[];
    create_tx_hash: string;
    create_block_time: number;
    creator: string;
}

export interface MarketInfoResponse {
    success: boolean;
    data: MarketInfo;
    metadata: Record<string, any>;
}

export interface MarketInfoRequest {
    address: string;
}

export interface MarketVolume {
    pool_address: string;
    program_id: string;
    total_volume_24h: number;
    total_volume_change_24h: number;
    total_trades_24h: number;
    total_trades_change_24h: number;
}

export interface MarketVolumeResponse {
    success: boolean;
    data: MarketVolume;
    metadata: Record<string, any>;
}

export interface MarketVolumeRequest {
    address: string;
    time?: [string, string]; // Format: YYYYMMDD
}

export interface TokenListResponse {
    success: boolean;
    data: {
        address: string;
        decimals: number;
        name: string;
        symbol: string;
        created_time: number;
        price?: number;
    }[];
    metadata: Record<string, any>;
}

export interface TokenListRequest {
    sort_by?: 'holder' | 'market_cap' | 'created_time';
    sort_order?: 'asc' | 'desc';
    page?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
}

export interface TrendingToken {
    address: string;
    decimals: number;
    name: string;
    symbol: string;
}

export interface TrendingTokensResponse {
    success: boolean;
    data: TrendingToken[];
    metadata: Record<string, any>;
}

export interface TrendingTokensRequest {
    limit?: number;
}