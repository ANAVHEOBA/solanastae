Transaction Monitoring Channel
Use these endpoints:

   router.get('/transaction/last', ...)  // For latest transactions
     router.get('/transaction/detail', ...) // For detailed transaction info
     router.get('/transaction/actions', ...) // For transaction actions

Monitor for:
Large transactions
Unusual patterns
Specific account activities
Token Movements Channel
Use these endpoints:
     router.get('/token/transfer', ...)  // For token transfers
     router.get('/token/holders', ...)   // For holder changes
     router.get('/account/:address/token-accounts', ...) // For account token changes




Monitor for:
Large token movements
Holder distribution changes
Unusual transfer patterns
Price Updates Channel
Use these endpoints:
     

     router.get('/token/price/multi', ...)  // For price updates
     router.get('/market/info', ...)        // For market data
     router.get('/market/volume', ...)      // For volume changes



Monitor for:
Price changes
Volume spikes
Market anomalies
Liquidity Changes Channel
Use these endpoints:
     
            router.get('/market/list', ...)        // For DEX listings
     router.get('/market/volume', ...)      // For liquidity metrics
     router.get('/token/defi/activities', ...) // For DeFi activities


Monitor for:
Pool reserves
Liquidity additions/removals
DEX activity
Implementation Strategy:
Create WebSocket server with these channels
Set up background workers to poll these endpoints
Implement event emitters for each data type
Use Redis pub/sub for distributing updates
Add connection management and heartbeat

