export interface PnLCalculation {
    totalPnL: number;
    winRate: number;
    lossRate: number;
    totalTransactions: number;
    profitableTransactions: number;
    losingTransactions: number;
    timePeriod: string;
}

export interface PnLResponse {
    success: boolean;
    data: {
        last7Days: PnLCalculation;
        last2Weeks: PnLCalculation;
        lastMonth: PnLCalculation;
        lastYear: PnLCalculation;
        lifetime: PnLCalculation;
    };
    message?: string;
}

export interface PnLRequest {
    address: string;
}

export interface DrawdownCalculation {
    maxDrawdown: number; // in percentage
    peakValue: number;   // in USD
    troughValue: number; // in USD
    peakDate: string;    // ISO date
    troughDate: string;  // ISO date
    recoveryDate?: string; // ISO date if recovered
}

export interface DrawdownResponse {
    success: boolean;
    data: {
        last7Days: DrawdownCalculation;
        last2Weeks: DrawdownCalculation;
        lastMonth: DrawdownCalculation;
        lastYear: DrawdownCalculation;
        lifetime: DrawdownCalculation;
    };
    message?: string;
}

export interface DrawdownRequest {
    address: string;
}


// ... existing code ...

export interface SharpeRatioCalculation {
    sharpeRatio: number;
    averageReturn: number;
    volatility: number;
    riskFreeRate: number;
    timePeriod: string;
}

export interface VolatilityCalculation {
    volatility: number;
    timePeriod: string;
}

export interface SharpeRatioResponse {
    success: boolean;
    data: {
        last7Days: SharpeRatioCalculation;
        last2Weeks: SharpeRatioCalculation;
        lastMonth: SharpeRatioCalculation;
        lastYear: SharpeRatioCalculation;
        lifetime: SharpeRatioCalculation;
    };
    message?: string;
}

export interface VolatilityResponse {
    success: boolean;
    data: {
        last7Days: VolatilityCalculation;
        last2Weeks: VolatilityCalculation;
        lastMonth: VolatilityCalculation;
        lastYear: VolatilityCalculation;
        lifetime: VolatilityCalculation;
    };
    message?: string;
}

export interface SharpeRatioRequest {
    address: string;
}

export interface VolatilityRequest {
    address: string;
}




// ... existing code ...

export interface SortinoRatioCalculation {
    sortinoRatio: number;
    averageReturn: number;
    downsideDeviation: number;
    riskFreeRate: number;
    timePeriod: string;
}

export interface SortinoRatioResponse {
    success: boolean;
    data: {
        last7Days: SortinoRatioCalculation;
        last2Weeks: SortinoRatioCalculation;
        lastMonth: SortinoRatioCalculation;
        lastYear: SortinoRatioCalculation;
        lifetime: SortinoRatioCalculation;
    };
    message?: string;
}

export interface SortinoRatioRequest {
    address: string;
}