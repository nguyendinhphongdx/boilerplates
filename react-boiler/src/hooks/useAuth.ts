import { useEffect } from 'react'
import { useAuthStore } from '@/stores'

export function useAuth() {
  const { user, loading, error, fetchUser, login, register, logout, clearError } =
    useAuthStore()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return { user, loading, error, login, register, logout, clearError }
}
