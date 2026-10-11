import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, TrendingDown, Users, PhoneCall, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us — CatalogHub Bulk Marketplace',
  description:
    'Learn about CatalogHub, our generic bulk quantity & customer offer system, and how we streamline B2B procurement and wholesale enquiries.',
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full">
          About Our Platform
        </span>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Modern Bulk Procurement & Live Offer Negotiation
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          CatalogHub was engineered to eliminate friction between wholesale buyers and supply
          partners. We provide direct WhatsApp quotes, dynamic quantity tiers, and live offer
          calculations for any product type.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Volume Tier Pricing</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Transparent price tiers automatically adjust as your order size increases, ensuring
            maximum savings on every batch.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">WhatsApp Direct Dispatch</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Instantly send structured enquiries directly to our procurement desks with product IDs,
            quantities, and custom targets.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Verified Manufacturing</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            From book publishers to commercial print houses and garment manufacturers, every listing
            is backed by quality control.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Looking to order custom merchandise or books?</h2>
        <p className="text-blue-100 max-w-xl mx-auto text-sm sm:text-base mb-6">
          Explore our catalog, select your target volume, and make an offer today.
        </p>
        <Link
          href="/products"
          className="px-8 py-3.5 bg-white text-blue-700 font-bold rounded-2xl shadow-lg hover:bg-blue-50 transition inline-block text-sm"
        >
          Explore Catalog Now
        </Link>
      </div>
    </div>
  );
}
