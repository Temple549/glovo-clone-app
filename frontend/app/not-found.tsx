// app/not-found.tsx
import Link from 'next/link';
import { UtensilsCrossed } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="p-4 bg-orange-100 rounded-full mb-6">
        <UtensilsCrossed className="w-12 h-12 text-orange-500" />
      </div>
      <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
      <p className="mt-4 text-xl font-medium text-gray-700">Page not found</p>
      <p className="mt-2 text-gray-500 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been removed or the URL might be incorrect.
      </p>
      <Link 
        href="/" 
        className="mt-8 inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
      >
        Back to Homepage
      </Link>
    </div>
  );
}