a@a:~/solanastae$ curl -X POST http://localhost:5000/api/v1/whale-monitor/watchlist \
-H "Content-Type: application/json" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiYjk0MzMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJ0eXBlIjoidXNlciIsImlhdCI6MTc0NTgxNTk5MCwiZXhwIjoxNzQ1OTAyMzkwfQ.9PJYZcIKqntL6DGPX_7w0qtUDIp6X2bJ5jNdMnyUFzI" \
-d '{
    "address": "2YcwVbKx9L25Jpaj2vfWSXD5UKugZumWjzEe6suBUJi2",
    "label": "Test Address",
    "type": "account",
    "notes": "Monitoring large transactions"
}'
{"success":true,"message":"Success","data":{"item":{"id":"cff83b07-0420-4f62-b2c9-12bcf6fc5344","userId":"bb9433","address":"2YcwVbKx9L25Jpaj2vfWSXD5UKugZumWjzEe6suBUJi2","label":"Test Address","type":"account","notes":"Monitoring large transactions","createdAt":"2025-04-28T13:31:18.257Z","updatedAt":"2025-04-28T13:31:18.257Z"}}}a@a:~/solanastae$ 









a@a:~/solanastae$ curl -X GET http://localhost:5000/api/v1/whale-monitor/watchlist \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiYjk0MzMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJ0eXBlIjoidXNlciIsImlhdCI6MTc0NTgxNTk5MCwiZXhwIjoxNzQ1OTAyMzkwfQ.9PJYZcIKqntL6DGPX_7w0qtUDIp6X2bJ5jNdMnyUFzI"
{"success":true,"message":"Success","data":{"items":[{"id":"cff83b07-0420-4f62-b2c9-12bcf6fc5344","userId":"bb9433","address":"2YcwVbKx9L25Jpaj2vfWSXD5UKugZumWjzEe6suBUJi2","label":"Test Address","type":"account","notes":"Monitoring large transactions","createdAt":"2025-04-28T13:31:18.257Z","updatedAt":"2025-04-28T13:31:18.257Z"}]}}a@a:~/solanastae$ 






















a@a:~/solanastae$ curl -X PUT http://localhost:5000/api/v1/whale-monitor/watchlist/e1e10ba4-e179-4d5c-8c90-351d13cf15d8 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiYjk0MzMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJ0eXBlIjoidXNlciIsImlhdCI6MTc0NTgxNTk5MCwiZXhwIjoxNzQ1OTAyMzkwfQ.9PJYZcIKqntL6DGPX_7w0qtUDIp6X2bJ5jNdMnyUFzI" \
-d '{
  "threshold": 2000
}'
{"success":true,"message":"Success","data":{"item":{"id":"e1e10ba4-e179-4d5c-8c90-351d13cf15d8","userId":"bb9433","address":"2YcwVbKx9L25Jpaj2vfWSXD5UKugZumWjzEe6suBUJi2","name":"Test Whale","threshold":2000,"createdAt":"2025-04-28T04:54:26.946Z","updatedAt":"2025-04-28T04:56:22.334Z"}}}a@a:~/solanastae$ 








a@a:~/solanastae$ curl -X DELETE http://localhost:5000/api/v1/whale-monitor/watchlist/e1e10ba4-e179-4d5c-8c90-351d13cf15d8 \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiYjk0MzMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJ0eXBlIjoidXNlciIsImlhdCI6MTc0NTgxNTk5MCwiZXhwIjoxNzQ1OTAyMzkwfQ.9PJYZcIKqntL6DGPX_7w0qtUDIp6X2bJ5jNdMnyUFzI"
{"success":true,"message":"Success","data":{"message":"Watchlist item deleted successfully"}}a@a:~/solanastae$ 
















  /whale-monitor/account/{address}          // Main account channel
  /whale-monitor/account/{address}/tx       // Transactions
  /whale-monitor/account/{address}/portfolio // Portfolio
  /whale-monitor/account/{address}/defi     // DeFi activities



  Initial Data Load
Address added to whale monitor
System fetches initial data from all endpoints
Data is stored in cache (cache.service.ts)
WebSocket channels are established
b) Real-time Updates
Regular polling of Solscan endpoints
Data comparison with cached values
Detection of changes
WebSocket notifications sent
Cache updates
Notification System
a) Event Types
Balance changes
Large transactions
New token accounts
Stake changes
DeFi activities
Transfer patterns

Notification Channels
WebSocket real-time updates
Email alerts (configurable)
Dashboard updates
Performance Optimization
a) Caching Strategy
Use cache.service.ts for:
Account details
Transaction history
Portfolio data
Token accounts
Stake information
b) Rate Limiting
Implement through rate-limit.ts middleware
Different limits for different endpoints
Priority queuing for important updates

Error Handling
a) Connection Issues
Automatic reconnection
Error logging
Alert notifications
b) Data Processing
Validation through auth.validator.ts
Error handling in error.middleware.ts
Retry mechanisms
Security Measures
a) Access Control
Authentication through auth.middleware.ts
Rate limiting
IP restrictions
b) Data Protection
Request validation
Response sanitization

Secure WebSocket connections
Monitoring Dashboard Integration
a) Data Display
Real-time updates
Historical data
Activity patterns
Alert history
b) User Controls
Monitoring preferences
Alert thresholds
Notification settings









Notification Priority Levels:
High Priority (Immediate notification):
Large withdrawals (>$50,000)
Failed transactions
Security-related events
Unusual activity patterns
Medium Priority (Batch notifications every 15 mins):
Regular large transactions
DeFi interactions
New token acquisitions
Balance changes >$5,000
Low Priority (Daily summary):
Small transactions
Regular balance changes
Minor DeFi activities