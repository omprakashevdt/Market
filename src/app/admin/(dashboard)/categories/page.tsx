import React from 'react';
import { getCategories } from '@/lib/dataService';
import { CategoryManager } from './CategoryManager';

export default async function AdminCategoriesPage() {
  const categoriesWithCount = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Category Taxonomy</h1>
        <p className="text-sm text-slate-400 mt-1">
          Add and manage dynamic product categories displayed on the customer catalog and search.
        </p>
      </div>

      <CategoryManager categories={categoriesWithCount} />
    </div>
  );
}
