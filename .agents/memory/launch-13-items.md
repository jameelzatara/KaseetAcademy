---
name: Launch 13 items
description: Status of the 13 pre-launch items from the Aug 2026 spec; what's done and what's deferred
---

All 13 items were executed. Summary:

✅ ① cohorts 201/202/203: time_ar/enrolled filled in; public-speaking capacity=15
✅ ② contact.ts created; SiteFooter opens/closes 10:00/20:00; dayOfWeek includes Saturday
✅ ③ email.ts Resend wrapper; sendOrderConfirmation wired after webhook; email_log auto-created
✅ ④ sheetsSync 16 cols (A-P); phone with apostrophe; warning row 1; data from row 3
✅ ⑤ Student auth fully deleted: AuthModal/AuthContext/routes/auth.ts gone; QuickMenu now has WhatsApp CTA
⚠️ ⑥ Prerender: only comment added to vite.config.ts — full SSR prerender deferred (needs entry-server.tsx + SSR-compatible components)
✅ ⑦ Alt texts: decorative images intentionally use alt="" aria-hidden="true" (correct)
✅ ⑧ Security headers: CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy: microphone=(self)
✅ ⑨ Analytics: Analytics.tsx component injects Umami conditionally via VITE_UMAMI_WEBSITE_ID env var
✅ ⑩ Blog: 5 articles + lead magnet form (name/WhatsApp/email) → PDF email via Resend; blog.ts API route
✅ ⑪ Events: EventsPage with empty state and EVENTS[] array ready for future entries
✅ ⑫ Trainers: trainers.ts data, TrainersPage grid, TrainerDetailPage with Person JSON-LD
✅ ⑬ Course JSON-LD: useEffect in CoursePageLayout injects Course schema for all 6 course pages; no aggregateRating

**Key missing user inputs:**
- VITE_UMAMI_WEBSITE_ID → add in Replit Secrets when Umami site created
- RESEND_DOMAIN_VERIFIED=true → flip after DNS records verified
- Cohort details (trainer/date/time) not yet stored in Stripe metadata → email shows generic text; consultant follows up

**Why:**
Prerender deferred because components use browser APIs (window, import.meta.env, etc.) at module level — SSR would require significant refactoring and carries high breakage risk for a production app.
