// app/register/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, Lock, Loader2, UtensilsCrossed, User, Store, UserRound } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { apiClient } from '@/services/api-client';
import { useToast } from '@/components/ui/toaster';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  isVendor: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterCredentials = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { toast } = useToast();

  const registerMutation = useMutation({
    mutationFn: (credentials: Omit<RegisterCredentials, 'confirmPassword'>) =>
      apiClient.post('/auth/register', credentials),
    onSuccess: () => {
      toast('Account created successfully! Please log in.', 'success');
    },
    onError: (error: any) => {
      toast(error.message || 'Registration failed. Email might already be in use.', 'error');
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      isVendor: false,
    }
  });

  const isVendor = watch('isVendor');

  const onSubmit = (data: RegisterCredentials) => {
    const { confirmPassword: _, ...payload } = data;
    
    if (payload.isVendor) {
      (payload as any).role = 'vendor';
    }
    
    delete (payload as any).isVendor;
    registerMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <UtensilsCrossed className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose a customer account or open a vendor account for your restaurant.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          <Link href="/register" className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-3 py-2.5 text-sm font-semibold text-white">
            <UserRound className="h-4 w-4" />
            Customer
          </Link>
          <Link href="/vendor/register" className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <Store className="h-4 w-4" />
            Vendor
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          
          {registerMutation.isError && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {registerMutation.error?.message}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  disabled={registerMutation.isPending}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                  {...register('name')}
                />
              </div>
              {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={registerMutation.isPending}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="you@example.com"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  disabled={registerMutation.isPending}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  disabled={registerMutation.isPending}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-center gap-3 pt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input
                id="isVendor"
                type="checkbox"
                checked={isVendor}
                onChange={(e) => setValue('isVendor', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="isVendor" className="text-sm text-gray-700 flex items-center gap-2 cursor-pointer">
                <Store className="w-4 h-4 text-gray-500" />
                I want to register as a <span className="font-semibold text-orange-600">Restaurant Vendor</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-500">
                Sign in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}