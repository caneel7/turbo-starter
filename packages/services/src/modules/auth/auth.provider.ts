import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { db } from '@turbo-starter/database'
import { dash } from '@better-auth/infra'
import { userQueue } from '@turbo-starter/queues'
import { BASE_URL } from '@/constants'

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql'
  }),
  plugins: [
    dash({
      apiKey: process.env.BETTER_AUTH_API_KEY
    }),
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    autoSignIn: false,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ token, url, user }) => {
      let res = await userQueue.add('onboarding-email', {
        user: {
          firstName: user.name,
          lastName: '',
          email: user.email
        },
        token: token,
        url: url
      })
      console.log(`Added onboarding email job to queue with ID: ${res.id}`)
    }
  },
  baseURL: BASE_URL,
  basePath: '/api/v1/auth',
  secret: process.env.BETTER_AUTH_API_KEY,
  trustedOrigins: [
    process.env.FRONTEND_ENDPOINT || 'http://localhost:5173',
  ]
})

export type Auth = typeof auth
