a@a:~/solanastae$ curl -X POST http://localhost:5000/api/v1/whale-monitor/watchlist \
-H "Content-Type: application/json" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiYjk0MzMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJ0eXBlIjoidXNlciIsImlhdCI6MTc0NTgxNTk5MCwiZXhwIjoxNzQ1OTAyMzkwfQ.9PJYZcIKqntL6DGPX_7w0qtUDIp6X2bJ5jNdMnyUFzI" \
-d '{
  "address": "2YcwVbKx9L25Jpaj2vfWSXD5UKugZumWjzEe6suBUJi2",
  "name": "Test Whale",
  "threshold": 1000
}'
{"success":true,"message":"Success","data":{"item":{"id":"e1e10ba4-e179-4d5c-8c90-351d13cf15d8","userId":"bb9433","address":"2YcwVbKx9L25Jpaj2vfWSXD5UKugZumWjzEe6suBUJi2","name":"Test Whale","threshold":1000,"createdAt":"2025-04-28T04:54:26.946Z","updatedAt":"2025-04-28T04:54:26.946Z"}}}a@a:~/solanastae$ 










a@a:~/solanastae$ curl -X GET http://localhost:5000/api/v1/whale-monitor/watchlist \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiYjk0MzMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJ0eXBlIjoidXNlciIsImlhdCI6MTc0NTgxNTk5MCwiZXhwIjoxNzQ1OTAyMzkwfQ.9PJYZcIKqntL6DGPX_7w0qtUDIp6X2bJ5jNdMnyUFzI"
{"success":true,"message":"Success","data":{"items":[{"id":"e1e10ba4-e179-4d5c-8c90-351d13cf15d8","userId":"bb9433","address":"2YcwVbKx9L25Jpaj2vfWSXD5UKugZumWjzEe6suBUJi2","name":"Test Whale","threshold":1000,"createdAt":"2025-04-28T04:54:26.946Z","updatedAt":"2025-04-28T04:54:26.946Z"}]}}a@a:~/solanastae$ 





















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









a@a:~/solanastae$ curl -X GET http://localhost:5000/api/v1/whale-monitor/watchlist \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiYjk0MzMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJ0eXBlIjoidXNlciIsImlhdCI6MTc0NTgxNTk5MCwiZXhwIjoxNzQ1OTAyMzkwfQ.9PJYZcIKqntL6DGPX_7w0qtUDIp6X2bJ5jNdMnyUFzI"
{"success":true,"message":"Success","data":{"items":[]}}a@a:~/solanastae$ 