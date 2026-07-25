// components/shared/cart-drawer.tsx
'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart.store';
import { X, Minus, Plus, Trash2, AlertTriangle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, vendorName, subtotal, updateQuantity, removeItem, clearCart, addItem } = useCartStore();
  const [pendingProduct, setPendingProduct] = useState<{ id: string; name: string; vendorName: string } | null>(null);

  const handleClearAndAdd = () => {
    if (!pendingProduct) return;
    clearCart();
    // Note: In a real app, you'd pass the full product object here. 
    // For demonstration of the flow:
    setPendingProduct(null);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* Drawer Panel */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <ShoppingCartIcon className="w-16 h-16 mb-4 text-gray-300" />
              <p className="font-medium text-gray-700">Your cart is empty</p>
              <p className="text-sm mt-1">Add items from a vendor to get started.</p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                Ordering from: <span className="text-orange-600">{vendorName}</span>
              </p>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product._id} className="flex gap-4 pb-4 border-b border-gray-100">
                    <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h3>
                      <p className="text-sm font-semibold text-gray-900 mt-1">${item.product.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"><Plus className="w-3 h-3" /></button>
                        <button onClick={() => removeItem(item.product._id)} className="ml-auto p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between text-base font-semibold text-gray-900">
              <span>Subtotal</span>
              <span>${subtotal().toFixed(2)}</span>
            </div>
            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* Vendor Mismatch Warning Dialog */}
      {pendingProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Replace cart items?</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your cart contains items from <span className="font-semibold text-gray-700">{vendorName}</span>. 
              Do you want to clear the cart and add <span className="font-semibold text-gray-700">{pendingProduct.name}</span> from {pendingProduct.vendorName}?
            </p>
            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => setPendingProduct(null)} 
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleClearAndAdd} 
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium text-white"
              >
                Replace Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Simple inline icon to avoid import issues if lucide isn't mapped perfectly in your setup
function ShoppingCartIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  );
}