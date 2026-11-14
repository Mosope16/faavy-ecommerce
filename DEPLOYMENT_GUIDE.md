# FAAVY - Production Deployment Guide

This guide details the procedure for deploying FAAVY to production on Vercel with Neon PostgreSQL and Paystack.

---

## 1. Prerequisites

- A Vercel account with project creation permissions.
- Neon PostgreSQL database instance (Production branch).
- Live Paystack account with activated secret and public keys.
- Registered custom domain (e.g., `faavy.ng` or `faavy.com`).

---

## 2. Environment Variables Configuration

Set the following environment variables in the **Vercel Project Settings > Environment Variables**:

| Variable | Environment | Description |
|---|---|---|
| `DATABASE_URL` | Production | Neon pooled connection string with `?sslmode=require` |
| `DIRECT_URL` | Production | Neon direct unpooled connection string |
| `NEXT_PUBLIC_APP_URL` | Production | Canonical public URL (e.g. `https://faavy.ng`) |
| `BETTER_AUTH_SECRET` | Production | 32-byte cryptographically random hex string (`openssl rand -hex 32`) |
| `BETTER_AUTH_URL` | Production | Matching canonical public URL (e.g. `https://faavy.ng`) |
| `PAYSTACK_PUBLIC_KEY` | Production | Live Paystack Public Key (`pk_live_...`) |
| `PAYSTACK_SECRET_KEY` | Production | Live Paystack Secret Key (`sk_live_...`) |
| `PAYSTACK_WEBHOOK_SECRET` | Production | Paystack Webhook Secret (or live secret key) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Production | Official WhatsApp Business phone with country code (e.g. `2348140000000`) |
| `NEXT_PUBLIC_STORE_NAME` | Production | `FAAVY` |
| `NEXT_PUBLIC_STORE_LOCATION` | Production | `Oye-Ekiti, Ekiti State, Nigeria` |
| `CLOUDINARY_CLOUD_NAME` | Production | Cloudinary Cloud Name (optional for CDN media) |
| `CLOUDINARY_API_KEY` | Production | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Production | Cloudinary API Secret |

---

## 3. Database Deployment & Migration Steps

Run these commands locally or in CI/CD before initiating traffic:

```bash
# 1. Install dependencies
npm ci

# 2. Generate Prisma Client
npx prisma generate

# 3. Apply schema to production Neon database
npx prisma db push

# 4. Seed initial categories, flagship corporate wears, store settings, and admin user
node scripts/seed.mjs
```

---

## 4. Paystack Dashboard Configuration

1. Log in to the [Paystack Dashboard](https://dashboard.paystack.com).
2. Navigate to **Settings > API Keys & Webhooks**.
3. Set **Live Webhook URL** to:
   ```text
   https://<your-domain>/api/webhooks/paystack
   ```
4. Copy the **Live Webhook Secret** and save it in Vercel as `PAYSTACK_WEBHOOK_SECRET`.
5. Under **Preferences**, verify that NGN is enabled as the primary settlement currency.

---

## 5. Domain & DNS Configuration

1. On Vercel, navigate to **Settings > Domains**.
2. Add your custom domain (e.g. `faavy.ng` and `www.faavy.ng`).
3. Add the recommended DNS A records and CNAME records at your registrar:
   - Type: `A`, Name: `@`, Value: `76.76.21.21`
   - Type: `CNAME`, Name: `www`, Value: `cname.vercel-dns.com`
4. Verify SSL certificate auto-generation.

---

## 6. Post-Deployment Smoke Test Checklist

- [ ] Visit homepage `https://<your-domain>` and verify luxury hero animation.
- [ ] Browse `/shop` and test filtering by category.
- [ ] Open a product detail page, switch variants, and verify stock indicators.
- [ ] Test the WhatsApp Concierge link to ensure it opens WhatsApp with pre-filled details.
- [ ] Add item to bag and verify slide-out cart drawer.
- [ ] Test guest checkout with test order.
- [ ] Log in to `/admin` using initial credentials (`admin@faavy.ng`).
- [ ] Update admin password and configure live WhatsApp number in `/admin/settings`.
