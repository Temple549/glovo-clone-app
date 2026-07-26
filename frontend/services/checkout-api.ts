// services/checkout-api.ts

import { apiClient } from './api-client';
import { CheckoutFormData, PaystackResponse } from '@/app/checkout/types';
import { CartItem } from '@/types';

interface InitCheckoutPayload {
  items: CartItem[];
  formData: CheckoutFormData;
}

interface VerifyResponse {
  success: boolean;
  data: {
    orderId: string;
  };
  message: string;
}

export const checkoutApi = {
  initializePayment: (payload: InitCheckoutPayload) => {
    // Transform frontend payload to backend-expected format
    const body = {
      deliveryAddress: payload.formData.address,
      customerContact: payload.formData.phone,
    };
    return apiClient.post<PaystackResponse>('/checkout/pay', body);
  },

  verifyPayment: (reference: string) =>
    apiClient.get<VerifyResponse>(`/checkout/verify?reference=${reference}`),
};