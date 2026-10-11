import { z } from 'zod';

export const pricingTierSchema = z.object({
  minQuantity: z.number().min(1, 'Minimum quantity must be at least 1'),
  maxQuantity: z.number().optional(),
  unitPrice: z.number().min(0, 'Tier unit price must be positive'),
});

export const productSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').trim(),
  slug: z.string().min(2).toLowerCase().trim(),
  shortDescription: z.string().min(5, 'Short description is required'),
  description: z.string().min(10, 'Full description must be at least 10 characters'),
  images: z.array(z.string().url('Valid image URL required')).min(1, 'At least one image is required'),
  category: z.string().min(1, 'Category is required'),
  categoryId: z.string().optional(),
  author: z.string().optional(),
  sku: z.string().min(2, 'SKU must be at least 2 characters').toUpperCase(),
  keywords: z.array(z.string()).default([]),
  pricing: z.object({
    price: z.number().min(0, 'Price must be positive'),
    originalPrice: z.number().min(0).optional(),
    currency: z.string().default('INR'),
    unit: z.string().default('piece'),
  }),
  bulkSettings: z.object({
    enabled: z.boolean().default(true),
    minimumQuantity: z.number().min(1).default(1),
    maximumQuantity: z.number().min(1).default(100000),
    pricingTiers: z.array(pricingTierSchema).default([]),
  }),
  offerSettings: z.object({
    enabled: z.boolean().default(true),
    suggestedOffers: z.array(z.number()).default([]),
  }),
  inventory: z.object({
    quantity: z.number().min(0).default(100),
    availability: z.enum(['in_stock', 'out_of_stock', 'made_to_order']).default('in_stock'),
  }),
  featured: z.boolean().default(false),
  popular: z.boolean().default(false),
  active: z.boolean().default(true),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      image: z.string().optional(),
    })
    .optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  slug: z.string().min(2).toLowerCase().trim(),
  description: z.string().default(''),
  image: z.string().default(''),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  active: z.boolean().default(true),
});

export const enquirySchema = z.object({
  productId: z.string(),
  productName: z.string().min(1),
  productSku: z.string().min(1),
  category: z.string().min(1),
  listedPrice: z.number().min(0),
  pricingUnit: z.string().default('piece'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  offerPrice: z.number().min(0, 'Offer price must be at least 0'),
  totalOffer: z.number().min(0),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9+\s-]+$/, 'Invalid phone number format'),
  customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
