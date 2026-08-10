---
name: CoursePageLayout architecture
description: Unified layout for all 6 course pages; data files, acceptance test, and key decisions
---

# CoursePageLayout — موحَّد لجميع صفحات الدورات

## الملفات الجديدة

| الملف | الغرض |
|---|---|
| `src/types/courseTypes.ts` | CourseData interface — النوع الأساسي لبيانات الدورة |
| `src/data/instructors.ts` | YASAR, RANA, OMAR, SOHAIB + RANA_LANG + advisor photos |
| `src/data/courses/voiceover.ts` | voiceoverCourse + voiceoverLiveCourse (مشتقة بفلتر mode:'online') |
| `src/data/courses/presenter.ts` | presenterCourse |
| `src/data/courses/arabic.ts` | arabicCourse |
| `src/data/courses/publicSpeaking.ts` | publicSpeakingCourse |
| `src/components/CoursePageLayout.tsx` | القالب الموحَّد |

## اختبار القبول

**`INSTALLMENT_STYLE`** — const object في رأس `CoursePageLayout.tsx` يُعرِّف شارة التقسيط.
عدّله مرة واحدة → يتغير في كل الصفحات الست.
**Why:** الشارة مُعرَّفة في مكان واحد فقط، جميع الصفحات تستدعي `<CoursePageLayout course={...} />`.

## المسارات والملفات

| المسار | الملف | الدورة |
|---|---|---|
| `/courses/voiceover` | CourseVoiceoverPage.tsx | أساسيات |
| `/courses/voiceover-basics` | CourseBasicsPage.tsx | أساسيات (نفس البيانات) |
| `/courses/voiceover-live` | CourseVoiceoverLivePage.tsx | voiceoverLiveCourse (cohorts فلتر online) |
| `/courses/presenter` | CoursePresenterPage.tsx | المذيع المحترف |
| `/courses/arabic-language` | CourseArabicLanguagePage.tsx | اللغة العربية |
| `/courses/public-speaking` | CoursePublicSpeakingPage.tsx | الخطابة |

## spec §9 — voiceover-live

`voiceoverLiveCourse` = spread من `voiceoverCourse` مع:
- `modes: { live: voiceoverCourse.modes.live }` فقط
- `cohorts: cohorts.filter(c => c.mode === 'online')`
- يستهلك نفس cohorts-voiceover.json — لا تعارض بين الصفحتين

## CourseData.modes

- إن وُجد كلا النمطين → mode picker تفاعلي
- إن وُجد نمط واحد → عرض سعر ثابت (بلا toggle)
- تغيير النمط يُحدّث: شارات الحقائق + فلتر cohorts + تبويب المنهج

## أيقونات GoalItem/OutcomeItem

سلسلة نصية (`'Mic'`, `'Award'`, إلخ) → يحلّها `ICON_MAP` في CoursePageLayout.tsx.
الأيقونات المدعومة: AudioLines, Volume2, SlidersHorizontal, Mic, Sparkles, Briefcase, Tv, BookOpen, Globe, Zap, Award, Star, Video, GraduationCap, Clock

## البيانات الناقصة (ينتظر وجيز)

جميع الدورات: stage, tagline, tags — موجودة في الكود بقيم معقولة.
المفقود فعلياً: brochure PDFs لكل دورة، OG images مخصصة.
