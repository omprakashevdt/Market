import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminUserDoc extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'superadmin';
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  },
  { timestamps: true }
);

export const AdminUser: Model<IAdminUserDoc> =
  mongoose.models.AdminUser || mongoose.model<IAdminUserDoc>('AdminUser', AdminUserSchema);
