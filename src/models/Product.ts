import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPricingTier {
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
}

export interface IProductDoc extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  images: string[];
  category: string;
  categoryId?: mongoose.Types.ObjectId;
  author?: string;
  sku: string;
  keywords: string[];
  pricing: {
    price: number;
    originalPrice?: number;
    currency: string;
    unit: string;
  };
  bulkSettings: {
    enabled: boolean;
    minimumQuantity: number;
    maximumQuantity: number;
    pricingTiers: IPricingTier[];
  };
  offerSettings: {
    enabled: boolean;
    suggestedOffers: number[];
  };
  inventory: {
    quantity: number;
    availability: 'in_stock' | 'out_of_stock' | 'made_to_order';
  };
  featured: boolean;
  popular: boolean;
  active: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PricingTierSchema = new Schema<IPricingTier>(
  {
    minQuantity: { type: Number, required: true },
    maxQuantity: { type: Number },
    unitPrice: { type: Number, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDoc>(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    category: { type: String, required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', index: true },
    author: { type: String, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    keywords: [{ type: String }],
    pricing: {
      price: { type: Number, required: true, min: 0 },
      originalPrice: { type: Number, min: 0 },
      currency: { type: String, default: 'INR' },
      unit: { type: String, default: 'piece' },
    },
    bulkSettings: {
      enabled: { type: Boolean, default: true },
      minimumQuantity: { type: Number, default: 1 },
      maximumQuantity: { type: Number, default: 100000 },
      pricingTiers: [PricingTierSchema],
    },
    offerSettings: {
      enabled: { type: Boolean, default: true },
      suggestedOffers: [{ type: Number }],
    },
    inventory: {
      quantity: { type: Number, default: 100 },
      availability: {
        type: String,
        enum: ['in_stock', 'out_of_stock', 'made_to_order'],
        default: 'in_stock',
      },
    },
    featured: { type: Boolean, default: false, index: true },
    popular: { type: Boolean, default: false, index: true },
    active: { type: Boolean, default: true, index: true },
    seo: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
      image: { type: String },
    },
  },
  { timestamps: true }
);

ProductSchema.index({
  title: 'text',
  shortDescription: 'text',
  description: 'text',
  author: 'text',
  category: 'text',
  sku: 'text',
  keywords: 'text',
});

export const Product: Model<IProductDoc> =
  mongoose.models.Product || mongoose.model<IProductDoc>('Product', ProductSchema);
