import { redisClient } from '../config/redis';

export class DistributedLock {
  private lockKey: string;
  private lockValue: string;
  private lockTTL: number;

  constructor(key: string, ttl = 10000) {
    this.lockKey = `lock:${key}`;
    this.lockValue = `${Date.now()}-${Math.random()}`;
    this.lockTTL = ttl;
  }

  async acquire(): Promise<boolean> {
    try {
      // SETNX with expiration
      const result = await redisClient.set(
        this.lockKey,
        this.lockValue,
        {
          NX: true, // Only set if not exists
          PX: this.lockTTL // Expire in milliseconds
        }
      );
      return result === 'OK';
    } catch (error) {
      console.error('Failed to acquire lock:', error);
      return false;
    }
  }

  async release(): Promise<boolean> {
    try {
      // Only release if we own the lock (Lua script for atomicity)
      const script = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;

      const result = await redisClient.eval(script, {
        keys: [this.lockKey],
        arguments: [this.lockValue]
      });

      return result === 1;
    } catch (error) {
      console.error('Failed to release lock:', error);
      return false;
    }
  }

  async extend(ttl = this.lockTTL): Promise<boolean> {
    try {
      const script = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("pexpire", KEYS[1], ARGV[2])
        else
          return 0
        end
      `;

      const result = await redisClient.eval(script, {
        keys: [this.lockKey],
        arguments: [this.lockValue, ttl.toString()]
      });

      return result === 1;
    } catch (error) {
      console.error('Failed to extend lock:', error);
      return false;
    }
  }
}

// Usage example for inventory management
export const withLock = async <T>(
  key: string,
  operation: () => Promise<T>,
  ttl = 10000
): Promise<T> => {
  const lock = new DistributedLock(key, ttl);

  const acquired = await lock.acquire();
  if (!acquired) {
    throw new Error('Failed to acquire lock');
  }

  try {
    return await operation();
  } finally {
    await lock.release();
  }
};