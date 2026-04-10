import { useAppSelector } from "../store"

export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAppSelector((state : any) => state.auth)
  return { user, isAuthenticated, isLoading }
}
