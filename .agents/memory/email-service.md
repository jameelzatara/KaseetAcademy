---
name: Email service
description: How transactional email is sent — provider, env vars, and key decisions
---

# Email Service — Brevo REST API

## Provider
Brevo (formerly Sendinblue) via REST API (`https://api.brevo.com/v3/smtp/email`).
Not SMTP — the xkeysib- API key only works with the REST API, not smtp-relay.brevo.com.

## Env vars
- `BREVO_API_KEY` — Replit Secret; v3 key starting with `xkeysib-`
- `SENDER_EMAIL` — env var; currently `notify@kaseet.com` (Brevo account email)
- `replyTo` is hardcoded to `info@kaseet.com` in all templates

## Why not SMTP?
Brevo SMTP relay requires a separate SMTP key (not the v3 API key). Switching to REST API avoids the credential confusion entirely and works immediately.

## Why not Resend / Gmail?
- Resend: account was in trial mode, couldn't send to external addresses without domain DNS verification
- Gmail (info@kaseet.com): Google Workspace SMTP blocked even with App Password; personal Gmail also considered but user chose Brevo

## generateOrderId fix (same session)
Changed from in-memory counter (resets on restart → always KS-ORD-YYYY-0101) to async DB sequence (`kaseet_order_seq`). All callers must `await generateOrderId()`.

## How to apply
- `sendEmail()` in `artifacts/api-server/src/lib/email.ts` uses `fetch` to call Brevo API
- Attachments supported via `attachment` array in Brevo body (base64)
- Failures are logged to `email_log` table but never block payment processing
