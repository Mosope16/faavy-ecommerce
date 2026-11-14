import { formatNaira } from "./utils";

export interface WhatsAppProductEnquiry {
  productName: string;
  variantName?: string;
  sku?: string;
  priceInKobo: number;
  quantity: number;
  isMadeToOrder?: boolean;
  leadTimeDays?: number;
  whatsappNumber?: string;
}

export interface WhatsAppCartEnquiry {
  items: Array<{
    productName: string;
    variantName?: string;
    sku?: string;
    unitPriceInKobo: number;
    quantity: number;
  }>;
  subtotalInKobo: number;
  orderNumber?: string;
  customerName?: string;
  deliveryState?: string;
  whatsappNumber?: string;
}

export function buildProductWhatsAppUrl(enquiry: WhatsAppProductEnquiry): string {
  const number =
    enquiry.whatsappNumber ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    "2348140000000";
  const cleanNumber = number.replace(/[^0-9]/g, "");

  const lines = [
    `*FAAVY LUXURY CONCIERGE ENQUIRY*`,
    `----------------------------------`,
    `Hello FAAVY, I would like to enquire about:`,
    `*Item:* ${enquiry.productName}`,
    enquiry.variantName ? `*Variant:* ${enquiry.variantName}` : null,
    enquiry.sku ? `*SKU:* ${enquiry.sku}` : null,
    `*Quantity:* ${enquiry.quantity}`,
    `*Price:* ${formatNaira(enquiry.priceInKobo)}`,
    enquiry.isMadeToOrder
      ? `*Note:* Made-to-order piece (Est. lead time: ${enquiry.leadTimeDays || 7} days)`
      : null,
    `----------------------------------`,
    `Please assist me with sizing, delivery timeline, and order processing.`,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(lines)}`;
}

export function buildCartWhatsAppUrl(enquiry: WhatsAppCartEnquiry): string {
  const number =
    enquiry.whatsappNumber ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    "2348140000000";
  const cleanNumber = number.replace(/[^0-9]/g, "");

  const itemLines = enquiry.items.map(
    (item, index) =>
      `${index + 1}. *${item.productName}* (${item.variantName || "Standard"}) x${item.quantity} - ${formatNaira(
        item.unitPriceInKobo * item.quantity
      )}`
  );

  const lines = [
    `*FAAVY CONCIERGE ASSISTED ORDER*`,
    `----------------------------------`,
    enquiry.orderNumber ? `*Order Reference:* ${enquiry.orderNumber}` : null,
    enquiry.customerName ? `*Customer:* ${enquiry.customerName}` : null,
    enquiry.deliveryState ? `*Destination:* ${enquiry.deliveryState}` : null,
    `----------------------------------`,
    `*Selected Items:*`,
    ...itemLines,
    `----------------------------------`,
    `*Subtotal:* ${formatNaira(enquiry.subtotalInKobo)}`,
    `----------------------------------`,
    `Hello FAAVY, I would like to complete my order via WhatsApp concierge. Please confirm availability and delivery dispatch.`,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(lines)}`;
}
