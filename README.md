# FAAVY - Luxury Nigerian Corporate Fashion E-Commerce

FAAVY is a premier Nigerian corporate fashion house based in Oye, Ekiti, Nigeria. This repository contains the full-stack e-commerce web application, customer storefront, shopping experience, Paystack payments, WhatsApp assisted ordering, and complete administrative back-office.

---

## Brand & Visual Direction

- **Primary Colors:** Warm Ivory (`#FAF8F5`), Tailored Charcoal (`#1A1A1A`), Midnight Pitch (`#0D0D0D`)
- **Accents:** Champagne Gold (`#C5A880`, `#D4AF37`)
- **Typography:** Refined High-Fashion Serif Headings + Modern Clean UI Sans-serif
- **Motion:** Framer Motion luxury editorial choreography (smooth staggered reveals, refined micro-interactions, full reduced-motion accessibility support)

---

## Core Features

- **Storefront:**
  - Responsive luxury homepage with hero composition, brand story, and curated collections.
  - Shop catalogue with multi-attribute filtering (category, size, color, ready-to-wear vs made-to-order, price).
  - Product detail page with multi-image gallery, variant switcher, size guides, and stock availability.
  - WhatsApp concierge enquiry for individual products or entire shopping carts.
  - Full guest checkout without forced account registration.
  - Order lookup and self-service tracking.
- **Order & Inventory Engine:**
  - Real-time variant-level inventory tracking (independent stock per size/color).
  - Integer-kobo precision monetary calculations.
  - Server-calculated subtotals, discounts, and regional shipping rates.
  - Immutable order item snapshots (price, name, SKU locked at time of order).
- **Payments:**
  - Paystack NGN checkout integration (standard bank card, transfer, USSD).
  - Cryptographic HMAC-SHA512 webhook verification with idempotent processing.
- **Admin Dashboard:**
  - Secure authentication and role-based access control.
  - Overview KPI metrics (revenue, orders, low-stock warnings, average order value).
  - Product & Variant manager with image uploads.
  - Order fulfillment workflow and tracking number assignment.
  - Inventory audit movements log.
  - Store configuration settings.

---

## Tech Stack

- **Framework:** Next.js (App Router, React Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Motion:** Framer Motion (`framer-motion`)
- **Database:** Neon Serverless PostgreSQL
- **ORM:** Prisma
- **Auth:** Better Auth
- **Payments:** Paystack
- **Logistics:** Provider-neutral shipping abstraction with manual fulfillment fallback
- **Icons:** Lucide React

---

## Documentation

- [Implementation Plan](file:///home/sope/Projects/favvy/IMPLEMENTATION_PLAN.md)
- [Project Status](file:///home/sope/Projects/favvy/PROJECT_STATUS.md)
- [Technical Decisions](file:///home/sope/Projects/favvy/TECHNICAL_DECISIONS.md)
- [Environment Variables](file:///home/sope/Projects/favvy/ENVIRONMENT_VARIABLES.md)
- [Owner Action Items](file:///home/sope/Projects/favvy/OWNER_ACTION_ITEMS.md)
