import { Request, Response } from 'express';
import { checkDatabaseHealth } from '../config/database';
import { redisClient } from '../config/redis';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database: { status: string; latency?: number };
    redis: { status: string; latency?: number };
    memory: { status: string; usage: string };
    disk: { status: string; usage: string };
  };
}

export const healthCheck = async (req: Request, res: Response) => {
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: { status: 'unknown' },
      redis: { status: 'unknown' },
      memory: { status: 'unknown', usage: '0%' },
      disk: { status: 'unknown', usage: '0%' }
    }
  };

  // Check database
  try {
    const dbStart = Date.now();
    const dbHealthy = await checkDatabaseHealth();
    const dbLatency = Date.now() - dbStart;
    
    health.checks.database = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      latency: dbLatency
    };
    
    if (!dbHealthy) health.status = 'degraded';
  } catch (error) {
    health.checks.database = { status: 'unhealthy' };
    health.status = 'unhealthy';
  }

  // Check Redis
  try {
    const redisStart = Date.now();
    await redisClient.ping();
    const redisLatency = Date.now() - redisStart;
    
    health.checks.redis = {
      status: 'healthy',
      latency: redisLatency
    };
  } catch (error) {
    health.checks.redis = { status: 'unhealthy' };
    health.status = 'degraded';
  }

  // Check memory usage
  const memoryUsage = process.memoryUsage();
  const memoryPercent = ((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100).toFixed(2);
  health.checks.memory = {
    status: parseFloat(memoryPercent) < 90 ? 'healthy' : 'degraded',
    usage: `${memoryPercent}%`
  };

  // Overall status
  const statusCode = health.status === 'healthy' ? 200 : 
                     health.status === 'degraded' ? 200 : 503;

  res.status(statusCode).json(health);
};

// Readiness probe (for Kubernetes)
export const readinessCheck = async (req: Request, res: Response) => {
  // Only check critical dependencies
  const dbHealthy = await checkDatabaseHealth();
  
  if (dbHealthy) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
};

// Liveness probe (for Kubernetes)
export const livenessCheck = (req: Request, res: Response) => {
  // Basic check if the process is running
  res.status(200).json({ status: 'alive' });
};