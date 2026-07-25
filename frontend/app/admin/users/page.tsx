// app/admin/users/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { Shield, ShieldCheck, Mail } from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { AdminUser } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminUsersPage() {
  // In a real app, implement pagination here via query params
  const { data: users, isLoading } = useQuery<AdminUser[]>({
    queryKey: ['admin-users'],
    queryFn: () => apiClient.get('/admin/users'),
  });

  const getRoleBadgeClasses = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-purple-50 text-purple-700 ring-purple-600/20';
      case 'vendor': return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      default: return 'bg-gray-50 text-gray-700 ring-gray-600/20';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase text-gray-500 bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4"><Skeleton className="h-5 w-48" /></td>
                <td className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                <td className="px-6 py-4"><Skeleton className="h-5 w-16" /></td>
                <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                <td className="px-6 py-4"><Skeleton className="h-5 w-20 ml-auto" /></td>
              </tr>
            ))}

            {!isLoading && users?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                  <p className="font-medium text-gray-700">No users found</p>
                </td>
              </tr>
            )}

            {users?.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-gray-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" /> {user.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${getRoleBadgeClasses(user.role)}`}>
                    {user.role === 'admin' && <Shield className="w-3 h-3" />}
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm text-orange-600 hover:text-orange-800 font-medium">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}