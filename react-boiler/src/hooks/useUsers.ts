import { useEffect } from 'react'
import { useUserStore } from '@/stores'
import type { PaginationParams } from '@/types'

export function useUsers(params?: PaginationParams) {
  const {
    users,
    pagination,
    loading,
    error,
    fetchUsers,
    removeUser,
    clearError,
  } = useUserStore()

  useEffect(() => {
    fetchUsers(params)
  }, [fetchUsers, params?.page, params?.limit])

  return { users, pagination, loading, error, refetch: fetchUsers, removeUser, clearError }
}

export function useUser(id: string) {
  const { selectedUser, loading, error, fetchUser, updateUser, clearSelected, clearError } =
    useUserStore()

  useEffect(() => {
    if (id) fetchUser(id)
    return () => clearSelected()
  }, [id, fetchUser, clearSelected])

  return { user: selectedUser, loading, error, updateUser, clearError }
}
