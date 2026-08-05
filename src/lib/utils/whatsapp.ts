export const DEFAULT_VARS_WHATSAPP_NUMBER = "905418340908"; // VARS export sales line +90 541 834 09 08

export interface WhatsAppMessageParams {
  phone?: string;
  productTitle?: string;
  categoryTitle?: string;
  latinName?: string;
  pageUrl?: string;
  customMessage?: string;
  cartItems?: Array<{ title: string; quantity: number }>;
}

/**
 * Constructs a pre-formatted, UTF-8 encoded wa.me URL for instant WhatsApp inquiries.
 */
export function createWhatsAppUrl(params: WhatsAppMessageParams): string {
  const phone = (params.phone || DEFAULT_VARS_WHATSAPP_NUMBER).replace(/\D/g, "");

  if (params.customMessage) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(params.customMessage)}`;
  }

  let text = `Hello VARS Aquaculture Export Sales Team,\n\n`;

  if (params.productTitle) {
    text += `I would like to request an urgent B2B quote & availability for:\n`;
    text += `*Product*: ${params.productTitle}`;
    if (params.latinName) {
      text += ` (_${params.latinName}_)`;
    }
    text += `\n`;
    if (params.categoryTitle) {
      text += `*Category*: ${params.categoryTitle}\n`;
    }
    if (params.pageUrl) {
      text += `*Reference*: ${params.pageUrl}\n`;
    }
    text += `\nPlease provide CIF pricing, MOQ, and earliest shipping availability to my location.`;
  } else if (params.cartItems && params.cartItems.length > 0) {
    text += `I have selected the following items from your portal for a consolidated quote:\n`;
    params.cartItems.forEach((item, index) => {
      text += `${index + 1}. *${item.title}* (Qty: ${item.quantity})\n`;
    });
    text += `\nPlease send a formal pro-forma quote with air freight / cold-chain logistics options.`;
  } else {
    text += `I am contacting you from the VARS B2B Portal regarding wholesale aquaculture feed, salmon ova, or seafood export inquiries.\n\nPlease connect me with an export specialist.`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
