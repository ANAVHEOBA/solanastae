export interface SolanaFMAccountData {
    friendlyName?: string;
    abbreviation?: string;
    category?: 'markets' | 'validators' | 'accounts' | 'tokens' | 'programs';
    voteKey?: string;
    network?: 'mainnet' | 'devnet' | 'testnet';
    tags?: string[];
    logoURI?: string;
    flag?: string;
}
export interface SolanaFMOnchainData {
    lamports: number;
    data: string | {
        parsed: any;
    };
    owner: string;
    executable: boolean;
    rentEpoch: number;
}
export interface SolanaFMAccount {
    accountHash: string;
    data: SolanaFMAccountData | null;
    onchain: SolanaFMOnchainData | null;
}
export interface SolanaFMAccountsResponse {
    accounts: SolanaFMAccount[];
}
export interface SolanaFMAccountsRequest {
    accountHashes: string[];
    fields?: ('data' | 'onchain' | '*')[];
}
export interface SolanaFMAccountFees {
    tx_fees: number;
    time: string;
}
export type SolanaFMAccountFeesResponse = SolanaFMAccountFees[];
export interface SolanaFMAccountFeesRequest {
    accountHash: string;
    from: string;
    to: string;
}
export interface SolanaFMTransaction {
    signature: string;
    timestamp: number;
    status: string;
    fee: number;
}
export interface SolanaFMTransactionsResponse {
    status: string;
    message: string;
    result: {
        data: SolanaFMTransaction[];
        pagination: {
            currentPage: number;
            totalPages: number;
        };
    };
}
export interface SolanaFMTransactionsRequest {
    accountHash: string;
    actions?: string;
    utcFrom?: number;
    utcTo?: number;
    inflow?: boolean;
    outflow?: boolean;
    mint?: string;
    mints?: string;
    amountFrom?: number;
    amountTo?: number;
    program?: string;
    programs?: string;
    limit?: number;
    page?: number;
}
export interface SolanaFMError {
    message: string;
    code?: number;
    details?: any;
}
export type TokenType = 'CompressedNonFungible' | 'Fungible' | 'Legacy' | 'NonFungible';
export interface TokenMetadataOnChainInfo {
    name: string | null;
    symbol: string | null;
    metadata: string | null;
    updateAuthority: string | null;
    isMasterEdition: boolean | null;
    edition: string | null;
    uri: string | null;
    sellerFeeBasisPoints: number | null;
    primarySaleHappened: boolean | null;
    isMutable: boolean | null;
    creators: any[];
    ruleSet: string | null;
    collection: string | null;
    collectionDetails: any | null;
    uses: any | null;
}
export interface TokenMetadata {
    onChainInfo: TokenMetadataOnChainInfo;
    offChainInfo: any | null;
}
export interface TokenData {
    mint: string;
    decimals: number;
    freezeAuthority: string | null;
    mintAuthority: string | null;
    tokenType: TokenType;
    tokenMetadata: TokenMetadata;
}
export interface TokenAccount {
    mint: string;
    ata: string;
    balance: number;
    tokenData: TokenData;
}
export interface OwnerTokenAccountsResponse {
    pubkey: string;
    tokens: Record<string, TokenAccount>;
    message: string | null;
}
export interface OwnerTokenAccountsRequest {
    accountHash: string;
    tokenType?: TokenType;
}
export interface TokenInfoData {
    mint: string;
    tokenName: string;
    symbol: string;
    decimals: number;
    description: string;
    logo: string;
    tags: string[];
    verified: string;
    network: string[];
    metadataToken: string;
}
export interface TokenInfoResponse {
    status: string;
    message: string;
    result: {
        tokenHash: string;
        data: TokenInfoData;
    };
}
export interface TokenInfoRequest {
    tokenHash: string;
}
export interface TokenSupplyResponse {
    circulatingSupply: number;
    tokenWithheldAmount: number | null;
    userTotalWithheldAmount: number;
    totalWithheldAmount: number;
    realCirculatingSupply: number;
    decimals: number;
}
export interface TokenSupplyRequest {
    tokenHash: string;
}
export type SolanaFMActionsResponse = string[];
export interface TransferData {
    [key: string]: any;
}
export interface TransferResponse {
    status: string;
    message: string;
    result: {
        transactionHash: string;
        data: TransferData[];
    };
}
export interface TransferRequest {
    hash: string;
}
//# sourceMappingURL=solanafm.schema.d.ts.map