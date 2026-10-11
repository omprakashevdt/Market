import React from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageCircle, Mail, MapPin, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export function CustomerFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">Make Your Custom Offer</h4>
              <p className="text-sm text-gray-500 mt-1">
                Order in bulk with flexible custom pricing. We match and accept volume offers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">Instant WhatsApp Enquiries</h4>
              <p className="text-sm text-gray-500 mt-1">
                One-click WhatsApp quote generator connects you directly with our supply team.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">Verified Wholesale Catalog</h4>
              <p className="text-sm text-gray-500 mt-1">
                From books to custom printed goods, electronics to office stationery.
              </p>
            </div>
          </div>
        </div>

        {/* Links Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-black text-xl text-gray-900">
                Catalog<span className="text-blue-600">Hub</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              A universal bulk marketplace and enquiry platform for books, custom visiting cards,
              apparel, stationary, and bespoke manufactured goods.
            </p>
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} CatalogHub Inc. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-gray-900 text-sm mb-4">Quick Links</h5>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition">
                  Home Catalog
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-blue-600 transition">
                  Browse All Products
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-blue-600 transition">
                  Global Search
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition">
                  About Our Platform
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Categories */}
          <div>
            <h5 className="font-bold text-gray-900 text-sm mb-4">Featured Categories</h5>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <Link href="/category/self-help" className="hover:text-blue-600 transition">
                  Self Help & Growth
                </Link>
              </li>
              <li>
                <Link href="/category/printing" className="hover:text-blue-600 transition">
                  Printing & Cards
                </Link>
              </li>
              <li>
                <Link href="/category/business" className="hover:text-blue-600 transition">
                  Business & Finance
                </Link>
              </li>
              <li>
                <Link href="/category/custom-products" className="hover:text-blue-600 transition">
                  Custom Merchandise
                </Link>
              </li>
              <li>
                <Link href="/category/fiction" className="hover:text-blue-600 transition">
                  Fiction & Literature
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h5 className="font-bold text-gray-900 text-sm mb-4">Direct Contact</h5>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>support@cataloghub.com</span>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp: +91 98765 43210</span>
              </p>
              <p className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>Bulk Distribution Center, Industrial Hub, India</span>
              </p>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-block text-xs font-semibold text-gray-400 hover:text-gray-900 underline"
                >
                  Admin Portal Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
