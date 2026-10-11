'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Menu, X, ShoppingBag, MessageCircle, ChevronDown, Layers } from 'lucide-react';

interface CategoryItem {
  name: string;
  slug: string;
}

export function CustomerHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  // Sync search input with URL query param if present
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Fetch dynamic categories for navigation dropdown
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data.map((c: any) => ({ name: c.name, slug: c.slug })));
        }
      })
      .catch(() => {
        // Fallback default categories if database is empty initially
        setCategories([
          { name: 'Self Help', slug: 'self-help' },
          { name: 'Business', slug: 'business' },
          { name: 'Printing', slug: 'printing' },
          { name: 'Custom Products', slug: 'custom-products' },
          { name: 'Fiction', slug: 'fiction' },
        ]);
      });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-gray-900 tracking-tight block">
                Catalog<span className="text-blue-600">Hub</span>
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wide block uppercase">
                Bulk Marketplace & Offers
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, books, categories, SKUs..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 bg-gray-50/70 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </form>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </Link>

            <Link
              href="/products"
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
            >
              All Products
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                onBlur={() => setTimeout(() => setCategoriesOpen(false), 200)}
                className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
              >
                Categories <ChevronDown className="w-4 h-4" />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <span className="block px-4 py-2 text-xs text-gray-400">Loading...</span>
                  )}
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
            >
              Contact
            </Link>
          </nav>

          {/* Direct WhatsApp Action & Admin Link */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}?text=${encodeURIComponent(
                'Hello! I would like to inquire about bulk ordering.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs rounded-full border border-emerald-200 transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Bulk WhatsApp</span>
            </a>

            <Link
              href="/admin"
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition"
            >
              Admin Portal
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (under header) */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-gray-800 hover:text-blue-600 border-b border-gray-100"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-gray-800 hover:text-blue-600 border-b border-gray-100"
          >
            All Products
          </Link>

          <div>
            <span className="block py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Browse Categories
            </span>
            <div className="grid grid-cols-2 gap-2 pl-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 text-sm text-gray-600 hover:text-blue-600"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-gray-800 hover:text-blue-600 border-b border-gray-100"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-gray-800 hover:text-blue-600 border-b border-gray-100"
          >
            Contact
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-blue-600"
          >
            Go to Admin Dashboard →
          </Link>
        </div>
      )}
    </header>
  );
}
