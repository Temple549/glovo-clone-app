// app/(customer)/orders/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { Skeleton } from '@/components/ui/skeleton';

interface Order {
  _id: string;
  total: number;
  status: string;
  vendor: { name: string };
  createdAt: string;
}

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['my-orders'],
    queryFn: () => apiClient.get('/orders'),
  });

  // Safely extract array
  let orderList: Order[] = Array.isArray(orders) ? orders : (orders as any)?.data || [];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'bg-emerald-50 text-emerald-700';
      case 'cancelled': return 'bg-red-50 text-red-700';
      default: return 'bg-orange-50 text-orange-700';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
      </div>

      <div className="space-y-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}

        {!isLoading && orderList.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="font-semibold text-gray-700 text-lg">No orders yet</p>
            <p className="text-gray-500 text-sm mt-1">When you place an order, it will appear here.</p>
          </div>
        )}

        {orderList.map((order) => (
          <Link key={order._id} href={`/orders/${order._id}`} className="block bg-white p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{order.vendor?.name || 'Restaurant'}</p>
                <p className="text-sm text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}