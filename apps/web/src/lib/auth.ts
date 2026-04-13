import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields, twoFactorClient } from 'better-auth/client/plugins'
import type { auth } from '@turbo-starter/better-auth'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || window.location.origin,
  basePath: '/api/v1/auth',
  plugins: [twoFactorClient(),inferAdditionalFields<typeof auth>()],
})

export type Session = typeof authClient.$Infer.Session
