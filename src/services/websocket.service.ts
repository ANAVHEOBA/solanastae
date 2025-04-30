import { Server } from 'socket.io';
import { TransactionMonitorService } from './transaction-monitor.service';

export class WebSocketService {
    private static io: Server;
    private static monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();
    private static isInitialized = false;

    static initialize(server: any) {
        if (this.isInitialized) {
            console.log('WebSocket service already initialized');
            return;
        }

        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            },
            allowEIO3: true,
            transports: ['websocket'],
            pingTimeout: 60000,
            pingInterval: 25000
        });

        this.setupConnectionHandlers();
        this.isInitialized = true;
        console.log('WebSocket service initialized');
    }

    private static setupConnectionHandlers() {
        this.io.on('connection', (socket) => {
            console.log('New client connected:', socket.id);

            // Account monitoring channel
            socket.on('subscribe', async (address: string) => {
                console.log(`Subscribing to account: ${address}`);
                
                try {
                    // Start monitoring for this address
                    const interval = TransactionMonitorService.startMonitoring(address);
                    this.monitoringIntervals.set(address, interval);

                    // Join the room for this address
                    socket.join(address);
                    socket.join(`large-transfers:${address}`); // Also join large transfers room

                    // Acknowledge subscription
                    socket.emit('subscription-success', { address });
                    console.log(`Successfully subscribed to ${address}`);
                } catch (error: unknown) {
                    console.error(`Error subscribing to ${address}:`, error);
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    socket.emit('subscription-error', { address, error: errorMessage });
                }
            });

            // Add handler for large transfer notifications
            socket.on('subscribe-large-transfers', async (address: string) => {
                console.log(`Subscribing to large transfers for: ${address}`);
                socket.join(`large-transfers:${address}`);
                socket.emit('large-transfers-subscription-success', { address });
            });

            socket.on('unsubscribe-large-transfers', (address: string) => {
                console.log(`Unsubscribing from large transfers for: ${address}`);
                socket.leave(`large-transfers:${address}`);
            });

            socket.on('unsubscribe', (address: string) => {
                console.log(`Unsubscribing from account: ${address}`);
                
                // Stop monitoring
                const interval = this.monitoringIntervals.get(address);
                if (interval) {
                    clearInterval(interval);
                    this.monitoringIntervals.delete(address);
                }
                TransactionMonitorService.stopMonitoring(address);

                socket.leave(address);
            });

            socket.on('disconnect', (reason) => {
                console.log('Client disconnected:', socket.id, 'Reason:', reason);
                
                // Clean up all monitoring for this socket
                this.monitoringIntervals.forEach((interval, address) => {
                    clearInterval(interval);
                    TransactionMonitorService.stopMonitoring(address);
                });
                this.monitoringIntervals.clear();
            });

            // Handle errors
            socket.on('error', (error) => {
                console.error('Socket error:', error);
            });
        });
    }

    static emitToChannel(channel: string, event: string, data: any) {
        if (!this.isInitialized) {
            console.error('WebSocket service not initialized');
            return;
        }
        console.log(`Emitting ${event} to ${channel}`);
        this.io.to(channel).emit(event, data);
    }
}