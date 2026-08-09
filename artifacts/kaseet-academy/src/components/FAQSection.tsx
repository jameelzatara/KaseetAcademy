// ── Kaseet FAQ Section — 8 questions + FAQPage schema ────────
import { useState } from 'react';
import SectionHeader, { Gold } from './SectionHeader';

interface FAQItem { q: string; a: string; defaultOpen?: boolean; }

const FAQS: FAQItem[] = [
  {
    q: 'صوتي عادي — هل ينفع أتدرب؟',
    a: 'بالتأكيد. ما يُسمَّع "صوتاً عادياً" هو في الغالب طاقة لم تُصقَل بعد. كل الأصوات الاحترافية التي تسمعها في الإعلام والإعلانات مرّت بتدريب ممنهج. ما نقيسه في الجلسة الأولى هو قابليتك للتطور، لا المستوى الحالي، والغالبية العظمى من المتدربين يُفاجَؤون بما يكتشفونه في أنفسهم خلال أسابيع.',
    defaultOpen: true,
  },
  {
    q: 'ما الفرق بين الحضوري والمباشر التفاعلي (Online LIVE)؟',
    a: 'الدورات الحضورية تُعقد في استوديو كاسيت بعمّان وتتيح تدريباً ميدانياً على معدات تسجيل احترافية، أمام المايكروفون فعلياً. أما المباشر التفاعلي (Online LIVE) فيُبثّ تفاعلياً بجدول أسبوعي ثابت ويتيح لك الانضمام من أي مكان في العالم مع تفاعل حي مع المدرب ومجموعة دراسية متقاربة. كلا الشكلين يمنحان شهادة رسمية.',
  },
  {
    q: 'أنا مبتدئ تماماً — من أين أبدأ؟',
    a: 'البداية الأنسب هي دورة "أساسيات التعليق والأداء الصوتي". إذا كنت محتارًا، تحدّث مع المستشارة التعليمية (ياقوت) للحصول على توجيه مجاني.',
  },
  {
    q: 'كم تستغرق الدورة؟ وما مواعيدها؟',
    a: 'الدورات الأساسية (12–16 ساعة)، الماستركلاسات (44 ساعة). التفاصيل المحددة موجودة في صفحة كل برنامج.',
  },
  {
    q: 'كيف أسجّل؟ وكيف يتم الدفع؟',
    a: 'عبر صفحة الدورة أو واتساب. تتوفر وسائل دفع متنوعة (تحويل بنكي، دفع إلكتروني، فيزا، ماستركارد).',
  },
  {
    q: 'هل الشهادة معتمدة ومن أي جهة؟',
    a: 'نعم. يحصل كل خريج على شهادة إتمام رسمية موقّعة من أكاديمية كاسيت ومعتمدة من تطبيق وجيز — أكبر منصّة صوتية في الشرق الأوسط. الشهادة قابلة للمشاركة على LinkedIn وتُثبت اجتيازك للبرنامج الاحترافي بمعايير الصناعة.',
  },
  {
    q: 'ماذا لو فاتتني جلسة؟',
    a: 'المباشر التفاعلي (Online LIVE): الجلسات مسجلة ومتاحة عبر المنصة.\nالحضوري: فريق كاسيت يوضح خيارات التعويض المتاحة.',
  },
  {
    q: 'هل أستطيع الدراسة من خارج الأردن؟',
    a: 'نعم، البرامج المباشرة التفاعلية (Online LIVE) متاحة عالمياً من أي مكان.',
  },
];

function AccordionItem({ item, defaultOpen = false }: { item: FAQItem; defaultOpen?: boolean }) {
  const [open, setOpen]   = useState(defaultOpen);
  const [hov,  setHov]    = useState(false);

  return (
    <div style={{
      borderRadius: 18,
      background: open
        ? 'rgba(255,193,7,0.04)'
        : hov
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(255,255,255,0.03)',
      backdropFilter:       'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border:    open ? '1px solid rgba(255,193,7,0.22)' : '1px solid rgba(255,255,255,0.06)',
      overflow:  'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.22)',
      transition: 'background 220ms, border 220ms, box-shadow 220ms',
    }}>
      {/* Trigger row */}
      <button
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width:          '100%',
          minHeight:      64,
          display:        'flex',
          alignItems:     'center',
          paddingInline:  24,
          paddingBlock:   14,
          background:     'none',
          border:         'none',
          cursor:         'pointer',
          direction:      'rtl',
          gap:            14,
        }}
      >
        {/* Toggle icon */}
        <span style={{
          flexShrink: 0,
          width: 28, height: 28,
          borderRadius: '50%',
          background: open ? 'rgba(255,193,7,0.15)' : 'rgba(255,255,255,0.07)',
          border: `1px solid ${open ? 'rgba(255,193,7,0.40)' : 'rgba(255,255,255,0.10)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: open ? '#FFC107' : 'rgba(252,251,251,0.52)',
          fontSize: 18, fontWeight: 500, lineHeight: 1,
          transition: 'all 220ms ease',
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
        }}>+</span>

        {/* Question text */}
        <span style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 700,
          fontSize: 'clamp(14px,1.4vw,16px)',
          color: open ? '#FFC107' : 'rgba(252,251,251,0.88)',
          lineHeight: 1.4,
          flex: 1,
          textAlign: 'right',
          transition: 'color 220ms',
        }}>
          {item.q}
        </span>
      </button>

      {/* Expand panel */}
      <div style={{
        maxHeight:  open ? 600 : 0,
        overflow:   'hidden',
        transition: 'max-height 240ms cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ padding: '0 24px 24px', direction: 'rtl' }}>
          <div style={{
            height: 1,
            background: 'linear-gradient(to left, rgba(255,193,7,0.22), transparent)',
            marginBottom: 18,
          }} />
          <p style={{
            fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
            fontSize: 16,
            color: 'rgba(226,232,240,0.72)',
            lineHeight: 1.9, margin: 0,
            textAlign: 'right',
          }}>
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── FAQPage JSON-LD schema ── */
const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function FAQSection() {
  return (
    <section id="faq" className="sec sec--faq section-block relative overflow-hidden">
      {/* FAQPage structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }}
      />

      {/* Subtle top glow */}
      <div className="absolute pointer-events-none" style={{
        top: -60, left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: 200,
        background: 'radial-gradient(ellipse at top, rgba(255,193,7,0.07) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 mx-auto px-4" style={{ maxWidth: 820 }}>

        <SectionHeader
          badge="الأسئلة الشائعة"
          heading={<>الأسئلة الشائعة <Gold>حول برامج كاسيت</Gold></>}
          description="إجابات واضحة على أكثر ما يسأل عنه طلابنا قبل التسجيل."
          style={{ marginBottom: 48 }}
        />

        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQS.map((item, i) => (
            <AccordionItem key={i} item={item} defaultOpen={!!item.defaultOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}
