---
name: Course page structure
description: Visual tokens, section backgrounds, and CSS classes used on MasarElamiPage.tsx
---

## Section background rhythm — /masar-elami

Two alternating darks + one cream:
- `#161E2B` (A) — Hero, Study, Trainers, Advisor, Final CTA
- `#1A2332` (B) — Tree, Enroll, FAQ
- `#F6F2E9` (cream) — Outcomes (section 4 only), bordered `2px solid #FFC107` top+bottom

Constants in MasarElamiPage.tsx:
- `S1 = '#1A2332'` (Tree, FAQ)
- `S2 = '#161E2B'` (Study)
- `S3 = '#161E2B'` (Trainers, Final CTA)
- `S4 = '#1A2332'` (Enroll)
- `S5 = '#161E2B'` (Advisor)

**Why:** No gradient transitions between dark↔cream — hard borders only. Two adjacent same-color sections read as one block.

## CSS classes in index.css

### Outcome panel (cream section)
- `.masar-outcome-panel` — single white panel, `grid-template-columns: repeat(4,1fr)`, `overflow:hidden`, no gap
- `.masar-oc` — cell with `border-left: 1px solid rgba(24,32,47,.10)`; hover → `#FBF8F1`
- `.masar-oc-n` — Poppins 44px, color `#8A6200` opacity 0.30
- `.masar-oc-title` — has `::before` gold bar (34px×3px `#FFC107`) via CSS pseudo-element
- `.masar-oc-desc` — color `#56617A`
- Responsive: 2-col @ 900px, 1-col @ 560px

### Advisor card
- `.masar-advisor` — grid 300px+1fr, `--card:#242F40`, gold border `rgba(255,193,7,.28)`, `overflow:hidden`
- `.masar-advisor-photo` — `::before` radial golden halo z-index 1; img at z-index 2; `::after` fade gradients at z-index 3
- `::after` gradient direction: `to left` (photo on right side); on mobile flips to `to top`
- `.masar-advisor-live` — green badge z-index 4, uses `<i />` as dot
- `.masar-advisor-body` — padding 40px 38px (mobile: 28px 24px 32px)

**Why:** `::after` gradient must use `--card` exact color; one degree off produces a visible seam.

## Neon blobs
- `ka-blob-1/2/3` classes in index.css for animated gradient blobs on dark sections

## Gold rule on cream
- Text: use `#8A6200` (contrast 5.9:1), never `#FFC107` (contrast 1.6:1 on light)
- Decorative bars/lines: `#FFC107` is fine (not text)
