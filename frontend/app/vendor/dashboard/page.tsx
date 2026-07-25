// app/vendor/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { Package, ClipboardList, Store } from 'lucide-react';

export default function VendorDashboardHome() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
        <p className="text-gray-500 mt-1">Manage your restaurant, menu, and incoming orders from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Link: Products */}
        <Link 
          href="/vendor/dashboard/products" 
          className="group block bg-white p-6 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all"
        >
          <div className="p-3 bg-orange-50 rounded-xl w-fit mb-4 group-hover:bg-orange-100 transition-colors">
            <Package className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Menu Products</h3>
          <p className="text-sm text-gray-500 mt-1">Add, edit, or remove items from your menu.</p>
        </Link>

        {/* Quick Link: Orders */}
        <Link 
          href="/vendor/dashboard/orders" 
          className="group block bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div className="p-3 bg-blue-50 rounded-xl w-fit mb-4 group-hover:bg-blue-100 transition-colors">
            <ClipboardList className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Incoming Orders</h3>
          <p className="text-sm text-gray-500 mt-1">View new orders and update their status.</p>
        </Link>

        {/* Placeholder: Store Settings */}
        <div className="block bg-white p-6 rounded-2xl border border-gray-200 opacity-50 cursor-not-allowed">
          <div className="p-3 bg-gray-50 rounded-xl w-fit mb-4">
            <Store className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Store Settings</h3>
          <p className="text-sm text-gray-500 mt-1">Update restaurant name, image, and opening hours.</p>
          <span className="text-xs text-gray-400 font-medium mt-2 inline-block bg-gray-100 px-2 py-0.5 rounded">Coming Soon</span>
        </div>
      </div>
    </div>
  );
}