---
name: Round 2 update status
description: Status of the 5-file Round 2 update package from /tmp/kaseet_docs2/; tracks what's complete and what still needs work.
---

## Source files
- `00-ترتيب-التنفيذ.md` — execution order
- `01-النظام-العام.md` — tokens, typography, icons, terminology, header, AuthModal, ShareModal, OG tags
- `02-الهوم-ستروكشر.md` — homepage sections
- `03-قالب-صفحة-الدورة.md` — CoursePageLayout template
- `04-قالب-الماستركلاس.md` — MasterclassLayout template

## Completed ✅

### File 01 — General System
- CSS tokens: full 30-variable `:root` block (--canvas, --card, --gold, --teal, --steel, --violet, --green, --red, --z-nav: 9999, etc.)
- Typography scale: body 16.5px, h1–h3, p, small/.meta
- Navbar: moved to App.tsx (renders once), zIndex 9999, transparent on hero + solid after scroll via IntersectionObserver; removed from 9 individual pages
- paddingTop fixes: all masterclass pages (92px) and course pages (clamp 98px→130px)
- **AuthModal**: rebuilt with dark theme (--card: #22303F), gold tabs + CTA (--gold: #FFC107), Escape key close, body overflow hidden, correct texts ("أهلاً بعودتك" / "أنشئ حسابك")
- **ShareModal**: already complete (5 options: WhatsApp, Facebook, LinkedIn, Instagram/copy, copy-link; body scroll lock; toast; dark theme)
- **OG tags**: og:image:width + og:image:height added to index.html; `usePageMeta` hook created at `src/hooks/usePageMeta.ts`; added to 7 pages (MasarSoti, MasarKhataba, MasarElam, CoursePresenter, CourseArabic, CoursePublicSpeaking, CourseVoiceoverLive)
- **Section IDs**: id="stats" (StatsBar), id="masterclasses" (TracksSection), id="voices" (ReelsSection), id="reviews" (TestimonialsSection), id="faq" (FAQSection) ✅
- **focus-visible**: `outline: 2px solid #FFC107; outline-offset: 3px` in index.css ✅
- **skip-to-content link**: `<a href="#main">تجاوز إلى المحتوى</a>` in Navbar ✅
- **Terminology sweep** completed: all "أونلاين/عن بُعد" → "مباشر تفاعلي (Online LIVE)", "كاسيت ميديا" → "كاسيت أكاديمي", "المسار الإعلامي" → "ماستركلاس الإعلام" (in user-visible strings)

### File 02 — Homepage
- HeroSection: "استكشف" scroll target → #stats
- StatsBar: id="stats"
- TracksSection: id="masterclasses"; heading fixed; "اكتشف الآن ↗" badge removed; hours label "عملاً" → "مخرجاً"
- ConsultationSection: hours Sat–Thu 10am–8pm, Fri closed
- SiteFooter: same hours + footnote
- CoursesSection: dual-mode pricing (MapPin/Wifi icons), dead code removed; featured card footer with icons

### FAQSection
- 8 questions confirmed as per spec ✅

### TestimonialsSection
- Wrap-around carousel (RTL correct), dot indicators, "اقرأ المزيد" expand — already implemented ✅

## Remaining / Not Done

### File 01 remaining
- `usePageMeta` not yet added to CourseVoiceoverPage (line 986) and CourseBasicsPage (line 989) — large files, not done for safety
- **Consultation Section header text**: spec §4.2 says "تحدّث مع مستشاراتنا الأكاديميات مباشرة — نحن هنا للمساعدة" — check if already updated

### File 02 remaining
- **Reviews / TestimonialsSection**: Google Maps badge link (https://maps.app.goo.gl/WmBQBMA6f3nbb6gn7) — visual badge only, NOT in JSON-LD aggregateRating

### Files 03 + 04 — Major templates (NOT started)
- `CoursePageLayout.tsx` — unified template for all 6 course pages
- `MasterclassLayout.tsx` — unified template for all 3 masterclass pages
- Migrating existing pages to use these layouts is a large refactor

### Open blockers
- Task #54 — WhatsApp number for MasarSotiPage advisor button (آية القماز) — awaiting user input; button stays disabled per spec

## Key decisions
- `usePageMeta` hook at `src/hooks/usePageMeta.ts` — updates document.title + OG/Twitter meta tags dynamically
- AuthModal uses dark theme (#22303F card, gold CTA) — matches design system
- ShareModal already used the dark theme from prior session ✅
- All terminology changes done via string replacement in src files (not data files checked)
