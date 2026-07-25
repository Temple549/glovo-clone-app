// hooks/use-auth.ts
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { apiClient } from '@/services/api-client';
import { LoginCredentials } from '@/types/types';

export const useAuth = () => {
  const { user, isLoading, isAuthenticated, isHydrated, hydrateUser, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Tell TypeScript we expect the nested wrapper from your backend
      const res = await apiClient.post<{ success: boolean; data: any }>('/auth/login', credentials);
      return res;
    },
    onSuccess: () => {
      // Fetch the full user profile with the corrected structure
      hydrateUser();
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated,
    isHydrated,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
  };
};