// app/login/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, Lock, Loader2, UtensilsCrossed, Store, UserRound } from 'lucide-react';
import { loginSchema, LoginCredentials } from '@/types/types';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toaster';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn, loginError, isAuthenticated, isHydrated, user } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  // REDIRECT LOGIC: Watch for authentication state changes
  useEffect(() => {
    // Only redirect if we know the user's auth state (not loading) AND they are logged in
    if (isHydrated && isAuthenticated && user) {
      toast('Welcome back!', 'success');
      
      // Route based on user role
      if (user.role === 'vendor') {
        router.push('/vendor/dashboard/products');
      } else if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/'); // Customers go to home
      }
    }
  }, [isHydrated, isAuthenticated, user, router, toast]);

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
      // The useEffect above will handle the redirect automatically once `isAuthenticated` becomes true!
    } catch (err) {
      // Error is handled by the mutation state and displayed below
    }
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
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in as a customer or continue as a restaurant partner.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          <Link href="/login" className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-3 py-2.5 text-sm font-semibold text-white">
            <UserRound className="h-4 w-4" />
            Customer
          </Link>
          <Link href="/vendor/login" className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <Store className="h-4 w-4" />
            Vendor
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          
          {/* Global Error Display */}
          {loginError && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {loginError.message}
            </div>
          )}

          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={isLoggingIn}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="you@example.com"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  disabled={isLoggingIn}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              New here?{' '}
              <Link href="/register" className="font-semibold text-orange-600 hover:text-orange-500">
                Create customer account
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}