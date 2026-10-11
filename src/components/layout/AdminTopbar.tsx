'use client';

import React from 'react';
import Link from 'next/link';
import { UserCheck, Plus, ExternalLink } from 'lucide-react';

export function AdminTopbar() {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Admin Console
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Product</span>
        </Link>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-800 text-slate-300 text-xs">
          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-semibold">Super Administrator</span>
        </div>
      </div>
    </header>
  );
}
