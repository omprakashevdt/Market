import React from 'react';
import { Metadata } from 'next';
import { Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us & Wholesale Support — CatalogHub',
  description: 'Reach our wholesale supply desk via WhatsApp, email, or direct phone support.',
};

export default function ContactPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          We’re Here to Help Your Business
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Need a custom quotation, custom materials, or high-volume logistics support? Connect
          directly with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Direct WhatsApp Helpdesk</h3>
              <p className="text-xs text-gray-500 mt-1">Instant replies for bulk quotations & offers</p>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block font-bold text-emerald-600 hover:text-emerald-700 text-sm"
              >
                Chat on WhatsApp (+91 {whatsappNumber.slice(2)}) →
              </a>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Corporate Inquiries Email</h3>
              <p className="text-xs text-gray-500 mt-1">For formal purchase orders and vendor onboarding</p>
              <a
                href="mailto:support@cataloghub.com"
                className="mt-3 inline-block font-bold text-blue-600 hover:text-blue-700 text-sm"
              >
                support@cataloghub.com →
              </a>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-slate-50 text-slate-700 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Operational Hours</h3>
              <p className="text-xs text-gray-500 mt-1">Monday – Saturday: 9:00 AM – 7:30 PM IST</p>
              <p className="text-xs text-gray-400 mt-1">Emergency quote requests monitored 24/7</p>
            </div>
          </div>
        </div>

        {/* Client Form Component */}
        <ContactForm />
      </div>
    </div>
  );
}
