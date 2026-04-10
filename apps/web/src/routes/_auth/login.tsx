import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAppDispatch } from '../../store'
import { authClient } from '../../lib/auth'
import { setUser } from '../../store/slices/auth.slice'


export const Route = createFileRoute('/_auth/login')({
  component: LoginPage
})

function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await authClient.signIn.email({ email, password })

    if (error) {
      setError(error.message ?? 'Login failed')
      setLoading(false)
      return
    }

    if (data?.user) {
      dispatch(setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: (data.user as any).role ?? 'user',
        emailVerified: data.user.emailVerified,
        twoFactorEnabled: (data.user as any).twoFactorEnabled ?? false
      }))
      navigate({ to: '/dashboard' })
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="text-sm text-center mt-4 text-gray-500">
        Don't have an account?{' '}
        <a href="/register" className="text-black font-medium">Register</a>
      </p>
    </div>
  )
}
