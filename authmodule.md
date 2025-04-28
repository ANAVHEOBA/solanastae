a@a:~/solanastae$ curl -X POST http://localhost:5000/api/v1/auth/register \
-H "Content-Type: application/json" \
-d '{"email": "test@example.com", "password": "Password123!"}'
{"success":true,"message":"Success","data":{"message":"Registration successful","user":{"id":"bb9433","email":"test@exampcurl -X POST http://localhost:5000/api/v1/auth/login \ost:5000/api/v1/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "test@example.com", "password": "Password123!"}'
{"success":true,"message":"Success","data":{"message":"Login successful","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiYjk0MzMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJ0eXBlIjoidXNlciIsImlhdCI6MTc0NTgxNTk5MCwiZXhwIjoxNzQ1OTAyMzkwfQ.9PJYZcIKqntL6DGPX_7w0qtUDIp6X2bJ5jNdMnyUFzI","expiresIn":"24h"}}a@a:~/solanastae$ 

