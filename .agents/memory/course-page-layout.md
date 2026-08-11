---
name: Shared CoursePageLayout
description: All 6 course pages now use CoursePageLayout — a single shared component. Any layout change goes in one file.
---

## Rule
Edit `src/components/CoursePageLayout.tsx` to change layout for ALL course pages.
Each page file (`CourseVoiceoverPage.tsx`, `CourseBasicsPage.tsx`, `CourseVoiceoverLivePage.tsx`, `CourseArabicLanguagePage.tsx`, `CoursePresenterPage.tsx`, `CoursePublicSpeakingPage.tsx`) is a thin wrapper — ~100–150 lines of data + `<CoursePageLayout {...config} />`.

**Why:** Eliminates copy-paste drift. Test: change one token (e.g. installment badge color) in the layout — all 6 pages change automatically.

## Key design decisions

### cohorts.json mode values
- `mode: 'onsite'` — in-person sessions
- `mode: 'live'` — online/live sessions (NOT 'online')
- `CourseVoiceoverPage` was migrated from `cohorts-voiceover.json` (which used `mode:'online'`) to `cohorts.json` (which uses `mode:'live'`)

### ModeConfig.cohortFilter
Each ModeConfig specifies `cohortFilter: 'onsite' | 'live'` — this is the `mode` value in `cohorts.json` used to filter cohorts for that page+mode combo.

### Single-mode vs dual-mode
- `modes.length === 1` → no tab switcher in CohortsSection, single price card in Hero
- `modes.length === 2` → tab switcher in CohortsSection, two radio-style price cards in Hero

### InstallmentStyle
- `'green'` → green chip (VoiceoverPage + BasicsPage — onsite studio courses)
- `'muted'` → gray chip (4 online/new courses)

### Advisors per page
- VoiceoverPage + BasicsPage: آية القماز (حضوري) + ياقوت الخشاشنة (أونلاين)
- VoiceoverLive + Arabic: ياقوت only
- Presenter: آية only
- PublicSpeaking: both (آية حضوري + ياقوت أونلاين)

### showBackLink
- `true` → VoiceoverPage only
- `false` → all others

### CourseSlug per page
- voiceover, voiceover-basics → `courseSlug: 'voiceover'`
- voiceover-live → `courseSlug: 'voiceover'` (same cohorts, live mode only)
- arabic-language → `courseSlug: 'arabic-language'`
- presenter → `courseSlug: 'presenter'`
- public-speaking → `courseSlug: 'public-speaking'`

## How to apply
When adding a new course page: create a thin wrapper that imports `CoursePageLayout` and passes a `CoursePageLayoutProps` config object. No need to copy any JSX — just data.
