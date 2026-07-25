// app/admin/page.tsx
'use client';

import Link from 'next/link';
import { Users, Store, ClipboardList, ShieldAlert } from 'lucide-react';

export default function AdminHomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
        <p className="text-gray-500 mt-1">Monitor users, manage vendor applications, and oversee all platform orders.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/users" className="group block bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
          <div className="p-3 bg-blue-50 rounded-xl w-fit mb-4 group-hover:bg-blue-100 transition-colors">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Users</h3>
          <p className="text-sm text-gray-500 mt-1">View and manage customer accounts.</p>
        </Link>

        <Link href="/admin/vendors" className="group block bg-white p-6 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all">
          <div className="p-3 bg-orange-50 rounded-xl w-fit mb-4 group-hover:bg-orange-100 transition-colors">
            <Store className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Vendors</h3>
          <p className="text-sm text-gray-500 mt-1">Approve applications or suspend stores.</p>
        </Link>

        <Link href="/admin/orders" className="group block bg-white p-6 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
          <div className="p-3 bg-purple-50 rounded-xl w-fit mb-4 group-hover:bg-purple-100 transition-colors">
            <ClipboardList className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">All Orders</h3>
          <p className="text-sm text-gray-500 mt-1">Track platform-wide order volume.</p>
        </Link>
      </div>
      
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
        <ShieldAlert className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-amber-800">Admin Privileges</h4>
          <p className="text-sm text-amber-700 mt-1">Actions taken here affect all users and vendors on the platform instantly.</p>
        </div>
      </div>
    </div>
  );
}