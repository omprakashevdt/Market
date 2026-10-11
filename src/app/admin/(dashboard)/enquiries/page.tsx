import React from 'react';
import Link from 'next/link';
import { getEnquiries } from '@/lib/dataService';
import { EnquiriesTable } from './EnquiriesTable';
import { Search } from 'lucide-react';

interface Props {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}

export default async function AdminEnquiriesPage({ searchParams }: Props) {
  const { status = 'all', search = '', page = '1' } = await searchParams;

  const pageNum = parseInt(page, 10);
  const limit = 20;

  const { enquiries, total, countNew, countContacted, countCompleted, countCancelled } =
    await getEnquiries({
      status,
      search,
      page: pageNum,
      limit,
    });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Enquiry Pipeline</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review customer bulk offers, update deal lifecycle, and dispatch WhatsApp follow-ups.
        </p>
      </div>

      {/* Status Filter Tabs & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <Link
            href="/admin/enquiries"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              status === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            All Enquiries ({countNew + countContacted + countCompleted + countCancelled})
          </Link>

          <Link
            href="/admin/enquiries?status=New"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              status === 'New'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-amber-400 hover:bg-slate-800'
            }`}
          >
            New ({countNew})
          </Link>

          <Link
            href="/admin/enquiries?status=Contacted"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              status === 'Contacted'
                ? 'bg-blue-500 text-white font-black'
                : 'text-blue-400 hover:bg-slate-800'
            }`}
          >
            Contacted ({countContacted})
          </Link>

          <Link
            href="/admin/enquiries?status=Completed"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              status === 'Completed'
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'text-emerald-400 hover:bg-slate-800'
            }`}
          >
            Completed ({countCompleted})
          </Link>

          <Link
            href="/admin/enquiries?status=Cancelled"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              status === 'Cancelled'
                ? 'bg-red-500 text-white font-black'
                : 'text-red-400 hover:bg-slate-800'
            }`}
          >
            Cancelled ({countCancelled})
          </Link>
        </div>

        {/* Search Input */}
        <form action="/admin/enquiries" method="GET" className="relative w-full md:w-72">
          {status !== 'all' && <input type="hidden" name="status" value={status} />}
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search by customer, phone, product..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Enquiries Interactive Table */}
      <EnquiriesTable enquiries={enquiries} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            Page {pageNum} of {totalPages} ({total} matching enquiries)
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <Link
                key={idx + 1}
                href={`/admin/enquiries?page=${idx + 1}${status ? `&status=${status}` : ''}${
                  search ? `&search=${search}` : ''
                }`}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  idx + 1 === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                {idx + 1}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
