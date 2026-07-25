// types/vendor.ts

export interface VendorOrder {
  _id: string;
  user: { _id: string; name: string; email: string };
  items: { product: { name: string }; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
  isVerified: boolean;
  createdAt: string;
}