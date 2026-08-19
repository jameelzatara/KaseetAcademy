---
name: Voice test static assets
description: Guardrails for the standalone voice-evaluation page's image assets and navigation.
---

The voice-evaluation experience is a standalone HTML page served directly from the public files rather than a React-rendered page. Its hero and evaluator portraits are referenced by literal file URLs, so asset cleanup based only on React imports will incorrectly classify them as unused.

**Why:** An image-optimization cleanup removed those public files, leaving the voice-test hero and evaluator cards with broken images even though the page itself still existed.

**How to apply:** Before deleting or relocating public assets, scan standalone HTML files as well as TypeScript/React imports. Keep the voice-test hero and evaluator images in public storage, and preserve its prominent home/back navigation controls when altering the page.