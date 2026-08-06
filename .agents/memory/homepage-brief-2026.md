---
name: Homepage Brief 2026 Implementation
description: Key decisions and facts from implementing the two briefs (homepage fixes + legal pages) in August 2026
---

# Homepage Brief Implementation (2026-08-06)

## Brand & Legal Facts
- Legal name: **بيركلي للصوتيات المسموعة** (tax: 200189476)
- Trade name: **كاسيت أكاديمي** · استوديو كاسيت
- Domain: **kaseet.com** · Email: **info@kaseet.com**
- Phone: +962 79 023 4483 · WhatsApp: +962 77 105 2222
- Address: شارع باريس، مجمع حجازي البيّر، شارع عبد الرحيم الحاج محمد 67، عمّان
- Hours: الأحد–الخميس · 9:00 ص – 7:00 م · الجمعة والسبت مغلق

## Numbers — site-wide constants (NEVER hardcode elsewhere)
- File: `src/data/stats.ts` · Values: 600 students, 40 batches, 5.0 Google rating, 88 reviews
- Gold color: always `#FFC107` (never amber, never `#F59E0B`)

## Route changes
- Old `/masar-elami` → redirects → `/masterclass-elam`
- Old `/masar-soti`  → redirects → `/masterclass-voice`
- Old `/masar-khataba` → redirects → `/masterclass-khataba`
- Redirects done via Wouter `<Redirect>` component in App.tsx

## Terminology
- "المسار الإعلامي" → "ماستركلاس الإعلام"
- "المسار الصوتي" → "ماستركلاس التعليق والأداء الصوتي"
- "مسار فن الخطابة" → "ماستركلاس فن الخطابة والتواصل القيادي"
- "المستشارة التعليمية" → "ياقوت"
- "استوديوهات كاسيت ميديا" → "استوديو كاسيت"
- "معتمد من وجيز" → "شهادة معتمدة من تطبيق وجيز" (linked to wajez.com)

## Architecture decisions

### CurrencyContext
- File: `src/context/CurrencyContext.tsx`
- Data: `src/data/currency.ts` (9 currencies, JOD default, fixed rates 2026-08-01)
- Wraps App in App.tsx; Navbar reads it for currency pill dropdown
- **Why:** Brief requires currency selector in Navbar + display in course prices

### Stats
- `src/data/stats.ts` is single source of truth for 600/40/5.0
- CountUp uses easeOutQuart + IntersectionObserver (fires once, disconnects after)
- **Why:** Brief forbids hardcoded numbers scattered across components

### TestimonialsSection — cream background
- Section bg: `#F5F4F0`, card bg: `rgba(255,255,255,0.80)`
- Text colors flipped to dark (`#1A2533`)
- Google Maps chip replaces old internal rating badge
- Wrap-around carousel (no disabled arrows)
- "اقرأ المزيد" expand for text > 120 chars

### SiteFooter
- Removed: conversion strip, Google chip from brand column, aggregateRating from JSON-LD
- Fixed: email→kaseet.com, copyright→2026 بيركلي, hours→9-7, address clickable
- "سمّعنا صوتك" link rendered in gold

### Legal pages
- All 4 pages completely rewritten with professional Arabic content
- NOT to be published before review by licensed Jordanian lawyer
- Pages: /privacy-policy (12 sections), /terms (15 sections), /refund-policy (10 sections + table), /cookies (7 sections)

### FAQSection
- 8 new Q&As replacing old 5; first Q open by default
- FAQPage JSON-LD schema embedded inline in component

### HeroSection
- Waveform replaced with 2 thin polyline SVGs
- Two CTA buttons added below subtext
- Scrim changed to strong left-right + bottom gradient
- Title shadow: `0 2px 18px rgba(0,0,0,.55)` (not amber glow)
