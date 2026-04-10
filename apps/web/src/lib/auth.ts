import { createAuthClient } from 'better-auth/react'
import { twoFactorClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || window.location.origin,
  basePath: '/api/v1/auth',
  plugins: [twoFactorClient()]
})

export type Session = typeof authClient.$Infer.Session
