---
name: Auth System
description: Current authentication architecture after student auth deletion
---

## Current state (Aug 2026)

**Student auth: DELETED**
- `AuthModal.tsx` — deleted
- `AuthContext.tsx` — deleted
- `routes/auth.ts` — deleted (API)
- `AuthProvider` removed from App.tsx
- `useAuth` removed from Navbar.tsx and QuickMenu.tsx
- `router.use(authRouter)` removed from routes/index.ts

**Admin auth: INTACT** (keep always)
- `routes/admin.ts` — Express routes with bcrypt + session
- `AdminOrdersPage.tsx` — protected admin panel
- Session config in app.ts: `kaseet.sid`, sameSite:none (required for Replit path-routing)
- ADMIN_PASSWORD env var in Replit Secrets

**Why student auth was deleted:**
It was never used by real students; consultants handle enrollment manually. Removing it simplifies the codebase and removes an attack surface.

**How to apply:**
Never recreate student auth without explicit user request. If auth is ever needed again, prefer Clerk (see clerk-auth skill) rather than custom session auth.
