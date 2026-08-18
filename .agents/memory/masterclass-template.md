---
name: Masterclass template
description: Architecture of the unified masterclass layout — where data lives, hero variants, and cohort IDs.
---

## Rule
Three masterclass pages (`/masterclass-voice`, `/masterclass-elam`, `/masterclass-khataba`) are thin wrappers. All JSX lives in `src/layouts/MasterclassLayout.tsx`; all text/data in `src/data/masterclasses.ts`.

## Hero variants (driven by data fields)
- `hero.heroCardSrc` present → portrait card column (voice)
- `hero.heroBgSrc` + `hero.useSpinningRing` → cover bg + SVG ring (elam)
- `hero.heroBgSrc` only → cover bg + centred text (khataba)

## Cohort IDs in cohorts.json
| slug | onsite | live |
|---|---|---|
| masar-soti | 301 | 302 |
| masar-khataba | 303 | 304 |
| masar-elami | 305 | 306 |

course keys in cohorts.json: `masar-soti`, `masar-elami`, `masar-khataba`

## Brief constraints preserved
- `reels.enabled: false` on all three (no written consent yet)
- `elam` + `khataba` → `stats.status: 'pending'` → no hero stats bar
- Gold #FFC107 on prices and primary CTA only
- Forbidden terms corrected in data (not in layout — layout is display-only)

## Standalone masterclass pages (Soti / Elami / Khataba)
These three pages are NOT thin wrappers — they are full standalone 1000-line TSX files in `src/pages/`.
- Each has its own Stripe checkout section (`id="checkout"`) with PaymentModal.
- DB prices: masar-soti 550 JOD/$750 · masar-elami 700 JOD/$1000 · masar-khataba 500 JOD/$700 (status=active).
- Installment notice shown for **both** onsite (50 JOD) and live ($71) modes — this is deliberate.
- DEPOSIT_JOD=50 / DEPOSIT_USD=71 constants live in PaymentModal.tsx (must stay in sync with server pricing.ts).
- CTA buttons (hero, section, sticky, FAQ) call `scrollToCheckout()` — NOT WA links.
- "اسأل عن جدول المدرّبين" WA link inside trainer section is intentional — keep as WA.
- MasterclassLayout.tsx priceJOD/priceUSD props use `?? 0` fallback (field type is `number | null`).

**Why:** Single-source-of-truth for masterclass UI prevents drift between three previously-separate 1000-line files.

**How to apply:** To add a fourth masterclass, add a factory fn to masterclasses.ts and a thin wrapper page — do not touch MasterclassLayout unless a new UI section is needed.
