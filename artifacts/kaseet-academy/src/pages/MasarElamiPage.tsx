/**
 * صفحة المسار الإعلامي — 10 محطات تدريبية متسلسلة
 */
import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronDown, ArrowLeft, MapPin, Wifi, Award, Users, Briefcase, Star } from 'lucide-react';
import { NAVY, GOLD, OFF, MUTED, F, FP, INNER, waLink } from './shared/coursePageHelpers';
import wajeezLogo from '@assets/wajeez-logo_1785688262989.png';
import coverElami  from '@assets/cover_لصفحة_الاعلام_1785772052880.jpeg';
import m1 from '@assets/M1_1785772181185.png';
import m2 from '@assets/M2_1785772181186.png';
import m3 from '@assets/M3_1785772176798.png';
import m4 from '@assets/M4_1785772176799.png';
import m5 from '@assets/M5_1785772176798.png';

/* ── tokens ───────────────────────────────────────────── */
const BG   = '#161E2B';
const BG2  = '#1A2332';
const BG3  = '#1D2738';
const CARD = '#242F40';
const HAIR = 'rgba(255,255,255,0.08)';
const GLD  = GOLD;
const GS   = 'rgba(255,193,7,0.10)';
const GL   = 'rgba(255,193,7,0.28)';
const MUT  = '#9AA6B8';
const LT   = '#CBD4E1';

const WA_TRACK = waLink('962700000000', 'مرحبا، أرغب بالاستفسار عن المسار الإعلامي');

/* ── station data ─────────────────────────────────────── */
const STATIONS = [
  {
    n: '01', phase: 1, standalone: true,
    title: 'التقديم التلفزيوني والإذاعي',
    sub: 'المرحلة التأسيسية — الحضور والإلقاء والتقديم',
    chips: ['الإلقاء الاحترافي','لغة الجسد','الحضور أمام الكاميرا','قراءة النشرة','تقديم البرامج','إدارة الحوارات','المقابلات','البث المباشر'],
    project: 'تقرير مرئي كامل تُقدّمه أمام الكاميرا ويُقيَّم من لجنة مدربين.',
    hours: '16 ساعة', note: 'متاحة كدورة مستقلة: الدورة المكثفة: المذيع المحترف',
  },
  {
    n: '02', phase: 1, standalone: false,
    title: 'التعليق الصوتي (Voice Over)',
    sub: 'المرحلة التأسيسية — ضبط الصوت والنبرة',
    chips: ['أساسيات الأداء الصوتي','التنفس','مخارج الحروف'],
    project: 'تسجيل صوتي قصير مقيَّم: إعلان، تمهيد برنامج، أو خبر.',
    hours: '6 ساعات', note: null,
  },
  {
    n: '03', phase: 2, standalone: false,
    title: 'الصحافة والتحرير الإعلامي',
    sub: 'مرحلة التخصص — الكتابة والتحرير',
    chips: ['الخبر','التقرير','التحقيق','المقال','التحرير الرقمي','العناوين','التحقق من الأخبار'],
    project: 'تقرير صحفي مكتوب مع تحقيق من مصادر متعددة.',
    hours: '12 ساعة', note: null,
  },
  {
    n: '04', phase: 2, standalone: false,
    title: 'المراسل الميداني',
    sub: 'مرحلة التخصص — التغطية والميدان',
    chips: ['الوقفة الميدانية','التقارير','التغطيات','البث المباشر','صناعة القصة','السلامة المهنية'],
    project: 'تقرير ميداني مصوّر يُجهَّز كاملاً: تصوير وتعليق وإخراج.',
    hours: '12 ساعة', note: null,
  },
  {
    n: '05', phase: 2, standalone: false,
    title: 'صناعة المحتوى الإعلامي',
    sub: 'مرحلة التخصص — المحتوى الرقمي',
    chips: ['كتابة السكريبت','الريلز','صناعة الهوية','تصوير المحتوى','السرد القصصي','استراتيجيات النشر'],
    project: 'سلسلة محتوى (3 قطع) لعلامة تجارية أو موضوع إعلامي.',
    hours: '10 ساعات', note: null,
  },
  {
    n: '06', phase: 2, standalone: false,
    title: 'البودكاست',
    sub: 'مرحلة التخصص — الصوت والمحادثة',
    chips: ['إعداد الحلقة','كتابة الأسئلة','إدارة الحوار','التسجيل','المونتاج الأساسي','نشر البودكاست'],
    project: 'حلقة بودكاست منتَجة ومنشورة على منصة.',
    hours: '10 ساعات', note: null,
  },
  {
    n: '07', phase: 2, standalone: false,
    title: 'الإعلام الرقمي والمتحدث الرسمي',
    sub: 'مرحلة التخصص — التصريحات والأزمات',
    chips: ['التعامل مع الإعلام','المؤتمرات الصحفية','التصريحات','إدارة الأزمات الإعلامية','بناء الرسائل'],
    project: 'محاكاة مؤتمر صحفي مع إدارة موقف أزمة.',
    hours: '10 ساعات', note: null,
  },
  {
    n: '08', phase: 2, standalone: false,
    title: 'الإنتاج الإعلامي',
    sub: 'مرحلة التخصص — الإخراج والإنتاج',
    chips: ['التخطيط للإنتاج','كتابة السيناريو','التصوير','الإخراج','أساسيات المونتاج','إدارة فريق الإنتاج'],
    project: 'فيلم قصير أو مقطع إعلامي منتَج بالكامل.',
    hours: '12 ساعة', note: null,
  },
  {
    n: '09', phase: 2, standalone: false,
    title: 'الذكاء الاصطناعي للإعلاميين',
    sub: 'مرحلة التخصص — الأدوات المستقبلية',
    chips: ['كتابة الأخبار بالذكاء الاصطناعي','صناعة السكريبت','تحويل النص إلى صوت','توليد الصور','أدوات المونتاج','الترجمة والدبلجة','التحقق من المعلومات'],
    project: 'مشروع إعلامي كامل منتَج بأدوات الذكاء الاصطناعي.',
    hours: '8 ساعات', note: null,
  },
  {
    n: '10', phase: 3, standalone: false, optional: true,
    title: 'القيادة الإعلامية',
    sub: 'مرحلة القيادة — الإدارة والاستراتيجية',
    chips: ['إدارة المؤسسات الإعلامية','التخطيط الإعلامي','إدارة فرق العمل','بناء الهوية الإعلامية','إدارة المشاريع الإعلامية'],
    project: 'خطة إعلامية متكاملة لمؤسسة أو مشروع.',
    hours: '10 ساعات', note: null,
  },
];

const OUTCOMES = [
  { n:'01', title:'صوت ولغة وحضور مضبوطين', desc:'إلقاء نظيف، مخارج حروف صحيحة، لغة عربية سليمة، وثقة أمام الكاميرا بدون تصنّع.' },
  { n:'02', title:'تخصص واضح تعرّف نفسك به', desc:'تتخرّج بعنوان مهني محدد: مراسل، معدّ، صانع محتوى، متحدث رسمي — لا "مهتم بالإعلام".' },
  { n:'03', title:'محفظة أعمال حقيقية', desc:'مشروع تخرّج منتَج بجودة عرض، ومخرجات تطبيقية من كل محطة قبله.' },
  { n:'04', title:'شهادة معتمدة من وجيز', desc:'شهادة المسار من كاسيت أكاديمي، معتمدة من تطبيق وجيز — أكبر مكتبة صوتية وبودكاست في الشرق الأوسط.' },
];

const FAQS = [
  { q:'لازم آخذ كل المحطات؟ ما بقدر أختار اللي يهمني؟', a:'لأ، ما في اختيار — وهاد مقصود. المسار مصمَّم يطلّعك إعلامي متكامل يعرف يكتب ويقدّم ويغطّي وينتج، لأن سوق الإعلام اليوم ما بيطلب مهارة وحدة. لو بدّك مهارة محددة بس، الأنسب لك دورة منفردة لا مسار.' },
  { q:'التعليق الصوتي 3 حصص بس؟ ليش هيك قليل؟', a:'لأن هدفه هنا محدود: يضبط تنفّسك ومخارج حروفك ونبرتك عشان تكون جاهز للكاميرا والمايك بباقي المحطات. هاد كل اللي بيحتاجه الإعلامي. أما لو هدفك تصير معلّق صوتي محترف — فهاد شي تاني بيحتاج دورة أعمق.' },
  { q:'أنا مبتدئ تماماً — المسار مناسب إلي؟', a:'آه، وهاد بالضبط اللي المسار مبني عليه. المرحلة التأسيسية تفترض إنك ما عندك أي خبرة سابقة، وتبني معك الإلقاء والحضور والصوت من الصفر قبل ما تفوت على أي تخصص.' },
  { q:'شو الفرق بين محطة القيادة وباقي المحطات؟', a:'محطات 01–09 تعلّمك تنفّذ: تقدّم، تكتب، تغطّي، وتنتج. محطة 10 مستوى مختلف — تعلّمك تدير: مؤسسة، فريق، خطة، وهوية إعلامية.' },
  { q:'أخذت دورة من الثلاث سابقاً — بتحسب لي؟', a:'آه. لو أخذت دورة المذيع المحترف معنا، تُخصم قيمتها من سعر المسار وما بتعيد دراستها، لأنها هي نفسها محطة 01. حكي مع المستشارة التعليمية وبنراجع سجلّك.' },
  { q:'الشهادة معتمدة من مين؟', a:'الشهادة صادرة عن كاسيت أكاديمي ومعتمدة من تطبيق وجيز، أكبر مكتبة صوتية وبودكاست في الشرق الأوسط. وبترافقها محفظة أعمال ومشروع تخرّج — وهي اللي فعلياً بتفرق مع المشغّل.' },
  { q:'ممكن أدرس Online من خارج الأردن؟', a:'آه، عبر كاسيت لايف — جلسات مباشرة تفاعلية بنفس المنهج ونفس المدربين، مع تسجيلات للمراجعة. الفرق الوحيد إن التسجيل العملي بيصير بمعداتك بدل استوديو كاسيت.' },
  { q:'الدفع آمن؟ وممكن أقسّط؟', a:'الدفع كله إلكتروني عبر بوابة دفع آمنة. والتقسيط متاح للمسار الكامل — تدفع الدفعة الأولى فيتثبّت مقعدك، وباقي الدفعات تتوزّع على مراحل المسار.' },
];

const PHASE_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'مرحلة التأسيس', color: GLD },
  2: { label: 'مرحلة التخصص', color: '#67e8f9' },
  3: { label: 'مرحلة القيادة', color: '#a78bfa' },
};

const STUDENT_IMGS = [m1, m2, m3, m4, m5];

/* ── Station card ────────────────────────────────────── */
function Station({ s, open, onToggle }: { s: typeof STATIONS[0]; open: boolean; onToggle: () => void }) {
  const phase = PHASE_LABELS[s.phase];
  return (
    <div
      role="button" tabIndex={0}
      onClick={onToggle}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      style={{
        background: open ? `linear-gradient(180deg, ${GS}, ${CARD} 55%)` : CARD,
        border: `1px solid ${open ? GL : (s.optional ? 'rgba(167,139,250,0.28)' : HAIR)}`,
        borderRadius: 14, padding: '20px 22px', cursor: 'pointer',
        transition: 'border-color .25s, background .25s',
      }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        {/* Number badge */}
        <div style={{
          flexShrink: 0, width: 44, height: 44, borderRadius: 12,
          background: BG3, border: `1px solid ${open ? GL : (s.optional ? 'rgba(167,139,250,0.28)' : HAIR)}`,
          display: 'grid', placeContent: 'center',
          fontFamily: FP, fontSize: 16, fontWeight: 700,
          color: s.optional ? '#a78bfa' : GLD,
        }}>{s.n}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: F, fontSize: 18, fontWeight: 800, color: OFF, lineHeight: 1.5 }}>{s.title}</span>
            {s.standalone && (
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: GLD, color: '#1A1206', padding: '2px 9px', borderRadius: 999 }}>
                متاحة منفردة
              </span>
            )}
            {s.optional && (
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: 'rgba(167,139,250,0.18)', border: '1px solid rgba(167,139,250,0.4)', color: '#c4b5fd', padding: '2px 9px', borderRadius: 999 }}>
                القيادة
              </span>
            )}
          </div>
          <div style={{ fontFamily: F, fontSize: 13, color: MUT }}>{s.sub}</div>
        </div>

        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: F, fontSize: 12, color: phase.color, fontWeight: 700 }}>{phase.label}</span>
          <ChevronDown size={16} color={GLD} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }} />
        </div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${HAIR}` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {s.chips.map(chip => (
              <span key={chip} style={{
                fontFamily: F, fontSize: 12.5, color: LT,
                background: 'rgba(255,255,255,0.045)', border: `1px solid ${HAIR}`,
                padding: '5px 12px', borderRadius: 999,
              }}>{chip}</span>
            ))}
          </div>
          <div style={{ fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.7 }}>
            <span style={{ color: GLD, fontWeight: 700 }}>المشروع التطبيقي: </span>{s.project}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: F, fontSize: 12, color: MUT }}>⏱ {s.hours}</span>
            {s.note && <span style={{ fontFamily: F, fontSize: 12, color: GLD }}>← {s.note}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── FAQ item ─────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: CARD, border: `1px solid ${open ? GL : HAIR}`,
      borderRadius: 14, overflow: 'hidden',
      marginBottom: 12, transition: 'border-color .25s',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <span style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: OFF, textAlign: 'right' }}>{q}</span>
        <span style={{ color: GLD, fontSize: 22, lineHeight: 1, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .25s', flexShrink: 0 }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 24px 22px', fontFamily: F, fontSize: 15, color: MUT, lineHeight: 1.85 }}>{a}</div>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────── */
export default function MasarElamiPage() {
  const [, navigate]   = useLocation();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [expandAll, setExpandAll] = useState(false);

  function toggle(i: number) {
    setOpenIdx(openIdx === i ? null : i);
    setExpandAll(false);
  }
  function handleExpandAll() {
    setExpandAll(v => !v);
    setOpenIdx(null);
  }
  function isOpen(i: number) {
    return expandAll || openIdx === i;
  }

  return (
    <div dir="rtl" style={{ fontFamily: F, background: BG, color: OFF, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── back nav ─────────────────────────────────── */}
      <div style={{ ...INNER, paddingTop: 24, paddingBottom: 0 }}>
        <button onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 14, color: MUT, padding: 0 }}>
          <ArrowLeft size={14} /> الرئيسية
        </button>
      </div>

      {/* ════════════════ HERO ════════════════ */}
      <section style={{ padding: '48px 0 80px' }}>
        <div style={{ ...INNER }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,0.9fr)', gap: 56, alignItems: 'center' }}>

            {/* left: text */}
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 13, fontWeight: 700, padding: '7px 16px', borderRadius: 999, boxShadow: '0 6px 22px rgba(255,193,7,0.2)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206', display: 'block' }} />
                مسار متكامل • 10 محطات
              </span>

              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(40px,6vw,66px)', lineHeight: 1.22, letterSpacing: -1.2, margin: '22px 0 0', color: OFF }}>
                المسار <span style={{ color: GLD }}>الإعلامي</span>
              </h1>

              <p style={{ fontFamily: F, fontSize: 18, color: MUT, maxWidth: 580, marginTop: 18, lineHeight: 1.75 }}>
                منهج واحد متكامل من 10 محطات: تبدأ من التقديم والحضور أمام الكاميرا، وبعدها تمرّ على كل تخصص
                إعلامي — صحافة، ميدان، محتوى، بودكاست، متحدث رسمي، وإنتاج — وكل محطة تسلّم فيها مشروع.
              </p>

              {/* Facts */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28 }}>
                {[
                  ['10', 'محطات تدريبية متسلسلة'],
                  ['كل', 'التخصصات الإعلامية — بلا اختيار'],
                  ['8', 'مشاريع تطبيقية تُسلّمها'],
                  [null, 'حضوري في عمّان أو Online LIVE'],
                ].map(([b, txt], i) => (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 9,
                    background: 'rgba(255,255,255,0.035)', border: `1px solid ${HAIR}`,
                    padding: '9px 15px', borderRadius: 10, fontFamily: F, fontSize: 13.5, color: LT,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD, flexShrink: 0 }} />
                    {b && <b style={{ color: OFF, fontWeight: 700 }}>{b}</b>} {txt}
                  </span>
                ))}
              </div>

              {/* Wajeez chip */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 13, marginTop: 26,
                background: 'rgba(30,122,133,0.14)', border: '1px solid rgba(30,122,133,0.45)',
                borderRadius: 14, padding: '11px 16px',
              }}>
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 9, background: '#fff', display: 'grid', placeContent: 'center', padding: 5 }}>
                  <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ fontFamily: F, fontSize: 13.5, fontWeight: 700, color: OFF, lineHeight: 1.5 }}>شهادة المسار معتمدة من تطبيق وجيز</div>
                  <div style={{ fontFamily: F, fontSize: 12, color: MUT, lineHeight: 1.5 }}>أكبر مكتبة صوتية وبودكاست في الشرق الأوسط</div>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 32 }}>
                <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15.5, padding: '15px 30px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,193,7,0.22)' }}>
                  احكي مع المستشارة — مجاناً <ArrowLeft size={15} />
                </a>
                <a href="#tree"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${HAIR}`, color: OFF, fontFamily: F, fontWeight: 700, fontSize: 15.5, padding: '15px 30px', borderRadius: 999, textDecoration: 'none' }}>
                  استكشف شجرة المسار <ArrowLeft size={15} />
                </a>
              </div>
            </div>

            {/* right: cover image + student grid */}
            <div style={{ position: 'relative' }}>
              <div style={{ borderRadius: 22, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.45)', aspectRatio: '9/12', maxHeight: 520 }}>
                <img src={coverElami} alt="المسار الإعلامي" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, rgba(22,30,43,0.82) 100%)', borderRadius: 22 }} />
              </div>
              {/* student strip */}
              <div style={{ position: 'absolute', bottom: 20, insetInline: 16, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {STUDENT_IMGS.map((img, i) => (
                  <div key={i} style={{ width: 54, height: 54, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${GLD}`, flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                    <img src={img} alt={`متدرب ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }} />
                  </div>
                ))}
              </div>
              {/* pill */}
              <div style={{
                position: 'absolute', top: 20, right: 20,
                background: GLD, color: '#1A1206', fontFamily: FP, fontWeight: 700, fontSize: 13,
                padding: '8px 16px', borderRadius: 999, boxShadow: '0 4px 16px rgba(255,193,7,0.35)',
              }}>10 محطات</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ TREE ════════════════ */}
      <section id="tree" style={{ background: BG2, borderBlock: `1px solid ${HAIR}`, padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${GL}`, color: GLD, background: GS, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>شجرة المسار</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35 }}>
              10 محطات من أول يوم <span style={{ color: GLD }}>للشهادة</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: MUT, maxWidth: 640, marginInline: 'auto', marginTop: 14, lineHeight: 1.75 }}>
              كل محطة إلزامية وبترتيب مقصود — كل واحدة تبني على اللي قبلها. اضغط على أي محطة تشوف محاورها ومشروعها.
            </p>
          </div>

          {/* toolbar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 880, marginInline: 'auto', marginBottom: 18 }}>
            <button onClick={handleExpandAll} style={{
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${HAIR}`,
              color: MUT, fontFamily: F, fontSize: 13, fontWeight: 700,
              padding: '9px 18px', borderRadius: 999, cursor: 'pointer',
              transition: 'border-color .2s, color .2s',
            }}>
              {expandAll ? 'اطوِ كل المحاور' : 'افتح كل المحاور'}
            </button>
          </div>

          {/* Connector + stations */}
          <div style={{ maxWidth: 880, marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STATIONS.map((s, i) => {
              const prevPhase  = i > 0 ? STATIONS[i-1].phase : null;
              const showBand   = s.phase !== prevPhase;
              return (
                <div key={s.n}>
                  {/* phase band */}
                  {showBand && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: i === 0 ? '0 0 12px' : '20px 0 12px' }}>
                      <div style={{ flex: 1, height: 1, background: HAIR }} />
                      <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: PHASE_LABELS[s.phase].color, letterSpacing: '.4px', whiteSpace: 'nowrap', padding: '4px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: `1px solid ${HAIR}` }}>
                        {PHASE_LABELS[s.phase].label}
                      </span>
                      <div style={{ flex: 1, height: 1, background: HAIR }} />
                    </div>
                  )}
                  {/* connector */}
                  {!showBand && i > 0 && (
                    <div style={{ width: 2, height: 14, background: `linear-gradient(180deg, ${GL}, rgba(255,193,7,0.5))`, margin: '4px auto', borderRadius: 2 }} />
                  )}
                  <Station s={s} open={isOpen(i)} onToggle={() => toggle(i)} />
                </div>
              );
            })}

            {/* connector to certificate */}
            <div style={{ width: 2, height: 24, background: `linear-gradient(180deg, ${GL}, rgba(30,122,133,0.6))`, margin: '8px auto', borderRadius: 2 }} />

            {/* certificate end node */}
            <div style={{ border: '1px solid rgba(30,122,133,0.45)', borderRadius: 18, background: 'linear-gradient(180deg,rgba(30,122,133,0.16), rgba(29,39,56,0.8) 60%)', padding: '28px 26px', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ width: 60, height: 60, borderRadius: 13, background: '#fff', display: 'grid', placeContent: 'center', padding: 8, flexShrink: 0 }}>
                  <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: OFF }}>شهادة كاسيت أكاديمي · معتمدة من تطبيق وجيز</h4>
                  <p style={{ fontFamily: F, fontSize: 14, color: MUT, marginTop: 4 }}>شهادة المسار الكاملة + محفظة أعمال + توصية مهنية</p>
                </div>
              </div>
              <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 999, textDecoration: 'none' }}>
                سجّل في المسار <ArrowLeft size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ OUTCOMES ════════════════ */}
      <section style={{ padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${GL}`, color: GLD, background: GS, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>مخرجات المسار</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35 }}>
              شو رح تطلع <span style={{ color: GLD }}>فيه</span>؟
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: MUT, maxWidth: 640, marginInline: 'auto', marginTop: 14 }}>
              مخرجات ملموسة تعرضها على مشغّل أو عميل — لا شعور عام بالتحسّن.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))', gap: 18 }}>
            {OUTCOMES.map(o => (
              <div key={o.n} style={{ background: CARD, border: `1px solid ${HAIR}`, borderRadius: 14, padding: '28px 24px', transition: 'border-color .25s' }}>
                <div style={{ fontFamily: FP, fontSize: 13, fontWeight: 700, color: GLD, letterSpacing: 1, marginBottom: 10 }}>{o.n}</div>
                <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: OFF, marginBottom: 10, lineHeight: 1.55 }}>{o.title}</h4>
                <p style={{ fontFamily: F, fontSize: 14.5, color: MUT, lineHeight: 1.75 }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ STUDENT GALLERY ════════════════ */}
      <section style={{ background: BG2, borderBlock: `1px solid ${HAIR}`, padding: '72px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(24px,3.6vw,38px)', color: OFF, lineHeight: 1.35 }}>
              خرّيجو <span style={{ color: GLD }}>المسار الإعلامي</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, color: MUT, marginTop: 12 }}>متدربون من الأردن والعالم العربي — كل واحد طلع بتخصص واضح.</p>
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {STUDENT_IMGS.map((img, i) => (
              <div key={i} style={{ width: 180, height: 220, borderRadius: 18, overflow: 'hidden', border: `1px solid ${HAIR}`, flexShrink: 0, boxShadow: '0 12px 32px rgba(0,0,0,0.28)' }}>
                <img src={img} alt={`متدرب ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ STUDY MODES ════════════════ */}
      <section style={{ padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${GL}`, color: GLD, background: GS, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>طريقة الدراسة</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35 }}>
              تدرس <span style={{ color: GLD }}>على كيفك</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: MUT, marginTop: 14 }}>نفس المنهج ونفس المدربين — الفرق بس مكان ما بتقعد.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {[
              {
                tag: 'حضوري في عمّان', Icon: MapPin, title: 'استوديو كاسيت',
                desc: 'تدريب داخل استوديو مجهّز صوتياً، مع كاميرا وميكروفونات احترافية.',
                items: ['تسجيل عملي بمعدات احترافية', 'مقاعد محدودة لكل فوج', 'تصحيح فوري ومباشر من المدرب', 'تشبيك مع المتدربين وفرص العمل'],
              },
              {
                tag: 'مباشر تفاعلي (Online LIVE)', Icon: Wifi, title: 'كاسيت لايف',
                desc: 'جلسات مباشرة بالكامل — لا فيديوهات مسجّلة ولا دراسة لحالك.',
                items: ['جلسات مباشرة مع المدرب وقت حقيقي', 'تسجيلات الجلسات متاحة للمراجعة', 'تسليم واجبات وتقييم فردي', 'متاح من أي مكان بالعالم العربي'],
              },
            ].map(({ tag, Icon, title, desc, items }) => (
              <div key={tag} style={{ background: CARD, border: `1px solid ${HAIR}`, borderRadius: 18, padding: '32px 30px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${GL}`, color: GLD, background: GS, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999, marginBottom: 18 }}>
                  <Icon size={14} /> {tag}
                </div>
                <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 21, color: OFF, marginBottom: 10 }}>{title}</h4>
                <p style={{ fontFamily: F, fontSize: 15, color: MUT, marginBottom: 18, lineHeight: 1.7 }}>{desc}</p>
                <ul style={{ listStyle: 'none', display: 'grid', gap: 10 }}>
                  {items.map(item => (
                    <li key={item} style={{ display: 'flex', gap: 10, fontFamily: F, fontSize: 14.5, color: LT, lineHeight: 1.7 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: GLD, marginTop: 10, flexShrink: 0 }} />{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ ACCESS ════════════════ */}
      <section style={{ background: BG2, borderBlock: `1px solid ${HAIR}`, padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${GL}`, color: GLD, background: GS, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>خيارات الدخول</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35 }}>
              شفت المسار — <span style={{ color: GLD }}>كيف بتفوت فيه</span>؟
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: MUT, maxWidth: 640, marginInline: 'auto', marginTop: 14 }}>
              المسار يُدرَس كوحدة واحدة. بس عنا 3 دورات مستقلة تنفع للتجربة.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
            {/* standalone */}
            <div style={{ background: CARD, border: `1px solid ${HAIR}`, borderRadius: 18, padding: '32px 30px' }}>
              <div style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: MUT, letterSpacing: '.6px', marginBottom: 8 }}>متاح كدورة مستقلة</div>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 23, color: OFF, lineHeight: 1.5, marginBottom: 14 }}>3 دورات تقدر تشتريها لحالها</h3>
              <div style={{ width: 44, height: 2, background: 'rgba(255,255,255,0.18)', borderRadius: 2, marginBottom: 20 }} />
              <ul style={{ listStyle: 'none', display: 'grid', gap: 12 }}>
                {[
                  'الدورة المكثفة: المذيع المحترف ومهارات الإعلام الرقمي',
                  'أساسيات التعليق والأداء الصوتي',
                  'تمكين اللغة العربية وفنون التحرير اللغوي',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 11, fontFamily: F, fontSize: 15, color: LT, lineHeight: 1.7 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: 'rgba(255,255,255,0.22)', marginTop: 11, flexShrink: 0 }} />{item}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${HAIR}`, fontFamily: F, fontSize: 13.5, color: MUT }}>
                دورة المذيع المحترف هي نفسها محطة 01 — قيمتها تُخصم لو كمّلت المسار.
              </div>
            </div>
            {/* track-exclusive */}
            <div style={{ background: `linear-gradient(180deg, rgba(255,193,7,0.055), ${CARD} 44%)`, border: `1px solid ${GL}`, borderRadius: 18, padding: '32px 30px' }}>
              <div style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: GLD, letterSpacing: '.6px', marginBottom: 8 }}>حصري داخل المسار</div>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 23, color: OFF, lineHeight: 1.5, marginBottom: 14 }}>8 محطات ما تنفتح إلا بالمسار</h3>
              <div style={{ width: 44, height: 2, background: GLD, borderRadius: 2, marginBottom: 20 }} />
              <ul style={{ listStyle: 'none', display: 'grid', gap: 12 }}>
                {[
                  'الصحافة والتحرير الإعلامي · المراسل الميداني',
                  'صناعة المحتوى الإعلامي · البودكاست',
                  'الإعلام الرقمي والمتحدث الرسمي · الإنتاج الإعلامي',
                  'الذكاء الاصطناعي للإعلاميين',
                  'القيادة الإعلامية للمستوى المتقدم',
                  'شهادة المسار المعتمدة من تطبيق وجيز',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 11, fontFamily: F, fontSize: 15, color: LT, lineHeight: 1.7 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: GLD, marginTop: 11, flexShrink: 0 }} />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* bridge */}
          <div style={{ marginTop: 22, background: BG3, border: `1px dashed ${GL}`, borderRadius: 14, padding: '22px 26px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 10, background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', color: GLD, fontWeight: 800, fontSize: 18 }}>؟</div>
            <p style={{ fontFamily: F, fontSize: 15.5, color: LT, lineHeight: 1.7 }}>
              <b style={{ color: OFF }}>يعني بالمختصر:</b> الدورة تعطيك مهارة، والمسار يعطيك مهنة.
              تبدأ بدورة إذا بتجرّب، وتسجّل بالمسار إذا قرّرت إن الإعلام مستقبلك — ووقتها بتمرّ على كل التخصصات، لا واحد.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════ ENROLL ════════════════ */}
      <section id="enroll" style={{ padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${GL}`, color: GLD, background: GS, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>الالتحاق</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35 }}>
              اختار <span style={{ color: GLD }}>طريقتك</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: MUT, marginTop: 14 }}>تمشي الرحلة كاملة، أو تبدأ بدورة تأسيسية وتقرر بعدين.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20 }}>
            {/* track plan */}
            <div style={{ background: `linear-gradient(180deg, rgba(255,193,7,0.06), ${CARD} 40%)`, border: `1px solid ${GL}`, borderRadius: 18, padding: '36px 32px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <span style={{ position: 'absolute', top: 22, left: 26, fontFamily: F, fontSize: 11.5, fontWeight: 700, background: GLD, color: '#1A1206', padding: '5px 12px', borderRadius: 999 }}>الأوفر</span>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 24, color: OFF, marginBottom: 10 }}>المسار الإعلامي الكامل</h3>
              <p style={{ fontFamily: F, fontSize: 15, color: MUT, lineHeight: 1.7 }}>10 محطات كاملة: التأسيس + كل التخصصات الإعلامية + القيادة الإعلامية.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '26px 0 6px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FP, fontSize: 40, fontWeight: 700, color: GLD, lineHeight: 1 }}>تواصل</span>
                <span style={{ fontFamily: F, fontSize: 15, color: MUT }}>للحصول على السعر</span>
              </div>
              <p style={{ fontFamily: F, fontSize: 13.5, color: '#76839A', marginBottom: 24 }}>التقسيط متاح • حضوري أو Online LIVE</p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 11, marginBottom: 28, flex: 1 }}>
                {['10 محطات متسلسلة · 3 مراحل', 'كل التخصصات الإعلامية بلا استثناء', '8 محطات ما تُتاح خارج المسار', '8 مشاريع تطبيقية بإشراف مباشر', 'محطة القيادة الإعلامية ضمن المسار', 'شهادة المسار معتمدة من تطبيق وجيز'].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, fontFamily: F, fontSize: 14.5, color: LT, lineHeight: 1.7 }}>
                    <span style={{ color: GLD, fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '15px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,193,7,0.22)' }}>
                سجّل في المسار <ArrowLeft size={15} />
              </a>
            </div>

            {/* single course plan */}
            <div style={{ background: CARD, border: `1px solid ${HAIR}`, borderRadius: 18, padding: '36px 32px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 24, color: OFF, marginBottom: 10 }}>دورة منفردة</h3>
              <p style={{ fontFamily: F, fontSize: 15, color: MUT, lineHeight: 1.7 }}>بتجرّب قبل ما تلتزم بالمسار؟ خُد واحدة من الدورات الثلاث المتاحة لحالها.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '26px 0 6px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FP, fontSize: 40, fontWeight: 700, color: GLD, lineHeight: 1 }}>150–250</span>
                <span style={{ fontFamily: F, fontSize: 15, color: MUT }}>دينار / للدورة</span>
              </div>
              <p style={{ fontFamily: F, fontSize: 13.5, color: '#76839A', marginBottom: 24 }}>متاح فقط للدورات التأسيسية الثلاث</p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 11, marginBottom: 28, flex: 1 }}>
                {['16 ساعة · 8 جلسات', 'مشروع تطبيقي واحد', 'شهادة إتمام الدورة', 'قيمة دورة المذيع المحترف تُخصم لو كمّلت المسار'].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, fontFamily: F, fontSize: 14.5, color: LT, lineHeight: 1.7 }}>
                    <span style={{ color: GLD, fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', border: `1px solid ${HAIR}`, color: OFF, fontFamily: F, fontWeight: 700, fontSize: 15, padding: 15, borderRadius: 999, cursor: 'pointer' }}>
                استعرض الدورات <ArrowLeft size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ FAQ ════════════════ */}
      <section style={{ background: BG2, borderBlock: `1px solid ${HAIR}`, padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 13, fontWeight: 700, padding: '7px 16px', borderRadius: 999, boxShadow: '0 6px 22px rgba(255,193,7,0.2)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206', display: 'block' }} />أسئلة متكررة
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35 }}>
              قبل ما <span style={{ color: GLD }}>تسأل</span>
            </h2>
          </div>
          <div style={{ maxWidth: 840, marginInline: 'auto' }}>
            {FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ════════════════ FINAL CTA ════════════════ */}
      <section style={{ padding: '20px 0 88px' }}>
        <div style={{ ...INNER }}>
          <div style={{ background: `linear-gradient(135deg, ${CARD}, ${BG3})`, border: `1px solid ${GL}`, borderRadius: 26, padding: '64px 48px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4vw,42px)', lineHeight: 1.4, letterSpacing: -.6, color: OFF }}>
              الإعلامي ما بيتبنى بدورة — <span style={{ color: GLD }}>بيتبنى بمسار</span>
            </h2>
            <p style={{ fontFamily: F, color: MUT, fontSize: 16.5, margin: '16px auto 32px', maxWidth: 560, lineHeight: 1.75 }}>
              مقاعد كل فوج محدودة عشان يضل التصحيح فردي. ابدأ بالاستشارة المجانية، وقرّر بعدها.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15.5, padding: '15px 30px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,193,7,0.22)' }}>
                احكي مع المستشارة — مجاناً <ArrowLeft size={15} />
              </a>
              <a href="#tree"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${HAIR}`, color: OFF, fontFamily: F, fontWeight: 700, fontSize: 15.5, padding: '15px 30px', borderRadius: 999, textDecoration: 'none' }}>
                استكشف شجرة المسار <ArrowLeft size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
