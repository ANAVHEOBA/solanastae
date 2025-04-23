Transaction Flow Tracking:
/transactions/flow - Track transaction paths between addresses
/transactions/related - Get related transactions for an address
/transactions/graph - Get transaction graph data for visualization
Protocol Interaction Analysis:
/protocols/interactions - Get interactions between protocols
/protocols/volume - Get transaction volume per protocol
/protocols/users - Get user activity per protocol
Wallet Analysis:
/wallets/activity - Get wallet activity patterns
/wallets/connections - Get connected wallets/clusters
/wallets/behavior - Get wallet behavior patterns



Liquidity Tracking:
/liquidity/movements - Track liquidity movements
/liquidity/pools - Get pool information
/liquidity/transfers - Get liquidity transfers
NFT & Token Flow:
/nfts/transfers - Track NFT transfers
/tokens/flow - Track token movements
/tokens/relationships - Get token relationships
Real-time Monitoring:
/monitor/transactions - Real-time transaction monitoring
/monitor/addresses - Real-time address monitoring
/monitor/protocols - Real-time protocol monitoring
Analytics & Insights:
/analytics/patterns - Get transaction patterns
/analytics/trends - Get market trends
/analytics/risk - Get risk analysi




Search & Filter:
/search/transactions - Search transactions
/search/addresses - Search addresses
/search/protocols - Search protocols
Visualization Data:
/visualization/nodes - Get node data for graphs
/visualization/edges - Get edge data for graphs
/visualization/layout - Get layout data
Export & Integration:
/export/data - Export analysis data
/export/reports - Generate analysis reports
/integrations/webhooks - Webhook endpoints for real-time updates













Primary Data Source: Helius + SolanaFM
Helius for basic RPC calls
SolanaFM for real-time transaction tracking
Analytics Layer: Dune Analytics + Flipside
Dune for complex analytics
Flipside for wallet analysis
Visualization Data: The Graph + Solscan
The Graph for protocol relationships
Solscan for transaction flows
Investigation Tools: Nansen + Chainalysis
Nansen for wallet labeling
Chainalysis for risk assessment















Account-Related Endpoints (Most Critical):
Get tagged account - Multiple (POST) - We already implemented this
Account's Transaction Fees (GET) - We already implemented this
Account Transactions (GET) - Important for tracking activity
Account Transfers (GET) - Crucial for fund flow visualization
Owner Token Accounts (GET) - Important for token tracking
Token-Related Endpoints (Very Important):
User's Token Accounts (POST) - For tracking token holdings
Token Info (GET) - For token metadata
Token Supply (GET) - For token metrics
On-Chain Token Data (GET) - For detailed token information
Transfer-Related Endpoints (Important for Flow Visualization):
All Transfer Actions (GET) - For comprehensive transfer tracking
Transaction Transfers - Multiple (POST) - For batch transfer analysis
Transfer Transactions (GET) - For detailed transfer information



SNS Domains (Useful for Identification):
Accounts' Domains (POST) - For domain resolution
Specific Account's Domains (GET) - For account identification







Account Tracking & Analysis:
/account/detail - For wallet profiling
/account/transactions - For transaction history
/account/portfolio - For asset overview
/account/token-accounts - For token holdings
/account/stake - For staking positions
/account/transfer - For fund flow analysis
/account/defi-activities - For DeFi interactions


Token Analysis:
/token/meta - For token information
/token/meta-multi - For batch token data
/token/price - For price tracking
/token/price-multi - For multiple token prices
/token/holders - For holder distribution
/token/transfer - For token movement
/token/defi-activities - For token DeFi usage



Transaction Analysis:
/transaction/detail - For detailed transaction info
/transaction/actions - For transaction breakdown
/transaction/last - For real-time monitoring
Block Analysis:
/block/detail - For block information
/block/transactions - For block activity
/block/last - For latest blocks
Market Analysis:
/market/listing - For pool/market listings
/market/info - For market details
/market/volume - For trading volume