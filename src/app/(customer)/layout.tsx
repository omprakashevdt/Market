import React, { Suspense } from 'react';
import { CustomerHeader } from '@/components/layout/CustomerHeader';
import { CustomerFooter } from '@/components/layout/CustomerFooter';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="h-20 bg-white border-b" />}>
        <CustomerHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
      <CustomerFooter />
    </div>
  );
}
