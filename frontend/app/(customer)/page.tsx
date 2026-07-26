// app/(customer)/page.tsx
'use client';

import { useState } from 'react';
import { Search, Sparkles, Clock, ShieldCheck, Flame, X } from 'lucide-react';
import { VendorGrid } from '@/components/customer/vendor-grid';

const CATEGORIES = [
  { id: 'all', label: 'All Cuisines', icon: '🍽️' },
  { id: 'pizza', label: 'Pizza & Italian', icon: '🍕' },
  { id: 'burger', label: 'Burgers & Fast Food', icon: '🍔' },
  { id: 'asian', label: 'Asian & Sushi', icon: '🍜' },
  { id: 'african', label: 'African & Local', icon: '🍲' },
  { id: 'dessert', label: 'Sweets & Bakery', icon: '🍰' },
  { id: 'healthy', label: 'Healthy & Vegan', icon: '🥗' },
  { id: 'drinks', label: 'Drinks & Coffee', icon: '🧋' },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <main className="min-h-screen bg-gray-50/60 pb-16">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 text-white">
        {/* Ambient glow backgrounds */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Animated Food Emblems */}
        <div className="hidden lg:block absolute top-12 right-20 text-6xl animate-float opacity-85 select-none pointer-events-none drop-shadow-xl">
          🍕
        </div>
        <div className="hidden lg:block absolute bottom-16 right-72 text-5xl animate-float-reverse opacity-80 select-none pointer-events-none drop-shadow-xl">
          🍔
        </div>
        <div className="hidden lg:block absolute top-36 right-1/3 text-4xl animate-float opacity-75 select-none pointer-events-none drop-shadow-md">
          🍜
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-orange-300 text-xs sm:text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4 text-orange-400 animate-spin-slow" />
              <span>Fastest Food Delivery in Town</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Craving something <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                extraordinary?
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Discover top-rated local kitchens, artisanal bakeries, and gourmet spots. Freshly cooked, delivered fast to your doorstep.
            </p>

            {/* Interactive Search Bar */}
            <div className="mt-8 max-w-xl">
              <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl transition-all focus-within:ring-4 focus-within:ring-orange-500/30">
                <Search className="w-6 h-6 text-gray-400 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants, cuisines, or dishes..."
                  className="w-full px-3 py-2.5 text-gray-900 placeholder-gray-400 bg-transparent text-sm sm:text-base focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors mr-1"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md text-sm flex-shrink-0"
                >
                  <Flame className="w-4 h-4 fill-white" />
                  Find Food
                </button>
              </div>
            </div>

            {/* Platform Highlights */}
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg border-t border-white/10 pt-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">30 Min Avg</p>
                  <p className="text-[11px] text-slate-400">Superfast delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Verified</p>
                  <p className="text-[11px] text-slate-400">Quality hygiene</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">4.8★ Rated</p>
                  <p className="text-[11px] text-slate-400">Happy foodies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md scale-102'
                      : 'bg-gray-100 hover:bg-gray-200/80 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Restaurant Grid Listing */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {activeCategory === 'all' ? 'Popular Restaurants' : `${CATEGORIES.find(c => c.id === activeCategory)?.label}`}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {searchQuery ? `Search results for "${searchQuery}"` : 'Handpicked places with top ratings'}
            </p>
          </div>
          {(searchQuery || activeCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 self-start sm:self-auto"
            >
              Reset Filters
            </button>
          )}
        </div>

        <VendorGrid searchQuery={searchQuery} activeCategory={activeCategory} />
      </section>
    </main>
  );
}