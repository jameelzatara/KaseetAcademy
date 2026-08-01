// ── Kaseet FAQ Section ────────────────────────────────────
import { useState } from 'react';
import SectionHeader, { Gold } from './SectionHeader';

interface FAQItem { q: string; a: string; }

const FAQS: FAQItem[] = [
  {
    q: 'ما الفرق بين دوراتكم الوجاهية والمباشرة أونلاين؟',
    a: 'الدورات الوجاهية تُعقد في استوديوهات كاسيت ميديا بعمّان وتتيح تدريباً عملياً مباشراً على المعدات الاحترافية وأمام الكاميرا. أما الدورات المباشرة أونلاين فتُعقد عبر منصة بث تفاعلي بجدول أسبوعي ثابت، وتُتيح للمشاركين من خارج الأردن الاستفادة ذاتها مع تفاعل حي مع المدرب.',
  },
  {
    q: 'هل أحتاج إلى خبرة مسبقة للالتحاق بالبرامج؟',
    a: 'لا، معظم برامجنا مصممة لاستقبال المبتدئين الكاملين إلى جانب المتوسطين. في صفحة كل دورة ستجد مستوى البرنامج المطلوب. يمكنك أيضاً التواصل مع مستشارتنا التعليمية للحصول على توصية مجانية بالمسار الأنسب لمستواك الحالي.',
  },
  {
    q: 'كيف يمكنني التسجيل والدفع؟',
    a: 'التسجيل يتم عبر نموذج الحجز في صفحة كل دورة أو مباشرةً عبر واتساب. نقبل التحويل البنكي، الدفع الإلكتروني، وكروت الفيزا/ماستركارد. يتوفر أيضاً خيار الدفع على دفعتين لبعض البرامج عند الطلب.',
  },
  {
    q: 'هل أحصل على شهادة إتمام معتمدة؟',
    a: 'نعم، يحصل كل خريج على شهادة إتمام موقّعة من أكاديمية كاسيت ميديا معتمدة من تطبيق وجيز — أكبر منصة صوتية في الشرق الأوسط. الشهادة قابلة للمشاركة على LinkedIn وتُثبت اجتيازك للبرنامج الاحترافي.',
  },
  {
    q: 'ماذا يحدث إذا فاتني لقاء؟',
    a: 'تُسجَّل جميع لقاءات الدورات المباشرة أونلاين وتُرفع خلال 24 ساعة في مساحتك الخاصة على المنصة. بالنسبة للدورات الوجاهية، يتم تزويدك بملخص اللقاء والمواد، مع إمكانية حضور جلسة تعويضية حسب الجدول المتاح.',
  },
];

function AccordionItem({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen]   = useState(false);
  const [hov,  setHov]    = useState(false);

  return (
    <div style={{
      borderRadius: 18,
      /* bg: open → gold tint, hover → slightly brighter, default → base */
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
      {/* Trigger row — exactly 64px, padding-inline 24px */}
      <button
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width:          '100%',
          height:         64,
          display:        'flex',
          alignItems:     'center',
          paddingInline:  24,
          background:     'none',
          border:         'none',
          cursor:         'pointer',
          direction:      'rtl',
          gap:            14,
        }}
      >
        {/* Toggle icon — first in DOM → visual RIGHT in RTL */}
        <span style={{
          flexShrink: 0,
          width: 28, height: 28,
          borderRadius: '50%',
          background: open ? 'rgba(255,193,7,0.15)' : 'rgba(255,255,255,0.07)',
          border: `1px solid ${open ? 'rgba(255,193,7,0.40)' : 'rgba(255,255,255,0.10)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: open ? '#FFC107' : 'rgba(252,251,251,0.52)',
          fontSize: 18, fontWeight: 300, lineHeight: 1,
          transition: 'all 220ms ease',
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
        }}>+</span>

        {/* Question text — center-vertically via height:64px on parent */}
        <span style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 700,
          fontSize: 'clamp(14px,1.4vw,16px)',
          color: open ? '#FFC107' : 'rgba(252,251,251,0.88)',
          lineHeight: 1.4,
          flex: 1,
          textAlign: 'right',
          transition: 'color 220ms',
        }}>
          {`${index + 1}. ${item.q}`}
        </span>
      </button>

      {/* Expand panel — 220ms animation */}
      <div style={{
        maxHeight:  open ? 560 : 0,
        overflow:   'hidden',
        transition: 'max-height 220ms cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ padding: '0 24px 24px', direction: 'rtl' }}>
          {/* Thin gold rule */}
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

export default function FAQSection() {
  return (
    <section id="faq" className="section-block relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute pointer-events-none" style={{
        top: -60, left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: 200,
        background: 'radial-gradient(ellipse at top, rgba(255,193,7,0.07) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 mx-auto px-4" style={{ maxWidth: 820 }}>

        {/* Centered section header */}
        <SectionHeader
          badge="الأسئلة الشائعة"
          heading={<>الأسئلة الشائعة <Gold>حول برامج كاسيت</Gold></>}
          description="إجابات واضحة على أكثر ما يسأل عنه طلابنا قبل التسجيل."
          style={{ marginBottom: 48 }}
        />

        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQS.map((item, i) => (
            <AccordionItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
