import Queue from 'bull';

//Email queue
export const emailQueue = new Queue('email', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 10,
    removeOnFail: 50,
  }
});

//Order processing queue
export const orderQueue = new Queue('order', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: 5,
    removeOnFail: 20,
  }
});

// Queue event handlers
emailQueue.on('completed', (job) => {
  console.log(`Email job ${job.id} completed`);
});

emailQueue.on('failed', (job, err) => {
  console.error(`Email job ${job?.id} failed:`, err);
});

orderQueue.on('completed', (job) => {
  console.log(`Order job ${job.id} completed`);
});

orderQueue.on('failed', (job, err) => {
  console.error(`Order job ${job?.id} failed:`, err);
});