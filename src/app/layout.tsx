import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'CatalogHub — Universal Bulk Marketplace & Custom Offer Platform',
    template: '%s | CatalogHub',
  },
  description:
    'Browse, negotiate, and order products in bulk. Direct WhatsApp enquiries, generic bulk pricing tiers, and custom offer acceptance for books, printing, merchandise, and more.',
  openGraph: {
    title: 'CatalogHub — Bulk Marketplace & Custom Offer Platform',
    description:
      'Order books, visiting cards, apparel, and corporate merchandise in bulk with custom offers.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'CatalogHub',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
