// app/vendor/dashboard/products/schema.ts

import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description too long'),
  price: z.string()
    .min(1, 'Price is required')
    .transform((val, ctx) => {
      const parsed = parseFloat(val);
      if (isNaN(parsed) || parsed <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Price must be a valid number greater than 0',
        });
        return z.NEVER; // Stops validation if it fails
      }
      return parsed;
    }),
  image: z.string().url('Must be a valid image URL'),
  isAvailable: z.boolean().default(true),
  category: z.string().min(1, 'Category is required'),
});

// Properly exporting the inferred type directly from the schema
export type ProductFormData = z.infer<typeof productSchema>;