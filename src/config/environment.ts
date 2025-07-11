import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const environment = {
    mongodb: {
        uri: process.env.MONGODB_URI || '',
        dbName: process.env.DB_NAME || 'solana_staking_dashboard',
    },
    server: {
        port: parseInt(process.env.PORT || '3000', 10),
        nodeEnv: process.env.NODE_ENV || 'development',
    },
    solana: {
        rpcUrl: process.env.SOLANA_RPC_URL || 'https://mainnet.helius-rpc.com',
        wsUrl: process.env.SOLANA_WS_URL || 'wss://mainnet.helius-rpc.com',
        heliusApiKey: process.env.HELIUS_API_KEY || '',
    },
    cache: {
        ttl: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutes in seconds
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
        saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || '',
    },
};

// Validate required environment variables
const validateEnv = () => {
    const required = ['MONGODB_URI', 'HELIUS_API_KEY', 'JWT_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

