// app/vendor/login/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, Lock, Loader2, Store } from 'lucide-react';
import { loginSchema, LoginCredentials } from '@/types/types';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toaster';

export default function VendorLoginPage() {
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

  useEffect(() => {
    if (isHydrated && isAuthenticated && user) {
      toast('Welcome back to the Hub!', 'success');
      if (user.role === 'vendor') {
        router.push('/vendor/dashboard/products');
      } else {
        // If a customer accidentally ends up here, send them back to the main site
        router.push('/');
      }
    }
  }, [isHydrated, isAuthenticated, user, router, toast]);

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
    } catch (err) {}
  };

  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* Left Side - Branding / Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Store className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Vendor Hub</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Manage your restaurant,<br />
            <span className="text-orange-400">your way.</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-md">
            Update menus in seconds, track incoming orders in real-time, and grow your business on our platform.
          </p>
        </div>
        <p className="text-slate-500 text-sm">© 2024 FoodieXpress Vendor Portal.</p>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="p-2 bg-slate-900 rounded-lg">
              <Store className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-xl font-bold text-slate-900">Vendor Hub</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-8">
            Don't have an account?{' '}
            <Link href="/register" className="text-orange-600 font-medium hover:text-orange-700">
              Sign up
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {loginError && (
              <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {loginError.message}
              </div>
            )}
              
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  disabled={isLoggingIn}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-100 ${errors.email ? 'border-red-300' : 'border-slate-200'}`}
                  placeholder="vendor@restaurant.com"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  disabled={isLoggingIn}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-100 ${errors.password ? 'border-red-300' : 'border-slate-200'}`}
                  placeholder="••••••••"
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          {/* Add this right below the </form> closing tag */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Are you a restaurant owner?{' '}
              <Link href="/vendor/login" className="font-medium text-slate-700 hover:text-slate-900 underline underline-offset-2 transition-colors">
                Log in to Vendor Hub
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

