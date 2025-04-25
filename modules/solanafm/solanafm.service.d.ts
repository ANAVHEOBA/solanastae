import { SolanaFMAccountsRequest, SolanaFMAccountsResponse, SolanaFMAccountFeesRequest, SolanaFMAccountFeesResponse, SolanaFMTransactionsRequest, SolanaFMTransactionsResponse, OwnerTokenAccountsRequest, OwnerTokenAccountsResponse, TokenInfoRequest, TokenInfoResponse, TokenSupplyRequest, TokenSupplyResponse, SolanaFMActionsResponse, TransferRequest, TransferResponse } from './solanafm.schema';
export declare class SolanaFMService {
    private readonly baseUrl;
    private readonly apiKey;
    private readonly maxRetries;
    private readonly retryDelay;
    constructor();
    private retryRequest;
    getTaggedAccounts(request: SolanaFMAccountsRequest): Promise<SolanaFMAccountsResponse>;
    getAccountFees(request: SolanaFMAccountFeesRequest): Promise<SolanaFMAccountFeesResponse>;
    getAccountTransactions(request: SolanaFMTransactionsRequest): Promise<SolanaFMTransactionsResponse>;
    getOwnerTokenAccounts(request: OwnerTokenAccountsRequest): Promise<OwnerTokenAccountsResponse>;
    getTokenInfo(request: TokenInfoRequest): Promise<TokenInfoResponse>;
    getTokenSupply(request: TokenSupplyRequest): Promise<TokenSupplyResponse>;
    getActions(): Promise<SolanaFMActionsResponse>;
    getTransfer(request: TransferRequest): Promise<TransferResponse>;
}
export declare const solanaFMService: SolanaFMService;
//# sourceMappingURL=solanafm.service.d.ts.map