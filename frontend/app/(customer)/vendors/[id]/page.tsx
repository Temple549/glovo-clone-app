// app/(customer)/vendors/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, Clock, MapPin, Plus, Loader2 } from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { Vendor, Product } from '@/types';
import { useCartStore } from '@/store/cart.store';
import { useToast } from '@/components/ui/toaster';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const vendorName = useCartStore((state) => state.vendorName);
  
  const [addingId, setAddingId] = useState<string | null>(null);

  // Fetch single vendor details
  const { data: vendor, isLoading: isVendorLoading } = useQuery<Vendor>({
    queryKey: ['vendor', id],
    queryFn: () => apiClient.get(`/vendors/${id}`),
    enabled: !!id,
  });

  // Fetch vendor's products
  const { data: rawProducts, isLoading: isProductsLoading } = useQuery({
    queryKey: ['vendor-products', id],
    queryFn: () => apiClient.get(`/vendors/${id}/products`),
    enabled: !!id,
  });

  // Safely extract products array (handles backend wrapping)
  let products: Product[] = [];
  if (Array.isArray(rawProducts)) {
    products = rawProducts;
  } else if (rawProducts && typeof rawProducts === 'object' && 'data' in rawProducts) {
    products = (rawProducts as any).data;
  }

  const handleAddToCart = async (product: Product) => {
    setAddingId(product._id);
    
    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const result = addItem(product, vendor?.name || 'Unknown Vendor');
    
    if (result === 'vendor_mismatch') {
      toast(`You have items from ${vendorName} in your cart. Clear your cart to order from ${vendor?.name}.`, 'error');
    } else {
      toast(`${product.name} added to cart`, 'success');
      // Dispatch event to open the cart drawer (listened for in app-shell.tsx)
      window.dispatchEvent(new Event('open-cart-drawer'));
    }
    
    setAddingId(null);
  };

  const isLoading = isVendorLoading || isProductsLoading;

  return (
    <main className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Hero Header */}
      <div className="relative h-64 w-full bg-gray-200">
        {vendor?.image ? (
          <Image 
            src={vendor.image} 
            alt={vendor.name} 
            fill 
            className="object-cover" 
            priority 
          />
        ) : (
          <Skeleton className="h-full w-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link href="/" className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-full text-sm font-medium hover:bg-white transition-colors shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>

        {/* Vendor Info Overlay */}
        {!isVendorLoading && vendor && (
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-extrabold drop-shadow-md">{vendor.name}</h1>
            <p className="text-sm text-gray-200 mt-1 line-clamp-1">{vendor.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm font-medium">
              <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {vendor.rating}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {vendor.deliveryTime}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Delivery
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Menu Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 max-w-4xl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Menu</h2>

        {isProductsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4">
                <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <p className="text-gray-500 text-lg font-medium">No menu items available right now.</p>
            <p className="text-gray-400 text-sm mt-1">Check back later!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product._id} className={`bg-white p-4 rounded-xl border border-gray-100 flex gap-4 transition-all ${!product.isAvailable ? 'opacity-60' : 'hover:shadow-sm'}`}>
                <div className="w-24 h-24 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                  <Image 
                    src={product.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80'} 
                    alt={product.name} 
                    fill 
                    className="object-cover" 
                    sizes="96px"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    
                    {product.isAvailable ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={addingId === product._id}
                        className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors disabled:bg-orange-400"
                      >
                        {addingId === product._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        Add
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded">Unavailable</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}