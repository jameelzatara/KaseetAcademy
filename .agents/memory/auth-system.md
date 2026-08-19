---
name: Auth System
description: Visitor Clerk accounts and the separate admin session system
---

## Current state (August 2026)

**Public visitor accounts: Clerk**
- Visitors can create an account or sign in with email/password or configured OAuth providers.
- The account flow is a compact public-site modal and returns to the homepage.
- Accounts support future marketing/newsletter communication; they are not a course portal or student dashboard.
- Clerk browser/API proxying is included for production custom-domain support.

**Admin auth: separate and intact**
- Administrative access continues to use the existing consultant/admin session system.
- A visitor Clerk account must never grant admin or consultant access.

**Why:** Visitor identity is needed for opt-in contact and future announcements, while student enrollment and internal administration remain separate workflows. Clerk avoids managing public passwords in the project.

**How to apply:**
Keep the Clerk public-account experience on the public site only. Do not add a dashboard, course access, or admin privileges unless the user explicitly requests that product change.
