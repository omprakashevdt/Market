import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ENQUIRIES,
} from '@/lib/fallbackData';

// Standalone in-memory repository for 100% self-contained Vercel deployment
interface GlobalStore {
  products: any[];
  categories: any[];
  enquiries: any[];
}

declare global {
  // eslint-disable-next-line no-var
  var marketplaceMemoryStore: GlobalStore | undefined;
}

if (!global.marketplaceMemoryStore) {
  global.marketplaceMemoryStore = {
    products: [...INITIAL_PRODUCTS],
    categories: [...INITIAL_CATEGORIES],
    enquiries: [...INITIAL_ENQUIRIES],
  };
}

const store = global.marketplaceMemoryStore;

export async function getCatalogHomeData() {
  return {
    categories: [...store.categories],
    featuredProducts: store.products.filter((p) => p.featured && p.active),
    popularProducts: store.products.filter((p) => p.popular && p.active),
  };
}

export async function getProductCatalog(params: {
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  featured?: string;
  popular?: string;
  page?: number;
  limit?: number;
}) {
  const page = params.page || 1;
  const limit = params.limit || 12;

  let filtered = [...store.products].filter((p) => p.active);

  if (params.category && params.category !== 'all') {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === params.category!.toLowerCase()
    );
  }

  if (params.featured === 'true') {
    filtered = filtered.filter((p) => p.featured);
  }

  if (params.popular === 'true') {
    filtered = filtered.filter((p) => p.popular);
  }

  if (params.minPrice) {
    filtered = filtered.filter((p) => p.pricing.price >= Number(params.minPrice));
  }

  if (params.maxPrice) {
    filtered = filtered.filter((p) => p.pricing.price <= Number(params.maxPrice));
  }

  if (params.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.author && p.author.toLowerCase().includes(q)) ||
        (p.keywords && p.keywords.some((k: string) => k.toLowerCase().includes(q)))
    );
  }

  if (params.sort === 'price-asc') {
    filtered.sort((a, b) => a.pricing.price - b.pricing.price);
  } else if (params.sort === 'price-desc') {
    filtered.sort((a, b) => b.pricing.price - a.pricing.price);
  } else if (params.sort === 'popular') {
    filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  } else {
    // Newest default
    filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // Recalculate categories with product count
  const categoriesWithCounts = store.categories.map((c) => ({
    ...c,
    productCount: store.products.filter(
      (p) => p.category.toLowerCase() === c.name.toLowerCase() && p.active
    ).length,
  }));

  return {
    products: paginated,
    total: filtered.length,
    categories: categoriesWithCounts,
  };
}

export async function getProductBySlugOrId(identifier: string) {
  return (
    store.products.find(
      (p) => p.slug === identifier || p._id === identifier || p.sku === identifier
    ) || null
  );
}

export async function createProduct(data: any) {
  const newProduct = {
    _id: `prod-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.products.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, data: any) {
  const idx = store.products.findIndex((p) => p._id === id || p.slug === id);
  if (idx === -1) return null;
  store.products[idx] = {
    ...store.products[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return store.products[idx];
}

export async function deleteProduct(id: string) {
  const idx = store.products.findIndex((p) => p._id === id);
  if (idx === -1) return false;
  store.products.splice(idx, 1);
  return true;
}

export async function getCategories() {
  return store.categories.map((c) => ({
    ...c,
    productCount: store.products.filter(
      (p) => p.category.toLowerCase() === c.name.toLowerCase() && p.active
    ).length,
  }));
}

export async function getCategoryBySlug(slug: string) {
  return store.categories.find((c) => c.slug === slug) || null;
}

export async function createCategory(data: any) {
  const newCat = {
    _id: `cat-${Date.now()}`,
    ...data,
    productCount: 0,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.categories.push(newCat);
  return newCat;
}

export async function deleteCategory(id: string) {
  const idx = store.categories.findIndex((c) => c._id === id);
  if (idx === -1) return false;
  store.categories.splice(idx, 1);
  return true;
}

export async function getAdminMetrics() {
  return {
    totalProducts: store.products.length,
    totalCategories: store.categories.length,
    totalEnquiries: store.enquiries.length,
    newEnquiries: store.enquiries.filter((e) => e.status === 'New').length,
    featuredProducts: store.products.filter((p) => p.featured).length,
    recentEnquiries: store.enquiries.slice(0, 6),
  };
}

export async function recordEnquiry(data: any) {
  const newEnq = {
    _id: `enq-${Date.now()}`,
    ...data,
    status: 'New',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.enquiries.unshift(newEnq);
  return newEnq;
}

export async function getEnquiries(params: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = params.page || 1;
  const limit = params.limit || 20;

  let filtered = [...store.enquiries];

  if (params.status && params.status !== 'all') {
    filtered = filtered.filter((e) => e.status === params.status);
  }

  if (params.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.customerName.toLowerCase().includes(q) ||
        e.customerPhone.toLowerCase().includes(q) ||
        e.productName.toLowerCase().includes(q) ||
        e.productSku.toLowerCase().includes(q)
    );
  }

  const paginated = filtered.slice((page - 1) * limit, page * limit);
  return {
    enquiries: paginated,
    total: filtered.length,
    countNew: store.enquiries.filter((e) => e.status === 'New').length,
    countContacted: store.enquiries.filter((e) => e.status === 'Contacted').length,
    countCompleted: store.enquiries.filter((e) => e.status === 'Completed').length,
    countCancelled: store.enquiries.filter((e) => e.status === 'Cancelled').length,
  };
}

export async function updateEnquiryStatus(id: string, status: string) {
  const enq = store.enquiries.find((e) => e._id === id);
  if (!enq) return null;
  enq.status = status;
  enq.updatedAt = new Date().toISOString();
  return enq;
}

export async function deleteEnquiry(id: string) {
  const idx = store.enquiries.findIndex((e) => e._id === id);
  if (idx === -1) return false;
  store.enquiries.splice(idx, 1);
  return true;
}
