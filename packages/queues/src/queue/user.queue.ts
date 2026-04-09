import { Queue } from 'bullmq'
import { redis } from '@/redis';

export type UserJobName = 'onboarding-email' | 'login-otp'

export type UserOnboardingEmailPayload = {
  user: { firstName: string, lastName: string, email: string },
  token: string,
  url: string
};

export type UserLoginOtpPayload = { userId: string; otp: string };

export type UserJobPayload = {
  'onboarding-email': UserOnboardingEmailPayload
  'login-otp': UserLoginOtpPayload
};

export const userQueue = new Queue<UserJobPayload[UserJobName]>('user', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 }
  }
});
