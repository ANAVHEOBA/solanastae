import { server } from './app';
import { environment } from './config/environment';

const PORT = environment.server.port;

server.listen(PORT, () => {
    console.log(`
🚀 Server is running!
🔊 Listening on port ${PORT}
🌍 Environment: ${environment.server.nodeEnv}
📊 Validator API: http://localhost:${PORT}/api/v1/validators
🔐 WebSocket: ws://localhost:${PORT}
❤️  Health check: http://localhost:${PORT}/health
    `);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    server.close(() => {
        process.exit(1);
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    server.close(() => {
        process.exit(1);
    });
});
