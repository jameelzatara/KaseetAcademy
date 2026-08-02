---
name: Course page structure
description: Established pattern for kaseet-academy course detail pages
---

Course detail pages follow this section structure and color scheme:

**Colors:**
- Most sections: light background `#F5F4F0`
- Registration section only: dark `#0D0B14`
- Gold accent: `#FFC107`; Raspberry icon accent: `#e01e8c`

**Section order:**
1. Hero — light bg, two-col (course info right + floating dark-navy pricing card left, sticky)
2. Registration — dark `#0D0B14` with animated neon blobs (`.ka-blob-1/2/3` CSS classes in index.css), single-accordion TrackCard2
3. About + Goals — light bg, two-col (main content + sticky advisor sidebar in `#181325`)
4. Expected Outcomes — light bg, 2-col card grid with icon badges (raspberry colored)
5. Curriculum — light bg, print button, accordion lectures (in-person: 2hr each) + structured modules (online)
6. Instructors — light bg, full-width stacked horizontal cards
7. Footer CTA — dark navy band

**Routing:** `/courses/voiceover` = comprehensive program, `/courses/voiceover-basics` = basics course

**Why:** User spec document `Pasted-1-Off-white...txt` established all-light-except-registration convention.
