import { ValidatorPerformance, ValidatorStats, TokenAccountsResponse } from './validator.schema';
import { rpcService } from '../../services/rpc.service';
import type { SignatureStatus } from '../../services/rpc.service';
import type { TransactionResult } from './validator.schema';
import { rpcService as newRpcService } from '../../services/rpc.service';
import type { PrioritizationFee } from './validator.schema';
import type { TokenSupplyResponse } from './validator.schema';

export class ValidatorModel {
    private static cache: {
        validators?: ValidatorPerformance[];
        stats?: ValidatorStats;
        lastUpdated?: number;
    } = {};

    private static CACHE_TTL = 60 * 1000; // 1 minute cache

    static async getAllValidators(): Promise<ValidatorPerformance[]> {
        if (this.isCacheValid()) {
            return this.cache.validators!;
        }

        const voteAccounts = await rpcService.getVoteAccounts();
        
        const validators: ValidatorPerformance[] = [
            ...voteAccounts.current.map(v => ({
                ...v,
                status: 'active' as const,
                activatedStake: this.lamportsToSol(v.activatedStake)
            })),
            ...voteAccounts.delinquent.map(v => ({
                ...v,
                status: 'delinquent' as const,
                activatedStake: this.lamportsToSol(v.activatedStake)
            }))
        ];

        this.updateCache(validators);
        return validators;
    }

    static async getValidatorStats(): Promise<ValidatorStats> {
        if (this.isCacheValid() && this.cache.stats) {
            return this.cache.stats;
        }

        const validators = await this.getAllValidators();
        
        const stats: ValidatorStats = {
            totalActiveStake: validators
                .filter(v => v.status === 'active')
                .reduce((sum, v) => sum + v.activatedStake, 0),
            totalDelinquentStake: validators
                .filter(v => v.status === 'delinquent')
                .reduce((sum, v) => sum + v.activatedStake, 0),
            averageCommission: this.calculateAverageCommission(validators),
            totalValidators: validators.length,
            activeValidators: validators.filter(v => v.status === 'active').length,
            delinquentValidators: validators.filter(v => v.status === 'delinquent').length
        };

        this.cache.stats = stats;
        return stats;
    }

    private static calculateAverageCommission(validators: ValidatorPerformance[]): number {
        if (validators.length === 0) return 0;
        const totalCommission = validators.reduce((sum, v) => sum + v.commission, 0);
        return totalCommission / validators.length;
    }

    private static lamportsToSol(lamports: number): number {
        return lamports / 1e9; // 1 SOL = 1e9 lamports
    }

    private static isCacheValid(): boolean {
        return !!(
            this.cache.lastUpdated &&
            this.cache.validators &&
            Date.now() - this.cache.lastUpdated < this.CACHE_TTL
        );
    }

    private static updateCache(validators: ValidatorPerformance[]): void {
        this.cache.validators = validators;
        this.cache.lastUpdated = Date.now();
    }

    static clearCache(): void {
        this.cache = {};
    }

    static async getStakeMinimumDelegation(): Promise<number> {
        try {
            console.log('[ValidatorModel] Getting stake minimum delegation...');
            const minimumDelegation = await rpcService.getStakeMinimumDelegation();
            console.log('[ValidatorModel] Successfully got stake minimum delegation:', minimumDelegation);
            return minimumDelegation;
        } catch (error) {
            console.error('[ValidatorModel] Error getting stake minimum delegation:', error);
            throw error;
        }
    }

    static async getLargestAccounts(params?: { commitment?: string; filter?: string }): Promise<{ lamports: number; address: string }[]> {
        try {
            console.log('[ValidatorModel] Getting largest accounts...');
            const accounts = await rpcService.getLargestAccounts(params);
            console.log('[ValidatorModel] Successfully got largest accounts:', accounts);
            return accounts;
        } catch (error) {
            console.error('[ValidatorModel] Error getting largest accounts:', error);
            throw error;
        }
    }

    static async getLeaderSchedule(epoch?: number, page = 1, limit = 20): Promise<{
        data: { [key: string]: number[] } | null;
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }> {
        try {
            console.log('[ValidatorModel] Getting leader schedule...', { epoch, page, limit });
            const schedule = await rpcService.getLeaderSchedule(epoch);
            
            if (!schedule) {
                return {
                    data: null,
                    pagination: {
                        total: 0,
                        page,
                        limit,
                        totalPages: 0
                    }
                };
            }

            // Convert schedule object to array for pagination
            const entries = Object.entries(schedule);
            const total = entries.length;
            const totalPages = Math.ceil(total / limit);
            
            // Calculate pagination
            const startIndex = (page - 1) * limit;
            const endIndex = Math.min(startIndex + limit, total);
            
            // Get paginated data
            const paginatedEntries = entries.slice(startIndex, endIndex);
            const paginatedSchedule = Object.fromEntries(paginatedEntries);

            console.log('[ValidatorModel] Successfully got leader schedule:', {
                total,
                page,
                limit,
                totalPages
            });

            return {
                data: paginatedSchedule,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages
                }
            };
        } catch (error) {
            console.error('[ValidatorModel] Error getting leader schedule:', error);
            throw error;
        }
    }

    static async getSlotLeaders(startSlot: number, limit: number): Promise<string[]> {
        try {
            console.log('[ValidatorModel] Getting slot leaders...', { startSlot, limit });
            const leaders = await rpcService.getSlotLeaders(startSlot, limit);
            console.log('[ValidatorModel] Successfully got slot leaders:', leaders);
            return leaders;
        } catch (error) {
            console.error('[ValidatorModel] Error getting slot leaders:', error);
            throw error;
        }
    }

    static async getSignatureStatuses(signatures: string[], searchTransactionHistory = true): Promise<(SignatureStatus | null)[]> {
        try {
            console.log('[ValidatorModel] Getting signature statuses...', { 
                signatureCount: signatures.length,
                searchTransactionHistory,
                signatures: signatures.slice(0, 3) // Log first 3 signatures for debugging
            });
            
            const statuses = await rpcService.getSignatureStatuses(signatures, searchTransactionHistory);
            
            console.log('[ValidatorModel] Successfully got signature statuses:', {
                total: statuses.length,
                nonNull: statuses.filter(s => s !== null).length
            });
            
            return statuses;
        } catch (error) {
            console.error('[ValidatorModel] Error getting signature statuses:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                signatures: signatures.slice(0, 3) // Log first 3 signatures for debugging
            });
            
            // Re-throw the error with additional context
            if (error instanceof Error) {
                throw new Error(`Failed to get signature statuses: ${error.message}`);
            }
            throw new Error('Failed to get signature statuses: Unknown error');
        }
    }

    static async getTransaction(signature: string, encoding: 'json' | 'base58' | 'base64' = 'json'): Promise<TransactionResult> {
        try {
            console.log('[ValidatorModel] Getting transaction...', { 
                signature,
                encoding
            });
            
            const transaction = await rpcService.getTransaction(signature, encoding);
            
            if (!transaction) {
                console.log('[ValidatorModel] Transaction not found:', { signature });
                return {
                    data: null,
                    pagination: {
                        total: 0,
                        page: 1,
                        limit: 1,
                        totalPages: 0
                    }
                };
            }

            const status = {
                slot: transaction.slot,
                hasTransaction: !!transaction.transaction,
                hasMeta: !!transaction.meta,
                metaError: transaction.meta?.err,
                fee: transaction.meta?.fee,
                signatures: transaction.transaction?.signatures?.length || 0
            };

            console.log('[ValidatorModel] Successfully got transaction:', status);
            
            return {
                data: transaction,
                pagination: {
                    total: 1,
                    page: 1,
                    limit: 1,
                    totalPages: 1
                }
            };
        } catch (error) {
            console.error('[ValidatorModel] Error getting transaction:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                signature,
                stack: error instanceof Error ? error.stack : undefined
            });
            
            // Re-throw the error with additional context
            if (error instanceof Error) {
                throw new Error(`Failed to get transaction: ${error.message}`);
            }
            throw new Error('Failed to get transaction: Unknown error');
        }
    }

    static async getRecentPrioritizationFees(accounts?: string[]): Promise<PrioritizationFee[]> {
        try {
            console.log('[ValidatorModel] Getting recent prioritization fees...', { accounts });
            const fees = await newRpcService.getRecentPrioritizationFees(accounts);
            console.log('[ValidatorModel] Successfully got prioritization fees:', fees);
            
            // Transform the RPC response to match our schema type
            return fees.map(fee => ({
                slot: fee.slot,
                prioritizationFee: fee.fee
            }));
        } catch (error) {
            console.error('[ValidatorModel] Error getting prioritization fees:', error);
            throw error;
        }
    }

    static async getSlot(commitment: 'processed' | 'confirmed' | 'finalized' = 'finalized'): Promise<number> {
        try {
            console.log('[ValidatorModel] Getting current slot...', { commitment });
            const slot = await newRpcService.getSlot(commitment);
            console.log('[ValidatorModel] Successfully got slot:', slot);
            return slot;
        } catch (error) {
            console.error('[ValidatorModel] Error getting slot:', error);
            throw error;
        }
    }

    static async getBlockTime(slot: number): Promise<number | null> {
        try {
            console.log('[ValidatorModel] Getting block time...', { slot });
            const blockTime = await newRpcService.getBlockTime(slot);
            console.log('[ValidatorModel] Successfully got block time:', blockTime);
            return blockTime;
        } catch (error) {
            console.error('[ValidatorModel] Error getting block time:', error);
            throw error;
        }
    }

    static async getTokenAccountsByOwner(
        owner: string,
        programId?: string,
        encoding: 'jsonParsed' | 'base58' | 'base64' = 'jsonParsed'
    ): Promise<TokenAccountsResponse> {
        try {
            console.log('[ValidatorModel] Getting token accounts by owner...', { owner, programId, encoding });
            const response = await rpcService.getTokenAccountsByOwner(owner, programId, encoding);
            console.log('[ValidatorModel] Successfully got token accounts:', {
                count: response.value.length,
                slot: response.context.slot,
                accounts: response.value.map(acc => ({
                    pubkey: acc.pubkey,
                    mint: acc.account.data.parsed.info.mint,
                    amount: acc.account.data.parsed.info.tokenAmount.uiAmountString
                }))
            });
            return response;
        } catch (error) {
            console.error('[ValidatorModel] Error getting token accounts:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }

    static async getTokenSupply(mint: string): Promise<TokenSupplyResponse> {
        try {
            console.log('[ValidatorModel] Getting token supply...', { mint });
            const response = await rpcService.getTokenSupply(mint);
            console.log('[ValidatorModel] Successfully got token supply:', {
                amount: response.value.amount,
                decimals: response.value.decimals,
                uiAmount: response.value.uiAmount,
                slot: response.context.slot
            });
            return response;
        } catch (error) {
            console.error('[ValidatorModel] Error getting token supply:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }
}
