import React from 'react';
import { getCategories } from '@/lib/dataService';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Create New Product</h1>
        <p className="text-sm text-slate-400 mt-1">
          Add a product with base pricing, generic bulk tiers, and customer offer capabilities.
        </p>
      </div>

      <ProductForm categories={categories.map((c: any) => ({ name: c.name, slug: c.slug }))} />
    </div>
  );
}
