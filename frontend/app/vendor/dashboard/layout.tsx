// app/vendor/dashboard/layout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, ClipboardList, Menu, X, UtensilsCrossed, Home } from 'lucide-react';

const sidebarLinks = [
  { name: 'Menu Products', href: '/vendor/dashboard/products', icon: Package },
  { name: 'Incoming Orders', href: '/vendor/dashboard/orders', icon: ClipboardList },
];

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Desktop Sidebar - Fixed on large screens */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-slate-900 text-white">
        <div className="flex items-center h-16 px-6 border-b border-slate-700">
          <UtensilsCrossed className="w-7 h-7 text-orange-400" />
          <span className="ml-3 text-xl font-bold">Vendor Hub</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 m-4 bg-slate-800 rounded-xl">
          <p className="text-xs text-slate-400">Need help?</p>
          <p className="text-sm font-medium text-slate-200 mt-1">Check the docs for managing your store.</p>
        </div>
      </aside>

      {/* Main Content Area - Offset by sidebar width */}
      <main className="flex-1 lg:pl-64">
        {/* Top Mobile Header */}
        <div className="sticky top-0 z-30 lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-gray-900">Vendor Hub</span>
          <Link href="/" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Home className="w-5 h-5" />
          </Link>
        </div>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col">
            <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
              <div className="flex items-center">
                <UtensilsCrossed className="w-7 h-7 text-orange-400" />
                <span className="ml-3 text-xl font-bold">Vendor Hub</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}