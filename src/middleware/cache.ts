import { Request, Response, NextFunction } from 'express';
import { cacheGet, cacheSet } from '../config/redis';

export const cacheMiddleware = (ttl = 3600) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const key = `cache:${req.method}:${req.originalUrl}`;
        
        try {
            const cachedData = await cacheGet(key);
            
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }
            
            // Store original json method
            const originalJson = res.json.bind(res);
            
            // Override json method to cache response
            res.json = function(data: unknown) {
                cacheSet(key, JSON.stringify(data), ttl).catch(err => {
                    console.error('Cache set error:', err);
                });
                return originalJson(data);
            };
            
            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};
