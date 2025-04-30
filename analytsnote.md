GET /api/v1/analytics/account/:address/pnl
- 7D Realized PnL
- Total PnL
- Unrealized Profits
- Win Rate

GET /api/v1/analytics/account/:address/transactions
- 7D Transaction Count
- 7D Average Duration
- 7D Total Cost
- 7D Token Average Cost

GET /api/v1/analytics/account/:address/distribution
- Profit Distribution Ranges
- Token Distribution
- Win/Loss Ratios

GET /api/v1/analytics/account/:address/security
- Blacklist Check
- Buy/Sell Patterns
- Quick Trade Detection


GET /api/v1/analytics/account/:address/portfolio
- Current Holdings
- Token Balances
- Portfolio Value
- Asset Distribution


GET /api/v1/analytics/account/:address/activity
- Recent Transactions
- DeFi Interactions
- Token Swaps
- Large Movements


GET /api/v1/analytics/account/:address/history
- Historical PnL
- Transaction History
- Portfolio Changes
- Performance Metrics


WebSocket /analytics/account/:address
- Real-time PnL Updates
- New Transaction Alerts
- Portfolio Changes
- Security Alerts






GET /account/:address/transactions
GET /account/:address/transfer
GET /token/price/multi

GET /account/:address/portfolio
GET /account/:address/token-accounts

GET /account/:address/defi/activities
GET /token/defi/activities




pnl calculaton : // Example request to get transfers within a specific time range
GET /account/:address/transfer?from_time=START_TIMESTAMP&to_time=END_TIMESTAMP

// Example request to get DeFi activities within a specific time range
GET /account/:address/defi/activities?from_time=START_TIMESTAMP&to_time=END_TIMESTAMP


For win/loss rate calculation:

// Example request to get token DeFi activities within a specific time range
GET /token/defi/activities?address=YOUR_ADDRESS&from_time=START_TIMESTAMP&to_time=END_TIMESTAMP



Risk Metrics:
Maximum Drawdown (largest peak-to-trough decline)
Sharpe Ratio (risk-adjusted return)
Sortino Ratio (downside risk-adjusted return)
Volatility (standard deviation of returns)
Performance Metrics:
ROI (Return on Investment) percentage
Average Profit per Transaction
Average Loss per Transaction
Profit Factor (gross profits / gross losses)
Largest Single Profit
Largest Single Loss
Time-based Metrics:
Average Holding Time
Best Performing Time Period
Worst Performing Time Period
Daily/Weekly/Monthly Returns
Token-specific Metrics:
Most Profitable Token
Most Traded Token
Token Diversification
Token Concentration Risk
Trading Pattern Metrics:
Success Rate by Token
Success Rate by DEX
Average Transaction Size
Frequency of Trading
Market Impact Metrics:
Slippage Analysis
Gas Cost Analysis
Market Impact Cost
Portfolio Metrics:
Current Portfolio Value
Portfolio Allocation
Portfolio Beta (market correlation)
Portfolio Alpha (excess return)
Behavioral Metrics:
Trading Frequency
Time Between Trades
Reaction to Market Events
Consistency of Strategy
Comparative Metrics:
Performance vs. SOL
Performance vs. Market Index
Performance vs. Similar Wallets
Risk Management Metrics:
Stop Loss Effectiveness
Take Profit Effectiveness
Risk/Reward Ratio
Position Sizing Analysis





For Maximum Drawdown:
Use /account/:address/portfolio to get historical portfolio values
Use /account/:address/transactions to get transaction history
Use /account/:address/transfer to track value changes
For Sharpe Ratio and Volatility:
Use /account/:address/portfolio for daily portfolio values
Use /token/price/multi to get historical token prices
Use /account/:address/defi/activities for trading activity data
For Sortino Ratio:
Use /account/:address/portfolio for portfolio values
Use /account/:address/transactions to identify negative returns
Use /account/:address/defi/activities for downside risk calculation
For Volatility:
Use /token/price/multi for price history
Use /account/:address/portfolio for portfolio value changes
Use /account/:address/transactions for transaction frequency