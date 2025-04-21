import { ValidatorPerformance, ValidatorStats } from './validator.schema';
import { rpcService } from '../../services/rpc.service';

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
}
