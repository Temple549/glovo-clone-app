// components/layout/navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useCartStore } from '@/store/cart.store';
import { UtensilsCrossed, ShoppingCart, LogOut, User, Store, Shield, ClipboardList, Heart } from 'lucide-react';

interface NavbarProps {
  isHydrated?: boolean;
}

export function Navbar({ isHydrated: hydratedProp }: NavbarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, isHydrated: authIsHydrated, logout } = useAuth();
  const itemCount = useCartStore((state) => state.itemCount());
  const isHydrated = hydratedProp ?? authIsHydrated;

  const handleOpenCartDrawer = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event('open-cart-drawer'));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-xl text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
              Foodie<span className="text-orange-600">Xpress</span>
            </span>
          </Link>

          {/* Desktop Navigation Links for Customer */}
          {isHydrated && isAuthenticated && user?.role === 'customer' && (
            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-600">
              <Link
                href="/"
                className={`px-3.5 py-2 rounded-lg transition-colors ${
                  pathname === '/' ? 'text-orange-600 bg-orange-50/80' : 'hover:text-slate-900 hover:bg-gray-100/70'
                }`}
              >
                Explore
              </Link>
              <Link
                href="/orders"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors ${
                  pathname.startsWith('/orders') ? 'text-orange-600 bg-orange-50/80' : 'hover:text-slate-900 hover:bg-gray-100/70'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Orders
              </Link>
              <Link
                href="/profile"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors ${
                  pathname.startsWith('/profile') ? 'text-orange-600 bg-orange-50/80' : 'hover:text-slate-900 hover:bg-gray-100/70'
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
            </nav>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {!isHydrated && (
            <div className="h-9 w-32 bg-gray-100 animate-pulse rounded-xl" />
          )}

          {isHydrated && !isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl px-4 py-2 transition-all shadow-sm"
              >
                Sign up
              </Link>
            </div>
          )}

          {isHydrated && isAuthenticated && user && (
            <>
              {/* Customer: Cart Drawer Button */}
              {user.role === 'customer' && (
                <button
                  onClick={handleOpenCartDrawer}
                  className="relative p-2.5 text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all cursor-pointer"
                  aria-label="Open Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-black text-white shadow-xs">
                      {itemCount}
                    </span>
                  )}
                </button>
              )}

              {/* VENDOR: Dashboard Button */}
              {user.role === 'vendor' && (
                <Link 
                  href="/vendor/dashboard/products" 
                  className="flex items-center gap-2 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl px-4 py-2 transition-colors border border-blue-200"
                >
                  <Store className="w-4 h-4" /> 
                  Dashboard
                </Link>
              )}
              
              {/* ADMIN: Purple Admin Button */}
              {user.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="flex items-center gap-2 text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl px-4 py-2 transition-colors border border-purple-200"
                >
                  <Shield className="w-4 h-4" /> 
                  Admin
                </Link>
              )}

              {/* User Info & Logout */}
              <div className="hidden sm:flex items-center gap-3 border-l border-gray-200 pl-4 ml-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{user.name}</span>
                </div>
                <button 
                  onClick={() => logout()} 
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="w-4.5 h-4.5" />
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