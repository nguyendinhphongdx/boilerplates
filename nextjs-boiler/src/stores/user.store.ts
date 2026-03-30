import { create } from "zustand";
import { userService } from "@/services";
import type { User, PaginationParams } from "@/types";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UserState {
  users: User[];
  selectedUser: User | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;

  fetchUsers: (params?: PaginationParams) => Promise<void>;
  fetchUser: (id: string) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
  clearSelected: () => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  selectedUser: null,
  pagination: null,
  loading: false,
  error: null,

  fetchUsers: async (params) => {
    try {
      set({ loading: true, error: null });
      const res = await userService.getAll(params);
      set({ users: res.data, pagination: res.pagination, loading: false });
    } catch (err) {
      set({ loading: false, error: (err as Error).message });
    }
  },

  fetchUser: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await userService.getById(id);
      set({ selectedUser: res.data, loading: false });
    } catch (err) {
      set({ loading: false, error: (err as Error).message });
    }
  },

  updateUser: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const res = await userService.update(id, data);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? res.data : u)),
        selectedUser: res.data,
        loading: false,
      }));
    } catch (err) {
      set({ loading: false, error: (err as Error).message });
      throw err;
    }
  },

  removeUser: async (id) => {
    try {
      set({ loading: true, error: null });
      await userService.remove(id);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        loading: false,
      }));
    } catch (err) {
      set({ loading: false, error: (err as Error).message });
      throw err;
    }
  },

  clearSelected: () => set({ selectedUser: null }),
  clearError: () => set({ error: null }),
}));
