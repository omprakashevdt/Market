import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { getProductCatalog } from '@/lib/dataService';
import { Search as SearchIcon, PackageX, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}" | CatalogHub` : 'Global Catalog Search | CatalogHub',
    description: `Browse wholesale bulk products matching "${q || ''}" with custom WhatsApp pricing offers.`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', category } = await searchParams;
  const query = q.trim();
  const { products, categories: allCats } = await getProductCatalog({
    search: query,
    category,
    limit: 50,
  });

  const matchingCategories = query
    ? allCats.filter(
        (c: any) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          (c.description && c.description.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm mb-10">
        <form action="/search" method="GET" className="max-w-2xl mx-auto">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">
            Global Marketplace Search
          </label>
          <div className="relative">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by title, category, author, keyword, or SKU..."
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm font-medium"
            />
            <SearchIcon className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
            <button
              type="submit"
              className="absolute right-2 top-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {query && (
          <div className="text-center mt-6 pt-5 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Search results for <span className="text-blue-600">"{query}"</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Found <strong className="text-gray-900">{products.length}</strong> matching products
              {matchingCategories.length > 0 && ` and ${matchingCategories.length} categories`}
            </p>
          </div>
        )}
      </div>

      {/* Matching Categories Pill Bar */}
      {matchingCategories.length > 0 && (
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
            Related Categories:
          </span>
          <div className="flex flex-wrap gap-2">
            {matchingCategories.map((cat: any) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs border border-blue-200 transition"
              >
                {cat.name} →
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Grid */}
      {query ? (
        products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod: any) => (
              <ProductCard key={prod._id.toString()} product={prod} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <PackageX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No products match "{query}"</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
              Check for typos, try broader keywords like "book", "card", or "shirt", or browse all
              products.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/products"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300 p-8">
          <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900">Type a keyword to search</h3>
          <p className="text-xs text-gray-500 mt-1">
            Search our entire catalog of wholesale products, categories, authors, or SKUs.
          </p>
        </div>
      )}
    </div>
  );
}
