// services/checkout-api.ts

import { apiClient } from './api-client';
import { CheckoutFormData, PaystackResponse } from '@/app/checkout/types';
import { CartItem } from '@/types';

interface InitCheckoutPayload {
  items: CartItem[];
  formData: CheckoutFormData;
}

export const checkoutApi = {
  initializePayment: (payload: InitCheckoutPayload) =>
    apiClient.post<PaystackResponse>('/checkout/pay', payload),

  verifyPayment: (reference: string) =>
    apiClient.get<{ message: string; orderId: string }>(`/checkout/verify?reference=${reference}`),
};