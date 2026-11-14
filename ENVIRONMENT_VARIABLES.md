# FAAVY - Environment Variables Guide

This document describes all environment variables used by the FAAVY platform.

> **CRITICAL SECURITY NOTE:** Never commit the `.env` or `.env.local` files to version control. Keep production credentials secure.

---

## Required Configuration (.env.example)

```env
# Database (Neon PostgreSQL)
# Pooled connection string (used at runtime by Next.js app)
DATABASE_URL="postgresql://neondb_owner:<password>@<host>-pooler.<region>.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Direct unpooled connection string (used by Prisma migrations/CLI)
DIRECT_URL="postgresql://neondb_owner:<password>@<host>.<region>.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Application Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="generate-a-secure-random-32-byte-hex-string"
BETTER_AUTH_URL="http://localhost:3000"

# Paystack (Payments)
PAYSTACK_PUBLIC_KEY="pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
PAYSTACK_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
PAYSTACK_WEBHOOK_SECRET="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# WhatsApp Business Integration
NEXT_PUBLIC_WHATSAPP_NUMBER="2348000000000"
NEXT_PUBLIC_STORE_NAME="FAAVY"
NEXT_PUBLIC_STORE_LOCATION="Oye, Ekiti, Nigeria"

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Resend (Email Notifications)
RESEND_API_KEY="re_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="orders@faavy.com"

# Shipping & Logistics (Optional / Sandbox)
SHIPBUBBLE_API_KEY=""
GIG_LOGISTICS_API_KEY=""
```

---

## Verification Checklist

1. Ensure `DATABASE_URL` connects with SSL mode enabled.
2. Ensure `PAYSTACK_SECRET_KEY` matches Paystack Dashboard test secret in development.
3. Better Auth secret can be generated with: `openssl rand -hex 32`.
