import axios from 'axios';
import { SolscanAccountDetailResponse, SolscanError, SolscanTokenAccountsRequest, SolscanAccountTransactionsRequest, SolscanAccountTransactionsResponse, SolscanPortfolioResponse, SolscanTokenAccountsResponse, SolscanStakeAccountsRequest, 
    SolscanStakeAccountsResponse,
    SolscanTransferRequest,
    SolscanTransferResponse,
    DefiActivitiesRequest,
    DefiActivitiesResponse,
    TokenMetadataMultiRequest,
    TokenMetadataMultiResponse,
    TokenPriceMultiRequest,
    TokenPriceMultiResponse,
    TokenHoldersRequest,
    TokenHoldersResponse,
    TokenTransferRequest,
    TokenTransferResponse,
    TokenDefiActivitiesRequest,
    TokenDefiActivitiesResponse,
    LastTransactionsRequest,
    LastTransactionsResponse,
    TransactionDetailResponse,
    LastBlocksRequest,
    LastBlocksResponse,
    BlockTransactionsRequest,
    BlockTransactionsResponse,
    TransactionActionsResponse,
    BlockDetailRequest,
    BlockDetailResponse,
    MarketListRequest,
    MarketListResponse,
    MarketInfoRequest,
    MarketInfoResponse,
    MarketVolumeRequest,
    MarketVolumeResponse,
    TokenListRequest,
    TokenListResponse,
    TrendingTokensResponse
 } from './solscan.schema';

export class SolscanService {
    private readonly baseUrl: string;
    private readonly apiKey: string;
    private readonly maxRetries: number;
    private readonly retryDelay: number;

    constructor() {
        this.baseUrl = process.env.SOLSCAN_API_URL || 'https://pro-api.solscan.io/v2.0';
        this.apiKey = process.env.SOLSCAN_API_KEY || '';
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
    }

    private async retryRequest<T>(fn: () => Promise<T>, retryCount = 0): Promise<T> {
        try {
            return await fn();
        } catch (error) {
            if (retryCount < this.maxRetries) {
                console.log(`[SolscanService] Retrying request (${retryCount + 1}/${this.maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
                return this.retryRequest(fn, retryCount + 1);
            }
            throw error;
        }
    }

    async getAccountDetail(address: string): Promise<SolscanAccountDetailResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting account detail...', { address });
            
            const response = await axios.get<SolscanAccountDetailResponse>(
                `${this.baseUrl}/account/detail`,
                {
                    params: { address },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );

            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }

            console.log('[SolscanService] Successfully got account detail:', {
                address: response.data.data.address
            });

            return response.data;
        });
    }

    async getAccountTransactions(request: SolscanAccountTransactionsRequest): Promise<SolscanAccountTransactionsResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting account transactions...', { 
                address: request.address,
                limit: request.limit
            });
            
            const response = await axios.get<SolscanAccountTransactionsResponse>(
                `${this.baseUrl}/account/transactions`,
                {
                    params: {
                        address: request.address,
                        limit: request.limit
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );

            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }

            console.log('[SolscanService] Successfully got account transactions:', {
                count: response.data.data.length
            });

            return response.data;
        });
    }

    async getPortfolio(address: string): Promise<SolscanPortfolioResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting portfolio...', { address });
            
            const response = await axios.get<SolscanPortfolioResponse>(
                `${this.baseUrl}/account/portfolio`,
                {
                    params: { address },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );

            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }

            console.log('[SolscanService] Successfully got portfolio:', {
                address,
                totalValue: response.data.data.total_value,
                tokenCount: response.data.data.tokens.length
            });

            return response.data;
        });
    }

    async getTokenAccounts(request: SolscanTokenAccountsRequest): Promise<SolscanTokenAccountsResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting token accounts...', request);
            
            const response = await axios.get<SolscanTokenAccountsResponse>(
                `${this.baseUrl}/account/token-accounts`,
                {
                    params: {
                        address: request.address,
                        type: request.type,
                        page: request.page,
                        page_size: request.page_size,
                        hide_zero: request.hide_zero
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );
    
            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }
    
            console.log('[SolscanService] Successfully got token accounts:', {
                count: response.data.data.length
            });
    
            return response.data;
        });
    }

    async getStakeAccounts(request: SolscanStakeAccountsRequest): Promise<SolscanStakeAccountsResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting stake accounts...', request);
            
            const response = await axios.get<SolscanStakeAccountsResponse>(
                `${this.baseUrl}/account/stake`,
                {
                    params: {
                        address: request.address,
                        page: request.page,
                        page_size: request.page_size
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );
    
            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }
    
            console.log('[SolscanService] Successfully got stake accounts:', {
                count: response.data.data.length
            });
    
            return response.data;
        });
    }

    async getTransfers(request: SolscanTransferRequest): Promise<SolscanTransferResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting transfers...', request);
            
            const response = await axios.get<SolscanTransferResponse>(
                `${this.baseUrl}/account/transfer`,
                {
                    params: {
                        ...request,
                        activity_type: request.activity_type?.join(','),
                        amount: request.amount?.join(','),
                        value: request.value?.join(',')
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );
    
            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }
    
            console.log('[SolscanService] Successfully got transfers:', {
                count: response.data.data.length
            });
    
            return response.data;
        });
    }

    async getDefiActivities(request: DefiActivitiesRequest): Promise<DefiActivitiesResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting DeFi activities...', request);
            
            const response = await axios.get<DefiActivitiesResponse>(
                `${this.baseUrl}/account/defi/activities`,
                {
                    params: {
                        ...request,
                        activity_type: request.activity_type?.join(','),
                        platform: request.platform?.join(','),
                        source: request.source?.join(',')
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );

            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }

            console.log('[SolscanService] Successfully got DeFi activities:', {
                count: response.data.data.length
            });

            return response.data;
        });
    }

    async getTokenMetadataMulti(request: TokenMetadataMultiRequest): Promise<TokenMetadataMultiResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting token metadata multi...', request);
            
            const response = await axios.get<TokenMetadataMultiResponse>(
                `${this.baseUrl}/token/meta/multi`,
                {
                    params: {
                        'address[]': request.address
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );

            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }

            console.log('[SolscanService] Successfully got token metadata:', {
                count: response.data.data.length
            });

            return response.data;
        });
    }

    async getTokenPriceMulti(request: TokenPriceMultiRequest): Promise<TokenPriceMultiResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting token price multi...', request);
            
            const response = await axios.get<TokenPriceMultiResponse>(
                `${this.baseUrl}/token/price/multi`,
                {
                    params: {
                        'address[]': request.address,
                        from_time: request.from_time,
                        to_time: request.to_time
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );

            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }

            console.log('[SolscanService] Successfully got token prices:', {
                count: response.data.data.length
            });

            return response.data;
        });
    }

    async getTokenHolders(request: TokenHoldersRequest): Promise<TokenHoldersResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting token holders...', request);
            
            const response = await axios.get<TokenHoldersResponse>(
                `${this.baseUrl}/token/holders`,
                {
                    params: {
                        address: request.address,
                        page: request.page,
                        page_size: request.page_size,
                        from_amount: request.from_amount,
                        to_amount: request.to_amount
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );

            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }

            console.log('[SolscanService] Successfully got token holders:', {
                total: response.data.data.total,
                count: response.data.data.items.length
            });

            return response.data;
        });
    }

    async getTokenTransfer(request: TokenTransferRequest): Promise<TokenTransferResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting token transfers...', request);
            
            const response = await axios.get<TokenTransferResponse>(
                `${this.baseUrl}/token/transfer`,
                {
                    params: {
                        ...request,
                        activity_type: request.activity_type?.join(','),
                        amount: request.amount?.join(','),
                        block_time: request.block_time?.join(','),
                        value: request.value?.join(',')
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );

            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }

            console.log('[SolscanService] Successfully got token transfers:', {
                count: response.data.data.length
            });

            return response.data;
        });
    }

    async getTokenDefiActivities(request: TokenDefiActivitiesRequest): Promise<TokenDefiActivitiesResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting token DeFi activities...', request);
            
            const response = await axios.get<TokenDefiActivitiesResponse>(
                `${this.baseUrl}/token/defi/activities`,
                {
                    params: {
                        ...request,
                        activity_type: request.activity_type?.join(','),
                        platform: request.platform?.join(','),
                        source: request.source?.join(',')
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );

            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }

            console.log('[SolscanService] Successfully got token DeFi activities:', {
                count: response.data.data.length
            });

            return response.data;
        });
    }

    async getLastTransactions(request: LastTransactionsRequest): Promise<LastTransactionsResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting last transactions...', request);
            
            const response = await axios.get<LastTransactionsResponse>(
                `${this.baseUrl}/transaction/last`,
                {
                    params: {
                        limit: request.limit,
                        filter: request.filter
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );

            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }

            console.log('[SolscanService] Successfully got last transactions:', {
                count: response.data.data.length
            });

            return response.data;
        });
    }



    async getTransactionDetail(tx: string): Promise<TransactionDetailResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting transaction detail...', { tx });
            
            const response = await axios.get<TransactionDetailResponse>(
                `${this.baseUrl}/transaction/detail`,
                {
                    params: { tx },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );
    
            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }
    
            console.log('[SolscanService] Successfully got transaction detail:', {
                tx_hash: response.data.data.tx_hash,
                block_time: response.data.data.block_time
            });
    
            return response.data;
        });
    }


    async getTransactionActions(tx: string): Promise<TransactionActionsResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting transaction actions...', { tx });
            
            const response = await axios.get<TransactionActionsResponse>(
                `${this.baseUrl}/transaction/actions`,
                {
                    params: { tx },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );
    
            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }
    
            console.log('[SolscanService] Successfully got transaction actions:', {
                tx_hash: response.data.data.tx_hash,
                activities_count: response.data.data.activities.length,
                transfers_count: response.data.data.transfers.length
            });
    
            return response.data;
        });
    }




    

    async getLastBlocks(request: LastBlocksRequest = {}): Promise<LastBlocksResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting last blocks...', request);
            
            const response = await axios.get<LastBlocksResponse>(
                `${this.baseUrl}/block/last`,
                {
                    params: {
                        limit: request.limit
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );
    
            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }
    
            console.log('[SolscanService] Successfully got last blocks:', {
                count: response.data.data.length
            });
    
            return response.data;
        });
    }



    async getBlockTransactions(request: BlockTransactionsRequest): Promise<BlockTransactionsResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting block transactions...', request);
            
            const response = await axios.get<BlockTransactionsResponse>(
                `${this.baseUrl}/block/transactions`,
                {
                    params: {
                        block: request.block,
                        page: request.page,
                        page_size: request.page_size,
                        exclude_vote: request.exclude_vote,
                        program: request.program
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );
    
            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }
    
            console.log('[SolscanService] Successfully got block transactions:', {
                total: response.data.data.total,
                count: response.data.data.transactions.length
            });
    
            return response.data;
        });
    }



    async getBlockDetail(request: BlockDetailRequest): Promise<BlockDetailResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting block detail...', request);
            
            const response = await axios.get<BlockDetailResponse>(
                `${this.baseUrl}/block/detail`,
                {
                    params: {
                        block: request.block
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );
    
            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }
    
            console.log('[SolscanService] Successfully got block detail:', {
                slot: response.data.data.slot,
                blockhash: response.data.data.blockhash
            });
    
            return response.data;
        });
    }


    async getMarketList(request: MarketListRequest = {}): Promise<MarketListResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting market list...', request);
            
            const response = await axios.get<MarketListResponse>(
                `${this.baseUrl}/market/list`,
                {
                    params: {
                        page: request.page,
                        page_size: request.page_size,
                        program: request.program,
                        token_address: request.token_address,
                        sort_by: request.sort_by,
                        sort_order: request.sort_order
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );
    
            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }
    
            console.log('[SolscanService] Successfully got market list:', {
                count: response.data.data.length
            });
    
            return response.data;
        });
    }



    async getMarketInfo(request: MarketInfoRequest): Promise<MarketInfoResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting market info...', request);
            
            const response = await axios.get<MarketInfoResponse>(
                `${this.baseUrl}/market/info`,
                {
                    params: {
                        address: request.address
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );
    
            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }
    
            console.log('[SolscanService] Successfully got market info:', {
                pool_address: response.data.data.pool_address,
                program_id: response.data.data.program_id
            });
    
            return response.data;
        });
    }
    
    async getMarketVolume(request: MarketVolumeRequest): Promise<MarketVolumeResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting market volume...', request);
            
            const response = await axios.get<MarketVolumeResponse>(
                `${this.baseUrl}/market/volume`,
                {
                    params: {
                        address: request.address,
                        time: request.time
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );
    
            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }
    
            console.log('[SolscanService] Successfully got market volume:', {
                pool_address: response.data.data.pool_address,
                volume_24h: response.data.data.total_volume_24h
            });
    
            return response.data;
        });
    }

    async getTokenList(request: TokenListRequest = {}): Promise<TokenListResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting token list...', request);
            
            const response = await axios.get<TokenListResponse>(
                `${this.baseUrl}/token/list`,
                {
                    params: {
                        sort_by: request.sort_by,
                        sort_order: request.sort_order,
                        page: request.page,
                        page_size: request.page_size
                    },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );
    
            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }
    
            console.log('[SolscanService] Successfully got token list:', {
                count: response.data.data.length
            });
    
            return response.data;
        });
    }

    async getTrendingTokens(limit: number = 10): Promise<TrendingTokensResponse> {
        return this.retryRequest(async () => {
            console.log('[SolscanService] Getting trending tokens...', { limit });
            
            const response = await axios.get<TrendingTokensResponse>(
                `${this.baseUrl}/token/trending`,
                {
                    params: { limit },
                    headers: {
                        'Accept': 'application/json',
                        'token': this.apiKey
                    }
                }
            );
    
            if (!response.data || !response.data.success) {
                throw new Error('Invalid response format from Solscan API');
            }
    
            console.log('[SolscanService] Successfully got trending tokens:', {
                count: response.data.data.length
            });
    
            return response.data;
        });
    }

}

export const solscanService = new SolscanService(); 