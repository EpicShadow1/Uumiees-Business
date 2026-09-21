import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';

export interface SessionData {
  userId: number;
  email: string;
  createdAt: number;
  lastAccessed: number;
}

export const sessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionToken = req.headers['session-token'] as string;

  if (!sessionToken) {
    return next();
  }

  try {
    const sessionKey = `session:${sessionToken}`;
    const sessionData = await redisClient.get(sessionKey);

    if (sessionData) {
      const session: SessionData = JSON.parse(sessionData);

      // Update last accessed time
      session.lastAccessed = Date.now();
      await redisClient.setEx(sessionKey, 3600, JSON.stringify(session));

      req.session = session;
    }
  } catch (error) {
    console.error('Session middleware error:', error);
  }

  next();
};

export const createSession = async (userId: number, email: string): Promise<string> => {
  const sessionToken = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const sessionData: SessionData = {
    userId,
    email,
    createdAt: Date.now(),
    lastAccessed: Date.now()
  };

  const sessionKey = `session:${sessionToken}`;
  await redisClient.setEx(sessionKey, 3600, JSON.stringify(sessionData)); // 1 hour expiry

  return sessionToken;
};