// app/vendor/login/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, Lock, Loader2, Store, ArrowRight } from 'lucide-react';
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
      toast('Welcome back to the Vendor Portal!', 'success');
      if (user.role === 'vendor') {
        router.push('/vendor/dashboard/products');
      } else if (user.role === 'admin') {
        router.push('/admin');
      } else {
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
    <div className="min-h-screen flex bg-slate-950">
      {/* Left Side - Branding / Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-xl text-white shadow-lg">
              <Store className="w-7 h-7" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">FoodieXpress <span className="text-orange-400">Vendor</span></span>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight">
            Manage your restaurant & <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">grow sales.</span>
          </h2>
          <p className="mt-4 text-slate-300 max-w-md text-sm leading-relaxed">
            Update menus in seconds, track incoming customer orders in real-time, and monitor revenue with your vendor dashboard.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-slate-500 text-xs">© 2024 FoodieXpress Vendor Portal.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-slate-900">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          
          {/* Top Switcher Banner to Customer Login */}
          <div className="mb-6 p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">Looking to order food?</span>
            <Link
              href="/login"
              className="text-xs font-bold text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 px-3 py-1.5 rounded-xl transition-all"
            >
              Customer Login →
            </Link>
          </div>

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold mb-3">
              <Store className="w-3.5 h-3.5" /> Vendor Partner Portal
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Vendor Portal Login</h1>
            <p className="text-slate-400 text-xs mt-1">
              Sign in to manage your products, orders, and restaurant settings.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {loginError && (
              <div className="p-3 text-xs text-red-400 bg-red-950/60 border border-red-800 rounded-xl">
                {loginError.message}
              </div>
            )}
              
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Business Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  disabled={isLoggingIn}
                  className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-800 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.email ? 'border-red-500' : 'border-slate-700'}`}
                  placeholder="vendor@restaurant.com"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="mt-1 text-[11px] text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  disabled={isLoggingIn}
                  className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-800 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.password ? 'border-red-500' : 'border-slate-700'}`}
                  placeholder="••••••••"
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="mt-1 text-[11px] text-red-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg cursor-pointer disabled:opacity-60"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Accessing Dashboard...
                </>
              ) : (
                <>
                  <span>Log In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              New restaurant partner?{' '}
              <Link href="/vendor/register" className="font-bold text-orange-400 hover:text-orange-300">
                Register Your Restaurant
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


