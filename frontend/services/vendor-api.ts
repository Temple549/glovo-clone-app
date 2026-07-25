

// services/vendor-api.ts
import { apiClient } from './api-client';
import { Product, VendorOrder } from '@/types'; // CHANGED: removed '/vendor'
import { ProductFormData } from '@/app/vendor/dashboard/products/schema';
// ... rest of the file remains exactly the same

export const vendorApi = {
  // Products
  getMyProducts: () => apiClient.get<Product[]>('/vendors/products'),
  createProduct: (data: ProductFormData) => apiClient.post<Product>('/vendors/products', data),
  updateProduct: (id: string, data: Partial<ProductFormData>) => apiClient.patch<Product>(`/vendors/products/${id}`, data),
  deleteProduct: (id: string) => apiClient.delete(`/vendors/products/${id}`),
  
  // Orders
  getMyOrders: () => apiClient.get<VendorOrder[]>('/vendors/orders'),
  updateOrderStatus: (id: string, status: string) => apiClient.patch(`/vendors/orders/${id}`, { status }),
};