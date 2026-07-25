// app/vendor/dashboard/products/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { vendorApi } from '@/services/vendor-api';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductForm } from './components/product-form';
import { useToast } from '@/components/ui/toaster';

export default function VendorProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['vendor-products'],
    queryFn: vendorApi.getMyProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: vendorApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
      toast('Product deleted', 'success');
    },
  });

  const openCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Your Menu</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Table / List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-gray-500 bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-40" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-16" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-20 ml-auto" /></td>
                </tr>
              ))}

              {!isLoading && products?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                    <p className="text-lg font-medium text-gray-700">No products yet</p>
                    <p className="text-sm mt-1">Click "Add Product" to start building your menu.</p>
                  </td>
                </tr>
              )}

              {products?.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 hidden sm:block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{product.category || 'Uncategorized'}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {product.isAvailable ? 'Available' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(product)} className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteMutation.mutate(product._id)}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={editingProduct} 
      />
    </>
  );
}