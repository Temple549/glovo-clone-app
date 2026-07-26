// components/layout/mobile-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, User, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';

const tabs = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Orders', href: '/orders', icon: ClipboardList, auth: true },
  { name: 'Cart', href: '#cart', icon: ShoppingBag, isCart: true },
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

  const handleOpenCart = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event('open-cart-drawer'));
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 md:hidden shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          if (tab.auth && !isAuthenticated) return null;

          const isActive = pathname === tab.href;

          if (tab.isCart) {
            return (
              <button
                key={tab.name}
                onClick={handleOpenCart}
                className="flex flex-col items-center justify-center w-full h-full relative text-gray-500 hover:text-orange-600 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <tab.icon className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[9px] font-black text-white">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold mt-1">{tab.name}</span>
              </button>
            );
          }

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${
                isActive ? 'text-orange-600 font-bold' : 'text-gray-500 hover:text-gray-700 font-medium'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-1">{tab.name}</span>
              {isActive && (
                <span className="absolute top-1 w-1 h-1 rounded-full bg-orange-600" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}