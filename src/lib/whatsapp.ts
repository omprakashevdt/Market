export interface WhatsAppMessageParams {
  siteName: string;
  productName: string;
  productId: string;
  category: string;
  listedPrice: number;
  currency: string;
  pricingUnit: string;
  quantity: number;
  offerPrice: number;
  totalOffer: number;
  customerName?: string;
  customerPhone?: string;
  customerMessage?: string;
}

export function generateWhatsAppMessage(params: WhatsAppMessageParams): string {
  const currencySymbol = params.currency === 'INR' ? '₹' : params.currency;

  const lines = [
    `Hello,`,
    ``,
    `I am interested in the following product enquiry:`,
    ``,
    `*Project:* ${params.siteName}`,
    `*Product:* ${params.productName}`,
    `*Category:* ${params.category}`,
    `*Product ID:* ${params.productId}`,
    `*Listed Price:* ${currencySymbol}${params.listedPrice.toLocaleString('en-IN')} / ${params.pricingUnit}`,
    `*Quantity:* ${params.quantity.toLocaleString('en-IN')} ${params.pricingUnit}(s)`,
    `*My Offer:* ${currencySymbol}${params.offerPrice.toLocaleString('en-IN')} / ${params.pricingUnit}`,
    `*Estimated Total:* ${currencySymbol}${params.totalOffer.toLocaleString('en-IN')}`,
  ];

  if (params.customerName && params.customerName.trim().length > 0) {
    lines.push(`*Customer Name:* ${params.customerName.trim()}`);
  }
  if (params.customerPhone && params.customerPhone.trim().length > 0) {
    lines.push(`*Customer Phone:* ${params.customerPhone.trim()}`);
  }
  if (params.customerMessage && params.customerMessage.trim().length > 0) {
    lines.push(``, `*Note:* ${params.customerMessage.trim()}`);
  }

  lines.push(
    ``,
    `Please let me know the availability and whether this offer can be accepted.`,
    `Thank you.`
  );

  return lines.join('\n');
}

export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  // Clean phone number: remove non-digits
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
