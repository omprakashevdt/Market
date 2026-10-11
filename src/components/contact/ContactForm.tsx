'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Thank you! Your message has been received. Our team will contact you.');
      (e.target as HTMLFormElement).reset();
    }, 500);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Send an Instant Message</h3>
      <p className="text-xs text-gray-500 mb-6">Our procurement leads review messages daily.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            required
            placeholder="Full Name"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Work Email / Phone</label>
          <input
            type="text"
            required
            placeholder="email@company.com or phone"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Message / Requirements</label>
          <textarea
            rows={3}
            required
            placeholder="Tell us what product and volume you are looking for..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition"
        >
          {submitting ? 'Sending...' : 'Submit Message'}
        </button>
      </form>
    </div>
  );
}
