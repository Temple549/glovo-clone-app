// app/vendor/register/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, Lock, Loader2, Store, User, MapPin, Utensils, FileText } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { apiClient } from '@/services/api-client';
import { useToast } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';

const vendorRegisterSchema = z.object({
  name: z.string().min(2, 'Owner name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  businessName: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  cuisine: z.string().min(2, 'Cuisine type is required (e.g., Italian, Burgers, Asian)'),
  address: z.string().min(5, 'Full street address is required'),
  description: z.string().min(10, 'Please provide a short description of your restaurant'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type VendorRegisterData = z.infer<typeof vendorRegisterSchema>;

export default function VendorRegisterPage() {
  const { toast } = useToast();
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: (data: VendorRegisterData) => {
      const { confirmPassword: _, ...payload } = data;
      return apiClient.post('/auth/register', {
        ...payload,
        role: 'vendor',
      });
    },
    onSuccess: () => {
      toast('Restaurant Partner account created successfully! Please log in.', 'success');
      router.push('/vendor/login');
    },
    onError: (error: any) => {
      toast(error.message || 'Vendor registration failed. Email might already be registered.', 'error');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VendorRegisterData>({
    resolver: zodResolver(vendorRegisterSchema),
  });

  const onSubmit = (data: VendorRegisterData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left Side - Branding / Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-xl text-white shadow-lg">
              <Store className="w-7 h-7" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">FoodieXpress <span className="text-orange-400">Partner</span></span>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight">
            Expand your restaurant's reach & <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">boost revenue.</span>
          </h2>
          <p className="mt-4 text-slate-300 max-w-md leading-relaxed text-sm">
            Join hundreds of local kitchens and popular spots. Gain access to thousands of hungry food lovers, live order management, and real-time sales tracking.
          </p>

          <div className="mt-10 space-y-4 border-t border-slate-800 pt-8">
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <span>Free restaurant listing & instant onboarding</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Full control over menu items & pricing</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Transparent payout tracking & weekly payouts</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6">
          <p className="text-slate-500 text-xs">© 2024 FoodieXpress Vendor Partner Portal.</p>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-slate-900 overflow-y-auto">
        <div className="w-full max-w-xl bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          
          {/* Top Switcher Banner to Customer Register */}
          <div className="mb-6 p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">Looking to order food instead?</span>
            <Link
              href="/register"
              className="text-xs font-bold text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 px-3 py-1.5 rounded-xl transition-all"
            >
              Customer Signup →
            </Link>
          </div>

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold mb-3">
              <Store className="w-3.5 h-3.5" /> Restaurant Partner Onboarding
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Partner with FoodieXpress</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Fill in your details below to register your restaurant business.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {registerMutation.isError && (
              <div className="p-3 text-xs text-red-400 bg-red-950/60 border border-red-800 rounded-xl">
                {registerMutation.error?.message}
              </div>
            )}

            {/* Section 1: Business Profile */}
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400">Restaurant Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Restaurant Name</label>
                  <div className="relative">
                    <Store className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      disabled={registerMutation.isPending}
                      placeholder="e.g. Mario's Pizzeria"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      {...register('businessName')}
                    />
                  </div>
                  {errors.businessName && <p className="mt-1 text-[11px] text-red-400">{errors.businessName.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cuisine Type</label>
                  <div className="relative">
                    <Utensils className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      disabled={registerMutation.isPending}
                      placeholder="e.g. Italian, Pizza, Burgers"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      {...register('cuisine')}
                    />
                  </div>
                  {errors.cuisine && <p className="mt-1 text-[11px] text-red-400">{errors.cuisine.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Business Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    disabled={registerMutation.isPending}
                    placeholder="e.g. 12 Main St, Downtown"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    {...register('address')}
                  />
                </div>
                {errors.address && <p className="mt-1 text-[11px] text-red-400">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    disabled={registerMutation.isPending}
                    placeholder="e.g. Authentic Woodfired Pizza & Fresh Pasta"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    {...register('description')}
                  />
                </div>
                {errors.description && <p className="mt-1 text-[11px] text-red-400">{errors.description.message}</p>}
              </div>
            </div>

            {/* Section 2: Owner Credentials */}
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400">Account Owner Credentials</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Owner Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    disabled={registerMutation.isPending}
                    placeholder="John Owner"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    {...register('name')}
                  />
                </div>
                {errors.name && <p className="mt-1 text-[11px] text-red-400">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Business Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    disabled={registerMutation.isPending}
                    placeholder="owner@restaurant.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="mt-1 text-[11px] text-red-400">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      disabled={registerMutation.isPending}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      {...register('password')}
                    />
                  </div>
                  {errors.password && <p className="mt-1 text-[11px] text-red-400">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      disabled={registerMutation.isPending}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      {...register('confirmPassword')}
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-[11px] text-red-400">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg cursor-pointer disabled:opacity-60"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Vendor Partner Account...
                </>
              ) : (
                'Register Restaurant & Access Dashboard'
              )}
            </button>
          </form>

          <div className="mt-6 text-center pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Already have a Vendor account?{' '}
              <Link href="/vendor/login" className="font-bold text-orange-400 hover:text-orange-300">
                Log in to Vendor Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
