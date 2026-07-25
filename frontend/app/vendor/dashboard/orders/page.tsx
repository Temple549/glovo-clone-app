// app/vendor/dashboard/orders/page.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, ChefHat, Truck, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { vendorApi } from '@/services/vendor-api';
import { VendorOrder } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toaster';
import { useState } from 'react';

export default function VendorOrdersPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data: rawOrders, isLoading } = useQuery({
    queryKey: ['vendor-orders'],
    queryFn: vendorApi.getMyOrders,
  });

  let orders: VendorOrder[] = [];
  if (Array.isArray(rawOrders)) {
    orders = rawOrders;
  } else if (rawOrders && typeof rawOrders === 'object' && 'data' in rawOrders) {
    orders = (rawOrders as any).data;
  }

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      vendorApi.updateOrderStatus(orderId, status),
    onMutate: (variables) => setUpdatingId(variables.orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-orders'] });
      toast('Order status updated!', 'success');
      setUpdatingId(null);
    },
    onError: () => {
      toast('Failed to update order status.', 'error');
      setUpdatingId(null);
    },
  });

  const getNextStatus = (currentStatus: string) => {
    switch(currentStatus) {
      case 'pending': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'delivered';
      default: return null;
    }
  };

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'pending': return { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-700' };
      case 'preparing': return { label: 'Preparing', icon: ChefHat, color: 'bg-blue-100 text-blue-700' };
      case 'ready': return { label: 'Ready', icon: Truck, color: 'bg-purple-100 text-purple-700' };
      case 'delivered': return { label: 'Delivered', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700' };
      case 'cancelled': return { label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-700' };
      default: return { label: status, icon: Clock, color: 'bg-gray-100 text-gray-700' };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800">Incoming Orders</h2>
        <p className="text-sm text-gray-500 mt-1">Manage and update fulfillment status.</p>
      </div>

      {isLoading ? (
        <div className="p-6 space-y-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <p className="font-medium text-gray-700">No orders yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            const nextStatus = getNextStatus(order.status);

            return (
              <div key={order._id} className="p-5 hover:bg-gray-50/50 transition-colors">
                {/* Dense Top Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">#{order._id.slice(-6).toUpperCase()}</span>
                    <span className="text-sm text-gray-600">{order.user.name}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${statusConfig.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig.label}
                  </span>
                </div>

                {/* Items Row */}
                <div className="text-sm text-gray-600 mb-3">
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.quantity}x {item.product.name} {idx < order.items.length - 1 && <span className="text-gray-300 mx-1">•</span>}
                    </span>
                  ))}
                </div>

                {/* Bottom Action Row */}
                <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-200">
                  <span className="text-lg font-extrabold text-gray-900">${order.total.toFixed(2)}</span>
                  
                  <div className="flex items-center gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ orderId: order._id, status: 'cancelled' })}
                        disabled={updatingId === order._id}
                        className="text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-md disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                    
                    {nextStatus && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ orderId: order._id, status: nextStatus })}
                        disabled={updatingId === order._id}
                        className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 px-4 py-1.5 rounded-md disabled:opacity-50 shadow-sm"
                      >
                        {updatingId === order._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                        Next: {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}