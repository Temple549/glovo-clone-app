// app/admin/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Store, ClipboardList } from 'lucide-react';

const tabs = [
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Vendors', href: '/admin/vendors', icon: Store },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>
        
        <nav className="flex gap-1 border-b border-gray-200 mb-8">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </Link>
            );
          })}
        </nav>

        {children}
      </div>
    </div>
  );
}