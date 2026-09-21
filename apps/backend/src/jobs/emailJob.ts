import { emailQueue } from '../config/queue';

export interface EmailJobData {
  to: string;
  subject: string;
  body: string;
  template?: string;
}

export const sendEmail = async (data: EmailJobData) => {
  const job = await emailQueue.add('send', data, {
    priority: data.subject.includes('urgent') ? 1 : 5,
  });
  
  return job;
};

// Email job processor
export const processEmailJobs = () => {
  emailQueue.process('send', async (job) => {
    const { to, subject } = job.data;

    console.log(`Sending email to ${to}: ${subject}`);

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, integrate with email service like SendGrid, AWS SES, etc.
    console.log(`Email sent successfully to ${to}`);

    return { success: true, messageId: `msg_${Date.now()}` };
  });
};