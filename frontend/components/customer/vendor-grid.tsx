// components/customer/vendor-grid.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock } from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { Vendor } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export function VendorGrid() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => apiClient.get('/vendors'),
  });

  // Define a type for potential backend wrappers
  type VendorResponse = Vendor[] | { data: Vendor[] } | { vendors: Vendor[] };

  // SAFELY EXTRACT THE ARRAY
  let vendors: Vendor[] = [];
  const res = data as VendorResponse | undefined;

  if (Array.isArray(res)) {
    vendors = res;
  } else if (res && typeof res === 'object' && 'data' in res) {
    vendors = res.data;
  } else if (res && typeof res === 'object' && 'vendors' in res) {
    vendors = res.vendors;
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="font-medium">Failed to load vendors.</p>
        <p className="text-sm mt-1">Please try again later.</p>
      </div>
    );
  }

  if (!isLoading && vendors.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-5xl mb-4">🍕</p>
        <p className="font-semibold text-gray-700 text-lg">No vendors found</p>
        <p className="text-sm mt-1">Check back later for new additions!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => <VendorCardSkeleton key={i} />)
        : vendors.map((vendor) => <VendorCard key={vendor._id} vendor={vendor} />)
      }
    </div>
  );
}
function VendorCard({ vendor }: { vendor: Vendor }) {
  // Fallback image if empty
  const imageSrc = vendor.image && vendor.image.trim() !== '' 
    ? vendor.image 
    : 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80'; 

  const altText: string = vendor?.name || 'Restaurant image';

  return (
    // THIS <Link> IS WHAT MAKES THE WHOLE CARD CLICKABLE
    <Link href={`/vendors/${vendor._id}`} className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-300">
      <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
        <Image 
          src={imageSrc} 
          alt={altText} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {!vendor.isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 font-semibold px-3 py-1 rounded-full text-sm">Closed</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 truncate text-lg">{vendor.name}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{vendor.description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1 font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" /> {vendor.rating}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {vendor.deliveryTime}
            </span>
          </div>
          
          {/* EXPLICIT CLICKABLE BUTTON SO USERS KNOW WHERE TO CLICK */}
          <span className="text-xs font-semibold text-orange-600 group-hover:text-orange-700 flex items-center gap-1">
            View Menu
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
// THIS IS THE MISSING FUNCTION THAT WAS CAUSING THE ERROR
function VendorCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <Skeleton className="h-40 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}