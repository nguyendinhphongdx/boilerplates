import { create } from 'zustand'
import { authService } from '@/services'
import type { User, LoginRequest, RegisterRequest } from '@/types'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null

  fetchUser: () => Promise<void>
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  fetchUser: async () => {
    try {
      set({ loading: true, error: null })
      const res = await authService.getMe()
      set({ user: res.data, loading: false })
    } catch {
      set({ user: null, loading: false })
    }
  },

  login: async (data) => {
    try {
      set({ loading: true, error: null })
      await authService.login(data)
      const res = await authService.getMe()
      set({ user: res.data, loading: false })
    } catch (err) {
      set({ loading: false, error: (err as Error).message })
      throw err
    }
  },

  register: async (data) => {
    try {
      set({ loading: true, error: null })
      await authService.register(data)
      const res = await authService.getMe()
      set({ user: res.data, loading: false })
    } catch (err) {
      set({ loading: false, error: (err as Error).message })
      throw err
    }
  },

  logout: async () => {
    await authService.logout()
    set({ user: null, error: null })
  },

  clearError: () => set({ error: null }),
}))
