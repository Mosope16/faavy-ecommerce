# FAAVY - Project Owner Action Items
**Target Review Date:** Upon return after December 4, 2026

This document lists decisions and production credentials that specifically require the business owner's attention before live public launch. The system operates autonomously using safe development defaults and sandboxes in the meantime.

---

## 1. Credentials & Account Activations Required

| Service | Purpose | Action Required by Owner |
|---|---|---|
| **Paystack** | Live NGN Payment Processing | Provide Live Secret Key (`sk_live_...`) and Live Public Key (`pk_live_...`). Configure Live Webhook URL in Paystack Dashboard pointing to `https://<your-domain>/api/webhooks/paystack`. |
| **WhatsApp Business** | Customer Concierge & Enquiries | Provide official FAAVY WhatsApp Business phone number with country code (e.g. `2348123456789`). |
| **Domain & DNS** | Custom Brand Domain | Register brand domain (e.g., `faavy.ng` or `faavy.com`) and configure DNS records on Vercel. |
| **Cloudinary** | Production Product Image CDN | Provide production Cloudinary Cloud Name, API Key, and API Secret. |
| **Resend** | Transactional Order Emails | Verify domain `faavy.com` on Resend and provide live API Key. |
| **Logistics Provider** | Live Shipping Rates & Waybills | Decide between Shipbubble, GIG Logistics, or dedicated local dispatch; provide production courier API credentials or use the provided Manual Fulfillment dispatch system. |

---

## 2. Business Policy Decisions

1. **Delivery Pricing Model:**
   - Flat rate per state/zone (e.g., Ekiti: ₦2,500; Lagos: ₦3,500; Rest of Nigeria: ₦5,000)?
   - Or real-time courier API rates with dynamic checkout calculation?
   - Default currently configured: Tiered regional flat-rate with manual fulfilment dispatch support.

2. **Made-to-Order Lead Times:**
   - Standard turnaround time for custom gowns, suits, and made-to-measure trousers.
   - Default currently configured: 7-14 business days production notice on made-to-order variants.

3. **Return & Exchange Policy:**
   - Standard return window (e.g., 7 days for unworn ready-to-wear with tags intact; bespoke made-to-order non-refundable unless defective).

4. **Initial Admin Credentials:**
   - Seed script creates a secure initial admin account (`admin@faavy.ng`). Owner should immediately update password upon return.
