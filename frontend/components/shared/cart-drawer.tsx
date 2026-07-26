// components/shared/cart-drawer.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { X, Minus, Plus, Trash2, AlertTriangle, ShoppingBag, ArrowRight, Lock } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { items, vendorName, subtotal, updateQuantity, removeItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [pendingProduct, setPendingProduct] = useState<{ id: string; name: string; vendorName: string } | null>(null);

  const handleClearAndAdd = () => {
    if (!pendingProduct) return;
    clearCart();
    setPendingProduct(null);
    onClose();
  };

  const handleProceedToCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* Drawer Panel */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 text-orange-500">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Sign in to view your cart</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                Log in or create an account to start adding delicious meals to your basket.
              </p>
              <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors text-center shadow-xs"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-xl text-sm transition-colors text-center"
                >
                  Create Account
                </Link>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-12">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner">
                🛒
              </div>
              <p className="font-bold text-gray-800 text-lg">Your cart is empty</p>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                Explore local vendors and pick your favorite food items to get started!
              </p>
              <button
                onClick={onClose}
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-4 py-2 rounded-full"
              >
                Browse Restaurants <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Ordering from: <span className="text-orange-600">{vendorName}</span>
                </p>
                <button
                  onClick={clearCart}
                  className="text-xs font-medium text-red-500 hover:text-red-700"
                >
                  Clear Cart
                </button>
              </div>
              <div className="space-y-4">
                {items.map((item) => {
                  const imageSrc = item.product.image || item.product.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80';
                  return (
                    <div key={item.product._id} className="flex gap-4 pb-4 border-b border-gray-100 group">
                      <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageSrc} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 truncate">{item.product.name}</h3>
                          <p className="text-sm font-extrabold text-orange-600 mt-0.5">${item.product.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="p-1 hover:bg-gray-200 text-gray-600"><Minus className="w-3.5 h-3.5" /></button>
                            <span className="text-xs font-bold w-7 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="p-1 hover:bg-gray-200 text-gray-600"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                          <button onClick={() => removeItem(item.product._id)} className="ml-auto p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isAuthenticated && items.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-4 bg-gray-50/50">
            <div className="flex justify-between text-base font-extrabold text-gray-900">
              <span>Subtotal</span>
              <span className="text-orange-600">${subtotal().toFixed(2)}</span>
            </div>
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
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