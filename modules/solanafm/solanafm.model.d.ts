import { SolanaFMAccountsResponse, SolanaFMAccountFeesResponse, SolanaFMTransactionsRequest, SolanaFMTransactionsResponse, OwnerTokenAccountsRequest, OwnerTokenAccountsResponse, TokenInfoRequest, TokenInfoResponse, TokenSupplyRequest, TokenSupplyResponse, SolanaFMActionsResponse, TransferRequest, TransferResponse } from './solanafm.schema';
export declare class SolanaFMModel {
    static getTaggedAccounts(accountHashes: string[], fields?: ('data' | 'onchain' | '*')[]): Promise<SolanaFMAccountsResponse>;
    static getAccountFees(accountHash: string, from: string, to: string): Promise<SolanaFMAccountFeesResponse>;
    static getAccountTransactions(request: SolanaFMTransactionsRequest): Promise<SolanaFMTransactionsResponse>;
    static getOwnerTokenAccounts(request: OwnerTokenAccountsRequest): Promise<OwnerTokenAccountsResponse>;
    static getTokenInfo(request: TokenInfoRequest): Promise<TokenInfoResponse>;
    static getTokenSupply(request: TokenSupplyRequest): Promise<TokenSupplyResponse>;
    static getActions(): Promise<SolanaFMActionsResponse>;
    static getTransfer(request: TransferRequest): Promise<TransferResponse>;
}
//# sourceMappingURL=solanafm.model.d.ts.map