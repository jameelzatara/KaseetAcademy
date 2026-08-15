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

**Why:** Single-source-of-truth for masterclass UI prevents drift between three previously-separate 1000-line files.

**How to apply:** To add a fourth masterclass, add a factory fn to masterclasses.ts and a thin wrapper page — do not touch MasterclassLayout unless a new UI section is needed.
