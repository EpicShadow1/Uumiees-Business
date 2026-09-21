import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = createClient({
    url: redisUrl,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                return new Error('Too many retries');
            }
            return retries * 100;
        }
    }
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
    }
    catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
};

// Cache helper function
export const cacheGet = async (key: string): Promise<string | null> => {
    try {
        return await redisClient.get(key);
    } catch (error) {
        console.error('Cache get error:', error);
        return null;
    }
};

export const cacheSet = async (key: string, value: string, ttl = 3600): Promise<void> => {
    try {
        await redisClient.setEx(key, ttl, value);
    } catch (error) {
        console.error('Cache set error:', error);
    }
};

export const cacheDelete = async (key: string): Promise<void> => {
    try {
        await redisClient.del(key);
    } catch (error) {
        console.error('Cache delete error:', error);
    }
};
