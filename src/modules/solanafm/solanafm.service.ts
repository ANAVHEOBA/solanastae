import axios from 'axios';
import { SolanaFMAccountsRequest, SolanaFMAccountsResponse, SolanaFMAccountFeesRequest, SolanaFMAccountFeesResponse, SolanaFMTransactionsRequest, SolanaFMTransactionsResponse, SolanaFMError, OwnerTokenAccountsRequest, OwnerTokenAccountsResponse, TokenInfoRequest, TokenInfoResponse, TokenSupplyRequest, TokenSupplyResponse, SolanaFMActionsResponse, TransferRequest, TransferResponse } from './solanafm.schema';

export class SolanaFMService {
    private readonly baseUrl: string;
    private readonly apiKey: string;
    private readonly maxRetries: number;
    private readonly retryDelay: number;

    constructor() {
        this.baseUrl = process.env.SOLANAFM_API_URL || 'https://api.solana.fm/v0';
        this.apiKey = process.env.SOLANAFM_API_KEY || '';
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
    }

    private async retryRequest<T>(fn: () => Promise<T>, retryCount = 0): Promise<T> {
        try {
            return await fn();
        } catch (error) {
            if (retryCount < this.maxRetries) {
                console.log(`[SolanaFMService] Retrying request (${retryCount + 1}/${this.maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
                return this.retryRequest(fn, retryCount + 1);
            }
            throw error;
        }
    }

    async getTaggedAccounts(request: SolanaFMAccountsRequest): Promise<SolanaFMAccountsResponse> {
        return this.retryRequest(async () => {
            console.log('[SolanaFMService] Getting tagged accounts...', { accountHashes: request.accountHashes });
            
            const response = await axios.post<SolanaFMAccountsResponse>(
                `${this.baseUrl}/accounts`,
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            console.log('[SolanaFMService] Successfully got tagged accounts:', {
                count: response.data.accounts.length
            });

            return response.data;
        });
    }

    async getAccountFees(request: SolanaFMAccountFeesRequest): Promise<SolanaFMAccountFeesResponse> {
        return this.retryRequest(async () => {
            console.log('[SolanaFMService] Getting account fees...', { 
                accountHash: request.accountHash,
                from: request.from,
                to: request.to
            });
            
            const response = await axios.get<SolanaFMAccountFeesResponse>(
                `${this.baseUrl}/accounts/${request.accountHash}/fees`,
                {
                    params: {
                        from: request.from,
                        to: request.to
                    },
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response format from SolanaFM API');
            }

            console.log('[SolanaFMService] Successfully got account fees:', {
                count: response.data.length
            });

            return response.data;
        });
    }

    async getAccountTransactions(request: SolanaFMTransactionsRequest): Promise<SolanaFMTransactionsResponse> {
        return this.retryRequest(async () => {
            console.log('[SolanaFMService] Getting account transactions...', { 
                accountHash: request.accountHash,
                page: request.page,
                limit: request.limit
            });
            
            const response = await axios.get<SolanaFMTransactionsResponse>(
                `${this.baseUrl}/accounts/${request.accountHash}/transactions`,
                {
                    params: {
                        actions: request.actions,
                        utcFrom: request.utcFrom,
                        utcTo: request.utcTo,
                        inflow: request.inflow,
                        outflow: request.outflow,
                        mint: request.mint,
                        mints: request.mints,
                        amountFrom: request.amountFrom,
                        amountTo: request.amountTo,
                        program: request.program,
                        programs: request.programs,
                        limit: request.limit,
                        page: request.page
                    },
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            if (!response.data || !response.data.result) {
                throw new Error('Invalid response format from SolanaFM API');
            }

            console.log('[SolanaFMService] Successfully got account transactions:', {
                count: response.data.result.data.length,
                page: response.data.result.pagination.currentPage,
                totalPages: response.data.result.pagination.totalPages
            });

            return response.data;
        });
    }

    async getOwnerTokenAccounts(request: OwnerTokenAccountsRequest): Promise<OwnerTokenAccountsResponse> {
        return this.retryRequest(async () => {
            console.log('[SolanaFMService] Getting owner token accounts...', { 
                accountHash: request.accountHash,
                tokenType: request.tokenType
            });
            
            const response = await axios.get<OwnerTokenAccountsResponse>(
                `${this.baseUrl}/addresses/${request.accountHash}/tokens`,
                {
                    params: {
                        tokenType: request.tokenType
                    },
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.data || !response.data.pubkey) {
                throw new Error('Invalid response format from SolanaFM API');
            }

            console.log('[SolanaFMService] Successfully got owner token accounts:', {
                pubkey: response.data.pubkey,
                tokenCount: Object.keys(response.data.tokens).length
            });

            return response.data;
        });
    }

    async getTokenInfo(request: TokenInfoRequest): Promise<TokenInfoResponse> {
        return this.retryRequest(async () => {
            console.log('[SolanaFMService] Getting token info...', { 
                tokenHash: request.tokenHash
            });
            
            const response = await axios.get<TokenInfoResponse>(
                `${this.baseUrl}/tokens/${request.tokenHash}`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.data || !response.data.result) {
                throw new Error('Invalid response format from SolanaFM API');
            }

            console.log('[SolanaFMService] Successfully got token info:', {
                tokenHash: response.data.result.tokenHash,
                tokenName: response.data.result.data.tokenName
            });

            return response.data;
        });
    }

    async getTokenSupply(request: TokenSupplyRequest): Promise<TokenSupplyResponse> {
        return this.retryRequest(async () => {
            console.log('[SolanaFMService] Getting token supply...', { 
                tokenHash: request.tokenHash
            });
            
            // Use v1 endpoint for token supply
            const response = await axios.get<TokenSupplyResponse>(
                `https://api.solana.fm/v1/tokens/${request.tokenHash}/supply`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            if (!response.data) {
                throw new Error('Invalid response format from SolanaFM API');
            }

            console.log('[SolanaFMService] Successfully got token supply:', {
                tokenHash: request.tokenHash,
                circulatingSupply: response.data.circulatingSupply
            });

            return response.data;
        });
    }

    async getActions(): Promise<SolanaFMActionsResponse> {
        return this.retryRequest(async () => {
            console.log('[SolanaFMService] Getting available actions...');
            
            const response = await axios.get<SolanaFMActionsResponse>(
                'https://api.solana.fm/v1/actions',
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response format from SolanaFM API');
            }

            console.log('[SolanaFMService] Successfully got actions:', {
                count: response.data.length
            });

            return response.data;
        });
    }

    async getTransfer(request: TransferRequest): Promise<TransferResponse> {
        return this.retryRequest(async () => {
            console.log('[SolanaFMService] Getting transfer details...', { hash: request.hash });
            
            const response = await axios.get<TransferResponse>(
                `https://api.solana.fm/v0/transfers/${request.hash}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            if (!response.data || !response.data.result) {
                throw new Error('Invalid response format from SolanaFM API');
            }

            console.log('[SolanaFMService] Successfully got transfer details:', {
                transactionHash: response.data.result.transactionHash,
                dataCount: response.data.result.data.length
            });

            return response.data;
        });
    }
}

export const solanaFMService = new SolanaFMService(); 