---
name: Round 2 update status
description: Status of the unified cohorts.json migration and brochure/PDF updates across all course pages
---

## Status: ✅ COMPLETE

All 5 course pages have been migrated to use the unified `cohorts.json` data source.

## What Was Done

### Unified data source
- `src/data/cohorts.json` — copied from `attached_assets/cohorts_1786452738779.json`
- Old per-course files (`cohorts-basics.json`, `cohorts-voiceover.json`) now unused
- Filter rule (global): `c.course === SLUG && c.mode === MODE && c.time_ar` — null `time_ar` means completely hidden

### Per-page mode keys
| Page | course slug | mode filter |
|---|---|---|
| CourseBasicsPage | voiceover | onsite |
| CourseVoiceoverLivePage | voiceover | live |
| CourseArabicLanguagePage | arabic-language | live |
| CoursePresenterPage | presenter | onsite |
| CoursePublicSpeakingPage | public-speaking | both (onsite + live) |

### Results
| Page | Open cohorts |
|---|---|
| CourseBasicsPage | Several onsite cohorts |
| CourseVoiceoverLivePage | 3 open (138, 141, 143) |
| CourseArabicLanguagePage | 0 → shows empty state |
| CoursePresenterPage | 0 → shows empty state |
| CoursePublicSpeakingPage | 0 in both tabs → shows empty state |

### Empty state
Pages with 0 open cohorts show: "الدفعات القادمة ستُعلَن قريباً" + "أبلغني فور الإطلاق" WhatsApp CTA.

### Platform fix
VoiceoverLivePage: changed "Zoom" → "Google Meet" (both hero card and CohortsSection subtitle). JSON cohorts have `platform: "Google Meet"`.

### Nullable fields handled
`FillBar` and `CohortRow` in all 5 pages handle `fill | null`, `remaining | null`, `time_ar | null` safely with `?? 0` fallback.

### Trainer display
CohortRow in all 5 pages shows trainer name at the bottom of each cohort card (User icon + `c.trainer`).

### Brochures
`public/brochures/` has 4 PDFs: voiceover-live.pdf, arabic-language.pdf, presenter.pdf, public-speaking.pdf.
Download button appears in CurriculumSection of all 4 new pages (BasicsPage has it in hero).
