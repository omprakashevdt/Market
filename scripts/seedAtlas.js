const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://omprakashevdt_db_user:yaM0A98ubgaedMSi@cluster0.ehc5f2n.mongodb.net/marketplace?retryWrites=true&w=majority&appName=Cluster0';

async function seed() {
  console.log('Connecting to MongoDB Atlas at:', MONGODB_URI.replace(/:[^:]*@/, ':****@'));
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected successfully to Atlas!');

  // Define minimal schemas for seeding
  const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({
    name: String,
    slug: String,
    description: String,
    image: String,
    productCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  }, { timestamps: true }));

  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
    title: String,
    slug: String,
    shortDescription: String,
    description: String,
    images: [String],
    category: String,
    author: String,
    sku: String,
    keywords: [String],
    pricing: {
      price: Number,
      originalPrice: Number,
      currency: { type: String, default: 'INR' },
      unit: { type: String, default: 'piece' },
    },
    bulkSettings: {
      enabled: { type: Boolean, default: true },
      minimumQuantity: { type: Number, default: 1 },
      maximumQuantity: { type: Number, default: 100000 },
      pricingTiers: [
        {
          minQuantity: Number,
          maxQuantity: Number,
          unitPrice: Number,
        },
      ],
    },
    offerSettings: {
      enabled: { type: Boolean, default: true },
      suggestedOffers: [Number],
    },
    inventory: {
      quantity: { type: Number, default: 100 },
      availability: { type: String, default: 'in_stock' },
    },
    featured: { type: Boolean, default: false },
    popular: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  }, { timestamps: true }));

  const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    role: { type: String, default: 'superadmin' },
  }, { timestamps: true }));

  // 1. Seed Categories
  const categoriesData = [
    {
      name: 'Self Help',
      slug: 'self-help',
      description: 'Personal development, habit formation, and productivity books and guides.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      active: true,
    },
    {
      name: 'Printing',
      slug: 'printing',
      description: 'Professional offset and digital printing: business cards, brochures, flyers, and stationery.',
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80',
      active: true,
    },
    {
      name: 'Custom Products',
      slug: 'custom-products',
      description: 'Custom corporate merchandise, personalized apparel, bags, and promotional goods.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      active: true,
    },
    {
      name: 'Business',
      slug: 'business',
      description: 'Finance, entrepreneurship, leadership, and management resources.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      active: true,
    },
    {
      name: 'Fiction',
      slug: 'fiction',
      description: 'Classic literature, gripping storytelling, and bestselling fiction novels.',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format&fit=crop&q=80',
      active: true,
    },
    {
      name: 'Stationery',
      slug: 'stationery',
      description: 'Premium notebooks, pens, office organizers, and desk accessories.',
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80',
      active: true,
    },
  ];

  for (const cat of categoriesData) {
    await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true });
  }
  console.log(`Seeded ${categoriesData.length} categories.`);

  // 2. Seed Products
  const productsData = [
    {
      title: 'Atomic Habits by James Clear',
      slug: 'atomic-habits',
      shortDescription: 'An easy and proven way to build good habits and break bad ones in bulk quantities.',
      description: `Atomic Habits by James Clear is the definitive guide to breaking bad behaviors and adopting good ones in four steps, showing how small, incremental, everyday routines compound into massive positive change.

Ideal for corporate gifting, university bookstores, libraries, and coaching institutions.
Available in paperback and hardcover editions with guaranteed publisher authenticity.`,
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
      ],
      category: 'Self Help',
      author: 'James Clear',
      sku: 'BOOK-AH-001',
      keywords: ['habits', 'productivity', 'james clear', 'psychology', 'bestseller'],
      pricing: {
        price: 499,
        originalPrice: 799,
        currency: 'INR',
        unit: 'piece',
      },
      bulkSettings: {
        enabled: true,
        minimumQuantity: 5,
        maximumQuantity: 5000,
        pricingTiers: [
          { minQuantity: 5, maxQuantity: 49, unitPrice: 480 },
          { minQuantity: 50, maxQuantity: 199, unitPrice: 420 },
          { minQuantity: 200, maxQuantity: 499, unitPrice: 380 },
          { minQuantity: 500, unitPrice: 340 },
        ],
      },
      offerSettings: {
        enabled: true,
        suggestedOffers: [450, 420, 390, 350],
      },
      inventory: {
        quantity: 2500,
        availability: 'in_stock',
      },
      featured: true,
      popular: true,
      active: true,
    },
    {
      title: 'Custom Velvet Touch Visiting Cards',
      slug: 'custom-visiting-cards',
      shortDescription: '350 GSM premium matte velvet laminated corporate business cards with gold foil options.',
      description: `Make a memorable impression with ultra-luxurious 350 GSM European cardstock. Finished with soft-touch velvet lamination on both sides, with optional spot UV or metallic foil highlights.

Print setup and color calibration included. Upload your vectors or let our in-house graphics team finalize the layout.`,
      images: [
        'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
      ],
      category: 'Printing',
      sku: 'PRINT-VC-350',
      keywords: ['visiting card', 'business card', 'printing', 'corporate identity', 'cards'],
      pricing: {
        price: 650,
        originalPrice: 900,
        currency: 'INR',
        unit: 'pack (100 cards)',
      },
      bulkSettings: {
        enabled: true,
        minimumQuantity: 5,
        maximumQuantity: 50000,
        pricingTiers: [
          { minQuantity: 5, maxQuantity: 19, unitPrice: 600 },
          { minQuantity: 20, maxQuantity: 49, unitPrice: 520 },
          { minQuantity: 50, maxQuantity: 199, unitPrice: 450 },
          { minQuantity: 200, unitPrice: 380 },
        ],
      },
      offerSettings: {
        enabled: true,
        suggestedOffers: [600, 550, 500, 450],
      },
      inventory: {
        quantity: 10000,
        availability: 'made_to_order',
      },
      featured: true,
      popular: true,
      active: true,
    },
    {
      title: 'Custom Bio-Washed Cotton T-Shirt',
      slug: 'custom-bio-washed-tshirt',
      shortDescription: '180 GSM 100% combed cotton crew-neck t-shirts customized with screen printing or embroidery.',
      description: `Premium unisex heavy cotton t-shirt designed for colleges, startups, corporate teams, and promotional events. Pre-shrunk, bio-washed fabric ensures zero color bleed and supreme comfort.

Supports front chest print, back oversized print, or sleeve woven badges. Available in sizes XS through 4XL.`,
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
      ],
      category: 'Custom Products',
      sku: 'APPAREL-TS-01',
      keywords: ['tshirt', 'apparel', 'custom merchandise', 'screen print', 'clothing'],
      pricing: {
        price: 450,
        originalPrice: 699,
        currency: 'INR',
        unit: 'piece',
      },
      bulkSettings: {
        enabled: true,
        minimumQuantity: 10,
        maximumQuantity: 20000,
        pricingTiers: [
          { minQuantity: 10, maxQuantity: 49, unitPrice: 420 },
          { minQuantity: 50, maxQuantity: 199, unitPrice: 360 },
          { minQuantity: 200, maxQuantity: 499, unitPrice: 310 },
          { minQuantity: 500, unitPrice: 260 },
        ],
      },
      offerSettings: {
        enabled: true,
        suggestedOffers: [400, 350, 300, 275],
      },
      inventory: {
        quantity: 5000,
        availability: 'in_stock',
      },
      featured: true,
      popular: true,
      active: true,
    },
    {
      title: 'The Psychology of Money by Morgan Housel',
      slug: 'the-psychology-of-money',
      shortDescription: 'Timeless lessons on wealth, greed, and happiness for finance lovers and teams.',
      description: `Morgan Housel shares 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of one of life's most important topics.

Outstanding resource for finance teams, wealth managers, and employee welcome kits.`,
      images: [
        'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&auto=format&fit=crop&q=80',
      ],
      category: 'Business',
      author: 'Morgan Housel',
      sku: 'BOOK-POM-02',
      keywords: ['finance', 'money', 'wealth', 'investing', 'psychology'],
      pricing: {
        price: 399,
        originalPrice: 499,
        currency: 'INR',
        unit: 'piece',
      },
      bulkSettings: {
        enabled: true,
        minimumQuantity: 5,
        maximumQuantity: 2000,
        pricingTiers: [
          { minQuantity: 5, maxQuantity: 24, unitPrice: 380 },
          { minQuantity: 25, maxQuantity: 99, unitPrice: 340 },
          { minQuantity: 100, unitPrice: 300 },
        ],
      },
      offerSettings: {
        enabled: true,
        suggestedOffers: [380, 350, 320, 300],
      },
      inventory: {
        quantity: 1200,
        availability: 'in_stock',
      },
      featured: false,
      popular: true,
      active: true,
    },
    {
      title: 'Hardcover PU Leather Executive Notebook',
      slug: 'executive-pu-leather-notebook',
      shortDescription: '192 ruled pages 100 GSM acid-free ivory paper with bookmark ribbon and pen loop.',
      description: `A sophisticated journal crafted with water-resistant vegan PU leather, expandable back pocket, and elastic closure band. Debossing or foil stamping of your company logo included for orders over 50 units.`,
      images: [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      ],
      category: 'Stationery',
      sku: 'STAT-NB-101',
      keywords: ['notebook', 'journal', 'stationery', 'leather notebook', 'executive'],
      pricing: {
        price: 299,
        originalPrice: 450,
        currency: 'INR',
        unit: 'piece',
      },
      bulkSettings: {
        enabled: true,
        minimumQuantity: 20,
        maximumQuantity: 10000,
        pricingTiers: [
          { minQuantity: 20, maxQuantity: 99, unitPrice: 280 },
          { minQuantity: 100, maxQuantity: 499, unitPrice: 240 },
          { minQuantity: 500, unitPrice: 195 },
        ],
      },
      offerSettings: {
        enabled: true,
        suggestedOffers: [270, 250, 220, 200],
      },
      inventory: {
        quantity: 3500,
        availability: 'in_stock',
      },
      featured: false,
      popular: true,
      active: true,
    },
  ];

  for (const prod of productsData) {
    await Product.findOneAndUpdate({ slug: prod.slug }, prod, { upsert: true, new: true });
  }
  console.log(`Seeded ${productsData.length} products.`);

  // 3. Seed Superadmin User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Admin@12345', salt);
  await AdminUser.findOneAndUpdate(
    { email: 'admin@marketplace.com' },
    {
      name: 'Super Administrator',
      email: 'admin@marketplace.com',
      passwordHash,
      role: 'superadmin',
    },
    { upsert: true }
  );
  console.log('Seeded Superadmin user (admin@marketplace.com / Admin@12345)');

  await mongoose.disconnect();
  console.log('Database seeding complete and connection closed.');
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
