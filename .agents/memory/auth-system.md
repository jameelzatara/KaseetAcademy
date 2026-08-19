---
name: Auth System
description: Visitor Clerk accounts and the separate admin session system
---

## Current state (August 2026)

**Public visitor accounts: Clerk**
- Visitors can create an account or sign in with email/password or configured OAuth providers.
- The account flow is a compact custom public-site modal and returns to the homepage.
- Accounts support future marketing/newsletter communication; they are not a course portal or student dashboard.
- Clerk browser/API proxying is included for production custom-domain support.
- The public sign-in form deliberately uses Clerk's custom flow API instead of its prebuilt components, so email and password are visible together; sign-up then asks for the required email verification code.

**Admin auth: separate and intact**
- Administrative access continues to use the existing consultant/admin session system.
- A visitor Clerk account must never grant admin or consultant access.

**Why:** Visitor identity is needed for opt-in contact and future announcements, while student enrollment and internal administration remain separate workflows. Clerk avoids managing public passwords in the project.

**How to apply:**
Keep the Clerk public-account experience on the public site only. Preserve the one-screen email/password sign-in experience; do not return to Clerk's staged identifier-first UI. Do not add a dashboard, course access, or admin privileges unless the user explicitly requests that product change.

**Google SSO in development**
- If Google returns 403 only after a visitor chooses their Google account, while the site has successfully reached `accounts.google.com`, the browser wiring is healthy. Configure Google OAuth credentials for the Development environment from Replit's Auth pane and add the exact callback URLs shown by its provider checklist.

**Why:** Shared development credentials can deny a particular custom development domain or Google account policy after Google authentication.

**How to apply:** Keep Development and Production Google provider credentials/configuration separate. Re-test the flow after saving the Development provider setup; apply the equivalent production configuration only when publishing.
