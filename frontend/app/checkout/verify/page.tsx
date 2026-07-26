// app/checkout/verify/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { checkoutApi } from '@/services/checkout-api';
import { useCartStore } from '@/store/cart.store';
import { useToast } from '@/components/ui/toaster';
import { useState } from 'react';

export default function VerifyPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const reference = searchParams.get('reference');

  const verifyMutation = useMutation({
    mutationFn: () => checkoutApi.verifyPayment(reference!),
    onSuccess: (data) => {
      setStatus('success');
      clearCart(); // Empty the local cart
      toast('Payment successful! Order placed.', 'success');
      // Redirect to order details or order history after a short delay
      setTimeout(() => {
        router.push(`/orders/${data.data.orderId}`);
      }, 2000);
    },
    onError: () => {
      setStatus('error');
      toast('Payment verification failed. Please contact support.', 'error');
    },
  });

  useEffect(() => {
    if (reference) {
      verifyMutation.mutate();
    } else {
      setStatus('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900">Verifying Payment...</h2>
            <p className="text-gray-500 mt-2">Please wait while we confirm your transaction with Paystack.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="text-gray-500 mt-2">Redirecting you to your order details...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
            <p className="text-gray-500 mt-2 mb-6">We couldn't verify your payment. If you were charged, please contact support.</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}