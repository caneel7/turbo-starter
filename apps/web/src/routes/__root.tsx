import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAppDispatch } from '../store'
import { authClient } from '../lib/auth'
import { clearUser, setUser } from '../store/slices/auth.slice'

function RootComponent() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      if (data?.user) {
        dispatch(setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: (data.user as any).role ?? 'user',
          emailVerified: data.user.emailVerified,
          twoFactorEnabled: (data.user as any).twoFactorEnabled ?? false
        }))
      } else {
        dispatch(clearUser())
      }
    }).catch(() => {
      dispatch(clearUser())
    })
  }, [dispatch])

  return (
    <>
      <Outlet />
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent
})
