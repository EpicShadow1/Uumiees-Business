import { Pool, PoolConfig } from 'pg';

//Connection pooling configuration
const poolConfig: PoolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'backend_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',

    // Connection pool settings
    max: 20,
    min: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
};

export const pool = new Pool(poolConfig);

// Connection pool monitoring
pool.on('connect', () => {
    console.log('New client connected to pool');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Health check for database
export const checkDatabaseHealth = async (): Promise<boolean> => {
    try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        return true;
    } catch (error) {
        console.error('Database health check failed:', error);
        return false;
    }
};

// Retry wrapper for database operations with exponential backoff
export const executeWithRetry = async <T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    initialDelay = 1000
): Promise<T> => {
    let lastError: Error;
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;

            if (attempt === maxRetries) {
                throw lastError;
            }

            console.log(`Database operation attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));

            // Exponential backoff
            delay = Math.min(delay * 2, 10000); // Max 10 seconds
        }
    }

    // This should never be reached, but TypeScript needs it for type safety
    throw new Error('Max retries exceeded without throwing last error');
};
