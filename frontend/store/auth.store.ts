// store/auth.store.ts

import { create } from 'zustand';
import { apiClient } from '@/services/api-client';

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
  _id: string; // Note: Your backend sends "id", but we map it to "_id" below
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;

  hydrateUser: () => Promise<void>;
  logout: () => Promise<void>;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isHydrated: false,

  hydrateUser: async () => {
    try {
      set({ isLoading: true });
      
      // Fetch the deeply nested response from your Express backend
      const response = await apiClient.get<{ success: boolean; data: { user: any } }>('/auth/me');
      
      // Map the backend "id" to our frontend "_id" standard
      const rawUser = response.data.user;
      const user: User = {
        _id: rawUser.id, 
        name: rawUser.name,
        email: rawUser.email,
        role: rawUser.role,
      };

      set({ user, isAuthenticated: true, isHydrated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isHydrated: true, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API failed', error);
    } finally {
      set({ user: null, isAuthenticated: false, isHydrated: true, isLoading: false });
    }
  },

  resetAuth: () => {
    set({ user: null, isAuthenticated: false });
  },
}));