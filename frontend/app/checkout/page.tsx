// app/checkout/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2, MapPin, Phone, FileText, CreditCard } from 'lucide-react';
import { checkoutSchema, CheckoutFormData } from './types';
import { useCartStore } from '@/store/cart.store';
import { checkoutApi } from '@/services/checkout-api';
import { useToast } from '@/components/ui/toaster';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, vendorName, subtotal, clearCart, removeItem } = useCartStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const checkoutMutation = useMutation({
    mutationFn: checkoutApi.initializePayment,
    onSuccess: (data) => {
      // Hard redirect to Paystack. This clears all local React state.
      // When the user returns, they will hit the /checkout/verify route.
      window.location.href = data.data.authorization_url;
    },
    onError: (error) => {
      toast(error.message || 'Failed to initialize payment. Please try again.', 'error');
    },
  });

  const onSubmit = (data: CheckoutFormData) => {
    if (items.length === 0) return;
    checkoutMutation.mutate({ items, formData: data });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">You need to add items before checking out.</p>
        <Link href="/" className="mt-6 inline-block bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Delivery Details Form */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Delivery Details</h2>
            
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="+234 800 000 0000"
                  {...register('phone')}
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="address"
                  rows={3}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.address ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Enter your full delivery address..."
                  {...register('address')}
                />
              </div>
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Delivery Notes (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="notes"
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g. Ring the doorbell twice"
                  {...register('notes')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">{vendorName}</p>
            
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-1">
              {items.map((item) => (
                <div key={item.product._id} className="flex items-center gap-3 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                  <button type="button" onClick={() => removeItem(item.product._id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Fee</span>
                <span>Calculated at payment</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t mt-2">
                <span>Total</span>
                <span>${subtotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={checkoutMutation.isPending}
              className="mt-6 w-full flex justify-center items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checkoutMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Initializing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay with Paystack
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}