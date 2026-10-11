import React from 'react';
import Link from 'next/link';
import { getAdminMetrics } from '@/lib/dataService';
import {
  Package,
  FolderTree,
  MessageSquare,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  PhoneCall,
} from 'lucide-react';

export default async function AdminOverviewPage() {
  const {
    totalProducts,
    totalCategories,
    totalEnquiries,
    newEnquiries,
    featuredProducts,
    recentEnquiries,
  } = await getAdminMetrics();

  const cards = [
    {
      title: 'Total Products',
      value: totalProducts,
      subtitle: `${featuredProducts} featured in store`,
      icon: Package,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Active Categories',
      value: totalCategories,
      subtitle: 'Taxonomy segments',
      icon: FolderTree,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'New Enquiries',
      value: newEnquiries,
      subtitle: 'Awaiting supplier response',
      icon: Clock,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Total Enquiries',
      value: totalEnquiries,
      subtitle: 'Bulk WhatsApp leads',
      icon: MessageSquare,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Marketplace Intelligence</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time catalog analytics, bulk pricing tiers, and WhatsApp quote requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center gap-1.5"
          >
            <span>+ Add New Product</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition"
          >
            <span>Manage Enquiries</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {card.title}
                </span>
                <span className={`p-2.5 rounded-xl border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </span>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black text-white">{card.value.toLocaleString()}</div>
                <div className="text-xs text-slate-400 mt-1">{card.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              Recent Customer Offers & Enquiries
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Bulk requests submitted via website and dispatched to WhatsApp
            </p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All Enquiries</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/40 text-[11px] text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Unit Offer</th>
                <th className="px-6 py-4">Total Offer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {recentEnquiries.length > 0 ? (
                recentEnquiries.map((enq: any) => (
                  <tr key={enq._id.toString()} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4 font-semibold text-white">
                      <div className="font-bold">{enq.productName}</div>
                      <div className="text-xs text-slate-400">{enq.category} • SKU: {enq.productSku}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{enq.customerName}</div>
                      <div className="text-xs text-slate-400 font-mono">{enq.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-200">
                      {enq.quantity.toLocaleString()} {enq.pricingUnit}s
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300">₹{enq.offerPrice}</td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                      ₹{enq.totalOffer.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          enq.status === 'New'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : enq.status === 'Contacted'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : enq.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`https://wa.me/${enq.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${enq.customerName}, regarding your bulk offer for ${enq.productName}...`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 text-xs font-bold transition"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Follow Up</span>
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No customer enquiries recorded yet. Once customers make offers on products,
                    they will appear here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
