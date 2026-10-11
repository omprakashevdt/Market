export interface IPricingTier {
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
}

export interface IProductPricing {
  price: number;
  originalPrice?: number;
  currency: string;
  unit: string;
}

export interface IProductBulkSettings {
  enabled: boolean;
  minimumQuantity: number;
  maximumQuantity: number;
  pricingTiers: IPricingTier[];
}

export interface IProductOfferSettings {
  enabled: boolean;
  suggestedOffers: number[];
}

export interface IProductInventory {
  quantity: number;
  availability: 'in_stock' | 'out_of_stock' | 'made_to_order';
}

export interface IProductSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  images: string[];
  category: string;
  categoryId: string;
  author?: string;
  sku: string;
  keywords: string[];
  pricing: IProductPricing;
  bulkSettings: IProductBulkSettings;
  offerSettings: IProductOfferSettings;
  inventory: IProductInventory;
  featured: boolean;
  popular: boolean;
  active: boolean;
  seo?: IProductSEO;
  createdAt: string;
  updatedAt: string;
}

export interface ICategorySEO {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  seo?: ICategorySEO;
  productCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Completed' | 'Cancelled';

export interface IEnquiry {
  _id: string;
  productId: string;
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
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  createdAt: string;
}
