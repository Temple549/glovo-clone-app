// app/admin/vendors/page.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Ban, Loader2, Store } from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toaster';
import { useState } from 'react';

interface AdminVendor {
  _id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'suspended';
  restaurantName: string;
  createdAt: string;
}

export default function AdminVendorsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const { data: rawVendors, isLoading } = useQuery({
    queryKey: ['admin-vendors'],
    queryFn: () => apiClient.get('/admin/vendors'),
  });

  // Safely extract array
  let vendors: AdminVendor[] = [];
  if (Array.isArray(rawVendors)) {
    vendors = rawVendors;
  } else if (rawVendors && typeof rawVendors === 'object' && 'data' in rawVendors) {
    vendors = (rawVendors as any).data;
  }

  const updateStatusMutation = useMutation({
    mutationFn: ({ vendorId, status }: { vendorId: string; status: string }) =>
      apiClient.patch(`/admin/vendors/${vendorId}`, { status }),
    onMutate: (variables) => setActionLoadingId(variables.vendorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      toast('Vendor status updated successfully', 'success');
      setActionLoadingId(null);
    },
    onError: () => {
      toast('Failed to update vendor status', 'error');
      setActionLoadingId(null);
    },
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      case 'suspended': return 'bg-red-50 text-red-700 ring-red-600/20';
      case 'pending': return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
      default: return 'bg-gray-50 text-gray-700 ring-gray-600/20';
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Vendor Management</h2>
          <p className="text-sm text-gray-500 mt-1">Review applications and manage vendor access.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-gray-500 bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">Vendor / Restaurant</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-48" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-20 ml-auto" /></td>
                </tr>
              ))}

              {!isLoading && vendors.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                    <Store className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium text-gray-700">No vendor applications found</p>
                  </td>
                </tr>
              )}

              {vendors.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{vendor.name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{vendor.email}</div>
                      <div className="text-orange-600 font-medium text-xs mt-1">{vendor.restaurantName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusBadge(vendor.status)}`}>
                      {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Show Approve button if pending */}
                      {vendor.status === 'pending' && (
                        <button 
                          onClick={() => updateStatusMutation.mutate({ vendorId: vendor._id, status: 'approved' })}
                          disabled={actionLoadingId === vendor._id}
                          className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg disabled:opacity-50"
                        >
                          {actionLoadingId === vendor._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                          Approve
                        </button>
                      )}

                      {/* Show Reject button if pending */}
                      {vendor.status === 'pending' && (
                        <button 
                          onClick={() => updateStatusMutation.mutate({ vendorId: vendor._id, status: 'suspended' })}
                          disabled={actionLoadingId === vendor._id}
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg disabled:opacity-50"
                        >
                          <XCircle className="w-3 h-3" />
                          Reject
                        </button>
                      )}

                      {/* Show Suspend button if approved */}
                      {vendor.status === 'approved' && (
                        <button 
                          onClick={() => updateStatusMutation.mutate({ vendorId: vendor._id, status: 'suspended' })}
                          disabled={actionLoadingId === vendor._id}
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg disabled:opacity-50"
                        >
                          {actionLoadingId === vendor._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Ban className="w-3 h-3" />}
                          Suspend
                        </button>
                      )}

                      {/* Show Reactivate button if suspended */}
                      {vendor.status === 'suspended' && (
                        <button 
                          onClick={() => updateStatusMutation.mutate({ vendorId: vendor._id, status: 'approved' })}
                          disabled={actionLoadingId === vendor._id}
                          className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg disabled:opacity-50"
                        >
                          {actionLoadingId === vendor._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                          Reactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}