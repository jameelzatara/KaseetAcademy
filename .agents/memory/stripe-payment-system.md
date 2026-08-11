---
name: Stripe Payment System
description: Full Stripe checkout system built for Kaseet Academy — architecture, key decisions, and activation steps.
---

## What was built
- `artifacts/api-server/src/lib/stripeClient.ts` — Replit connection API credentials fetcher
- `artifacts/api-server/src/lib/currency.ts` — FX config (1 JOD = 1.41 USD, hardcoded quarterly), DEPOSIT_JOD=50, toMinorUSD, jodToChargeUSD, splitInstallments
- `artifacts/api-server/src/lib/pricing.ts` — COURSE_PRICING map (server-side, not trusted from frontend)
- `artifacts/api-server/src/lib/orderUtils.ts` — hold lifecycle (createHold, confirmHold, releaseHold, sweepExpiredHolds), order ID generation (KS-ORD-YYYY-XXXX)
- `artifacts/api-server/src/routes/checkout.ts` — POST /api/checkout/session, GET /api/checkout/status, handleStripeWebhook
- `artifacts/api-server/src/routes/admin.ts` — POST /api/admin/login, GET /api/admin/orders, POST /api/admin/orders/:id/payment
- `kaseet-academy/src/pages/CheckoutPage.tsx` — 3-step flow (plan → customer → pay)
- `kaseet-academy/src/pages/CheckoutSuccessPage.tsx` — polling /api/checkout/status, 2s interval for up to 60s
- `kaseet-academy/src/pages/AdminOrdersPage.tsx` — password-gated orders dashboard
- DB tables: `orders` + `holds` (Drizzle ORM, pushed to prod via drizzle-kit push)

## Key architecture decisions

### Stripe Checkout (hosted, not Elements)
- All payments go through Stripe Checkout hosted page with `locale: 'ar'`
- Uses `price_data` (dynamic, per-cohort) NOT pre-created Stripe prices — each cohort is unique
- The Stripe skill says "never use price_data" but this is required for dynamic cohort pricing

### Currency rule
- **All Stripe charges in USD** (`CHARGE_CURRENCY = 'usd'`)
- JOD is display-only; server always converts with `jodToChargeUSD(n) = Math.ceil(n * 1.41)`
- `toMinorUSD(n) = Math.round(n * 100)` → cents
- Never pass `jod` as currency to Stripe

### Installment plan (onsite only)
- Deposit = 50 JOD → $71 USD charged now via Stripe
- Installments 2 & 3 = manual (cash/bank transfer, tracked in admin panel)
- Live/online courses: full payment only, no installment option shown

### Seat hold flow
- On checkout session creation: 30-minute hold created in `holds` table
- On `checkout.session.completed` webhook: hold confirmed, order created, seat decremented
- On `checkout.session.expired`: hold released
- Available seats = cohortCapacity - cohortEnrolled - activeHolds - confirmedOrders

### Webhook route
- MUST be registered BEFORE express.json() in app.ts (currently correct)
- Uses raw Buffer body → `stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)`
- Events handled: completed, expired, charge.refunded, charge.dispute.created

### Admin panel
- Route: `/admin/orders`
- Password: env var `ADMIN_PASSWORD` (default: 'kaseet-admin-2026' in dev, MUST set in production)
- Records manual cash/bank-transfer payments, updates remainingJOD and status

## Activation requirement (IMPORTANT)
Stripe credentials are fetched via Replit Connector API (`REPLIT_CONNECTORS_HOSTNAME`).
The Stripe integration was connected but API keys must be entered via the Replit Integrations UI.
Until keys are entered, the checkout endpoint returns a 500 error.
The server starts normally regardless (non-fatal init error).

## FX notice (mandatory for JOD courses)
Shown above the pay button whenever courseMode === 'onsite' (JOD-priced).
Text: "سعر البرنامج: X ديناراً · يُحصَّل ما يعادل $Y بالدولار"
Also appears in success page and should appear in confirmation emails.

## URL patterns
- Checkout: `/checkout?course=voiceover&cohort=137&mode=onsite`
- Success: `/checkout/success?session_id=cs_xxx`
- Admin: `/admin/orders`
- API: `/api/checkout/session`, `/api/checkout/status`, `/api/stripe/webhook`

**Why:** useLocation() in Wouter doesn't include query string — must use window.location.search instead.
