---
name: Auth System
description: Real email/password authentication wired end-to-end — DB, API routes, frontend context, and QuickMenu panel.
---

# Auth System

## How it works
- **Backend**: `express-session` + `bcryptjs` on the API server (port 8080 internally, routed via `/api/*` by Replit proxy)
- **Session cookie**: `name: kaseet.sid`, `secure: true`, `sameSite: 'none'`, 7-day expiry. `trust proxy: 1` set on Express.
- **DB**: `usersTable` in `lib/db/src/schema/index.ts` — Postgres via Drizzle. Already migrated.
- **Routes**: `artifacts/api-server/src/routes/auth.ts` — POST /auth/register, /auth/login, /auth/logout, GET /auth/me (all under `/api/`)

## Frontend
- `AuthContext` at `artifacts/kaseet-academy/src/context/AuthContext.tsx` — `useAuth()` hook exposes `user`, `login`, `register`, `logout`
- `AuthProvider` wraps the whole app in `App.tsx` (outside `CurrencyProvider`)
- `QuickMenu` component is the new hamburger overlay panel — logo + search + menu rows. Clicking "دخول | تسجيل" closes QuickMenu then opens `AuthModal`
- `AuthModal` calls real API endpoints, shows loading/error states, closes on success

## Why sameSite: none
Replit path-based routing means the frontend (at `/kaseet-academy/`) and API (at `/api/`) share the same domain but different paths. `sameSite: none` + `secure: true` ensures the cookie is sent for cross-path requests through the Replit proxy.

## Test credentials (dev)
demo@kaseet.com / Demo1234 — created during development, id=1 in DB.
