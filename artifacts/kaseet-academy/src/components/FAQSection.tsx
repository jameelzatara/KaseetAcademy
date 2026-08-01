// ── Kaseet FAQ Section ────────────────────────────────────
import { useState } from 'react';

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
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      borderRadius: 16,
      background: open ? 'rgba(255,193,7,0.04)' : 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: open ? '1px solid rgba(255,193,7,0.25)' : '1px solid rgba(255,255,255,0.09)',
      overflow: 'hidden',
      transition: 'background 0.3s, border 0.3s, box-shadow 0.3s',
      boxShadow: open ? '0 10px 30px rgba(0,0,0,0.25), 0 4px 24px rgba(255,193,7,0.06)' : '0 10px 30px rgba(0,0,0,0.25)',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: 'clamp(18px,2.2vw,24px) clamp(20px,2.8vw,32px)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          direction: 'rtl',
          gap: 16,
          textAlign: 'right',
        }}
      >
        {/* Question text — first in DOM → RIGHT side in RTL */}
        <span style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 700,
          fontSize: 'clamp(14px,1.5vw,17px)',
          color: open ? '#FFC107' : 'rgba(252,251,251,0.90)',
          lineHeight: 1.45,
          flex: 1,
          textAlign: 'right',
          transition: 'color 0.25s',
        }}>
          {`${index + 1}. ${item.q}`}
        </span>

        {/* ± icon — marginInlineStart:auto pushes it to far inline-end (LEFT in RTL) */}
        <span style={{
          flexShrink: 0,
          marginInlineStart: 'auto',
          width: 30, height: 30,
          borderRadius: '50%',
          background: open ? 'rgba(255,193,7,0.15)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${open ? 'rgba(255,193,7,0.40)' : 'rgba(255,255,255,0.10)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: open ? '#FFC107' : 'rgba(252,251,251,0.50)',
          fontSize: 20, fontWeight: 300, lineHeight: 1,
          transition: 'all 0.25s',
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
        }}>+</span>
      </button>

      <div style={{
        maxHeight: open ? '500px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.40s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{
          padding: '0 clamp(20px,2.8vw,32px) clamp(20px,2.5vw,28px)',
          direction: 'rtl',
        }}>
          <div style={{
            height: 1,
            background: 'linear-gradient(to left, rgba(255,193,7,0.25), transparent)',
            marginBottom: 18,
          }} />
          <p style={{
            fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
            fontSize: 'clamp(13.5px,1.3vw,15.5px)',
            color: 'rgba(226,232,240,0.75)',
            lineHeight: 1.95, margin: 0,
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

      <div className="relative z-10 mx-auto px-4" style={{ maxWidth: 820, direction: 'rtl' }}>

        {/* Header */}
        <div style={{ textAlign: 'right', marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            marginBottom: 12,
            padding: '4px 14px', borderRadius: 99,
            background: 'rgba(255,193,7,0.09)',
            border: '1px solid rgba(255,193,7,0.25)',
            fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 12.5,
            color: '#FFC107',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#FFC107', boxShadow: '0 0 6px rgba(255,193,7,0.7)',
              flexShrink: 0,
            }} />
            الأسئلة الشائعة
          </div>

          <h2 style={{
            fontFamily: 'Tajawal, sans-serif', fontWeight: 900,
            fontSize: 'clamp(24px,3.5vw,42px)',
            color: 'rgba(252,251,251,0.96)',
            lineHeight: 1.2, margin: '0 0 10px',
            textAlign: 'right',
          }}>
            الأسئلة الشائعة{' '}
            <span style={{ color: '#FFC107' }}>حول برامج كاسيت</span>
          </h2>
          <p style={{
            fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
            fontSize: 'clamp(13px,1.3vw,15.5px)',
            color: 'rgba(226,232,240,0.58)',
            margin: '20px 0 0',    /* heading → subtitle: 20px */
            textAlign: 'right',
          }}>
            إجابات واضحة على أكثر ما يسأل عنه طلابنا قبل التسجيل.
          </p>
        </div>

        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {FAQS.map((item, i) => (
            <AccordionItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
