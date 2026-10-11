'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  Sparkles,
  TrendingDown,
  Image as ImageIcon,
  Layers,
  HelpCircle,
  UploadCloud,
  X,
} from 'lucide-react';
import Link from 'next/link';

const pricingTierSchema = z.object({
  minQuantity: z.number().min(1, 'Min quantity must be at least 1'),
  maxQuantity: z.number().optional(),
  unitPrice: z.number().min(0, 'Unit price must be non-negative'),
});

const formSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  shortDescription: z.string().min(5, 'Short description is required'),
  description: z.string().min(10, 'Full description must be at least 10 characters'),
  images: z.string().min(1, 'At least one image URL required (comma separated)'),
  category: z.string().min(1, 'Category is required'),
  author: z.string().optional(),
  sku: z.string().min(2, 'SKU is required'),
  keywords: z.string().optional(),
  price: z.number().min(0, 'Base price must be positive'),
  originalPrice: z.number().optional(),
  currency: z.string(),
  unit: z.string(),
  minQuantity: z.number().min(1),
  maxQuantity: z.number().min(1),
  bulkEnabled: z.boolean(),
  offersEnabled: z.boolean(),
  suggestedOffers: z.string().optional(),
  stockQuantity: z.number().min(0),
  availability: z.enum(['in_stock', 'out_of_stock', 'made_to_order']),
  featured: z.boolean(),
  popular: z.boolean(),
  active: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  pricingTiers: z.array(pricingTierSchema),
});

type FormData = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: any;
  categories: { name: string; slug: string }[];
  isEdit?: boolean;
}

export function ProductForm({ initialData, categories, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      shortDescription: initialData?.shortDescription || '',
      description: initialData?.description || '',
      images: initialData?.images ? initialData.images.join(', ') : '',
      category: initialData?.category || (categories[0]?.name ?? 'General'),
      author: initialData?.author || '',
      sku: initialData?.sku || '',
      keywords: initialData?.keywords ? initialData.keywords.join(', ') : '',
      price: initialData?.pricing?.price ?? 499,
      originalPrice: initialData?.pricing?.originalPrice ?? 699,
      currency: initialData?.pricing?.currency || 'INR',
      unit: initialData?.pricing?.unit || 'piece',
      minQuantity: initialData?.bulkSettings?.minimumQuantity ?? 1,
      maxQuantity: initialData?.bulkSettings?.maximumQuantity ?? 10000,
      bulkEnabled: initialData?.bulkSettings?.enabled ?? true,
      offersEnabled: initialData?.offerSettings?.enabled ?? true,
      suggestedOffers: initialData?.offerSettings?.suggestedOffers
        ? initialData.offerSettings.suggestedOffers.join(', ')
        : '',
      stockQuantity: initialData?.inventory?.quantity ?? 500,
      availability: initialData?.inventory?.availability || 'in_stock',
      featured: initialData?.featured ?? false,
      popular: initialData?.popular ?? false,
      active: initialData?.active ?? true,
      seoTitle: initialData?.seo?.title || '',
      seoDescription: initialData?.seo?.description || '',
      pricingTiers: initialData?.bulkSettings?.pricingTiers || [
        { minQuantity: 10, maxQuantity: 49, unitPrice: 450 },
        { minQuantity: 50, maxQuantity: 199, unitPrice: 400 },
        { minQuantity: 200, unitPrice: 350 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'pricingTiers',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-slugify title if creating new
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEdit) {
      const generated = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', generated, { shouldValidate: true });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size exceeds 2MB limit for client storage.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        const cur = watch('images') || '';
        const list = cur ? cur.split(',').map((s) => s.trim()).filter(Boolean) : [];
        list.push(base64);
        setValue('images', list.join(', '), { shouldValidate: true });
        toast.success('Local device image attached successfully!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addPresetImage = (url: string) => {
    const cur = watch('images') || '';
    const list = cur ? cur.split(',').map((s) => s.trim()).filter(Boolean) : [];
    list.push(url);
    setValue('images', list.join(', '), { shouldValidate: true });
    toast.success('Sample image added!');
  };

  const removeImageAt = (index: number) => {
    const cur = watch('images') || '';
    const list = cur.split(',').map((s) => s.trim()).filter(Boolean);
    list.splice(index, 1);
    setValue('images', list.join(', '), { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const imagesArray = data.images
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const keywordsArray = data.keywords
        ? data.keywords
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        : [];

      const suggestedOffersArray = data.suggestedOffers
        ? data.suggestedOffers
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => !isNaN(n) && n > 0)
        : [];

      const payload = {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        images: imagesArray,
        category: data.category,
        author: data.author || undefined,
        sku: data.sku,
        keywords: keywordsArray,
        pricing: {
          price: data.price,
          originalPrice: data.originalPrice || undefined,
          currency: data.currency,
          unit: data.unit,
        },
        bulkSettings: {
          enabled: data.bulkEnabled,
          minimumQuantity: data.minQuantity,
          maximumQuantity: data.maxQuantity,
          pricingTiers: data.pricingTiers,
        },
        offerSettings: {
          enabled: data.offersEnabled,
          suggestedOffers: suggestedOffersArray,
        },
        inventory: {
          quantity: data.stockQuantity,
          availability: data.availability,
        },
        featured: data.featured,
        popular: data.popular,
        active: data.active,
        seo: {
          title: data.seoTitle || undefined,
          description: data.seoDescription || undefined,
          keywords: keywordsArray,
        },
      };

      const url = isEdit ? `/api/products/${initialData._id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save product');
      }

      toast.success(isEdit ? 'Product updated successfully!' : 'Product created successfully!');
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}</span>
        </button>
      </div>

      {/* 1. Basic Information Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
          <Layers className="w-5 h-5 text-blue-500" />
          1. Basic Product Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Product Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register('title')}
              onChange={(e) => {
                register('title').onChange(e);
                handleTitleChange(e);
              }}
              placeholder="e.g. Atomic Habits or Velvet Visiting Cards"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              URL Slug <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register('slug')}
              placeholder="atomic-habits"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
            {errors.slug && <p className="text-xs text-red-400 mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              {...register('category')}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              SKU Code <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register('sku')}
              placeholder="PROD-VC-101"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
            {errors.sku && <p className="text-xs text-red-400 mt-1">{errors.sku.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Author / Brand (Optional)
            </label>
            <input
              type="text"
              {...register('author')}
              placeholder="e.g. James Clear"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Search Keywords (Comma Separated)
            </label>
            <input
              type="text"
              {...register('keywords')}
              placeholder="book, self help, habits, print"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
            Short Description <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register('shortDescription')}
            placeholder="Brief 1-2 sentence overview for cards and listings..."
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.shortDescription && (
            <p className="text-xs text-red-400 mt-1">{errors.shortDescription.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
            Full Description & Specifications <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={5}
            {...register('description')}
            placeholder="Comprehensive description of materials, finishes, batch sizes, specs..."
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
          {errors.description && (
            <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label className="block text-xs font-bold text-slate-300 uppercase">
              Product Images <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-semibold rounded-lg border border-blue-500/30 transition"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Upload Device Image
              </button>
            </div>
          </div>

          <input
            type="text"
            {...register('images')}
            placeholder="https://images.unsplash.com/photo-1..., https://images.unsplash.com/photo-2..."
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
          />

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-[11px] text-slate-400 font-medium">Quick Presets:</span>
            <button
              type="button"
              onClick={() => addPresetImage('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80')}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              + 📚 Book
            </button>
            <button
              type="button"
              onClick={() => addPresetImage('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80')}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              + 💳 Business Card
            </button>
            <button
              type="button"
              onClick={() => addPresetImage('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80')}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              + 👕 T-Shirt
            </button>
            <button
              type="button"
              onClick={() => addPresetImage('https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80')}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              + 📓 Notebook
            </button>
            <button
              type="button"
              onClick={() => addPresetImage('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80')}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              + ☕ Mug
            </button>
          </div>

          {/* Live Preview Thumbnails */}
          {(() => {
            const rawImages = watch('images') || '';
            const previewList = rawImages.split(',').map((s) => s.trim()).filter(Boolean);
            if (previewList.length === 0) return null;
            return (
              <div className="mt-4 p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Live Image Previews ({previewList.length}) — #1 is primary store cover
                </p>
                <div className="flex flex-wrap gap-3">
                  {previewList.map((url, idx) => (
                    <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImageAt(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600/90 hover:bg-red-500 text-white rounded-full opacity-80 group-hover:opacity-100 transition shadow"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {errors.images && <p className="text-xs text-red-400 mt-1">{errors.images.message}</p>}
        </div>
      </div>

      {/* 2. Generic Pricing & Bulk Quantity Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
          <TrendingDown className="w-5 h-5 text-emerald-500" />
          2. Pricing & Generic Bulk Quantity Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Listed Base Price <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              step="any"
              {...register('price', { valueAsNumber: true })}
              placeholder="499"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Original Price (MSRP)
            </label>
            <input
              type="number"
              step="any"
              {...register('originalPrice', { valueAsNumber: true })}
              placeholder="699"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Pricing Unit <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register('unit')}
              placeholder="piece, pack (100 cards), box, unit"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Currency</label>
            <input
              type="text"
              {...register('currency')}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Minimum Order Quantity
            </label>
            <input
              type="number"
              {...register('minQuantity', { valueAsNumber: true })}
              placeholder="1"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Maximum Order Quantity
            </label>
            <input
              type="number"
              {...register('maxQuantity', { valueAsNumber: true })}
              placeholder="10000"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Dynamic Pricing Tiers */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-white">Bulk Discount Pricing Tiers</h4>
              <p className="text-xs text-slate-400">
                Tier price overrides base price when selected quantity falls within range.
              </p>
            </div>
            <button
              type="button"
              onClick={() => append({ minQuantity: 100, maxQuantity: 499, unitPrice: 400 })}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tier</span>
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl">
                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Min Units
                  </span>
                  <input
                    type="number"
                    {...register(`pricingTiers.${idx}.minQuantity`, { valueAsNumber: true })}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs font-mono"
                  />
                </div>

                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Max Units (Optional)
                  </span>
                  <input
                    type="number"
                    {...register(`pricingTiers.${idx}.maxQuantity`, { valueAsNumber: true })}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs font-mono"
                  />
                </div>

                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Unit Price (₹)
                  </span>
                  <input
                    type="number"
                    step="any"
                    {...register(`pricingTiers.${idx}.unitPrice`, { valueAsNumber: true })}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs font-mono font-bold text-emerald-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="mt-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Offer Configuration */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Customer Offer System
          </h4>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="offersEnabled"
              {...register('offersEnabled')}
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="offersEnabled" className="text-xs font-bold text-slate-200">
              Enable Customer Price Offers for this product
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Suggested Offer Quick Buttons (Comma-separated numbers)
            </label>
            <input
              type="text"
              {...register('suggestedOffers')}
              placeholder="e.g. 450, 420, 390, 350"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              If left blank, realistic quick buttons around the base price will be auto-generated.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Inventory & Status Flags */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-4">
          3. Inventory & Product Flags
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              {...register('stockQuantity', { valueAsNumber: true })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Availability Status
            </label>
            <select
              {...register('availability')}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="made_to_order">Made to Order / Custom Print</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-800">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              {...register('featured')}
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600"
            />
            <span>Featured on Home Page</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              {...register('popular')}
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600"
            />
            <span>Mark as Popular Deal</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              {...register('active')}
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600"
            />
            <span>Active & Visible in Catalog</span>
          </label>
        </div>
      </div>

      {/* 4. SEO Metadata */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-4">
          4. SEO & Social Metadata
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              SEO Title (Optional override)
            </label>
            <input
              type="text"
              {...register('seoTitle')}
              placeholder="Atomic Habits Book — Wholesale Bulk Copies & Custom Offers"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              SEO Description (Optional override)
            </label>
            <textarea
              rows={2}
              {...register('seoDescription')}
              placeholder="Order bulk copies of Atomic Habits at volume tier pricing..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Link
          href="/admin/products"
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}</span>
        </button>
      </div>
    </form>
  );
}
