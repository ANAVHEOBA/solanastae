import { SolscanAccountDetailResponse, SolscanAccountTransactionsResponse, SolscanPortfolioResponse, SolscanTokenAccountsResponse, SolscanStakeAccountsResponse, SolscanTransferRequest, SolscanTransferResponse, DefiActivitiesRequest, DefiActivitiesResponse, TokenMetadataMultiResponse, TokenPriceMultiResponse, TokenHoldersResponse, TokenTransferRequest, TokenTransferResponse, TokenDefiActivitiesRequest, TokenDefiActivitiesResponse, LastTransactionsResponse, TransactionDetailResponse, BlockTransactionsResponse, LastBlocksResponse, BlockDetailResponse, TransactionActionsResponse, MarketListResponse, MarketInfoResponse, MarketVolumeResponse } from './solscan.schema';
export declare class SolscanModel {
    static getAccountDetail(address: string): Promise<SolscanAccountDetailResponse>;
    static getAccountTransactions(address: string, limit?: number): Promise<SolscanAccountTransactionsResponse>;
    static getPortfolio(address: string): Promise<SolscanPortfolioResponse>;
    static getTokenAccounts(address: string, type: 'token' | 'nft', page?: number, pageSize?: 10 | 20 | 30 | 40, hideZero?: boolean): Promise<SolscanTokenAccountsResponse>;
    static getStakeAccounts(address: string, page?: number, pageSize?: 10 | 20 | 30 | 40): Promise<SolscanStakeAccountsResponse>;
    static getTransfers(address: string, options?: Omit<SolscanTransferRequest, 'address'>): Promise<SolscanTransferResponse>;
    static getDefiActivities(address: string, options?: Omit<DefiActivitiesRequest, 'address'>): Promise<DefiActivitiesResponse>;
    static getTokenMetadataMulti(addresses: string[]): Promise<TokenMetadataMultiResponse>;
    static getTokenPriceMulti(addresses: string[], fromTime?: number, toTime?: number): Promise<TokenPriceMultiResponse>;
    static getTokenHolders(address: string, page?: number, pageSize?: 10 | 20 | 30 | 40, fromAmount?: string, toAmount?: string): Promise<TokenHoldersResponse>;
    static getTokenTransfer(address: string, options?: Omit<TokenTransferRequest, 'address'>): Promise<TokenTransferResponse>;
    static getTokenDefiActivities(address: string, options?: Omit<TokenDefiActivitiesRequest, 'address'>): Promise<TokenDefiActivitiesResponse>;
    static getLastTransactions(limit?: 10 | 20 | 30 | 40 | 60 | 100, filter?: 'exceptVote' | 'all'): Promise<LastTransactionsResponse>;
    static getTransactionDetail(tx: string): Promise<TransactionDetailResponse>;
    static getTransactionActions(tx: string): Promise<TransactionActionsResponse>;
    static getLastBlocks(limit?: 10 | 20 | 30 | 40 | 60 | 100): Promise<LastBlocksResponse>;
    static getBlockTransactions(block: number, page?: number, pageSize?: 10 | 20 | 30 | 40 | 60 | 100, excludeVote?: boolean, program?: string): Promise<BlockTransactionsResponse>;
    static getBlockDetail(block: number): Promise<BlockDetailResponse>;
    static getMarketList(page?: number, pageSize?: 10 | 20 | 30 | 40 | 60 | 100, program?: string, tokenAddress?: string, sortBy?: 'created_time' | 'volumes_24h' | 'trades_24h', sortOrder?: 'asc' | 'desc'): Promise<MarketListResponse>;
    static getMarketInfo(address: string): Promise<MarketInfoResponse>;
    static getMarketVolume(address: string, time?: [string, string]): Promise<MarketVolumeResponse>;
}
//# sourceMappingURL=solscan.model.d.ts.map