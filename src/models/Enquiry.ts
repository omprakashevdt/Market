import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnquiryDoc extends Document {
  productId: mongoose.Types.ObjectId;
  productName: string;
  productSku: string;
  category: string;
  listedPrice: number;
  pricingUnit: string;
  quantity: number;
  offerPrice: number;
  totalOffer: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Completed' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiryDoc>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    productName: { type: String, required: true },
    productSku: { type: String, required: true },
    category: { type: String, required: true },
    listedPrice: { type: Number, required: true },
    pricingUnit: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    offerPrice: { type: Number, required: true, min: 0 },
    totalOffer: { type: Number, required: true, min: 0 },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true, index: true },
    customerEmail: { type: String, trim: true, lowercase: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Completed', 'Cancelled'],
      default: 'New',
      index: true,
    },
  },
  { timestamps: true }
);

export const Enquiry: Model<IEnquiryDoc> =
  mongoose.models.Enquiry || mongoose.model<IEnquiryDoc>('Enquiry', EnquirySchema);
