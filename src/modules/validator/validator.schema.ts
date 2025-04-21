export interface ValidatorStats {
    totalActiveStake: number;
    totalDelinquentStake: number;
    averageCommission: number;
    totalValidators: number;
    activeValidators: number;
    delinquentValidators: number;
}

export interface ValidatorPerformance {
    votePubkey: string;
    nodePubkey: string;
    activatedStake: number;
    commission: number;
    lastVote: number;
    rootSlot: number;
    epochVoteAccount: boolean;
    status: 'active' | 'delinquent';
    epochCredits: {
        epoch: number;
        credits: number;
        previousCredits: number;
    }[];
}

export interface ValidatorFilters {
    status?: 'active' | 'delinquent' | 'all';
    minStake?: number;
    maxCommission?: number;
    votePubkey?: string;
}
