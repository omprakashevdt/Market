'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { EnquiryModal } from '@/components/bulk/EnquiryModal';

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    slug: string;
    shortDescription: string;
    images: string[];
    category: string;
    sku: string;
    pricing: {
      price: number;
      originalPrice?: number;
      currency: string;
      unit: string;
    };
    bulkSettings?: {
      enabled: boolean;
      minimumQuantity: number;
      maximumQuantity: number;
    };
    offerSettings?: {
      enabled: boolean;
      suggestedOffers: number[];
    };
    inventory?: {
      availability: string;
    };
    featured?: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const currencySymbol = product.pricing.currency === 'INR' ? '₹' : product.pricing.currency;
  const imageSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

  const discountPercent =
    product.pricing.originalPrice && product.pricing.originalPrice > product.pricing.price
      ? Math.round(((product.pricing.originalPrice - product.pricing.price) / product.pricing.originalPrice) * 100)
      : 0;

  const minQuantity = product.bulkSettings?.minimumQuantity || 1;

  return (
    <>
      <div className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-400 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
        {/* Product Image & Badges */}
        <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-white/95 text-blue-700 rounded-full shadow-sm">
              {product.category}
            </span>
            {product.featured && (
              <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-white rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
          </div>

          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow">
              {discountPercent}% OFF
            </div>
          )}
        </Link>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="text-xs text-gray-400 font-mono mb-1">{product.sku}</div>
            <Link href={`/products/${product.slug}`}>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {product.title}
              </h3>
            </Link>

            <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Pricing & Actions */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-2xl font-black text-gray-900">
                  {currencySymbol}{product.pricing.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-gray-500 ml-1">
                  / {product.pricing.unit}
                </span>
              </div>
              {product.pricing.originalPrice && product.pricing.originalPrice > product.pricing.price && (
                <span className="text-xs text-gray-400 line-through">
                  {currencySymbol}{product.pricing.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* View Details & Enquire Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/products/${product.slug}`}
                className="w-full py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1 transition"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setEnquiryModalOpen(true)}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Enquire</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instant Enquiry Modal from Product Card */}
      {enquiryModalOpen && (
        <EnquiryModal
          isOpen={enquiryModalOpen}
          onClose={() => setEnquiryModalOpen(false)}
          product={product}
          quantity={minQuantity}
          offerPrice={product.pricing.price}
          totalOffer={minQuantity * product.pricing.price}
        />
      )}
    </>
  );
}
