// app/app-shell.tsx
'use client';

import { useState, useEffect, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/navbar';
import { CartDrawer } from '@/components/shared/cart-drawer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useAuthStore, AuthState } from '@/store/auth.store';

// Initialize QueryClient OUTSIDE the component to preserve state across renders
const queryClient = new QueryClient();

export function AppShell({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const hydrateUser = useAuthStore((state: AuthState) => state.hydrateUser);

  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);

  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('open-cart-drawer', handleOpenCart);
    return () => window.removeEventListener('open-cart-drawer', handleOpenCart);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Navbar />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        
        {/* pb-16 ensures mobile content isn't hidden behind the fixed bottom nav */}
        <main className="pb-16 md:pb-0">
          {children}
        </main>

        <MobileNav />
      </ToastProvider>
    </QueryClientProvider>
  );
}