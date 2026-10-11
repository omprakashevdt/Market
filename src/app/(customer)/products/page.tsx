import React from 'react';
import { Metadata } from 'next';
import { ProductCard } from '@/components/product/ProductCard';
import { getProductCatalog } from '@/lib/dataService';
import Link from 'next/link';
import { Filter, SlidersHorizontal, PackageX } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Products Catalog & Bulk Wholesale Deals',
  description:
    'Browse our comprehensive catalog of books, custom printing, merchandise, and stationery. Enjoy volume tier discounts and custom WhatsApp offers.',
};

export const dynamic = 'force-dynamic';

interface SearchParams {
  category?: string;
  q?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  const category = params.category;
  const search = params.q;
  const sort = params.sort || 'newest';
  const minPrice = params.minPrice;
  const maxPrice = params.maxPrice;
  const page = parseInt(params.page || '1', 10);
  const limit = 12;

  const { products, total, categories } = await getProductCatalog({
    category,
    search,
    sort,
    minPrice,
    maxPrice,
    page,
    limit,
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title & Breadcrumbs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Catalog</span>
          {category && (
            <>
              <span>/</span>
              <span className="text-blue-600 capitalize">{category}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          {category ? `${category} Products` : 'All Products Catalog'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Showing {products.length} of {total} products available for volume enquiry & custom offers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 pb-4 border-b border-gray-100">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filter Catalog</span>
            </div>

            {/* Category Filter */}
            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Categories
              </h4>
              <div className="space-y-1.5">
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(sort ? { sort } : {}),
                    ...(search ? { q: search } : {}),
                  }).toString()}`}
                  className={`block px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    !category || category === 'all'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Categories ({total})
                </Link>

                {categories.map((cat: any) => (
                  <Link
                    key={cat.slug}
                    href={`/products?${new URLSearchParams({
                      category: cat.name,
                      ...(sort ? { sort } : {}),
                      ...(search ? { q: search } : {}),
                    }).toString()}`}
                    className={`block px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      category && category.toLowerCase() === cat.name.toLowerCase()
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Price Filter Links */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Price Range
              </h4>
              <div className="space-y-1.5 text-xs">
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    maxPrice: '300',
                  }).toString()}`}
                  className="block px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Under ₹300
                </Link>
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    minPrice: '300',
                    maxPrice: '500',
                  }).toString()}`}
                  className="block px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  ₹300 – ₹500
                </Link>
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    minPrice: '500',
                  }).toString()}`}
                  className="block px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Above ₹500
                </Link>
              </div>
            </div>

            {/* Clear Filters */}
            {(category || search || minPrice || maxPrice) && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  href="/products"
                  className="block text-center text-xs font-bold text-red-600 hover:text-red-700 py-1.5"
                >
                  Reset All Filters
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Products Grid & Sorting */}
        <section className="lg:col-span-9">
          {/* Top Sort Controls */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500 font-medium">
              Found <strong className="text-gray-900">{total}</strong> products
            </span>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-gray-600">Sort By:</span>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    ...(search ? { q: search } : {}),
                    sort: 'newest',
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    sort === 'newest' ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Newest
                </Link>
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    ...(search ? { q: search } : {}),
                    sort: 'price-asc',
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    sort === 'price-asc' ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Price: Low to High
                </Link>
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    ...(search ? { q: search } : {}),
                    sort: 'price-desc',
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    sort === 'price-desc' ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Price: High to Low
                </Link>
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    ...(search ? { q: search } : {}),
                    sort: 'popular',
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    sort === 'popular' ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Popular
                </Link>
              </div>
            </div>
          </div>

          {/* Products List or Empty State */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod: any) => (
                <ProductCard key={prod._id.toString()} product={prod} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Products Found</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                No catalog items matched your selected filters or search terms. Try clearing your
                filters or search for another keyword.
              </p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition inline-block"
                >
                  View All Products
                </Link>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isCurrent = pageNum === page;
                return (
                  <Link
                    key={pageNum}
                    href={`/products?${new URLSearchParams({
                      ...(category ? { category } : {}),
                      ...(search ? { q: search } : {}),
                      ...(sort ? { sort } : {}),
                      page: pageNum.toString(),
                    }).toString()}`}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
