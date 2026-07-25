// app/(customer)/profile/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Loader2, Save, Package } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/services/api-client';
import { useToast } from '@/components/ui/toaster';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery<ProfileData>({
    queryKey: ['profile'],
    queryFn: () => apiClient.get('/users/profile'),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileData>({
    values: profile || { name: '', email: '', phone: '', address: '' },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProfileData) => apiClient.patch('/users/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast('Profile updated successfully', 'success');
      setIsEditing(false);
    },
    onError: () => toast('Failed to update profile', 'error'),
  });

  const onSubmit = (data: ProfileData) => updateMutation.mutate(data);

  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{profile?.name || user?.name}</h2>
              <p className="text-sm text-gray-500">{profile?.email || user?.email}</p>
            </div>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="text-sm font-medium text-orange-600 hover:text-orange-700">
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input {...register('phone')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="+234..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Delivery Address</label>
              <textarea {...register('address')} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Enter your default address" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { reset(); setIsEditing(false); }} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={updateMutation.isPending} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50">
                {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium text-gray-900">{profile?.phone || 'Not set'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Default Address</span>
              <span className="font-medium text-gray-900 max-w-xs text-right">{profile?.address || 'Not set'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Account Role</span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium capitalize">{user?.role}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Link to Orders */}
      <Link href="/orders" className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">My Orders</h3>
            <p className="text-sm text-gray-500">View your order history and tracking status</p>
          </div>
        </div>
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </Link>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
      <Skeleton className="h-9 w-48" />
      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-52" />
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}