import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { Server } from 'http';
import { proxyConfig } from './config/proxy';
import { basicLimiter, authLimiter, apiLimiter } from './middleware/rateLimiter';
import { checkDatabaseHealth, pool } from './config/database';
import { connectRedis, redisClient } from './config/redis';
import { logger } from './config/logger';
import { metricsMiddleware, metricsEndpoint } from './config/metrics';
import { sessionMiddleware } from './middleware/session';
import { initializeDatabase } from './config/databaseInit';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import userRoutes from './routes/users';
import categoryRoutes from './routes/categories';
import cartRoutes from './routes/cart';
import productImageRoutes from './routes/productImages';
import productVariantRoutes from './routes/productVariants';
import wishlistRoutes from './routes/wishlist';
import reviewRoutes from './routes/reviews';
import trackingRoutes from './routes/tracking';
import discountRoutes from './routes/discounts';
import supportRoutes from './routes/support';


const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0'; // 0.0.0.0 means listen on all interfaces

//Security middleware 
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    },
    noSniff: true,
    frameguard: { action: 'deny' },
    xssFilter: true
}));
app.use(cors());

if (proxyConfig.trustProxy) {
    app.set('trust proxy', true);
}

//Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

//Apply rate limiters to all routes
app.use(basicLimiter);
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Apply middleware
app.use(sessionMiddleware);
app.use(metricsMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/product-images', productImageRoutes);
app.use('/api/product-variants', productVariantRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/support', supportRoutes);

// Metrics endpoint
app.get('/metrics', metricsEndpoint);

// Graceful shutdown handling
const gracefulShutdown = async (signal: string, server: Server) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  // Stop accepting new connections
  server.close(async () => {
    logger.info('HTTP server closed');

    // Close database connections
    try {
      await pool.end();
      logger.info('Database connections closed');
    } catch (error) {
      logger.error('Error closing database connections:', error);
    }

    // Close Redis connection
    try {
      await redisClient.quit();
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Error closing Redis connection:', error);
    }

    logger.info('Graceful shutdown completed');
    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

// Initialize connections
const initializeServer = async () => {
  try {
    // Connect to Redis
    await connectRedis();

    // Initialize database schema
    await initializeDatabase();

    // Check database health
    const dbHealthy = await checkDatabaseHealth();
    if (!dbHealthy) {
      throw new Error('Database is not healthy');
    }

    // Start server
    const server = app.listen(PORT, HOST, () => {
      logger.info(`Server is running on http://${HOST}:${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM', server));
    process.on('SIGINT', () => gracefulShutdown('SIGINT', server));

  } catch (error) {
    logger.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

initializeServer();