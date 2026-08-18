---
name: Admin dashboard UI
description: Structure and conventions of the admin dashboard frontend at /admin
---

- Lives in `artifacts/kaseet-academy/src/pages/admin/` — `AdminDashboard.tsx` (login + shell), `context.tsx` (dual-role auth), `api.ts`, `components.tsx`, `admin.css`, `sections/*`. Old `AdminOrdersPage.tsx` deleted; route is `/admin` (`/admin/orders` redirects there).
- Public site `Navbar` is hidden for `/admin*` routes via `ChromeAwareNavbar` in `App.tsx`.
- CSS is scoped under a `.ka-admin` wrapper; active-state class convention is `.on` (not `.is-active`); shell classes: `.ka-topbar`, `.ka-content`, `.ka-side-foot`, `.ka-logout`.
- **Why / lesson:** section interfaces must be written against the actual API responses in `admin.ts` / `adminSections.ts` — voice-evaluations is a review pipeline (`submittedAt`, `pending/reviewed/accepted/rejected`, `audioRef`, `reviewer`) and instagram-leads is campaign analytics (`campaignName`, `leadCount`, `conversionCount`), not contact lists. Verify shapes with grep before wiring.
- **How to apply:** consultant role sees only Orders/Cohorts/Courses/Discounts/Consultants/VoiceEvals; base course prices are admin-only on both create and edit (server strips them for non-admins in POST /admin/courses).
