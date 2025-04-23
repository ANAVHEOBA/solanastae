import { solanaFMService } from './solanafm.service';
import { 
    SolanaFMAccountsRequest, 
    SolanaFMAccountsResponse,
    SolanaFMAccountFeesRequest, 
    SolanaFMAccountFeesResponse,
    SolanaFMTransactionsRequest,
    SolanaFMTransactionsResponse,
    OwnerTokenAccountsRequest,
    OwnerTokenAccountsResponse,
    TokenInfoRequest,
    TokenInfoResponse,
    TokenSupplyRequest,
    TokenSupplyResponse,
    SolanaFMActionsResponse,
    TransferRequest,
    TransferResponse
} from './solanafm.schema';

export class SolanaFMModel {
    static async getTaggedAccounts(accountHashes: string[], fields?: ('data' | 'onchain' | '*')[]): Promise<SolanaFMAccountsResponse> {
        try {
            console.log('[SolanaFMModel] Getting tagged accounts...', { accountHashes, fields });
            
            const request: SolanaFMAccountsRequest = {
                accountHashes,
                fields
            };

            const result = await solanaFMService.getTaggedAccounts(request);
            
            console.log('[SolanaFMModel] Successfully got tagged accounts:', {
                count: result.accounts.length
            });

            return result;
        } catch (error) {
            console.error('[SolanaFMModel] Error getting tagged accounts:', error);
            throw error;
        }
    }

    static async getAccountFees(accountHash: string, from: string, to: string): Promise<SolanaFMAccountFeesResponse> {
        try {
            console.log('[SolanaFMModel] Getting account fees...', { accountHash, from, to });
            
            const request: SolanaFMAccountFeesRequest = {
                accountHash,
                from,
                to
            };

            const result = await solanaFMService.getAccountFees(request);
            
            console.log('[SolanaFMModel] Successfully got account fees:', {
                count: result.length
            });

            return result;
        } catch (error) {
            console.error('[SolanaFMModel] Error getting account fees:', error);
            throw error;
        }
    }

    static async getAccountTransactions(request: SolanaFMTransactionsRequest): Promise<SolanaFMTransactionsResponse> {
        try {
            console.log('[SolanaFMModel] Getting account transactions...', { 
                accountHash: request.accountHash,
                page: request.page,
                limit: request.limit
            });

            const result = await solanaFMService.getAccountTransactions(request);
            
            console.log('[SolanaFMModel] Successfully got account transactions:', {
                count: result.result.data.length,
                page: result.result.pagination.currentPage,
                totalPages: result.result.pagination.totalPages
            });

            return result;
        } catch (error) {
            console.error('[SolanaFMModel] Error getting account transactions:', error);
            throw error;
        }
    }

    static async getOwnerTokenAccounts(request: OwnerTokenAccountsRequest): Promise<OwnerTokenAccountsResponse> {
        try {
            console.log('[SolanaFMModel] Getting owner token accounts...', { 
                accountHash: request.accountHash,
                tokenType: request.tokenType
            });

            const result = await solanaFMService.getOwnerTokenAccounts(request);
            
            console.log('[SolanaFMModel] Successfully got owner token accounts:', {
                pubkey: result.pubkey,
                tokenCount: Object.keys(result.tokens).length
            });

            return result;
        } catch (error) {
            console.error('[SolanaFMModel] Error getting owner token accounts:', error);
            throw error;
        }
    }

    static async getTokenInfo(request: TokenInfoRequest): Promise<TokenInfoResponse> {
        try {
            console.log('[SolanaFMModel] Getting token info...', { 
                tokenHash: request.tokenHash
            });

            const result = await solanaFMService.getTokenInfo(request);
            
            console.log('[SolanaFMModel] Successfully got token info:', {
                tokenHash: result.result.tokenHash,
                tokenName: result.result.data.tokenName
            });

            return result;
        } catch (error) {
            console.error('[SolanaFMModel] Error getting token info:', error);
            throw error;
        }
    }

    static async getTokenSupply(request: TokenSupplyRequest): Promise<TokenSupplyResponse> {
        try {
            console.log('[SolanaFMModel] Getting token supply...', { 
                tokenHash: request.tokenHash
            });

            const result = await solanaFMService.getTokenSupply(request);
            
            console.log('[SolanaFMModel] Successfully got token supply:', {
                tokenHash: request.tokenHash,
                circulatingSupply: result.circulatingSupply
            });

            return result;
        } catch (error) {
            console.error('[SolanaFMModel] Error getting token supply:', error);
            throw error;
        }
    }

    static async getActions(): Promise<SolanaFMActionsResponse> {
        try {
            console.log('[SolanaFMModel] Getting available actions...');
            
            const result = await solanaFMService.getActions();
            
            console.log('[SolanaFMModel] Successfully got actions:', {
                count: result.length
            });

            return result;
        } catch (error) {
            console.error('[SolanaFMModel] Error getting actions:', error);
            throw error;
        }
    }

    static async getTransfer(request: TransferRequest): Promise<TransferResponse> {
        try {
            console.log('[SolanaFMModel] Getting transfer details...', { hash: request.hash });
            
            const result = await solanaFMService.getTransfer(request);
            
            console.log('[SolanaFMModel] Successfully got transfer details:', {
                transactionHash: result.result.transactionHash,
                dataCount: result.result.data.length
            });

            return result;
        } catch (error) {
            console.error('[SolanaFMModel] Error getting transfer details:', error);
            throw error;
        }
    }
} 