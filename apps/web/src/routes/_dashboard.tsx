import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { store, useAppDispatch } from '../store'
import { useAuth } from '../hooks/useAuth'
import { authClient } from '../lib/auth'
import { clearUser } from '../store/slices/auth.slice'


export const Route = createFileRoute('/_dashboard')({
  beforeLoad: () => {
    const { isAuthenticated, isLoading } = store.getState().auth;
    if (!isLoading && !isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: DashboardLayout
})

function DashboardLayout() {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  async function handleSignOut() {
    await authClient.signOut()
    dispatch(clearUser())
    navigate({ to: '/login' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <span className="font-semibold">Cancer App</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}
