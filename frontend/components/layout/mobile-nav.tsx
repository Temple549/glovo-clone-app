// components/layout/mobile-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';

const tabs = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Orders', href: '/orders', icon: ClipboardList, auth: true },
  { name: 'Profile', href: '/profile', icon: User, auth: true },
];

export function MobileNav() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const itemCount = useCartStore((state) => state.itemCount());

  // Hide mobile nav on Vendor/Admin dashboards or Checkout
  if (pathname.startsWith('/vendor') || pathname.startsWith('/admin') || pathname.startsWith('/checkout')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          // Hide auth-required tabs if not logged in
          if (tab.auth && !isAuthenticated) return null;

          const isActive = pathname === tab.href;
          
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${
                isActive ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium mt-1">{tab.name}</span>
              {tab.name === 'Home' && itemCount > 0 && (
                <span className="absolute top-2 right-1/4 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}