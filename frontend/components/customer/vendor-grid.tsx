// components/customer/vendor-grid.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, AlertCircle, Utensils, MapPin, ChevronRight } from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { Vendor } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface VendorGridProps {
  searchQuery?: string;
  activeCategory?: string;
}

export function VendorGrid({ searchQuery = '', activeCategory = 'all' }: VendorGridProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => apiClient.get('/vendors'),
  });

  // Define a type for potential backend wrappers
  type VendorResponse = Vendor[] | { data: Vendor[] } | { vendors: Vendor[] };

  // SAFELY EXTRACT THE ARRAY
  let rawVendors: Vendor[] = [];
  const res = data as VendorResponse | undefined;

  if (Array.isArray(res)) {
    rawVendors = res;
  } else if (res && typeof res === 'object' && 'data' in res) {
    rawVendors = res.data;
  } else if (res && typeof res === 'object' && 'vendors' in res) {
    rawVendors = res.vendors;
  }

  // Filter vendors based on search query & active category
  const filteredVendors = rawVendors.filter((vendor) => {
    const vName = (vendor.name || vendor.businessName || '').toLowerCase();
    const vDesc = (vendor.description || '').toLowerCase();
    const vCuisine = (vendor.cuisine || '').toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !query ||
      vName.includes(query) ||
      vDesc.includes(query) ||
      vCuisine.includes(query);

    let matchesCategory = true;
    if (activeCategory !== 'all') {
      matchesCategory =
        vCuisine.includes(activeCategory) ||
        vName.includes(activeCategory) ||
        vDesc.includes(activeCategory);
    }

    return matchesSearch && matchesCategory;
  });

  if (isError) {
    return (
      <div className="bg-white rounded-3xl border border-red-100 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-500">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Couldn't load restaurants</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
          We encountered an issue fetching vendor data. Please check your connection or try again.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!isLoading && filteredVendors.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-10 sm:p-16 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🔍
        </div>
        <h3 className="text-lg font-bold text-gray-900">No restaurants match your search</h3>
        <p className="text-sm text-gray-500 mt-1">
          {searchQuery
            ? `No vendors found for "${searchQuery}". Try different keywords or reset filters.`
            : 'No restaurants available in this category right now.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => <VendorCardSkeleton key={i} />)
        : filteredVendors.map((vendor) => <VendorCard key={vendor._id} vendor={vendor} />)}
    </div>
  );
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  const vendorDisplayName = vendor.name || vendor.businessName || 'Restaurant';
  const imageSrc =
    (vendor.image || vendor.imageUrl)?.trim() ||
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80';

  const rating = vendor.rating ?? 4.8;
  const deliveryTime = vendor.deliveryTime ?? '25-35 min';
  const cuisine = vendor.cuisine || 'International';

  return (
    <Link
      href={`/vendors/${vendor._id}`}
      className="group flex flex-col bg-white rounded-2xl shadow-xs border border-gray-100/80 overflow-hidden hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
        <Image
          src={imageSrc}
          alt={vendorDisplayName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="bg-white/90 backdrop-blur-md text-gray-900 font-semibold px-2.5 py-1 rounded-full text-xs shadow-xs">
            {cuisine}
          </span>
        </div>

        {!vendor.isOpen && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold px-3.5 py-1 rounded-full text-xs shadow-md">
              Closed Now
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-gray-900 truncate text-base group-hover:text-orange-600 transition-colors">
              {vendorDisplayName}
            </h3>
            <span className="flex items-center gap-1 font-bold text-xs text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-lg flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {rating}
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {vendor.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" /> {deliveryTime}
          </span>

          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-orange-600 group-hover:text-orange-700 group-hover:translate-x-0.5 transition-all">
            View Menu <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function VendorCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <Skeleton className="h-44 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
        <div className="pt-2 border-t border-gray-100 flex justify-between">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-16" />
        </div>
      </div>
    </div>
  );
}