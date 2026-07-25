// app/vendor/dashboard/products/components/product-form.tsx
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { productSchema, ProductFormData } from '@/app/vendor/dashboard/products/schema';
import { Product } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorApi } from '@/services/vendor-api';
import { useToast } from '@/components/ui/toaster';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null; 
}

export function ProductForm({ isOpen, onClose, product }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: String(product.price), 
      image: product.image,
      isAvailable: product.isAvailable,
      category: product.category || '',
    } : {
      name: '', 
      description: '', 
      price: '', 
      image: '', 
      isAvailable: true, 
      category: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset(product ? {
        name: product.name, 
        description: product.description, 
        price: String(product.price),
        image: product.image, 
        isAvailable: product.isAvailable, 
        category: product.category || ''
      } : {
        name: '', 
        description: '', 
        price: '', 
        image: '', 
        isAvailable: true, 
        category: ''
      });
    }
  }, [product, isOpen, reset]);

  const mutation = useMutation({
    mutationFn: (data: ProductFormData) =>
      isEditing ? vendorApi.updateProduct(product!._id, data) : vendorApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
      toast(`Product ${isEditing ? 'updated' : 'created'} successfully`, 'success');
      onClose();
    },
    onError: () => {
      toast('Failed to save product. Please try again.', 'error');
    },
  });

  const onSubmit = (data: ProductFormData) => {
    mutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input {...register('name')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea {...register('description')} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input type="number" step="0.01" {...register('price')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input {...register('category')} placeholder="e.g. Burgers" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input {...register('image')} placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input id="isAvailable" type="checkbox" {...register('isAvailable')} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <label htmlFor="isAvailable" className="text-sm text-gray-700">Product is available for ordering</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}