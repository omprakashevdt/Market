import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProductCatalog } from '@/lib/dataService';
import { Plus, Search, Edit, ExternalLink, Sparkles } from 'lucide-react';
import { AdminProductDeleteButton } from './DeleteButton';

interface Props {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const { q = '', category = '', page = '1' } = await searchParams;

  const pageNum = parseInt(page, 10);
  const limit = 15;

  const { products, total, categories } = await getProductCatalog({
    search: q,
    category,
    page: pageNum,
    limit,
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Product Catalog</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage wholesale catalog items, bulk tiers, and customer offer parameters.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <form action="/admin/products" method="GET" className="relative w-full md:w-80">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by title, SKU, category..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-semibold">Category:</span>
          <div className="flex flex-wrap gap-1">
            <Link
              href="/admin/products"
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                !category || category === 'all'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              All
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.slug}
                href={`/admin/products?category=${encodeURIComponent(cat.name)}`}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                  category.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/40 text-[11px] text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Listed Price</th>
                <th className="px-6 py-4">Bulk Tiers</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {products.length > 0 ? (
                products.map((prod: any) => (
                  <tr key={prod._id.toString()} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                          <Image
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                            alt={prod.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            {prod.title}
                            {prod.featured && (
                              <span className="p-1 rounded bg-amber-500/20 text-amber-400 text-[10px]">
                                <Sparkles className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 font-mono">SKU: {prod.sku}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {prod.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-white">
                      ₹{prod.pricing.price.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-slate-400">/ {prod.pricing.unit}</span>
                    </td>

                    <td className="px-6 py-4 text-xs">
                      {prod.bulkSettings?.enabled ? (
                        <span className="text-emerald-400 font-semibold">
                          {prod.bulkSettings.pricingTiers?.length || 0} Tiers Active
                        </span>
                      ) : (
                        <span className="text-slate-500">Disabled</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs font-mono">
                      <div className="text-slate-200">{prod.inventory?.quantity ?? '—'} in stock</div>
                      <div className="text-[10px] text-slate-500 capitalize">
                        {prod.inventory?.availability?.replace(/_/g, ' ') || 'In Stock'}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          prod.active
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {prod.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${prod.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
                          title="View on Live Store"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${prod._id.toString()}/edit`}
                          className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <AdminProductDeleteButton productId={prod._id.toString()} title={prod.title} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No products found. Click "Add New Product" to create your first catalog item.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Page {pageNum} of {totalPages} ({total} total products)
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <Link
                  key={idx + 1}
                  href={`/admin/products?page=${idx + 1}${q ? `&q=${q}` : ''}${
                    category ? `&category=${category}` : ''
                  }`}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    idx + 1 === pageNum ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {idx + 1}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
