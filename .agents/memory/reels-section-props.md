---
name: ReelsSection props
description: How to customise the shared ReelsSection component per page
---

`ReelsSection` (in `src/components/ReelsSection.tsx`) now accepts optional props:

- `badge?: string` — short pill label above the heading
- `heading?: ReactNode` — main heading; can include JSX (e.g. a `<span>` for gold accent)
- `description?: string` — subtext below the heading

Defaults match the homepage wording ("أصوات صنعناها معاً").

**Why:** MasarSotiPage needed a different reels title to avoid duplicate text with the homepage.

**How to apply:** Pass the props from the page component. `heading` is evaluated in the calling page's scope, so page-local constants (e.g. `GLD`) are in scope.
