// components/layout/navbar.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useCartStore } from '@/store/cart.store';
import { UtensilsCrossed, ShoppingCart, LogOut, User, Store, Shield } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, isHydrated, logout } = useAuth();
  const itemCount = useCartStore((state) => state.itemCount());

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <UtensilsCrossed className="w-6 h-6 text-orange-500" />
          <span className="hidden sm:inline">FoodieXpress</span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {!isHydrated && (
            <div className="h-9 w-32 bg-gray-100 animate-pulse rounded-lg" />
          )}

          {isHydrated && !isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2">
                Log in
              </Link>
              <Link href="/register" className="text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg px-4 py-2">
                Sign up
              </Link>
            </div>
          )}

          {isHydrated && isAuthenticated && user && (
            <>
              {/* Customer: Cart Icon */}
              {user.role === 'customer' && (
                <Link href="/checkout" className="relative p-2 text-gray-600 hover:text-orange-600">
                  <ShoppingCart className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                      {itemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* VENDOR: Big Blue Dashboard Button */}
              {user.role === 'vendor' && (
                <Link 
                  href="/vendor/dashboard/products" 
                  className="flex items-center gap-2 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg px-4 py-2 transition-colors border border-blue-200"
                >
                  <Store className="w-4 h-4" /> 
                  Dashboard
                </Link>
              )}
              
              {/* ADMIN: Purple Admin Button */}
              {user.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="flex items-center gap-2 text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg px-4 py-2 transition-colors border border-purple-200"
                >
                  <Shield className="w-4 h-4" /> 
                  Admin
                </Link>
              )}

              {/* User Info & Logout */}
              <div className="hidden sm:flex items-center gap-2 border-l pl-3 ml-1">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <button 
                  onClick={() => logout()} 
                  className="ml-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Logout Only */}
              <button 
                onClick={() => logout()} 
                className="sm:hidden p-2 text-gray-400 hover:text-red-600"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}