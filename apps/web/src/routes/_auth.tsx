import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { store } from '../store'

export const Route = createFileRoute('/_auth')({
  beforeLoad: () => {
    const { isAuthenticated, isLoading } = store.getState().auth
    if (!isLoading && isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Outlet />
    </div>
  )
})
