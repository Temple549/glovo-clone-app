// app/checkout/types.ts

import { z } from 'zod';

export const checkoutSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[\d\s-]{10,15}$/, 'Please enter a valid phone number'),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address is too long'),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export interface PaystackResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}