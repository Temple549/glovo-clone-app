// types/index.ts

export interface Vendor {
  _id: string;
  name?: string;
  businessName?: string;
  description: string;
  image?: string;
  imageUrl?: string;
  cuisine?: string;
  address?: string;
  deliveryTime?: string;
  rating?: number;
  isOpen: boolean;
}

export interface Product {
  _id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  imageUrl?: string;
  isAvailable: boolean;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

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