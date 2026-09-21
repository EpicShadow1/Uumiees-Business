import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/auth';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Role-based authorization
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // TODO: Implement role-based authorization
    // Check if user has the required roles from database
    // For now, we'll assume all authenticated users have access
    // Placeholder to use the parameter (will be used in RBAC implementation)
    void roles;

    next();
  };
};