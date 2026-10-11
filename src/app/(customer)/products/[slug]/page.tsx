import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProductGallery } from '@/components/product/ProductGallery';
import { BulkOfferCard } from '@/components/bulk/BulkOfferCard';
import { ProductCard } from '@/components/product/ProductCard';
import { getProductBySlugOrId, getProductCatalog } from '@/lib/dataService';
import { generateProductJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Share2,
  Tag,
  User,
  Hash,
  Boxes,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugOrId(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const title = product.seo?.title || `${product.title} — Bulk Pricing & Custom Offers`;
  const description = product.seo?.description || product.shortDescription;
  const imageUrl = product.images?.[0] || `${siteUrl}/default-product.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/products/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/products/${product.slug}`,
      images: [{ url: imageUrl, alt: product.title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlugOrId(slug);
  if (!product) {
    notFound();
  }

  // Fetch related products in the same category
  const { products: catProducts } = await getProductCatalog({ category: product.category, limit: 6 });
  const relatedProducts = catProducts.filter((p: any) => p.slug !== product.slug).slice(0, 4);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const productJsonLd = generateProductJsonLd(product as any, siteUrl);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'Products', url: `${siteUrl}/products` },
    { name: product.category, url: `${siteUrl}/category/${product.category.toLowerCase().replace(/\s+/g, '-')}` },
    { name: product.title, url: `${siteUrl}/products/${product.slug}` },
  ]);

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600 transition">
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-blue-600 transition"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-bold truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Layout Grid: Left Gallery & Details, Right Sticky Bulk Offer Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Gallery & Details */}
          <div className="lg:col-span-7 space-y-8">
            <ProductGallery images={product.images} title={product.title} />

            {/* Product Meta Specs */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2">
                    {product.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {product.title}
                  </h1>
                </div>
              </div>

              {/* Quick Spec Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">SKU Code</span>
                    <span className="font-mono font-bold text-slate-800">{product.sku}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Availability</span>
                    <span className="font-bold text-emerald-600 capitalize">
                      {product.inventory?.availability?.replace(/_/g, ' ') || 'In Stock'}
                    </span>
                  </div>
                </div>

                {product.author && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Author</span>
                      <span className="font-bold text-slate-800">{product.author}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div className="text-sm text-gray-600 leading-relaxed font-medium">
                {product.shortDescription}
              </div>

              {/* Full Description & Specifications */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-base font-bold text-gray-900 mb-3">Product Overview & Specs</h3>
                <div className="prose max-w-none text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>

              {/* Keywords */}
              {product.keywords && product.keywords.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Tags & Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.keywords.map((kw: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Generic Bulk Offer Card (Sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              <BulkOfferCard product={product as any} />

              {/* Trust Guarantees */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3.5 text-xs text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-gray-900 block font-bold">Guaranteed Wholesale Quality</strong>
                    <span>Direct factory inspection on volume orders.</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-gray-900 block font-bold">Pan-India Bulk Logistics</strong>
                    <span>Safe pallet shipping with tracked consignment.</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-gray-900 block font-bold">Samples Available</strong>
                    <span>Request physical samples prior to full production runs.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Related Recommendations
                </span>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
                  More in {product.category}
                </h2>
              </div>
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Browse all {product.category} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel: any) => (
                <ProductCard key={rel._id.toString()} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
