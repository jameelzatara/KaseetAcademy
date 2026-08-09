// ── Refund Policy — بيركلي للصوتيات المسموعة (كاسيت أكاديمي) ─
// مسوّدة مهنية — تحتاج مراجعة محامٍ أردني مرخَّص قبل النشر
import { useEffect } from 'react';
import SiteFooter from '@/components/SiteFooter';
import BackButton from '@/components/BackButton';

const S = {
  page:  { minHeight: '100dvh', background: '#FDFBF7', direction: 'rtl' as const },
  wrap:  { maxWidth: 820, margin: '0 auto', padding: '140px 24px 80px', direction: 'rtl' as const },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 999, background: 'rgba(123,45,96,0.08)', border: '1px solid rgba(123,45,96,0.22)', color: '#7B2D60', fontSize: 13, fontWeight: 700, marginBottom: 18 },
  h1:    { fontFamily: 'Tajawal, sans-serif', fontWeight: 900, fontSize: 'clamp(26px,4vw,40px)', color: '#1A2533', margin: '0 0 8px', lineHeight: 1.25 },
  date:  { fontFamily: 'Poppins, sans-serif', fontSize: 12.5, color: 'rgba(26,37,51,0.44)', margin: '0 0 48px', direction: 'ltr' as const, display: 'block' },
  rule:  { height: 1, background: 'linear-gradient(to left, rgba(123,45,96,0.18), transparent)', margin: '40px 0' },
  h2:    { fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 'clamp(17px,2.2vw,22px)', color: '#7B2D60', margin: '0 0 16px' },
  p:     { fontFamily: 'Tajawal, sans-serif', fontWeight: 400, fontSize: 15.5, color: 'rgba(26,37,51,0.75)', lineHeight: 1.95, margin: '0 0 14px', textAlign: 'right' as const },
  ul:    { paddingRight: 20, margin: '0 0 14px', listStyleType: 'disc' as const },
  li:    { fontFamily: 'Tajawal, sans-serif', fontSize: 15.5, color: 'rgba(26,37,51,0.72)', lineHeight: 1.9, marginBottom: 6 },
  info:  { background: 'rgba(255,193,7,0.05)', border: '1px solid rgba(255,193,7,0.20)', borderRadius: 14, padding: '20px 22px', marginBottom: 14 },
  table: { width: '100%', borderCollapse: 'collapse' as const, marginBottom: 20 },
  th:    { fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 13.5, color: '#7B2D60', padding: '10px 14px', textAlign: 'right' as const, borderBottom: '1px solid rgba(123,45,96,0.18)', background: 'rgba(123,45,96,0.06)' },
  td:    { fontFamily: 'Tajawal, sans-serif', fontSize: 13.5, color: 'rgba(26,37,51,0.72)', padding: '10px 14px', borderBottom: '1px solid rgba(26,37,51,0.07)', lineHeight: 1.7, textAlign: 'right' as const },
};

const CONTACT = {
  name:  'بيركلي للصوتيات المسموعة',
  brand: 'كاسيت أكاديمي',
  email: 'info@kaseet.com',
  wa:    '+962 77 105 2222',
};

export default function RefundPolicyPage() {
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []);
  return (
    <div style={S.page}>
      <BackButton />
      <main id="main" style={S.wrap}>

        <div style={S.badge}>سياسة الاسترداد</div>
        <h1 style={S.h1}>سياسة الاسترداد والإلغاء</h1>
        <span style={S.date}>آخر تحديث: [تاريخ النشر] — إصدار 1.0</span>

        {/* ── 1 ── */}
        <h2 style={S.h2}>1. نظرة عامة والمبادئ الأساسية</h2>
        <p style={S.p}>
          تؤمن <strong style={{ color: '#1A2533' }}>{CONTACT.brand}</strong> بأن رضاك أولوية. هذه السياسة توضّح حقوقك بشكل شفاف، وتُحدّد الإجراءات المتبعة عند طلب الاسترداد أو الإلغاء.
        </p>
        <p style={S.p}>
          تُحسَب مدد الاسترداد من تاريخ إتمام الدفع. المبالغ غير القابلة للاسترداد تُستثنى منها رسوم معالجة الدفع التي تُحتجزها بوابات الدفع الخارجية.
        </p>
        <div style={S.rule} />

        {/* ── 2 ── */}
        <h2 style={S.h2}>2. جدول الاسترداد التفصيلي</h2>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>توقيت طلب الإلغاء</th>
              <th style={S.th}>نسبة الاسترداد</th>
              <th style={S.th}>المبلغ المُسترَد</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={S.td}>قبل بدء الدورة بأكثر من 14 يوم</td>
              <td style={{ ...S.td, color: '#4ade80', fontWeight: 700 }}>100%</td>
              <td style={S.td}>المبلغ كاملاً (ناقص رسوم البوابة)</td>
            </tr>
            <tr>
              <td style={S.td}>قبل بدء الدورة بـ 7–14 يوم</td>
              <td style={{ ...S.td, color: '#FFC107', fontWeight: 700 }}>75%</td>
              <td style={S.td}>75% من المبلغ المدفوع</td>
            </tr>
            <tr>
              <td style={S.td}>قبل بدء الدورة بأقل من 7 أيام</td>
              <td style={{ ...S.td, color: '#FFA500', fontWeight: 700 }}>50%</td>
              <td style={S.td}>50% من المبلغ المدفوع</td>
            </tr>
            <tr>
              <td style={S.td}>بعد بدء الجلسة الأولى</td>
              <td style={{ ...S.td, color: '#f87171', fontWeight: 700 }}>0%</td>
              <td style={S.td}>لا يوجد استرداد (رصيد تدريبي بديل)</td>
            </tr>
            <tr>
              <td style={S.td}>إلغاء الدورة من طرف الأكاديمية</td>
              <td style={{ ...S.td, color: '#4ade80', fontWeight: 700 }}>100%</td>
              <td style={S.td}>المبلغ كاملاً خلال 7 أيام عمل</td>
            </tr>
          </tbody>
        </table>
        <div style={S.rule} />

        {/* ── 3 ── */}
        <h2 style={S.h2}>3. الرصيد التدريبي البديل</h2>
        <p style={S.p}>
          في الحالات التي لا تستوفي شروط الاسترداد النقدي (الانسحاب بعد بدء الجلسة الأولى)، يمكن تحويل المبلغ المدفوع إلى رصيد تدريبي يُستخدم في أي دورة أخرى خلال 12 شهراً من تاريخ الإلغاء.
        </p>
        <div style={S.rule} />

        {/* ── 4 ── */}
        <h2 style={S.h2}>4. حالات الاسترداد الاستثنائي</h2>
        <p style={S.p}>قد يُمنح استرداد جزئي أو كامل خارج الجدول أعلاه في الحالات التالية (مع تقديم وثائق داعمة):</p>
        <ul style={S.ul}>
          <li style={S.li}>حالة طبية طارئة موثّقة بشهادة طبية رسمية.</li>
          <li style={S.li}>وفاة أحد أفراد الأسرة المباشرين.</li>
          <li style={S.li}>نزاع مسلح أو قوة قاهرة تمنع الحضور.</li>
          <li style={S.li}>منح تأشيرة مرفوضة لمتدربين قادمين من خارج الأردن (للدورات الحضورية فقط).</li>
        </ul>
        <p style={S.p}>تُدرَس هذه الطلبات حالة بحالة خلال 5 أيام عمل من استلام الوثائق.</p>
        <div style={S.rule} />

        {/* ── 5 ── */}
        <h2 style={S.h2}>5. تأجيل الانضمام إلى دفعة لاحقة</h2>
        <p style={S.p}>
          يحق للمتدرب طلب تأجيل انضمامه إلى الدفعة التالية من نفس الدورة مرة واحدة بدون رسوم إضافية، شريطة تقديم الطلب قبل بدء الدورة بـ 48 ساعة على الأقل. التأجيل الثاني يخضع لرسوم إدارية قدرها 15 د.أ.
        </p>
        <div style={S.rule} />

        {/* ── 6 ── */}
        <h2 style={S.h2}>6. طريقة الاسترداد ومدته</h2>
        <ul style={S.ul}>
          <li style={S.li}>يُعاد المبلغ بنفس طريقة الدفع الأصلية قدر الإمكان.</li>
          <li style={S.li}>التحويل البنكي: 3–5 أيام عمل.</li>
          <li style={S.li}>كروت الائتمان: 5–10 أيام عمل حسب الجهة المُصدِرة.</li>
          <li style={S.li}>المحافظ الإلكترونية: 1–3 أيام عمل.</li>
        </ul>
        <div style={S.rule} />

        {/* ── 7 ── */}
        <h2 style={S.h2}>7. الحالات غير المشمولة بالاسترداد</h2>
        <ul style={S.ul}>
          <li style={S.li}>رسوم الاستشارة المجانية (مجانية بطبيعتها، لا شيء يُسترَد).</li>
          <li style={S.li}>المواد التدريبية الرقمية التي تم تنزيلها أو الاطلاع عليها.</li>
          <li style={S.li}>جلسات التسجيل الصوتي في الاستوديو التي تمّت فعلاً.</li>
          <li style={S.li}>حالات الفصل بسبب انتهاك قواعد السلوك.</li>
        </ul>
        <div style={S.rule} />

        {/* ── 8 ── */}
        <h2 style={S.h2}>8. إلغاء خدمات الاشتراك</h2>
        <p style={S.p}>
          في حال وجود اشتراكات شهرية أو دورية، يُمكن إلغاؤها في أي وقت مع سريان الإلغاء من الدورة الفوترية التالية. لا يُسترَد الجزء المتبقي من الفترة الحالية.
        </p>
        <div style={S.rule} />

        {/* ── 9 ── */}
        <h2 style={S.h2}>9. إجراءات تقديم طلب الاسترداد</h2>
        <ol style={{ ...S.ul, listStyleType: 'decimal' }}>
          <li style={S.li}>أرسل بريداً إلكترونياً إلى <a href={`mailto:${CONTACT.email}`} style={{ color: '#FFC107' }}>{CONTACT.email}</a> أو رسالة واتساب على {CONTACT.wa}.</li>
          <li style={S.li}>اذكر: الاسم الكامل، اسم الدورة، تاريخ الدفع، سبب الإلغاء، والمبلغ المدفوع.</li>
          <li style={S.li}>أرفق إيصال الدفع ووثيقة الهوية.</li>
          <li style={S.li}>ستتلقى تأكيداً باستلام الطلب خلال 24 ساعة، وقراراً نهائياً خلال 3 أيام عمل.</li>
        </ol>
        <div style={S.rule} />

        {/* ── 10 ── */}
        <h2 style={S.h2}>10. التواصل والنزاعات</h2>
        <div style={S.info}>
          <p style={{ ...S.p, margin: 0 }}>
            للاستفسار أو الطعن في قرار الاسترداد:<br/>
            البريد: <a href={`mailto:${CONTACT.email}`} style={{ color: '#FFC107' }}>{CONTACT.email}</a><br/>
            واتساب: <span dir="ltr">{CONTACT.wa}</span><br/><br/>
            في حال عدم التوصل إلى حل وديّ، يحق لك اللجوء إلى الجهات التحكيمية المختصة أو القضاء الأردني.
          </p>
        </div>

      </main>
      <SiteFooter />
    </div>
  );
}
