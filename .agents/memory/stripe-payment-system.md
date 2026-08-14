---
name: Stripe Payment System
description: Full Stripe Elements embedded checkout for masterclass pages — architecture, endpoints, and env var requirements
---

## Architecture

Kaseet uses TWO Stripe flows in parallel:
- **Legacy**: `POST /checkout/session` → Stripe Checkout Session (redirect-based) — old courses
- **New (PaymentIntent)**: `POST /checkout/payment-intent` → Stripe Elements in-page modal — masterclass pages

## Masterclass Payment Flow (Task #117)

### Frontend
- `src/lib/stripeClient.ts` — fetches publishable key from `GET /api/checkout/config`, caches the Stripe promise
- `src/components/PaymentModal.tsx` — 3-step modal: form → Stripe Elements (PaymentElement) → success/polling
  - Step 1 (form): mode (onsite/live), plan (deposit/full), customer info
  - Step 2 (payment): `<Elements>` with night theme, gold accent, Tajawal font, Arabic locale
  - Step 3 (success/polling): polls `/api/checkout/pi-status` until order confirmed
  - Handles 3DS redirect return: detects `?payment_intent=xxx&redirect_status=succeeded` in URL
- All 3 masterclass pages import `PaymentModal` and open it via `setModalOpen(true)`

### API Endpoints (checkout.ts)
- `GET /checkout/config` → `{ publishableKey }` from `STRIPE_PUBLISHABLE_KEY` env var
- `POST /checkout/payment-intent` → creates PI with full metadata (customer, cohort, mode, plan, amounts); returns `{ clientSecret, paymentIntentId, orderId }`
- `GET /checkout/pi-status?pi_id=xxx` → checks DB first, then Stripe; calls `onPaymentIntentSucceeded()` if succeeded
- `payment_intent.succeeded` webhook event → `onPaymentIntentSucceeded(pi)` (same handler)

### onPaymentIntentSucceeded
Mirrors `onSessionCompleted` but reads PI metadata. Uses `pi.id` as `sessionId` for idempotency.
Calls `createOrderWithSeat`, then `notifyOrderCompleted` + `sendOrderConfirmation` (fire-and-forget).

### Cohort IDs (masterclass)
- 301: masar-soti onsite, 302: masar-soti live
- 303: masar-khataba onsite, 304: masar-khataba live
- 305: masar-elami onsite, 306: masar-elami live

### Pricing (pricing.ts)
- masar-soti: 550 JOD / $750 USD
- masar-khataba: 500 JOD / $700 USD
- masar-elami: 700 JOD / $1000 USD
- Deposit for onsite: 50 JOD (DEPOSIT_JOD constant in currency.ts)

## Required Env Var

**`STRIPE_PUBLISHABLE_KEY`** must be set in Replit Secrets. It is the `pk_test_...` or `pk_live_...` key from the Stripe dashboard. This key is NOT secret (it's publishable) but must be added manually since it's not injected by the Stripe integration automatically.

**Why:** The Stripe integration auto-injects `STRIPE_SECRET_KEY` for server-side use, but the publishable key for the browser SDK is separate. The `GET /checkout/config` endpoint returns 503 until this env var is set.

## Stripe Appearance (PaymentElement)
Night theme, primary color #FFC107 (gold), background #1A2535, Tajawal font, locale `ar`, border radius 12px.
