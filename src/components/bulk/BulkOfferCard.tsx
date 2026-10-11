'use client';

import React, { useState, useMemo } from 'react';
import { QuantitySelector } from '@/components/product/QuantitySelector';
import { EnquiryModal } from '@/components/bulk/EnquiryModal';
import { MessageSquare, Sparkles, TrendingDown, ShieldCheck } from 'lucide-react';

interface PricingTier {
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
}

interface BulkOfferCardProps {
  product: {
    _id: string;
    title: string;
    sku: string;
    category: string;
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
      pricingTiers: PricingTier[];
    };
    offerSettings?: {
      enabled: boolean;
      suggestedOffers: number[];
    };
    inventory?: {
      quantity: number;
      availability: string;
    };
  };
}

export function BulkOfferCard({ product }: BulkOfferCardProps) {
  const { pricing, bulkSettings, offerSettings } = product;

  // 1. Quantity bounds & state
  const minQty = bulkSettings?.minimumQuantity || 1;
  const maxQty = bulkSettings?.maximumQuantity || 100000;
  const [quantity, setQuantity] = useState<number>(minQty);

  // 2. Compute Applicable Tier Price based on selected quantity
  const applicableTierPrice = useMemo(() => {
    if (!bulkSettings?.enabled || !bulkSettings.pricingTiers?.length) {
      return pricing.price;
    }
    const matchedTier = bulkSettings.pricingTiers
      .filter((tier) => quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity))
      .sort((a, b) => b.minQuantity - a.minQuantity)[0];

    return matchedTier ? matchedTier.unitPrice : pricing.price;
  }, [bulkSettings, quantity, pricing.price]);

  // 3. Customer Offer state
  const [offerPrice, setOfferPrice] = useState<number>(applicableTierPrice);
  const [isCustomOffer, setIsCustomOffer] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Suggested Offer Buttons based on product pricing
  const suggestedButtons = useMemo(() => {
    if (offerSettings?.suggestedOffers?.length) {
      return offerSettings.suggestedOffers;
    }
    // Dynamic fallback offer suggestions around the base tier price
    const base = applicableTierPrice;
    return [
      Math.round(base * 0.95),
      Math.round(base * 0.9),
      Math.round(base * 0.85),
      Math.round(base * 0.8),
    ].filter((val) => val > 0);
  }, [offerSettings, applicableTierPrice]);

  const totalEstimated = useMemo(() => {
    return Math.max(0, quantity * offerPrice);
  }, [quantity, offerPrice]);

  const currencySymbol = pricing.currency === 'INR' ? '₹' : pricing.currency;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 transition-all hover:border-blue-400">
      <div className="flex items-start justify-between border-b border-gray-100 pb-5 mb-6">
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-blue-600" /> Bulk Order & Offer System
          </span>
          <h3 className="text-xl font-bold text-gray-900 mt-2">{product.title}</h3>
          <p className="text-xs text-gray-400 font-mono mt-0.5">SKU: {product.sku}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-gray-400">Listed Price</p>
          <p className="text-2xl sm:text-3xl font-black text-gray-900">
            {currencySymbol}{pricing.price.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-gray-500 font-medium">/ {pricing.unit}</span>
        </div>
      </div>

      {/* Tier Pricing Display if enabled */}
      {bulkSettings?.enabled && bulkSettings.pricingTiers && bulkSettings.pricingTiers.length > 0 && (
        <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-600" /> Quantity Discount Tiers
            </span>
            <span className="text-[11px] text-slate-500">Auto-applies with quantity</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {bulkSettings.pricingTiers.map((tier, idx) => {
              const isActive =
                quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity);
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 font-bold text-blue-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <div className="text-[11px] font-medium text-slate-500">
                    {tier.minQuantity}
                    {tier.maxQuantity ? `–${tier.maxQuantity}` : '+'} units
                  </div>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">
                    {currencySymbol}{tier.unitPrice.toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Stepper Component */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-bold text-gray-800">
            Select Quantity ({pricing.unit}s)
          </label>
          <span className="text-xs text-gray-500">
            Min: {minQty.toLocaleString()} | Max: {maxQty.toLocaleString()}
          </span>
        </div>
        <QuantitySelector
          value={quantity}
          min={minQty}
          max={maxQty}
          unit={pricing.unit}
          onChange={(newVal) => {
            setQuantity(newVal);
            if (!isCustomOffer) {
              setOfferPrice(applicableTierPrice);
            }
          }}
        />
      </div>

      {/* Customer Offer Section */}
      {offerSettings?.enabled && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <span>Your Offer Price</span>
              <span className="text-xs font-normal text-gray-500">(/ {pricing.unit})</span>
            </label>
            <span className="text-xs text-blue-600 font-semibold">Custom Offer Welcome</span>
          </div>

          {/* Suggested Offer Buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestedButtons.map((btnAmt) => (
              <button
                key={btnAmt}
                type="button"
                onClick={() => {
                  setOfferPrice(btnAmt);
                  setIsCustomOffer(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  offerPrice === btnAmt && !isCustomOffer
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {currencySymbol}{btnAmt.toLocaleString('en-IN')}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsCustomOffer(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isCustomOffer
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Custom Amount
            </button>
          </div>

          {/* Custom Offer Direct Numeric Input */}
          {isCustomOffer && (
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 font-bold">
                {currencySymbol}
              </span>
              <input
                type="number"
                min="1"
                value={offerPrice || ''}
                onChange={(e) => setOfferPrice(Number(e.target.value))}
                placeholder="Enter custom offer price per unit"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 font-bold text-sm"
              />
            </div>
          )}
        </div>
      )}

      {/* Live Estimated Total Calculation */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 mb-6 border border-blue-100/80 flex items-center justify-between shadow-inner">
        <div>
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
            Estimated Total
          </span>
          <p className="text-xs text-blue-700 font-medium mt-0.5">
            {quantity.toLocaleString()} {pricing.unit}(s) × {currencySymbol}{offerPrice.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-blue-950">
          {currencySymbol}{totalEstimated.toLocaleString('en-IN')}
        </div>
      </div>

      {/* WhatsApp Dispatch Trigger */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer text-base"
      >
        <MessageSquare className="w-5 h-5" />
        Enquire on WhatsApp
      </button>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Direct Supplier Enquiry • Fast response within 1 hour</span>
      </div>

      {/* Modal */}
      {modalOpen && (
        <EnquiryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          product={product}
          quantity={quantity}
          offerPrice={offerPrice}
          totalOffer={totalEstimated}
        />
      )}
    </div>
  );
}
