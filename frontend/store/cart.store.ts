// store/cart.store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  vendorId: string | null;
  vendorName: string | null;
  
  // Getters
  itemCount: () => number;
  subtotal: () => number;

  // Actions
  addItem: (product: Product, vendorName: string) => 'success' | 'vendor_mismatch';
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      vendorId: null,
      vendorName: null,

      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      
      subtotal: () => get().items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),

      addItem: (product, vendorName) => {
        const { vendorId, items } = get();
        
        // Enforce One-Vendor-Per-Cart
        if (vendorId && vendorId !== product.vendorId) {
          return 'vendor_mismatch';
        }

        const existingIndex = items.findIndex((i) => i.product._id === product._id);
        
        if (existingIndex > -1) {
          const newItems = [...items];
          newItems[existingIndex].quantity += 1;
          set({ items: newItems, vendorId: product.vendorId, vendorName });
        } else {
          set({ 
            items: [...items, { product, quantity: 1 }], 
            vendorId: product.vendorId, 
            vendorName 
          });
        }
        return 'success';
      },

      removeItem: (productId) => {
        const newItems = get().items.filter((i) => i.product._id !== productId);
        set({ 
          items: newItems,
          // Clear cart entirely if no items left
          vendorId: newItems.length === 0 ? null : get().vendorId,
          vendorName: newItems.length === 0 ? null : get().vendorName
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const newItems = get().items.map((i) =>
          i.product._id === productId ? { ...i, quantity } : i
        );
        set({ items: newItems });
      },

      clearCart: () => set({ items: [], vendorId: null, vendorName: null }),
    }),
    {
      name: 'foodie-cart-storage', // LocalStorage key
    }
  )
);