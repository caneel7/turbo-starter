import { redis, Worker } from '@turbo-starter/queues'
import type { UserJobName, UserJobPayload, UserOnboardingEmailPayload } from '@turbo-starter/queues'
import { EmailService } from '@turbo-starter/services'


export const userWorker = new Worker<UserJobPayload[UserJobName], void, UserJobName>(
  'user',
  async (job) => {
    console.log(`Processing user job: ${job.name} with data:`, job.data)
    switch (job.name) {
      case 'onboarding-email':
        await new EmailService()
            .sendVerificationEmail(job.data as UserOnboardingEmailPayload);
        break;
    }
  },
  { connection: redis }
)

userWorker.on('completed', (job) => {
  console.log(`User job ${job.name} completed`)
})

userWorker.on('failed', (job, err) => {
  console.error(`User job ${job?.name} failed:`, err)
})