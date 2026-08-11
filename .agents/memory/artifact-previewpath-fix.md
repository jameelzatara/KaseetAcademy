---
name: Artifact previewPath fix
description: History of the kaseet-academy artifact path — was /kaseet-academy/, now correctly at /
---

## Current state (corrected)
- `previewPath = "/"` — artifact now served at root
- `paths = ["/"]` — proxy routes all traffic here
- `BASE_PATH = "/"` — Vite base and Wouter base are both root

**Why:** The site is kaseet.com's sole product; having it at /kaseet-academy/ made the root a 404 and wasted the canonical URL.

## Redirect in place
App.tsx has client-side Wouter redirects for the old prefix:
```tsx
<Route path="/kaseet-academy" component={() => <Redirect to="/" />} />
<Route path="/kaseet-academy/:rest*" component={() => <Redirect to="/" />} />
```
These are client-side only (no HTTP 301). A true server-side 301 is not possible with Replit static serving; the rewrite rules only support URL rewriting, not HTTP status codes.

## How to apply
`import.meta.env.BASE_URL` is now `/` in both dev and production. No asset path prefix changes needed.

**Why:** Original previewPath was /kaseet-academy/ because that matched the monorepo slug by convention. Corrected to / because this is a single-product site.
