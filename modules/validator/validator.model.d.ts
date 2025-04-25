import { ValidatorPerformance, ValidatorStats, TokenAccountsResponse } from './validator.schema';
import type { SignatureStatus } from '../../services/rpc.service';
import type { TransactionResult } from './validator.schema';
import type { PrioritizationFee } from './validator.schema';
import type { TokenSupplyResponse } from './validator.schema';
import type { MultipleAccountsResponse } from './validator.schema';
import { SignatureSubscribeParams } from './validator.schema';
export declare class ValidatorModel {
    private static cache;
    private static ws;
    private static reconnectAttempts;
    private static maxReconnectAttempts;
    private static reconnectDelay;
    private static pingInterval;
    private static pingTimeout;
    private static readonly PING_INTERVAL;
    private static readonly PING_TIMEOUT;
    private static CACHE_TTL;
    static getAllValidators(): Promise<ValidatorPerformance[]>;
    static getValidatorStats(): Promise<ValidatorStats>;
    private static calculateAverageCommission;
    private static lamportsToSol;
    private static isCacheValid;
    private static updateCache;
    static clearCache(): void;
    static getStakeMinimumDelegation(): Promise<number>;
    static getLargestAccounts(params?: {
        commitment?: string;
        filter?: string;
    }): Promise<{
        lamports: number;
        address: string;
    }[]>;
    static getLeaderSchedule(epoch?: number, page?: number, limit?: number): Promise<{
        data: {
            [key: string]: number[];
        } | null;
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    static getSlotLeaders(startSlot: number, limit: number): Promise<string[]>;
    static getSignatureStatuses(signatures: string[], searchTransactionHistory?: boolean): Promise<(SignatureStatus | null)[]>;
    static getTransaction(signature: string, encoding?: 'json' | 'base58' | 'base64'): Promise<TransactionResult>;
    static getRecentPrioritizationFees(accounts?: string[]): Promise<PrioritizationFee[]>;
    static getSlot(commitment?: 'processed' | 'confirmed' | 'finalized'): Promise<number>;
    static getBlockTime(slot: number): Promise<number | null>;
    static getTokenAccountsByOwner(owner: string, programId?: string, encoding?: 'jsonParsed' | 'base58' | 'base64'): Promise<TokenAccountsResponse>;
    static getTokenSupply(mint: string): Promise<TokenSupplyResponse>;
    static getMultipleAccounts(pubkeys: string[]): Promise<MultipleAccountsResponse>;
    static subscribeToSignature(signature: string, params?: SignatureSubscribeParams): Promise<number>;
}
//# sourceMappingURL=validator.model.d.ts.map