---
name: kaseet-academy artifact previewPath fix
description: The kaseet-academy artifact had previewPath="/" causing Wouter routing to break completely — fix applied.
---

## Problem
The artifact.toml for `artifacts/kaseet-academy` had `previewPath = "/"` and `BASE_PATH = "/"`.
Replit's proxy served the app at `/kaseet-academy/...`, so `window.location.pathname` started with `/kaseet-academy/`.
But `import.meta.env.BASE_URL = "/"` → Wouter `base = ""` → routes like `/courses/voiceover-basics` couldn't match the full path `/kaseet-academy/courses/voiceover-basics` → ALL routes showed the app's 404 page.

## Fix
Updated `artifact.toml` via `verifyAndReplaceArtifactToml` to:
- `previewPath = "/kaseet-academy"`
- `paths = [ "/kaseet-academy" ]`
- `BASE_PATH = "/kaseet-academy/"`

**Why:** Vite sets `import.meta.env.BASE_URL` from `basePath = process.env.BASE_PATH`. The router uses `base = BASE_URL.replace(/\/$/, '')`. Setting BASE_PATH to the real served prefix makes Wouter strip it before matching routes.

**How to apply:** If routing breaks again (all pages show 404 except the app's own not-found page), check `artifact.toml` — previewPath and BASE_PATH must match the actual URL prefix Replit proxies the app at.
