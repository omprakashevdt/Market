'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneCall, Mail, MessageSquare, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface EnquiryItem {
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
  status: 'New' | 'Contacted' | 'Completed' | 'Cancelled';
  createdAt: string;
}

interface EnquiriesTableProps {
  enquiries: EnquiryItem[];
}

export function EnquiriesTable({ enquiries }: EnquiriesTableProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      toast.success(`Enquiry marked as "${newStatus}"`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Error updating enquiry');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete enquiry from ${name}?`)) return;

    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete enquiry');

      toast.success('Enquiry record deleted');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting enquiry');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/40 text-[11px] text-slate-400 uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Customer Details</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Offer / Unit</th>
              <th className="px-6 py-4">Total Offer</th>
              <th className="px-6 py-4">Status & Action</th>
              <th className="px-6 py-4 text-right">Direct Outreach</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {enquiries.length > 0 ? (
              enquiries.map((enq) => {
                const isUpdating = updatingId === enq._id;
                return (
                  <tr key={enq._id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{enq.productName}</div>
                      <div className="text-xs text-slate-400">
                        {enq.category} • Listed: ₹{enq.listedPrice}/{enq.pricingUnit}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">SKU: {enq.productSku}</div>
                      {enq.message && (
                        <div className="mt-2 text-xs bg-slate-800/70 p-2 rounded-lg text-slate-300 border border-slate-700/60 max-w-xs">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Note:
                          </span>
                          "{enq.message}"
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{enq.customerName}</div>
                      <div className="text-xs text-slate-400 font-mono">{enq.customerPhone}</div>
                      {enq.customerEmail && (
                        <div className="text-xs text-slate-500">{enq.customerEmail}</div>
                      )}
                      <div className="text-[10px] text-slate-500 mt-1">
                        {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-white">
                      {enq.quantity.toLocaleString()} {enq.pricingUnit}s
                    </td>

                    <td className="px-6 py-4 font-mono text-slate-200">
                      ₹{enq.offerPrice.toLocaleString('en-IN')}
                    </td>

                    <td className="px-6 py-4 font-mono font-extrabold text-emerald-400 text-base">
                      ₹{enq.totalOffer.toLocaleString('en-IN')}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={enq.status}
                        disabled={isUpdating}
                        onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border focus:outline-none transition cursor-pointer ${
                          enq.status === 'New'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : enq.status === 'Contacted'
                            ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                            : enq.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-red-500/10 text-red-300 border-red-500/30'
                        }`}
                      >
                        <option value="New" className="bg-slate-900 text-white">
                          New
                        </option>
                        <option value="Contacted" className="bg-slate-900 text-white">
                          Contacted
                        </option>
                        <option value="Completed" className="bg-slate-900 text-white">
                          Completed
                        </option>
                        <option value="Cancelled" className="bg-slate-900 text-white">
                          Cancelled
                        </option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${enq.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${enq.customerName}, this is regarding your bulk order enquiry for ${enq.productName} (${enq.quantity} units @ ₹${enq.offerPrice}/unit). We can accept this offer. Let us know your delivery timeline!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                          title="Open WhatsApp chat"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => handleDelete(enq._id, enq.customerName)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  No enquiries match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
