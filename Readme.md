Core Validator Information:
Apply
- getVoteAccounts (CRITICAL) - Get all active and delinquent validators
- getEpochInfo (CRITICAL) - Current epoch, slot, and progress
- getInflationRate - Current staking rewards rate
- getInflationReward - Specific stake account rewards


Account & Balance Monitoring:
Apply
- getAccountInfo - Get stake account details
- getProgramAccounts - Get all stake accounts
- getBalance - Check SOL balances
- getTokenAccountBalance (if tracking staking tokens)


Real-time Updates (WebSocket):
- accountSubscribe - Monitor stake account changes
- slotSubscribe - Track network progress
- voteSubscribe - Real-time validator voting


Performance Metrics:
- getRecentPerformanceSamples - Validator performance
- getBlockProduction - Block production stats
- getClusterNodes - Network node information


General Network Health:
- getHealth - Network health status
- getSupply - Total SOL supply and distribution
- getVersion - Network version info


