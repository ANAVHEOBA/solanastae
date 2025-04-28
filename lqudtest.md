a@a:~/solanastae$ curl -X POST "http://localhost:5000/api/v1/liquidity-monitor/start" \
-H "Content-Type: application/json" \
-d '{"pool_address": "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"}'
{"success":true,"message":"Started monitoring pool 58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"}a@a:~/solanastae$



wat a few seconds 


a@a:~/solanastae$ curl -X GET "http://localhost:5000/api/v1/liquidity-monitor/changes?pool_address=58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2&page=1&page_size=10&sort_by=timestamp&sort_order=desc"
{"success":true,"data":[{"pool_address":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2","program_id":"675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8","token1":"So11111111111111111111111111111111111111112","token2":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","token1_amount":24092.096709742,"token2_amount":3577159.206349,"token1_change":0,"token2_change":0,"timestamp":1745752173520,"tx_hash":"","type":"add"},{"pool_address":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2","program_id":"675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8","token1":"So11111111111111111111111111111111111111112","token2":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","token1_amount":24092.09670774,"token2_amount":3577159.206645,"token1_change":0,"token2_change":0,"timestamp":1745752142837,"tx_hash":"","type":"add"}],"metadata":{"total_changes":2,"last_updated":1745752182282}}a@a:~/solanastae$ 






a@a:~/solanastae$ curl "http://localhost:5000/api/v1/liquidity-monitor/volume?pool_address=58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2&min_anomaly_score=50&sort_by=anomaly_score&sort_order=desc"
{"success":true,"data":[{"pool_address":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2","program_id":"675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8","token1":"So11111111111111111111111111111111111111112","token2":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","volume_24h":680308,"volume_change_24h":72.8067287169929,"trades_24h":7703,"trades_change_24h":51.421524081526684,"timestamp":1745755475438,"anomaly_score":72.8067287169929,"type":"volume"},{"pool_address":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2","program_id":"675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8","token1":"So11111111111111111111111111111111111111112","token2":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","volume_24h":680308,"volume_change_24h":72.8067287169929,"trades_24h":7703,"trades_change_24h":51.421524081526684,"timestamp":1745755507394,"anomaly_score":72.8067287169929,"type":"volume"},{"pool_address":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2","program_id":"675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8","token1":"So11111111111111111111111111111111111111112","token2":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","volume_24h":680308,"volume_change_24h":72.8067287169929,"trades_24h":7703,"trades_change_24h":51.421524081526684,"timestamp":1745755536617,"anomaly_score":72.8067287169929,"type":"volume"},{"pool_address":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2","program_id":"675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8","token1":"So11111111111111111111111111111111111111112","token2":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","volume_24h":680308,"volume_change_24h":72.8067287169929,"trades_24h":7703,"trades_change_24h":51.421524081526684,"timestamp":1745755566388,"anomaly_score":72.8067287169929,"type":"volume"}],"metadata":{"total_anomalies":4,"last_updated":1745755577236}}a@a:~/solanastae$ 




a@a:~/solanastae$ curl -X GET "http://localhost:5000/api/v1/liquidity-monitor/volume?pool_address=58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2&min_anomaly_score=50&sort_by=anomaly_score&sort_order=desc"
{"success":true,"data":[{"pool_address":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2","program_id":"675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8","token1":"So11111111111111111111111111111111111111112","token2":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","volume_24h":680308,"volume_change_24h":72.8067287169929,"trades_24h":7703,"trades_change_24h":51.421524081526684,"timestamp":1745755475438,"anomaly_score":72.8067287169929,"type":"volume"},{"pool_address":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2","program_id":"675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8","token1":"So11111111111111111111111111111111111111112","token2":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","volume_24h":680308,"volume_change_24h":72.8067287169929,"trades_24h":7703,"trades_change_24h":51.421524081526684,"timestamp":1745755507394,"anomaly_score":72.8067287169929,"type":"volume"},{"pool_address":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2","program_id":"675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8","token1":"So11111111111111111111111111111111111111112","token2":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","volume_24h":680308,"volume_change_24h":72.8067287169929,"trades_24h":7703,"trades_change_24h":51.421524081526684,"timestamp":1745755536617,"anomaly_score":72.8067287169929,"type":"volume"},{"pool_address":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2","program_id":"675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8","token1":"So11111111111111111111111111111111111111112","token2":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","volume_24h":680308,"volume_change_24h":72.8067287169929,"trades_24h":7703,"trades_change_24h":51.421524081526684,"timestamp":1745755566388,"anomaly_score":72.8067287169929,"type":"volume"},{"pool_address":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2","program_id":"675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8","token1":"So11111111111111111111111111111111111111112","token2":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","volume_24h":680308,"volume_change_24h":72.8067287169929,"trades_24h":7703,"trades_change_24h":51.421524081526684,"timestamp":1745755595155,"anomaly_score":72.8067287169929,"type":"volume"}],"metadata":{"total_anomalies":5,"last_updated":1745755606264}}a@a:~/solanastae$ 






