---
name: Launch 13 items
description: Status of all 13 pre-launch items for Kaseet Academy
---

All 13 items complete as of Aug 2026.

| # | Item | Status |
|---|---|---|
| ① | Fix cohorts 201/202/203 + public-speaking capacity=15 | ✅ |
| ② | contact.ts, fix hours (10:00/20:00), SiteFooter add Saturday | ✅ |
| ③ | Unified sendEmail Resend wrapper, wired to webhook | ✅ |
| ④ | sheetsSync 16 cols (A–P) + phone apostrophe + warning row | ✅ |
| ⑤ | Delete student auth system entirely | ✅ |
| ⑥ | prerender.mjs — post-build static HTML for OG tags | ✅ artifacts/kaseet-academy/prerender.mjs; wired into build script |
| ⑦ | Fix alt texts | ✅ |
| ⑧ | Security headers (CSP, HSTS, Permissions-Policy) | ✅ |
| ⑨ | Umami analytics via Analytics.tsx (conditional on VITE_UMAMI_WEBSITE_ID) | ✅ |
| ⑩ | Blog — 5 PDF guides as lead magnets | ✅ Content rewritten from actual PDFs |
| ⑪ | /events page | ✅ |
| ⑫ | /trainers + /trainers/:slug | ✅ |
| ⑬ | Course JSON-LD schema | ✅ |

**Blog PDF sources (correct mapping):**
- khamat-sawt → دليل_سوق_التعليق_الصوتي_1786559999332.pdf
- makharij-huruf → Kaseet_Makharij_Guide_1786559999332.pdf
- studio-manzili → كاسيت_دليل_الاستوديو_المنزلي_1786559999332.pdf (was wrong before, now fixed)
- khomul-nutq → دليل_كاسيت_علاج_خمول_النطق_1786559999333.pdf (image-based; content extracted via visual render)
- taswiq-sawti → KASEET_Marketing_Guide_1786559999332.pdf

**Navigation links:**
- /blog, /trainers, /events added to QuickMenu (PAGE_LINKS array, uses wouter Link)
- /blog, /trainers, /events added to SiteFooter NAV_LINKS

**Prerender script:**
- artifacts/kaseet-academy/prerender.mjs
- Runs after vite build via: "build": "vite build && node prerender.mjs"
- Generates static index.html with OG+Twitter meta tags for: 5 blog posts, blog index, 6 course pages, 4 trainer pages, trainers index, events, static pages

**User actions still required:**
- Set VITE_UMAMI_WEBSITE_ID in Replit Secrets (after creating site on cloud.umami.is)
- Stripe API keys in Replit Integrations (for live checkout)
- RESEND_DOMAIN_VERIFIED=true after DNS verification
