import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/product/ProductCard';
import { getCategoryBySlug, getProductCatalog } from '@/lib/dataService';
import { Layers, ArrowRight, PackageX } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const title = category.seo?.title || `${category.name} Bulk Wholesale Products | CatalogHub`;
  const description =
    category.seo?.description ||
    `Explore wholesale prices and submit custom bulk offers for ${category.name} on CatalogHub.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/category/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      images: category.image ? [{ url: category.image }] : [],
    },
  };
}

export default async function CategoryDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sort = 'newest' } = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const { products } = await getProductCatalog({
    category: category.name,
    sort,
    limit: 50,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Category Header Hero */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 sm:p-12 overflow-hidden mb-12 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition">
              Categories
            </Link>
            <span>/</span>
            <span className="text-white font-bold">{category.name}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {category.name}
          </h1>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
            {category.description ||
              `Discover verified ${category.name} products available for volume wholesale ordering and custom price offers.`}
          </p>

          <div className="pt-2 text-xs font-bold text-blue-200 uppercase tracking-wider">
            {products.length} Products Available
          </div>
        </div>

        {category.image && (
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 hidden md:block">
            <Image src={category.image} alt={category.name} fill className="object-cover" />
          </div>
        )}
      </div>

      {/* Sorting bar */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <span className="text-xs text-gray-500 font-medium">
          Showing all products in <strong className="text-gray-900">{category.name}</strong>
        </span>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 font-semibold">Sort:</span>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <Link
              href={`/category/${category.slug}?sort=newest`}
              className={`px-3 py-1.5 rounded-lg transition ${
                sort === 'newest' ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-600'
              }`}
            >
              Newest
            </Link>
            <Link
              href={`/category/${category.slug}?sort=price-asc`}
              className={`px-3 py-1.5 rounded-lg transition ${
                sort === 'price-asc' ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-600'
              }`}
            >
              Price: Low
            </Link>
            <Link
              href={`/category/${category.slug}?sort=price-desc`}
              className={`px-3 py-1.5 rounded-lg transition ${
                sort === 'price-desc' ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-600'
              }`}
            >
              Price: High
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod: any) => (
            <ProductCard key={prod._id.toString()} product={prod} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <PackageX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Products in this Category</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
            We are restocking items for {category.name}. Check back soon or explore our other
            categories.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition inline-block"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
