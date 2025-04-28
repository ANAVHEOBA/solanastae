export interface LiquidityChange {
    pool_address: string;
    program_id: string;
    token1: string;
    token2: string;
    token1_amount: number;
    token2_amount: number;
    token1_change: number;
    token2_change: number;
    timestamp: number;
    tx_hash: string;
    type: 'add' | 'remove';
}

export interface LiquidityMonitorResponse {
    success: boolean;
    data: LiquidityChange[];
    metadata: {
        total_changes: number;
        last_updated: number;
    };
}

export interface LiquidityMonitorRequest {
    pool_address?: string;
    program_id?: string;
    token_address?: string;
    from_time?: number;
    to_time?: number;
    page?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
    sort_by?: 'timestamp';
    sort_order?: 'asc' | 'desc';
}

export interface VolumeAnomaly {
    pool_address: string;
    program_id: string;
    token1: string;
    token2: string;
    volume_24h: number;
    volume_change_24h: number;
    trades_24h: number;
    trades_change_24h: number;
    timestamp: number;
    anomaly_score: number;
    type: 'volume' | 'trades';
}

export interface VolumeMonitorResponse {
    success: boolean;
    data: VolumeAnomaly[];
    metadata: {
        total_anomalies: number;
        last_updated: number;
    };
}

export interface VolumeMonitorRequest {
    pool_address?: string;
    program_id?: string;
    token_address?: string;
    from_time?: number;
    to_time?: number;
    min_anomaly_score?: number;
    page?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
    sort_by?: 'timestamp' | 'anomaly_score';
    sort_order?: 'asc' | 'desc';
} 














export interface SwapActivity {
    pool_address: string;
    program_id: string;
    token1: string;
    token2: string;
    token1_amount: number;
    token2_amount: number;
    from_address: string;
    block_time: number;
    tx_hash: string;
    timestamp: number;
    value: number;
}

export interface SwapMonitorResponse {
    success: boolean;
    data: SwapActivity[];
    metadata: {
        total_swaps: number;
        last_updated: number;
    };
}

export interface SwapMonitorRequest {
    pool_address?: string;
    program_id?: string;
    token_address?: string;
    from_time?: number;
    to_time?: number;
    min_value?: number;
    page?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
    sort_by?: 'timestamp' | 'value';
    sort_order?: 'asc' | 'desc';
}