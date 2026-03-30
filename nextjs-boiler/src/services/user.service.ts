import api from "@/lib/api";
import type { ApiResponse, PaginatedResponse } from "@/lib/api";
import type { User, PaginationParams } from "@/types";

export const userService = {
  getAll: (params?: PaginationParams) =>
    api.get<never, PaginatedResponse<User>>("/users", { params }),

  getById: (id: string) =>
    api.get<never, ApiResponse<User>>(`/users/${id}`),

  update: (id: string, data: Partial<User>) =>
    api.patch<never, ApiResponse<User>>(`/users/${id}`, data),

  remove: (id: string) =>
    api.delete<never, void>(`/users/${id}`),
};
