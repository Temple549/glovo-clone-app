// app/providers.tsx
'use client';

import { useEffect, ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/toaster';
import { useAuthStore } from '../store/auth.store';
import { AuthState } from '../store/auth.store'; // ADD THIS IMPORT

export function ClientProviders({ children }: { children: ReactNode }) {
  // EXPLICITLY TYPE THE STATE PARAMETER HERE
  const hydrateUser = useAuthStore((state: AuthState) => state.hydrateUser);

  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);

  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}