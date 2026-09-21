import { Request, Response, NextFunction } from 'express';
import { cacheGet, cacheSet } from '../config/redis';

export const idempotencyMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const idempotencyKey = req.headers['idempotency-key'] as string;
  
  if (!idempotencyKey) {
    return next();
  }
  
  const cacheKey = `idempotency:${idempotencyKey}`;
  
  try {
    const cachedResponse = await cacheGet(cacheKey);
    
    if (cachedResponse) {
      const response = JSON.parse(cachedResponse);
      return res.status(200).json(response);
    }
    
    // Store original json method
    const originalJson = res.json.bind(res);
    
    // Override json method to cache response
    res.json = function(data: unknown) {
      cacheSet(cacheKey, JSON.stringify(data), 86400); // Cache for 24 hours
      return originalJson(data);
    };
    
    next();
  } catch (error) {
    console.error('Idempotency middleware error:', error);
    next();
  }
};