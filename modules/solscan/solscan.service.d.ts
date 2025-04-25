import { SolscanAccountDetailResponse, SolscanTokenAccountsRequest, SolscanAccountTransactionsRequest, SolscanAccountTransactionsResponse, SolscanPortfolioResponse, SolscanTokenAccountsResponse, SolscanStakeAccountsRequest, SolscanStakeAccountsResponse, SolscanTransferRequest, SolscanTransferResponse, DefiActivitiesRequest, DefiActivitiesResponse, TokenMetadataMultiRequest, TokenMetadataMultiResponse, TokenPriceMultiRequest, TokenPriceMultiResponse, TokenHoldersRequest, TokenHoldersResponse, TokenTransferRequest, TokenTransferResponse, TokenDefiActivitiesRequest, TokenDefiActivitiesResponse, LastTransactionsRequest, LastTransactionsResponse, TransactionDetailResponse, LastBlocksRequest, LastBlocksResponse, BlockTransactionsRequest, BlockTransactionsResponse, TransactionActionsResponse, BlockDetailRequest, BlockDetailResponse, MarketListRequest, MarketListResponse, MarketInfoRequest, MarketInfoResponse, MarketVolumeRequest, MarketVolumeResponse } from './solscan.schema';
export declare class SolscanService {
    private readonly baseUrl;
    private readonly apiKey;
    private readonly maxRetries;
    private readonly retryDelay;
    constructor();
    private retryRequest;
    getAccountDetail(address: string): Promise<SolscanAccountDetailResponse>;
    getAccountTransactions(request: SolscanAccountTransactionsRequest): Promise<SolscanAccountTransactionsResponse>;
    getPortfolio(address: string): Promise<SolscanPortfolioResponse>;
    getTokenAccounts(request: SolscanTokenAccountsRequest): Promise<SolscanTokenAccountsResponse>;
    getStakeAccounts(request: SolscanStakeAccountsRequest): Promise<SolscanStakeAccountsResponse>;
    getTransfers(request: SolscanTransferRequest): Promise<SolscanTransferResponse>;
    getDefiActivities(request: DefiActivitiesRequest): Promise<DefiActivitiesResponse>;
    getTokenMetadataMulti(request: TokenMetadataMultiRequest): Promise<TokenMetadataMultiResponse>;
    getTokenPriceMulti(request: TokenPriceMultiRequest): Promise<TokenPriceMultiResponse>;
    getTokenHolders(request: TokenHoldersRequest): Promise<TokenHoldersResponse>;
    getTokenTransfer(request: TokenTransferRequest): Promise<TokenTransferResponse>;
    getTokenDefiActivities(request: TokenDefiActivitiesRequest): Promise<TokenDefiActivitiesResponse>;
    getLastTransactions(request: LastTransactionsRequest): Promise<LastTransactionsResponse>;
    getTransactionDetail(tx: string): Promise<TransactionDetailResponse>;
    getTransactionActions(tx: string): Promise<TransactionActionsResponse>;
    getLastBlocks(request?: LastBlocksRequest): Promise<LastBlocksResponse>;
    getBlockTransactions(request: BlockTransactionsRequest): Promise<BlockTransactionsResponse>;
    getBlockDetail(request: BlockDetailRequest): Promise<BlockDetailResponse>;
    getMarketList(request?: MarketListRequest): Promise<MarketListResponse>;
    getMarketInfo(request: MarketInfoRequest): Promise<MarketInfoResponse>;
    getMarketVolume(request: MarketVolumeRequest): Promise<MarketVolumeResponse>;
}
export declare const solscanService: SolscanService;
//# sourceMappingURL=solscan.service.d.ts.map