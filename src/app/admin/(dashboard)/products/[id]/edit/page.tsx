import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlugOrId, getCategories } from '@/lib/dataService';
import { ProductForm } from '@/components/admin/ProductForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProductBySlugOrId(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Edit Product</h1>
        <p className="text-sm text-slate-400 mt-1">
          Update specifications, pricing tiers, and WhatsApp bulk offer settings for {product.title}.
        </p>
      </div>

      <ProductForm
        initialData={JSON.parse(JSON.stringify(product))}
        categories={categories.map((c: any) => ({ name: c.name, slug: c.slug }))}
        isEdit
      />
    </div>
  );
}
