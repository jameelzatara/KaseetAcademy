---
name: Admin system backend
description: Durable invariants for consultant auth, discount codes, and referral tracking
---

- Consultant sessions are re-checked against the DB on every admin request — deactivating an account revokes access immediately. Login regenerates the session (drops any prior admin identity); logout destroys it. **Why:** stored session flags alone allowed disabled accounts to keep access.
- Session cookie is SameSite=None, so state-changing admin routes reject untrusted Origin headers (CSRF guard). Requests without an Origin header (curl/server) pass.
- Discount invariants: money columns are integer JOD/USD → always round after applying a discount; on the deposit plan the discounted total is clamped to ≥ the fixed deposit (deposit is always charged, remaining never negative).
- Discount max-uses is enforced by an **atomic claim before payment is issued** (conditional increment), released on session expiry / PI cancel / creation failure. **Why:** validating then counting after payment let concurrent buyers oversell the cap.
- Admin schema is applied idempotently at server startup (IF NOT EXISTS DDL) so production deploys don't need a manual schema push; courses auto-seed from the pricing config when empty.
- Referrals: checkout accepts an optional consultant ref, validated against active accounts and silently ignored if invalid — a bad ref must never block a buyer.
- Testing gotcha: session cookie is secure-only — exercise auth flows via `https://$REPLIT_DEV_DOMAIN`, not localhost.
