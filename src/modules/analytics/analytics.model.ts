import { SolscanModel } from '../solscan/solscan.model';
import { PnLCalculation, PnLResponse, DrawdownCalculation, DrawdownResponse,
    SharpeRatioCalculation,
    SharpeRatioResponse,
    VolatilityCalculation,
    VolatilityResponse,
    SortinoRatioCalculation,
    SortinoRatioResponse

 } from './analytics.schema';

export class AnalyticsModel {
    private static calculatePnLForPeriod(
        defiActivities: any[],
        transfers: any[],
        startTime: number,
        endTime: number
    ): PnLCalculation {
        let totalPnL = 0;
        let profitableTransactions = 0;
        let losingTransactions = 0;

        // Process DeFi activities
        defiActivities.forEach(activity => {
            if (activity.block_time >= startTime && activity.block_time <= endTime) {
                totalPnL += activity.value;
                if (activity.value > 0) profitableTransactions++;
                if (activity.value < 0) losingTransactions++;
            }
        });

        // Process transfers
        transfers.forEach(transfer => {
            if (transfer.block_time >= startTime && transfer.block_time <= endTime) {
                const value = transfer.flow === 'in' ? transfer.value : -transfer.value;
                totalPnL += value;
                if (value > 0) profitableTransactions++;
                if (value < 0) losingTransactions++;
            }
        });

        const totalTransactions = profitableTransactions + losingTransactions;
        const winRate = totalTransactions > 0 ? (profitableTransactions / totalTransactions) * 100 : 0;
        const lossRate = totalTransactions > 0 ? (losingTransactions / totalTransactions) * 100 : 0;

        return {
            totalPnL,
            winRate,
            lossRate,
            totalTransactions,
            profitableTransactions,
            losingTransactions,
            timePeriod: this.getTimePeriodLabel(startTime, endTime)
        };
    }

    private static getTimePeriodLabel(startTime: number, endTime: number): string {
        const now = Math.floor(Date.now() / 1000);
        const diff = now - startTime;
        
        if (diff <= 7 * 24 * 60 * 60) return 'last7Days';
        if (diff <= 14 * 24 * 60 * 60) return 'last2Weeks';
        if (diff <= 30 * 24 * 60 * 60) return 'lastMonth';
        if (diff <= 365 * 24 * 60 * 60) return 'lastYear';
        return 'lifetime';
    }

    static async calculatePnL(address: string): Promise<PnLResponse> {
        try {
            // Get all DeFi activities and transfers
            const [defiActivities, transfers] = await Promise.all([
                SolscanModel.getDefiActivities(address, {}),
                SolscanModel.getTransfers(address, {})
            ]);

            const now = Math.floor(Date.now() / 1000);
            const periods = [
                { start: now - (7 * 24 * 60 * 60), label: 'last7Days' },
                { start: now - (14 * 24 * 60 * 60), label: 'last2Weeks' },
                { start: now - (30 * 24 * 60 * 60), label: 'lastMonth' },
                { start: now - (365 * 24 * 60 * 60), label: 'lastYear' },
                { start: 0, label: 'lifetime' }
            ];

            const results = periods.map(period => 
                this.calculatePnLForPeriod(
                    defiActivities.data,
                    transfers.data,
                    period.start,
                    now
                )
            );

            return {
                success: true,
                data: {
                    last7Days: results[0],
                    last2Weeks: results[1],
                    lastMonth: results[2],
                    lastYear: results[3],
                    lifetime: results[4]
                }
            };
        } catch (error) {
            console.error('[AnalyticsModel] Error calculating PnL:', error);
            throw error;
        }
    }

    private static calculateDrawdownForPeriod(
        transfers: any[],
        startTime: number,
        endTime: number
    ): DrawdownCalculation {
        let peakValue = 0;
        let troughValue = Infinity;
        let currentValue = 0;
        let peakDate = '';
        let troughDate = '';
        let recoveryDate = '';

        // Process transfers chronologically
        transfers
            .filter(t => t.block_time >= startTime && t.block_time <= endTime)
            .sort((a, b) => a.block_time - b.block_time)
            .forEach(transfer => {
                // Update current value based on transfer
                if (transfer.flow === 'in') {
                    currentValue += transfer.value;
                } else {
                    currentValue -= transfer.value;
                }

                // Update peak and trough
                if (currentValue > peakValue) {
                    peakValue = currentValue;
                    peakDate = transfer.time;
                }
                if (currentValue < troughValue) {
                    troughValue = currentValue;
                    troughDate = transfer.time;
                }
                // Check for recovery
                if (currentValue >= peakValue && !recoveryDate) {
                    recoveryDate = transfer.time;
                }
            });

        const maxDrawdown = peakValue > 0 ? ((peakValue - troughValue) / peakValue) * 100 : 0;

        return {
            maxDrawdown,
            peakValue,
            troughValue,
            peakDate,
            troughDate,
            recoveryDate: recoveryDate || undefined
        };
    }

    static async calculateDrawdown(address: string): Promise<DrawdownResponse> {
        try {
            // Get all transfers
            const transfers = await SolscanModel.getTransfers(address, {});

            const now = Math.floor(Date.now() / 1000);
            const periods = [
                { start: now - (7 * 24 * 60 * 60), label: 'last7Days' },
                { start: now - (14 * 24 * 60 * 60), label: 'last2Weeks' },
                { start: now - (30 * 24 * 60 * 60), label: 'lastMonth' },
                { start: now - (365 * 24 * 60 * 60), label: 'lastYear' },
                { start: 0, label: 'lifetime' }
            ];

            const results = periods.map(period => 
                this.calculateDrawdownForPeriod(
                    transfers.data,
                    period.start,
                    now
                )
            );

            return {
                success: true,
                data: {
                    last7Days: results[0],
                    last2Weeks: results[1],
                    lastMonth: results[2],
                    lastYear: results[3],
                    lifetime: results[4]
                }
            };
        } catch (error) {
            console.error('[AnalyticsModel] Error calculating drawdown:', error);
            throw error;
        }
    }





    private static calculateSharpeRatioForPeriod(
        portfolioValues: number[],
        riskFreeRate: number = 0
    ): SharpeRatioCalculation {
        const dailyReturns = portfolioValues.slice(1).map((value, index) => 
            (value - portfolioValues[index]) / portfolioValues[index]
        );

        const averageReturn = dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length;
        const volatility = Math.sqrt(
            dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / dailyReturns.length
        );

        const sharpeRatio = volatility > 0 ? (averageReturn - riskFreeRate) / volatility : 0;

        return {
            sharpeRatio,
            averageReturn,
            volatility,
            riskFreeRate,
            timePeriod: this.getTimePeriodLabel(0, 0) // Placeholder, will be set in the calling method
        };
    }

    private static calculateVolatilityForPeriod(
        portfolioValues: number[]
    ): VolatilityCalculation {
        const dailyReturns = portfolioValues.slice(1).map((value, index) => 
            (value - portfolioValues[index]) / portfolioValues[index]
        );

        const averageReturn = dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length;
        const volatility = Math.sqrt(
            dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / dailyReturns.length
        );

        return {
            volatility,
            timePeriod: this.getTimePeriodLabel(0, 0) // Placeholder, will be set in the calling method
        };
    }

    static async calculateSharpeRatio(address: string): Promise<SharpeRatioResponse> {
        try {
            // Get portfolio values over time (mock data for now)
            const portfolioValues = [3.50, 3.60, 3.70, 3.65, 3.80, 3.75, 3.65]; // Example data

            const now = Math.floor(Date.now() / 1000);
            const periods = [
                { start: now - (7 * 24 * 60 * 60), label: 'last7Days' },
                { start: now - (14 * 24 * 60 * 60), label: 'last2Weeks' },
                { start: now - (30 * 24 * 60 * 60), label: 'lastMonth' },
                { start: now - (365 * 24 * 60 * 60), label: 'lastYear' },
                { start: 0, label: 'lifetime' }
            ];

            const results = periods.map(period => 
                this.calculateSharpeRatioForPeriod(portfolioValues)
            );

            return {
                success: true,
                data: {
                    last7Days: results[0],
                    last2Weeks: results[1],
                    lastMonth: results[2],
                    lastYear: results[3],
                    lifetime: results[4]
                }
            };
        } catch (error) {
            console.error('[AnalyticsModel] Error calculating Sharpe Ratio:', error);
            throw error;
        }
    }

    static async calculateVolatility(address: string): Promise<VolatilityResponse> {
        try {
            // Get portfolio values over time (mock data for now)
            const portfolioValues = [3.50, 3.60, 3.70, 3.65, 3.80, 3.75, 3.65]; // Example data

            const now = Math.floor(Date.now() / 1000);
            const periods = [
                { start: now - (7 * 24 * 60 * 60), label: 'last7Days' },
                { start: now - (14 * 24 * 60 * 60), label: 'last2Weeks' },
                { start: now - (30 * 24 * 60 * 60), label: 'lastMonth' },
                { start: now - (365 * 24 * 60 * 60), label: 'lastYear' },
                { start: 0, label: 'lifetime' }
            ];

            const results = periods.map(period => 
                this.calculateVolatilityForPeriod(portfolioValues)
            );

            return {
                success: true,
                data: {
                    last7Days: results[0],
                    last2Weeks: results[1],
                    lastMonth: results[2],
                    lastYear: results[3],
                    lifetime: results[4]
                }
            };
        } catch (error) {
            console.error('[AnalyticsModel] Error calculating Volatility:', error);
            throw error;
        }
    }


    private static calculateSortinoRatioForPeriod(
        portfolioValues: number[],
        riskFreeRate: number = 0
    ): SortinoRatioCalculation {
        const dailyReturns = portfolioValues.slice(1).map((value, index) => 
            (value - portfolioValues[index]) / portfolioValues[index]
        );

        const negativeReturns = dailyReturns.filter(ret => ret < 0);
        const averageReturn = dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length;

        const downsideDeviation = Math.sqrt(
            negativeReturns.reduce((sum, ret) => sum + Math.pow(ret, 2), 0) / negativeReturns.length
        );

        const sortinoRatio = downsideDeviation > 0 ? (averageReturn - riskFreeRate) / downsideDeviation : 0;

        return {
            sortinoRatio,
            averageReturn,
            downsideDeviation,
            riskFreeRate,
            timePeriod: this.getTimePeriodLabel(0, 0) // Placeholder, will be set in the calling method
        };
    }

    static async calculateSortinoRatio(address: string): Promise<SortinoRatioResponse> {
        try {
            // Get portfolio values over time (mock data for now)
            const portfolioValues = [3.50, 3.60, 3.70, 3.65, 3.80, 3.75, 3.65]; // Example data

            const now = Math.floor(Date.now() / 1000);
            const periods = [
                { start: now - (7 * 24 * 60 * 60), label: 'last7Days' },
                { start: now - (14 * 24 * 60 * 60), label: 'last2Weeks' },
                { start: now - (30 * 24 * 60 * 60), label: 'lastMonth' },
                { start: now - (365 * 24 * 60 * 60), label: 'lastYear' },
                { start: 0, label: 'lifetime' }
            ];

            const results = periods.map(period => 
                this.calculateSortinoRatioForPeriod(portfolioValues)
            );

            return {
                success: true,
                data: {
                    last7Days: results[0],
                    last2Weeks: results[1],
                    lastMonth: results[2],
                    lastYear: results[3],
                    lifetime: results[4]
                }
            };
        } catch (error) {
            console.error('[AnalyticsModel] Error calculating Sortino Ratio:', error);
            throw error;
        }
    }
}




