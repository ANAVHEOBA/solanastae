import Redis from 'ioredis';
import { environment } from '../config/environment';

export class CacheService {
    private redis: Redis;

    constructor() {
        this.redis = new Redis({
            host: environment.redis.host,
            port: environment.redis.port,
            password: environment.redis.password,
            retryStrategy: (times: number): number => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        this.redis.on('error', (error: Error) => {
            console.error('Redis error:', error);
        });

        this.redis.on('connect', () => {
            console.log('Connected to Redis');
        });
    }

    async get(key: string): Promise<any | null> {
        try {
            const data = await this.redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting from cache:', error);
            return null;
        }
    }

    async set(key: string, value: any, ttlSeconds: number): Promise<void> {
        try {
            await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        } catch (error) {
            console.error('Error setting cache:', error);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.redis.del(key);
        } catch (error) {
            console.error('Error deleting from cache:', error);
        }
    }

    async clear(): Promise<void> {
        try {
            await this.redis.flushdb();
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }

    async keys(pattern: string): Promise<string[]> {
        try {
            return await this.redis.keys(pattern);
        } catch (error) {
            console.error('Error getting cache keys:', error);
            return [];
        }
    }

    async exists(key: string): Promise<boolean> {
        try {
            return (await this.redis.exists(key)) === 1;
        } catch (error) {
            console.error('Error checking cache key existence:', error);
            return false;
        }
    }

    async ttl(key: string): Promise<number> {
        try {
            return await this.redis.ttl(key);
        } catch (error) {
            console.error('Error getting cache TTL:', error);
            return -2; // Key doesn't exist
        }
    }
}
