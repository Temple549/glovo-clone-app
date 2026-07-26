// app/app-shell.tsx
'use client';

import { useState, useEffect, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/navbar';
import { CartDrawer } from '@/components/shared/cart-drawer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useAuthStore, AuthState } from '@/store/auth.store';

const queryClient = new QueryClient();

export function AppShell({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const hydrateUser = useAuthStore((state: AuthState) => state.hydrateUser);
  
  // Wait for hydration AND get the exact boolean to pass to Navbar
  const isHydrated = useAuthStore((state: AuthState) => state.isHydrated);

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
        {/* PASS isHydrated TO NAVBAR HERE */}
        <Navbar isHydrated={isHydrated} />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        
        <main className="pb-16 md:pb-0">
          {children}
        </main>

        <MobileNav />
      </ToastProvider>
    </QueryClientProvider>
  );
}