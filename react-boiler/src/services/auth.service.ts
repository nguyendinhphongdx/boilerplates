import api from '@/lib/api'
import type { ApiResponse } from '@/lib/api'
import type { User, LoginRequest, RegisterRequest } from '@/types'

export const authService = {
  login: (data: LoginRequest) =>
    api.post<never, ApiResponse<null>>('/auth/login', data),

  register: (data: RegisterRequest) =>
    api.post<never, ApiResponse<null>>('/auth/register', data),

  logout: () =>
    api.post<never, ApiResponse<null>>('/auth/logout'),

  getMe: () =>
    api.get<never, ApiResponse<User>>('/auth/me'),
}
