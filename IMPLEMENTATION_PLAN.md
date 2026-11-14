# FAAVY E-Commerce Platform - Detailed Implementation Plan

## Overview
FAAVY is a high-end Nigerian corporate-wear and luxury fashion accessories e-commerce platform based in Oye, Ekiti, Nigeria. This plan outlines the technical execution phases following the autonomous brief.

---

## Phase Breakdown

### Phase 1: Foundation Architecture
- [ ] Initialize Next.js project with App Router, TypeScript, and Tailwind CSS.
- [ ] Configure custom theme tokens:
  - Backgrounds: Warm Ivory (`#FAF8F5`), Cream (`#F4EFE6`), Pure Black (`#0C0C0C`), Charcoal (`#18181B`).
  - Accents: Champagne Gold (`#D4AF37`, `#C5A880`, `#E5C158`).
  - Typography: Serif headings (Playfair Display / Cormorant Garamond / Cinzel style) + Sans-serif body/UI (Inter / Plus Jakarta Sans).
- [ ] Set up Prisma ORM configured for Neon PostgreSQL with connection pooling (`DATABASE_URL`) and direct connection (`DIRECT_URL`).
- [ ] Design and generate core database schema:
  - User, Session, Account, Verification (Better Auth compatible)
  - Customer, Address
  - Category, Product, ProductVariant, ProductImage
  - Cart, CartItem
  - Order, OrderItem
  - Payment, Shipment, InventoryMovement, Discount, StoreSettings
- [ ] Configure authentication via Better Auth with email/password and admin role enforcement.
- [ ] Set up reusable motion design system using `framer-motion`:
  - `motion-provider.tsx`, `motion-variants.ts`, `fade-in.tsx`, `reveal.tsx`, `stagger-container.tsx`, `page-transition.tsx`.
- [ ] Implement foundational UI primitives (Button, Input, Select, Dialog, Sheet, Badge, Card, Table, Toast).

### Phase 2: Catalogue & Storefront
- [ ] Seed database with initial FAAVY corporate collections:
  - Luxury Two-Piece Suits, Oxford Cotton Shirts, Tailored Trousers, Silk Ties, Handcrafted Shoes, Artisanal Perfume Oils, Corporate Gowns, Tailored Pencil Skirts, Power Blazers.
- [ ] Public Header & Navigation with desktop dropdowns, mobile sliding drawer, search trigger, and cart badge.
- [ ] Editorial Homepage:
  - Hero section with staggered typography reveal and curated visual collage.
  - Curated collection highlights ("The Executive Edit", "Bespoke Suiting", "Fragrance & Accessories").
  - Featured products grid with hover micro-interactions.
  - Made-to-order vs Ready-to-wear value proposition banner.
  - Testimonial / Brand editorial statement.
- [ ] Shop & Category Listing:
  - Filtering by category, availability (Ready-to-wear / Made-to-order), price range, size, colour.
  - Sorting (Newest, Price Low-High, Price High-Low).
  - Search functionality with real-time query support.
- [ ] Product Detail Page:
  - Multi-image gallery with thumbnail switcher and zoom / lightbox.
  - Variant selector (independent stock tracking per size/colour).
  - Lead-time indicator for made-to-order items.
  - Size guide modal.
  - Care & Fabric details.
  - WhatsApp enquiry direct button for specific variant.
- [ ] Static Information Pages:
  - About FAAVY (Oye, Ekiti roots, African craftsmanship, premium tailoring).
  - Contact Us with enquiry form.
  - Shipping & Returns, Terms & Conditions, Privacy Policy.

### Phase 3: Cart & Checkout Engine
- [ ] Guest Shopping Cart:
  - Persistent client-side / cookie-synced cart.
  - Server validation on modification: stock availability, active pricing, valid variants.
  - Quantity controls, item removal, slide-out cart drawer with animated transitions.
- [ ] Checkout Flow:
  - Guest checkout (no mandatory registration).
  - Form validation with Zod (Nigerian states, local phone formatting, email, street address).
  - Server-calculated subtotals, delivery rates, discounts.
  - Order snapshot persistence (locks in unit prices, variant details, SKU at time of purchase).

### Phase 4: Payment System (Paystack Sandbox)
- [ ] Paystack integration module:
  - Server-side transaction initialization (Paystack API standard endpoint).
  - Return URL & callback verification on the server.
  - Secure webhook endpoint (`/api/webhooks/paystack`) with cryptographic HMAC SHA512 signature verification.
  - Idempotent order state transitions (prevents double-crediting or duplicate stock deductions).
  - Independent status tracking: `Order.status` vs `Payment.status`.

### Phase 5: Admin Operations & Dashboard
- [ ] Admin route protection via server-side session and role inspection (`ADMIN` role required).
- [ ] Overview dashboard: Revenue, orders, average order value, low stock alerts, recent transactions.
- [ ] Product & Variant Manager:
  - Create, update, archive products.
  - Multi-variant matrix builder (size x colour with SKU and stock counts).
  - Image upload handler (Cloudinary integration + fallback direct media storage).
- [ ] Order Management:
  - Status progression workflow (`PENDING_PAYMENT` -> `CONFIRMED` -> `PROCESSING` -> `READY_FOR_DISPATCH` -> `SHIPPED` -> `DELIVERED`).
  - Order item snapshot inspector and customer communication log.
- [ ] Inventory Management & Audit Log:
  - Stock level adjustments with mandatory `InventoryMovement` reasons (Sale, Restock, Damage, Return, Manual Adjustment).
- [ ] Store Settings & WhatsApp Configuration:
  - Configurable WhatsApp business phone, banner announcements, lead times.

### Phase 6: Delivery & WhatsApp Integration
- [ ] Shipping Provider Abstraction:
  - Interface `ShippingProvider` defining `getRates()`, `createShipment()`, `trackShipment()`.
  - Nigerian logistics evaluation (Shipbubble, GIG Logistics, Courier Plus).
  - Robust Manual Fulfillment Adapter (default active provider when API keys are not yet configured).
  - Waybill / tracking number generator and status tracking.
- [ ] WhatsApp-Assisted Ordering:
  - Pre-filled WhatsApp message generator for single products (with SKU, size, color, price).
  - Cart-to-WhatsApp order summary with order reference.
  - Configurable business phone number management.

### Phase 7: Quality Assurance, Security & Polish
- [ ] Automated testing suite for business logic (server pricing, inventory deduplication, webhook signature verification).
- [ ] Security audits: SQL injection safety (Prisma parameterized queries), rate limiting, CORS/CSP headers, zero client-exposed secrets.
- [ ] Performance and accessibility: Lighthouse scores, image optimization, `prefers-reduced-motion` compliance.
- [ ] Full build verification: `npm run lint` and `npm run build`.
- [ ] Comprehensive documentation handover files.
