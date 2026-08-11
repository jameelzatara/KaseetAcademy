---
name: Backend files 08 + 09 implementation status
description: Status of DB migration, webhook hardening, KPI panel, phone field, WhatsApp templates
---

## ✅ Completed in session (Aug 2026)

### DB Migration (file 08 — step 1)
- `cohort_seats` seeded with IDs 137–143, 201–203 (10 cohorts from cohorts.json)
- `installments` relational table created
- `orders` flat columns added: first_name, last_name, phone, email, country, city, stripe_session_id, stripe_payment_id, charged_usd, notes
- `holds.status` column added (active | confirmed | released)
- Migration applied via psql, script at `lib/db/scripts/migrate-08.ts`

### orderUtils.ts (file 08 — step 2)
- `getCohortSeats(cohortId, fallbackCapacity, fallbackEnrolled)` — reads DB, auto-seeds if missing
- `createOrderWithSeat(params)` — raw pg transaction with SELECT … FOR UPDATE on cohort_seats
- Returns "created" | "duplicate" | "overbooked"
- Uses `pool` from `@workspace/db` (not a new Pool instance — avoids pg external resolution issue)

### checkout.ts (file 08 — step 3) ✅
- Webhook: `verifyStripeWebhook()` + `processWebhookEvent()` split
- app.ts responds 200 FIRST, then processWebhookEvent fires-and-forgets
- POST /checkout/session: reads seat availability from DB via getCohortSeats (ignores client-sent values)
- Overbooked: creates order with status="overbooked" + logs ERROR for manual intervention

### admin.ts (file 08 — step 4, file 09 KPI) ✅
- GET /admin/kpi: 5 KPI indicators (revenue, dues, seats, new orders 7d, completion rate)
- POST /admin/orders/:id/payment: updates BOTH relational installments table AND JSONB for backward compat
- POST /admin/orders/:id/status: cancel/refund without DELETE
- GET/POST /admin/cohorts/:id/seats: seat management
- GET /admin/cohorts: list all seat rows

### AdminOrdersPage.tsx (file 09 KPI + WhatsApp) ✅
- KPI dashboard: 5 cards with trend arrows (TrendingUp/Down), gold card for Dues
- WhatsApp templates: 3 ready-made links per order (تأكيد التسجيل, تذكير بالدفعة, تذكير بموعد الدورة)
- Manual payment modal updates relational installments table via API

### CheckoutPage.tsx (file 09 phone field) ✅
- PhoneField component: country picker (flag + +code) + numeric local input
- Jordan (+962) default; Arab countries first in list
- Drops leading zero: 079… → 96279… (not 9620 79…)
- fontSize: 16px (prevents iOS auto-zoom)
- direction: ltr on number input
- inputMode="numeric"
- Validation per country min/max digit count, Arabic error messages

## ✅ Google Sheet sync (file 08 — step 5) — COMPLETE
- Sheet ID stored in GOOGLE_SHEET_ID env var (shared)
- Integration: Replit Google Sheets OAuth connector (conn_google-sheet_01KZS4QSJNHWE0DC0FN66S6V68)
- Two tabs created automatically on first run: الطلبات + الدفعات المستحقّة
- Full overwrite every 15 min; startup sync after 20 s delay
- `artifacts/api-server/src/lib/sheetsSync.ts` — uses ReplitConnectors.proxy("google-sheet", ...)
- Tab names with Arabic text need single-quote wrapping in A1 notation: `'الطلبات'`
- @replit/connectors-sdk marked external in build.mjs; added to api-server/package.json
- No service account needed — OAuth connector uses the authorized Google account directly

### Stripe real keys (file 09 — §7)
- Still test mode; prerequisites in §7 not yet met

## Key decisions / constraints
- Revenue = installments.paid_at IS NOT NULL (not order value)
- Phone: drop leading zero with replace(/^0+/, ''), never prepend extra 0
- No DELETE ever — use status changes only
- pg must be in api-server/package.json (not just @workspace/db) for esbuild external resolution to work at runtime
