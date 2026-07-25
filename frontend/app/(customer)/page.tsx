// app/(customer)/page.tsx
import { VendorGrid } from '@/components/customer/vendor-grid';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-orange-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-90" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Craving something <br className="hidden sm:block" /> delicious?
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-orange-100 max-w-lg">
              Order from the best local restaurants with easy, on-demand delivery.
            </p>
            {/* In a full app, you'd put a search bar here */}
          </div>
        </div>
      </section>

      {/* Vendor Listing */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Restaurants</h2>
        <VendorGrid />
      </section>
    </main>
  );
}