'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { X, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { generateWhatsAppMessage, buildWhatsAppLink } from '@/lib/whatsapp';

const enquiryFormSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .regex(/^[0-9+\s-]+$/, 'Invalid phone number format'),
  customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
});

type EnquiryFormData = z.infer<typeof enquiryFormSchema>;

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    _id: string;
    title: string;
    sku: string;
    category: string;
    pricing: {
      price: number;
      currency: string;
      unit: string;
    };
  };
  quantity: number;
  offerPrice: number;
  totalOffer: number;
}

export function EnquiryModal({
  isOpen,
  onClose,
  product,
  quantity,
  offerPrice,
  totalOffer,
}: EnquiryModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      message: '',
    },
  });

  if (!isOpen) return null;

  const currencySymbol = product.pricing.currency === 'INR' ? '₹' : product.pricing.currency;

  const onSubmit = async (data: EnquiryFormData) => {
    setSubmitting(true);
    try {
      // 1. Save Enquiry to MongoDB via API
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          productName: product.title,
          productSku: product.sku,
          category: product.category,
          listedPrice: product.pricing.price,
          pricingUnit: product.pricing.unit,
          quantity,
          offerPrice,
          totalOffer,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail,
          message: data.message,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to save enquiry');
      }

      toast.success('Enquiry registered! Redirecting to WhatsApp...');

      // 2. Generate WhatsApp structured message
      const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Product Marketplace';
      const waMsg = generateWhatsAppMessage({
        siteName,
        productName: product.title,
        productId: product.sku || product._id,
        category: product.category,
        listedPrice: product.pricing.price,
        currency: product.pricing.currency || 'INR',
        pricingUnit: product.pricing.unit,
        quantity,
        offerPrice,
        totalOffer,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerMessage: data.message,
      });

      const whatsappTarget = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
      const waUrl = buildWhatsAppLink(whatsappTarget, waMsg);

      // 3. Open WhatsApp Web or mobile app
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex items-center justify-between text-white">
          <div>
            <h3 className="font-bold text-lg text-white">Send Bulk Enquiry</h3>
            <p className="text-xs text-slate-400">Direct response from catalog team via WhatsApp</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <div className="p-6">
          {/* Offer Summary Card */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-900 block">{product.title}</span>
              <p className="text-xs text-blue-700 mt-0.5">
                Quantity: <span className="font-bold">{quantity.toLocaleString()}</span> {product.pricing.unit}(s) @ {currencySymbol}{offerPrice}/unit
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-blue-600 block">Total Offer</span>
              <span className="text-xl font-black text-blue-950">
                {currencySymbol}{totalOffer.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('customerName')}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
              {errors.customerName && (
                <p className="text-xs text-red-500 mt-1">{errors.customerName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                WhatsApp Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register('customerPhone')}
                placeholder="e.g. 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
              {errors.customerPhone && (
                <p className="text-xs text-red-500 mt-1">{errors.customerPhone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                {...register('customerEmail')}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
              {errors.customerEmail && (
                <p className="text-xs text-red-500 mt-1">{errors.customerEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Specific Customizations / Delivery Timeline (Optional)
              </label>
              <textarea
                rows={2}
                {...register('message')}
                placeholder="E.g. Matte finish, expedited shipping to Bangalore, custom logo print..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer text-sm"
            >
              {submitting ? (
                <span className="inline-block animate-spin mr-2">⚪</span>
              ) : (
                <Send className="w-4 h-4" />
              )}
              {submitting ? 'Recording Enquiry...' : 'Confirm & Open WhatsApp'}
            </button>
          </form>

          <p className="text-center text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Your details are safe. We will never spam.
          </p>
        </div>
      </div>
    </div>
  );
}
