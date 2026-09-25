# Avyzen Imports — Production E-Commerce Platform

A production-grade, full-stack e-commerce and curated product showcase website built for **Avyzen Imports** (+8801939846312).

---

## 🌟 Key Features & Architectural Highlights

### 1. Storefront & Customer UX
- **Flagship Showcase & Shop Catalog (`/shop`)**: Multi-faceted filtering by category, price slider, stock availability, and sorting (price low-high, high-low, newest drops, top ratings).
- **SEO-Optimized Product Pages (`/products/[slug]`)**: JSON-LD structured data (`Product`, `Offer`, `BreadcrumbList`, `Organization`), dynamic Open Graph tags, interactive multi-image galleries, and related products recommendations.
- **Product Variants System**: Support for colors, editions, and sizes with independent SKUs, real-time stock counters, and dynamic pricing.
- **Persistent Shopping Bag (`/cart`)**: LocalStorage synchronisation, subtotal recalculation, free delivery threshold indicator, and direct WhatsApp order generation.
- **Streamlined Checkout (`/checkout`)**: Guest checkout support, strict Zod validation on client and server, delivery address calculation (Inside vs Outside Dhaka), and real-time coupon validation (`AVYZEN10`, `WELCOME200`).
- **Post-Purchase & Invoice (`/order-confirmation/[orderId]`)**: Printable receipts, order summary, and structured WhatsApp confirmation button.
- **Real-Time Order Tracking (`/track-order`)**: 5-step visual fulfillment pipeline (Placed → Payment Confirmed → Processing & QC → Shipped → Delivered).

---

### 2. Official WhatsApp Integrations (+8801939846312)
- **Click-to-Chat Pre-Filled Inquiries**: Automatically generates inquiry messages with the product name and URL.
- **Structured Order Messages**: Pre-populates customer name, address, items, subtotal, shipping, discount, and order ID.
- **Official WhatsApp Business Platform / Cloud API Architecture**:
  - Secure server-side dispatch on confirmed payment/order creation.
  - Exponential backoff retry logic with comprehensive logging.
  - **Fail-safe decoupling**: WhatsApp API downtime or credential expiry will never fail customer orders or payments.

---

### 3. Modular Payment Architecture & Critical Security
- **Modular Payment Service**:
  - Cash on Delivery (COD) adapter.
  - Modular Online Payment Gateway adapter (compatible with SSLCommerz, bKash, Nagad, Stripe).
- **Strict Server-Side Validation**:
  - Item quantities and prices are recomputed against database records.
  - Totals from client requests are never trusted.
- **Cryptographic Webhook Endpoint (`/api/payments/webhook`)**:
  - HMAC SHA256 signature verification.
  - Idempotency key tracking to block duplicate transactions and replayed callbacks.
  - Status separation: `order_status` (`PENDING`, `PAYMENT_PENDING`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`) and `payment_status` (`UNPAID`, `PENDING`, `PAID`, `FAILED`).

---

### 4. Protected Admin Operations Portal (`/admin`)
- **Executive Analytics Dashboard (`/admin`)**: Real-time gross paid revenue, order volumes, low-stock inventory alerts, and recent transactions.
- **Product Management (`/admin/products`)**: Add/edit modal, price adjustments, compare price discounts, image URLs, variant management, and stock updates.
- **Order Fulfillment Hub (`/admin/orders`)**: Filter by workflow status, view customer notes, update order/payment statuses, and launch direct WhatsApp chats with customers.
- **Categories & Coupons (`/admin/categories`, `/admin/coupons`)**: View taxonomies and active promotional discount codes.

---

## 🛠 Technology Stack

- **Framework**: Next.js 16 (App Router with React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & custom design tokens
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form & Zod
- **Database & Auth**: PostgreSQL / Supabase
- **Hosting**: Vercel

---

## 🚀 Getting Started

### 1. Installation

```bash
git clone <repository-url>
cd "AVYZEN IMPORS1"
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your environment keys:
- `NEXT_PUBLIC_SITE_URL`: Your live production domain (e.g. `https://avyzenimports.com`).
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase project keys.
- `SUPABASE_SERVICE_ROLE_KEY`: Secret service-role key (server-side only).
- `PAYMENT_PROVIDER`, `PAYMENT_PUBLIC_KEY`, `PAYMENT_SECRET_KEY`, `PAYMENT_WEBHOOK_SECRET`.
- `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_VERIFY_TOKEN`.
- `ADMIN_WHATSAPP_NOTIFICATION_NUMBER`: `8801939846312`.

### 3. Database Setup (Supabase)

1. Open your Supabase Dashboard SQL Editor.
2. Run `supabase/migrations/20260325000001_initial_schema.sql` to create tables, constraints, indexes, and Row Level Security policies.
3. (Optional for development) Run `supabase/seed.sql` to populate initial categories, products, variants, and demo reviews.

### 4. Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build & Testing

```bash
npm run build
npm run start
```

---

## 🔒 Security Measures
- HTTP Security Headers enabled in `next.config.ts` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`, `Referrer-Policy`).
- Parameterized SQL execution and type-safe query boundaries.
- No sensitive keys or tokens exposed to client code.
