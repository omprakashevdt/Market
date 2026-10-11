import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/product/ProductCard';
import { getCatalogHomeData } from '@/lib/dataService';
import {
  ArrowRight,
  TrendingDown,
  Sparkles,
  ShoppingBag,
  CheckCircle,
  MessageSquare,
  Shield,
  Layers,
} from 'lucide-react';
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { categories, featuredProducts, popularProducts } = await getCatalogHomeData();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const orgJsonLd = generateOrganizationJsonLd(siteUrl, 'CatalogHub Marketplace');
  const webSiteJsonLd = generateWebSiteJsonLd(siteUrl, 'CatalogHub Marketplace');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Bulk Pricing & Dynamic Custom Offers</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
                Discover Products That <span className="text-blue-600">Fit Your Needs</span> &
                Your Budget.
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl font-normal">
                Order books, visiting cards, apparel, office stationery, and custom manufactured goods
                in bulk. Make your own per-unit price offers and connect directly via WhatsApp.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/products"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="#categories"
                  className="px-7 py-4 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm sm:text-base rounded-2xl border border-gray-200 shadow-sm hover:shadow flex items-center gap-2 transition"
                >
                  <Layers className="w-4 h-4 text-gray-500" />
                  <span>Browse Categories</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-200/60 max-w-lg text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Generic Bulk Pricing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Instant WhatsApp</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Direct Supplier</span>
                </div>
              </div>
            </div>

            {/* Right Hero Product Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white p-4 rounded-3xl shadow-2xl border border-gray-100">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                  <Image
                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"
                    alt="Featured Marketplace Product"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <div className="mt-4 p-2 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                      Live Offer Engine
                    </span>
                    <h4 className="text-base font-bold text-gray-900">Custom Visiting Cards & Books</h4>
                    <p className="text-xs text-gray-500">Tier discounts up to 40% on volume</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">Starts at</span>
                    <p className="text-lg font-black text-gray-900">₹299/unit</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-4 rounded-2xl shadow-xl hidden sm:flex items-center gap-3 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">WhatsApp Dispatch</div>
                  <div className="text-sm font-bold text-white">Pre-calculated Quotes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Categories Section */}
      <section id="categories" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Dynamic Taxonomy
              </span>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mt-1">
                Browse by Category
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2 sm:mt-0"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat: any) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group bg-slate-50 hover:bg-blue-50/50 border border-gray-200 hover:border-blue-300 rounded-2xl p-4 text-center transition-all duration-200 flex flex-col items-center"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden mb-3 bg-white shadow-sm group-hover:scale-105 transition-transform">
                  <Image
                    src={
                      cat.image ||
                      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300'
                    }
                    alt={cat.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-gray-500 mt-1">
                  {cat.productCount || 0} products
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Handpicked Wholesale Deals
              </span>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mt-1">
                Featured Bulk Products
              </h2>
            </div>
            <Link
              href="/products?featured=true"
              className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2 sm:mt-0"
            >
              <span>See all featured</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product._id.toString()} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Capability Showcase */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
              Generic Product Capability
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              One Reusable Bulk Pipeline For Any Product
            </h2>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
              Whether you are ordering 50 books, 10,000 visiting cards, 500 corporate t-shirts, or
              1,000 custom engraved pens, our platform provides unified quantity steppers, tier pricing,
              and live WhatsApp negotiation.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-slate-900">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200">
              <span className="text-xs font-bold uppercase text-blue-600">Category: Books</span>
              <h4 className="font-bold text-base mt-1">Atomic Habits</h4>
              <p className="text-xs text-gray-500 mt-1">Quantity: 100 units</p>
              <div className="mt-4 pt-3 border-t text-sm font-black text-gray-900 flex justify-between">
                <span>Offer: ₹400/copy</span>
                <span className="text-emerald-700">Total: ₹40,000</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200">
              <span className="text-xs font-bold uppercase text-blue-600">Category: Printing</span>
              <h4 className="font-bold text-base mt-1">Velvet Visiting Cards</h4>
              <p className="text-xs text-gray-500 mt-1">Quantity: 5,000 units</p>
              <div className="mt-4 pt-3 border-t text-sm font-black text-gray-900 flex justify-between">
                <span>Offer: ₹380/pack</span>
                <span className="text-emerald-700">Total: ₹19,000</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200">
              <span className="text-xs font-bold uppercase text-blue-600">Category: Apparel</span>
              <h4 className="font-bold text-base mt-1">Custom Crew T-Shirts</h4>
              <p className="text-xs text-gray-500 mt-1">Quantity: 500 pieces</p>
              <div className="mt-4 pt-3 border-t text-sm font-black text-gray-900 flex justify-between">
                <span>Offer: ₹260/pc</span>
                <span className="text-emerald-700">Total: ₹1,30,000</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200">
              <span className="text-xs font-bold uppercase text-blue-600">Category: Stationery</span>
              <h4 className="font-bold text-base mt-1">PU Leather Journals</h4>
              <p className="text-xs text-gray-500 mt-1">Quantity: 250 units</p>
              <div className="mt-4 pt-3 border-t text-sm font-black text-gray-900 flex justify-between">
                <span>Offer: ₹210/pc</span>
                <span className="text-emerald-700">Total: ₹52,500</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Most In-Demand Items
              </span>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mt-1">
                Popular in Catalog
              </h2>
            </div>
            <Link
              href="/products?sort=popular"
              className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2 sm:mt-0"
            >
              <span>Explore popular items</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product: any) => (
              <ProductCard key={product._id.toString()} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
