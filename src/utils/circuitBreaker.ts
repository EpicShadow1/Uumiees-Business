export interface CircuitBreakerOptions {
    failureThreshold: number;
    recoveryTimeout: number;
    monitoringPeriod: number;
}

export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private successCount = 0;

  constructor(private options: CircuitBreakerOptions) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.options.recoveryTimeout) {
        this.state = 'half-open';
        this.successCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    if (this.state === 'half-open') {
      this.successCount++;
      if (this.successCount >= 3) {
        this.state = 'closed';
      }
    }
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.options.failureThreshold) {
      this.state = 'open';
      console.error('Circuit breaker opened due to failures');
    }
  }

  getState() {
    return this.state;
  }
}

// Usage example
export const dbCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  recoveryTimeout: 60000, // 1 minute
  monitoringPeriod: 10000
});