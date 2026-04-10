import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../../hooks/useAuth'

export const Route = createFileRoute('/_dashboard/dashboard')({
  component: DashboardPage
})

function DashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Welcome back, {user?.name}!</h1>
      <p className="text-gray-500 text-sm">You're logged in as <strong>{user?.role}</strong></p>
    </div>
  )
}
