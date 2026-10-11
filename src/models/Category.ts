import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategoryDoc extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  productCount: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategoryDoc>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    seo: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
    },
    productCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Category: Model<ICategoryDoc> =
  mongoose.models.Category || mongoose.model<ICategoryDoc>('Category', CategorySchema);
