---
name: Assets alias path
description: Where @assets resolves in the kaseet-academy Vite config
---

The `@assets` import alias in `artifacts/kaseet-academy` points to the workspace-root `attached_assets/` directory, NOT to `src/assets/`.

**Why:** The Vite config uses `path.resolve(import.meta.dirname, '..', 'attached_assets')`, so any new image/asset must be placed (or copied) into `attached_assets/` before it can be imported as `@assets/filename`.

**How to apply:** When converting or adding new images (e.g. HEIC → JPG), run magick/convert, then copy to `attached_assets/<filename>` and import as `@assets/<filename>`.
