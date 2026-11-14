# FAAVY E-Commerce Platform - Technical & Architectural Decisions

This document records the architectural and engineering decisions made during the autonomous development of FAAVY.

---

## 1. Architecture & Framework Choice

- **Decision:** Next.js 15/16 with App Router and Server Components by default.
- **Rationale:** Server Components eliminate client-side secret exposure, optimize initial payload sizes, and enable fast SSR for e-commerce SEO. Client components are restricted strictly to interactive boundaries (cart drawer, variant selectors, animations, modals, checkout inputs).

---

## 2. Monetary Units & Pricing Integrity

- **Decision:** All monetary values in the database and calculations are stored as **integers in Kobo** (1 NGN = 100 Kobo).
- **Rationale:** Prevents floating-point rounding errors during tax, discount, or delivery calculations. The client UI formats kobo into formatted Naira strings (e.g. `₦45,000`).
- **Cart & Order Integrity:** The frontend never submits total prices or prices per item. The server looks up the product and variant from the database, computes subtotal, applies verified discounts, calculates delivery fees, and validates stock atomically within Prisma database transactions.

---

## 3. Database & ORM (Neon PostgreSQL & Prisma)

- **Decision:** PostgreSQL hosted on Neon serverless, managed via Prisma ORM with connection pooling support.
- **Connection Configuration:**
  - `DATABASE_URL`: Neon pooled connection string for serverless API routes and query execution.
  - `DIRECT_URL`: Neon direct unpooled connection string for schema migrations and introspections.
- **Schema Design Standards:**
  - All foreign keys explicitly enforced with cascading rules where appropriate.
  - Snapshotting on `OrderItem`: Stores `productName`, `variantName`, `sku`, and `unitPriceInKobo` at the exact time of order to maintain historical financial and audit accuracy regardless of future product updates.
  - `InventoryMovement` log: Every stock deduction or addition creates an immutable audit record tied to an order, shipment, or manual admin adjustment.

---

## 4. Authentication & Authorization (Better Auth)

- **Decision:** Better Auth for session management, role-based access control (`CUSTOMER`, `ADMIN`), and credential verification.
- **Rationale:** Modern TypeScript-native authentication library with official Prisma adapter, built-in session handling, secure cookie defaults, and clean role management.
- **Admin Security:** All `/admin/*` routes and API endpoints verify the active session and require `role === "ADMIN"` on the server before processing data.

---

## 5. Motion System & Visual Aesthetics

- **Decision:** Framer Motion (`framer-motion`) orchestrated with reusable presets and custom cubic-bezier curves matching luxury editorial fashion.
- **Design Tokens:**
  - Warm Ivory: `#FAF8F5`
  - Deep Charcoal: `#1A1A1A`
  - Pure Black: `#0D0D0D`
  - Champagne Gold: `#C5A880` & `#D4AF37`
  - Cream Accent: `#F5F2EB`
- **Accessibility:** All motion components wrap interactions with `useReducedMotion()` checks, falling back to instant opacity transitions for users requesting reduced motion.

---

## 6. Payment Processing (Paystack Sandbox)

- **Decision:** Server-to-server transaction initialization via Paystack API with HMAC SHA512 webhook signature verification.
- **Idempotency Strategy:**
  - Paystack reference is unique in the `Payment` table.
  - Webhook processor verifies `x-paystack-signature` using the secret key.
  - If a payment is already marked `PAID`, subsequent webhook deliveries are acknowledged with `200 OK` without duplicating inventory deduction or sending duplicate emails.

---

## 7. Logistics & WhatsApp Strategy

- **Decision:** Provider-neutral `ShippingService` interface with a `ManualFulfillmentAdapter` default, alongside ready evaluation blueprints for Shipbubble and GIG Logistics.
- **WhatsApp Integration:** Dynamic deep link generator (`https://wa.me/<number>?text=<encoded_message>`) pre-populating item details, variant selections, and unique order reference codes.
