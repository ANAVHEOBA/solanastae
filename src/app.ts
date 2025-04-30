import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { validatorRouter } from './modules/validator/validator.router';
import { networkRouter } from './modules/network/network.router';
import { solanaFMRouter } from './modules/solanafm/solanafm.router';
import { solscanRouter } from './modules/solscan/solscan.router';
import { whaleMonitorRouter } from './modules/whale-monitor/whale-monitor.router';
import { authRouter } from './modules/auth/auth.router';
import { analyticsRouter } from './modules/analytics/analytics.router';
import { errorMiddleware } from './middleware/error.middleware';
import { rateLimit } from 'express-rate-limit';
import { environment } from './config/environment';
import { WebSocketService } from './services/websocket.service';

// Create Express app
const app = express();
const httpServer = createServer(app);

// Initialize WebSocket service
WebSocketService.initialize(httpServer);

// Connect to MongoDB
mongoose.connect(environment.mongodb.uri, {
    dbName: environment.mongodb.dbName
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Apply security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Apply rate limiting
const limiter = rateLimit({
    windowMs: environment.rateLimit.windowMs,
    max: environment.rateLimit.max,
    message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/validators', validatorRouter);
app.use('/api/v1/network', networkRouter);
app.use('/api/v1/solanafm', solanaFMRouter);
app.use('/api/v1/solscan', solscanRouter);
app.use('/api/v1/whale-monitor', whaleMonitorRouter);
app.use('/api/v1/analytics', analyticsRouter);

// 404 handler - needs to be before error handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handling - must be last middleware with 4 parameters
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorMiddleware(err, req, res, next);
});

export { httpServer as server };
export default app;
