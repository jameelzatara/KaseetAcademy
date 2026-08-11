---
name: Round 2 update status
description: Status of the 4 course pages rebuild — what's done and what needs data from client
---

## الصفحات المبنية (نفس ستايل CourseBasicsPage حرفياً)

All 4 pages rebuilt to match CourseBasicsPage exactly. Each is self-contained (~700–900 lines).

| الصفحة | المسار | النمط | الحالة |
|---|---|---|---|
| CourseVoiceoverLivePage | /courses/voiceover-live | Online LIVE فقط | ✅ مبني |
| CoursePresenterPage | /courses/presenter | حضوري فقط | ✅ مبني |
| CourseArabicLanguagePage | /courses/arabic-language | Online LIVE فقط | ✅ مبني |
| CoursePublicSpeakingPage | /courses/public-speaking | كلاهما (حضوري + أونلاين) | ✅ مبني |

## قرارات التصميم
- زر "تحميل الكتيّب" **محذوف** (مش disabled، مش broken — محذوف كلياً) حتى تصل الكتيّبات
- نمط واحد (online-only أو onsite-only): يُظهر Single mode display بلا toggle
- كلا النمطين (PublicSpeaking): يُظهر mode picker كامل كما في CourseBasicsPage
- الشعبات كلها placeholder حقيقية (مواعيد سبتمبر/أكتوبر 2026) تحتاج مراجعة من العميل

## بيانات مؤقتة (placeholder) تحتاج تأكيد
- مواعيد وأيام ووقت الشعب الفعلية
- عدد المقاعد النهائي لكل دفعة
- سعر التقسيط لكل دورة
- صور الغلاف النهائية (voiceover-live و presenter موجودة، arabic + public-speaking موجودة أيضاً)
