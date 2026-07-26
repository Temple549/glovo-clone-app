// app/(customer)/vendors/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, Clock, MapPin, Plus, Loader2, Utensils } from 'lucide-react';
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
  const currentCartVendorName = useCartStore((state) => state.vendorName);
  
  const [addingId, setAddingId] = useState<string | null>(null);

  // Fetch single vendor details
  const { data: rawVendor, isLoading: isVendorLoading } = useQuery<any>({
    queryKey: ['vendor', id],
    queryFn: () => apiClient.get(`/vendors/${id}`),
    enabled: !!id,
  });

  const vendor: Vendor | undefined = rawVendor?.data || rawVendor;

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

  // Group products by category
  const categories = Array.from(new Set(products.map((p) => p.category || 'General Menu')));

  const vendorDisplayName = vendor?.name || vendor?.businessName || 'Restaurant';
  const vendorImage = (vendor?.image || vendor?.imageUrl)?.trim() || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80';
  const vendorRating = vendor?.rating ?? 4.8;
  const vendorDeliveryTime = vendor?.deliveryTime ?? '25-35 min';

  const handleAddToCart = async (product: Product) => {
    setAddingId(product._id);
    await new Promise((resolve) => setTimeout(resolve, 250));
    
    const result = addItem(product, vendorDisplayName);
    
    if (result === 'vendor_mismatch') {
      toast(`You have items from ${currentCartVendorName} in your cart. Clear your cart to order from ${vendorDisplayName}.`, 'error');
    } else {
      toast(`${product.name} added to cart`, 'success');
      window.dispatchEvent(new Event('open-cart-drawer'));
    }
    
    setAddingId(null);
  };

  return (
    <main className="min-h-screen bg-gray-50/70 pb-20 md:pb-12">
      {/* Hero Header */}
      <div className="relative h-72 sm:h-80 w-full bg-slate-900">
        <Image 
          src={vendorImage} 
          alt={vendorDisplayName} 
          fill 
          className="object-cover opacity-80" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Link href="/" className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-gray-900 px-4 py-2 rounded-full text-xs font-bold hover:bg-white transition-all shadow-md">
            <ArrowLeft className="w-4 h-4" /> Back to Restaurants
          </Link>
        </div>

        {/* Vendor Info Overlay */}
        {!isVendorLoading && vendor && (
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white container mx-auto max-w-4xl">
            <div className="inline-block px-3 py-1 rounded-md bg-orange-600/90 text-white font-bold text-xs mb-2">
              {vendor.cuisine || 'Restaurant'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black drop-shadow-sm tracking-tight">{vendorDisplayName}</h1>
            <p className="text-sm text-gray-200 mt-1 max-w-2xl line-clamp-2">{vendor.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-semibold">
              <span className="flex items-center gap-1 bg-white/15 backdrop-blur-md px-3 py-1 rounded-lg text-amber-300">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {vendorRating} Rating
              </span>
              <span className="flex items-center gap-1 bg-white/15 backdrop-blur-md px-3 py-1 rounded-lg text-white">
                <Clock className="w-4 h-4 text-orange-400" /> {vendorDeliveryTime}
              </span>
              {vendor.address && (
                <span className="flex items-center gap-1 bg-white/15 backdrop-blur-md px-3 py-1 rounded-lg text-gray-200">
                  <MapPin className="w-4 h-4 text-red-400" /> {vendor.address}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Menu Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Utensils className="w-6 h-6 text-orange-600" /> Menu
          </h2>
          <span className="text-xs font-bold text-gray-500 bg-gray-200/60 px-3 py-1 rounded-full">
            {products.length} Items
          </span>
        </div>

        {isProductsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4">
                <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xs">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🍽️
            </div>
            <h3 className="text-lg font-bold text-gray-900">No menu items added yet</h3>
            <p className="text-gray-500 text-sm mt-1">Check back later for update on this restaurant's menu.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((catName) => {
              const categoryProducts = products.filter((p) => (p.category || 'General Menu') === catName);
              return (
                <div key={catName}>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 pl-1 border-l-4 border-orange-500 capitalize">
                    {catName}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryProducts.map((product) => {
                      const productImage = (product.image || product.imageUrl)?.trim() || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80';
                      return (
                        <div
                          key={product._id}
                          className={`bg-white p-4 rounded-2xl border border-gray-100 flex gap-4 transition-all duration-200 ${
                            !product.isAvailable ? 'opacity-60' : 'hover:shadow-md hover:border-orange-200'
                          }`}
                        >
                          <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative">
                            <Image 
                              src={productImage} 
                              alt={product.name} 
                              fill 
                              className="object-cover" 
                              sizes="96px"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900 truncate text-base">{product.name}</h4>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                              <span className="font-black text-gray-900 text-base">${product.price.toFixed(2)}</span>
                              
                              {product.isAvailable ? (
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  disabled={addingId === product._id}
                                  className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-xs disabled:bg-orange-400 cursor-pointer"
                                >
                                  {addingId === product._id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Plus className="w-3.5 h-3.5" />
                                  )}
                                  Add
                                </button>
                              ) : (
                                <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg">Sold Out</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}