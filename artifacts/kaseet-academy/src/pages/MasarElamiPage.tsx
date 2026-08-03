/**
 * صفحة المسار الإعلامي — كاسيت أكاديمي
 */
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronDown, ArrowLeft, MapPin, Wifi, Award, Layers, Clock, FolderCheck, CheckCircle2 } from 'lucide-react';
import { NAVY, GOLD, OFF, MUTED, F, FP, INNER, LBG, DH, DM, waLink } from './shared/coursePageHelpers';
import wajeezLogo    from '@assets/wajeez-logo_1785688262989.png';
import coverMasar    from '@assets/cover_المسار_الاعلامي_1785777356196.png';
import instructorRana from '@assets/trainer-rana-azzam_1785692178863.JPG';
import instructorRami from '@assets/رامي_ابو_جبارة_1785777158127.png';

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

const WA_PHONE = '962700000000';
const WA_TRACK       = waLink(WA_PHONE, 'مرحباً، أودّ الاستفسار عن المسار الإعلامي');


/* ── station data ─────────────────────────────────────── */
const STATIONS = [
  {
    n:'01', phase:1, standalone:true,
    title:'التقديم التلفزيوني والإذاعي',
    sub:'المرحلة التأسيسية — الحضور والإلقاء والتقديم',
    chips:['الإلقاء الاحترافي','لغة الجسد','الحضور أمام الكاميرا','قراءة النشرة','تقديم البرامج','إدارة الحوارات','المقابلات','البث المباشر'],
    project:'تقرير مرئي كامل يُقدَّم أمام الكاميرا ويُقيَّم من لجنة مدربين.',
    hours:'16 ساعة', note:'متاحة كدورة مستقلة: الدورة المكثفة — المذيع المحترف',
  },
  {
    n:'02', phase:1, standalone:false,
    title:'التعليق الصوتي (Voice Over)',
    sub:'المرحلة التأسيسية — ضبط الصوت والنبرة',
    chips:['أساسيات الأداء الصوتي','التنفس الصحيح','مخارج الحروف','ضبط النبرات'],
    project:'تسجيل صوتي مقيَّم: إعلان، تمهيد برنامج، أو خبر.',
    hours:'6 ساعات', note:null,
  },
  {
    n:'03', phase:2, standalone:false,
    title:'الصحافة والتحرير الإعلامي',
    sub:'مرحلة التخصص — الكتابة والتحرير',
    chips:['الخبر','التقرير','التحقيق','المقال','التحرير الرقمي','العناوين','التحقق من الأخبار'],
    project:'تقرير صحفي مكتوب مع تحقيق من مصادر متعددة.',
    hours:'12 ساعة', note:null,
  },
  {
    n:'04', phase:2, standalone:false,
    title:'المراسل الميداني',
    sub:'مرحلة التخصص — التغطية والميدان',
    chips:['الوقفة الميدانية','التقارير','التغطيات','البث المباشر','صناعة القصة','السلامة المهنية'],
    project:'تقرير ميداني مصوَّر يُجهَّز كاملاً: تصوير وتعليق وإخراج.',
    hours:'12 ساعة', note:null,
  },
  {
    n:'05', phase:2, standalone:false,
    title:'صناعة المحتوى الإعلامي',
    sub:'مرحلة التخصص — المحتوى الرقمي',
    chips:['كتابة السكريبت','الريلز','صناعة الهوية','تصوير المحتوى','السرد القصصي','استراتيجيات النشر'],
    project:'سلسلة محتوى من ثلاث قطع لعلامة تجارية أو موضوع إعلامي.',
    hours:'10 ساعات', note:null,
  },
  {
    n:'06', phase:2, standalone:false,
    title:'البودكاست',
    sub:'مرحلة التخصص — الصوت والمحادثة',
    chips:['إعداد الحلقة','كتابة الأسئلة','إدارة الحوار','التسجيل','المونتاج الأساسي','نشر البودكاست'],
    project:'حلقة بودكاست منتَجة ومنشورة على إحدى المنصات.',
    hours:'10 ساعات', note:null,
  },
  {
    n:'07', phase:2, standalone:false,
    title:'الإعلام الرقمي والمتحدث الرسمي',
    sub:'مرحلة التخصص — التصريحات وإدارة الأزمات',
    chips:['التعامل مع الإعلام','المؤتمرات الصحفية','التصريحات','إدارة الأزمات الإعلامية','بناء الرسائل'],
    project:'محاكاة مؤتمر صحفي مع إدارة موقف أزمة.',
    hours:'10 ساعات', note:null,
  },
  {
    n:'08', phase:2, standalone:false,
    title:'الإنتاج الإعلامي',
    sub:'مرحلة التخصص — الإخراج والإنتاج',
    chips:['التخطيط للإنتاج','كتابة السيناريو','التصوير','الإخراج','أساسيات المونتاج','إدارة فريق الإنتاج'],
    project:'فيلم قصير أو مقطع إعلامي منتَج بالكامل.',
    hours:'12 ساعة', note:null,
  },
  {
    n:'09', phase:2, standalone:false,
    title:'الذكاء الاصطناعي للإعلاميين',
    sub:'مرحلة التخصص — أدوات المستقبل',
    chips:['كتابة الأخبار بالذكاء الاصطناعي','صناعة السكريبت','تحويل النص إلى صوت','توليد الصور','أدوات المونتاج','الترجمة والدبلجة','التحقق من المعلومات'],
    project:'مشروع إعلامي كامل منتَج بأدوات الذكاء الاصطناعي.',
    hours:'8 ساعات', note:null,
  },
  {
    n:'10', phase:3, standalone:false, optional:true,
    title:'القيادة الإعلامية',
    sub:'مرحلة القيادة — الإدارة والاستراتيجية',
    chips:['إدارة المؤسسات الإعلامية','التخطيط الإعلامي','إدارة فرق العمل','بناء الهوية الإعلامية','إدارة المشاريع الإعلامية'],
    project:'خطة إعلامية متكاملة لمؤسسة أو مشروع.',
    hours:'10 ساعات', note:null,
  },
] as const;

type StationType = typeof STATIONS[number];

const OUTCOMES = [
  { n:'01', title:'صوت ولغة وحضور مضبوطان', desc:'إلقاء نظيف، مخارج حروف صحيحة، لغة عربية سليمة، وثقة حقيقية أمام الكاميرا.' },
  { n:'02', title:'تخصص مهني محدد', desc:'تتخرّج بعنوان واضح: مراسل، معدّ، صانع محتوى، أو متحدث رسمي — لا مجرد "مهتم بالإعلام".' },
  { n:'03', title:'محفظة أعمال احترافية', desc:'مشروع تخرّج بجودة العرض، ومخرجات تطبيقية موثَّقة من كل محطة على مدار المسار.' },
  { n:'04', title:'شهادة معتمدة من وجيز', desc:'شهادة المسار من كاسيت أكاديمي، معتمدة من تطبيق وجيز — أكبر مكتبة صوتية وبودكاست في الشرق الأوسط.' },
];

const FAQS = [
  { q:'هل يمكن اختيار بعض المحطات فقط؟', a:'لا، ولذلك مقصود. المسار مصمَّم ليخرّج إعلامياً متكاملاً قادراً على الكتابة والتقديم والتغطية والإنتاج، لأن سوق الإعلام اليوم لا يطلب مهارة واحدة بمعزل عن سواها. إن كنتَ تبحث عن مهارة محددة، فالدورة المنفردة هي الخيار الأنسب.' },
  { q:'التعليق الصوتي ثلاث جلسات فقط — لماذا؟', a:'لأن هدفه هنا محدود: ضبط تنفّسك ومخارج حروفك ونبرتك تمهيداً للكاميرا والمايكروفون في بقية المحطات. أما إن كان هدفك أن تصبح معلّقاً صوتياً محترفاً، فذلك تخصص مستقل يستلزم دورة أعمق.' },
  { q:'أنا مبتدئ تماماً — هل المسار مناسب لي؟', a:'نعم، وهذا بالضبط ما بُني عليه المسار. المرحلة التأسيسية لا تفترض أي خبرة سابقة، وتبني معك الإلقاء والحضور والصوت من البداية قبل الدخول إلى التخصصات.' },
  { q:'ما الفرق بين محطة القيادة وباقي المحطات؟', a:'المحطات 01–09 تُعلّمك التنفيذ: التقديم، الكتابة، التغطية، والإنتاج. أما المحطة 10 فهي مستوى مختلف تُعلّمك الإدارة: مؤسسة، فريق، خطة، وهوية إعلامية.' },
  { q:'درستُ إحدى الدورات الثلاث سابقاً — هل تُحتسب لي؟', a:'نعم. إن أكملتَ دورة المذيع المحترف معنا، تُخصم قيمتها من سعر المسار ولن تُعيد دراستها، إذ هي نفسها المحطة 01. تواصل مع المستشارة التعليمية لمراجعة سجلك.' },
  { q:'من أيّ جهة معتمدة الشهادة؟', a:'الشهادة صادرة عن كاسيت أكاديمي ومعتمدة من تطبيق وجيز، أكبر مكتبة صوتية وبودكاست في الشرق الأوسط. وترافقها محفظة أعمال ومشروع تخرّج — وهما اللذان يُحدثان الفرق الفعلي مع أصحاب العمل.' },
  { q:'هل أستطيع الدراسة عبر الإنترنت من خارج الأردن؟', a:'نعم، عبر كاسيت لايف — جلسات مباشرة تفاعلية بنفس المنهج ونفس المدربين، مع تسجيلات للمراجعة. الفرق الوحيد أن التسجيل العملي يجري بمعداتك عوضاً عن استوديو كاسيت.' },
  { q:'هل الدفع آمن؟ وهل التقسيط متاح؟', a:'الدفع كله إلكتروني عبر بوابة دفع آمنة. والتقسيط متاح للمسار الكامل: تُسدَّد الدفعة الأولى لتثبيت المقعد، وتتوزّع الدفعات المتبقية على مراحل المسار.' },
];

const PHASE_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'مرحلة التأسيس',   color: GLD },
  2: { label: 'مرحلة التخصص',   color: '#67e8f9' },
  3: { label: 'مرحلة القيادة',  color: '#a78bfa' },
};

const STANDALONE_COURSES = [
  {
    n: '01',
    title: 'الدورة المكثفة: المذيع المحترف ومهارات الإعلام الرقمي',
    note: 'محطة 01 بالمسار',
    desc: 'تدريب متكامل على التقديم التلفزيوني والإذاعي، الحضور أمام الكاميرا، وأساسيات الإعلام الرقمي.',
    instructor: 'أ. رنا محمد العزام',
    duration: '16 ساعة · 8 جلسات',
    route: '/courses/presenter',
  },
  {
    n: '02',
    title: 'أساسيات التعليق والأداء الصوتي',
    note: 'نسخة موسَّعة من محطة 02',
    desc: 'منهج متكامل لبناء أداء صوتي احترافي من الصفر: مخارج الحروف، التنفس، ضبط النبرات، وبناء الملف الصوتي.',
    instructor: 'أ. يسار عبده · أ. عمر درابكة',
    duration: '16 ساعة · 8 جلسات',
    route: '/courses/voiceover',
  },
  {
    n: '03',
    title: 'تمكين اللغة العربية وفنون التحرير اللغوي',
    note: 'دورة مستقلة',
    desc: 'إتقان النحو والإملاء وأساليب التحرير الرقمي بأسلوب تطبيقي، مع حقيبة مرجعية رقمية شاملة.',
    instructor: 'أ. رنا محمد العزام',
    duration: '16 ساعة · 8 جلسات',
    route: '/courses/arabic-language',
  },
];

/* only Rana's card */

/* ── Station card ────────────────────────────────────── */
function Station({ s, open, onToggle }: { s: StationType; open: boolean; onToggle: () => void }) {
  const phase = PHASE_LABELS[s.phase];
  return (
    <div
      role="button" tabIndex={0}
      onClick={onToggle}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      style={{
        background: open ? `linear-gradient(180deg, ${GS}, ${CARD} 55%)` : CARD,
        border: `1px solid ${open ? GL : ('optional' in s && s.optional ? 'rgba(167,139,250,0.28)' : HAIR)}`,
        borderRadius: 14, padding: '20px 22px', cursor: 'pointer',
        transition: 'border-color .25s, background .25s',
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{
          flexShrink: 0, width: 44, height: 44, borderRadius: 12,
          background: BG3, border: `1px solid ${open ? GL : HAIR}`,
          display: 'grid', placeContent: 'center',
          fontFamily: FP, fontSize: 16, fontWeight: 700,
          color: 'optional' in s && s.optional ? '#a78bfa' : GLD,
        }}>{s.n}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: F, fontSize: 18, fontWeight: 800, color: OFF, lineHeight: 1.5 }}>{s.title}</span>
            {'standalone' in s && s.standalone && (
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: GLD, color: '#1A1206', padding: '2px 9px', borderRadius: 999 }}>
                متاحة منفردةً
              </span>
            )}
            {'optional' in s && s.optional && (
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

      {open && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${HAIR}` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {(s.chips as readonly string[]).map(chip => (
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
      borderRadius: 14, overflow: 'hidden', marginBottom: 12, transition: 'border-color .25s',
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

/* ── Study accordion ─────────────────────────────────── */
function StudyAccordion({
  variant, label, sub, badges, items,
}: {
  variant: 'inperson' | 'online';
  label: string; sub: string;
  badges: string[];
  items: { title: string; desc: string }[];
}) {
  const [open, setOpen] = useState(false);
  const isIP   = variant === 'inperson';
  const accent = isIP ? GLD         : '#67e8f9';
  const bgOpen = isIP ? 'rgba(255,193,7,0.06)'   : 'rgba(103,232,249,0.04)';
  const bdOpen = isIP ? 'rgba(255,193,7,0.45)'   : 'rgba(103,232,249,0.40)';
  const bdCls  = isIP ? `1px solid rgba(255,193,7,0.28)` : `1px solid rgba(103,232,249,0.26)`;
  const iconBg = isIP ? 'rgba(255,193,7,0.14)'   : 'rgba(103,232,249,0.13)';
  const rowBg  = isIP ? 'rgba(255,193,7,0.03)'   : 'rgba(103,232,249,0.03)';
  const rowBd  = isIP ? 'rgba(255,193,7,0.16)'   : 'rgba(103,232,249,0.16)';
  const chipBg = isIP ? 'rgba(255,193,7,0.10)'   : 'rgba(103,232,249,0.12)';
  const chipBd = isIP ? 'rgba(255,193,7,0.28)'   : 'rgba(103,232,249,0.28)';
  const chipTx = isIP ? '#B8860B'                : '#0e7490';

  return (
    <div style={{
      borderRadius: 18, overflow: 'hidden', marginBottom: 12,
      border: `1px solid ${open ? bdOpen : HAIR}`,
      boxShadow: open ? `0 6px 24px rgba(0,0,0,0.20)` : '0 2px 8px rgba(0,0,0,0.10)',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: '100%', background: open ? bgOpen : CARD, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', cursor: 'pointer', textAlign: 'right', gap: 12 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: open ? accent : iconBg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
            {isIP
              ? <MapPin size={17} color={open ? BG : accent} strokeWidth={2.2} />
              : <Wifi   size={17} color={open ? BG : accent} strokeWidth={2.2} />}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: F, fontWeight: 900, fontSize: 16, color: OFF }}>{label}</div>
            <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginTop: 2 }}>{sub}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {badges.map(b => (
            <span key={b} style={{ fontFamily: FP, fontSize: 11, color: MUT, background: 'rgba(255,255,255,0.05)', border: `1px solid ${HAIR}`, borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>{b}</span>
          ))}
          <ChevronDown size={16} color={open ? accent : MUT} strokeWidth={2.5} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', flexShrink: 0 }} />
        </div>
      </button>
      {open && (
        <div style={{ background: rowBg, borderTop: `1px solid ${rowBd}` }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 22px', borderBottom: i < items.length - 1 ? `1px solid ${HAIR}` : 'none' }}>
              <span style={{ fontFamily: FP, fontWeight: 800, fontSize: 12, color: BG, background: accent, borderRadius: '50%', flexShrink: 0, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: OFF, marginBottom: 5 }}>{item.title}</div>
                <div style={{ fontFamily: F, fontSize: 13.5, color: MUT, lineHeight: 1.75 }}>{item.desc}</div>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0, background: chipBg, border: `1px solid ${chipBd}`, borderRadius: 8, padding: '4px 10px', fontFamily: FP, fontWeight: 700, fontSize: 11, color: chipTx, whiteSpace: 'nowrap' }}>
                {isIP ? <MapPin size={11} strokeWidth={2} color={accent} /> : <Wifi size={11} strokeWidth={2} color={accent} />}
                {isIP ? 'داخل الاستوديو' : 'بث مباشر'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────── */
export default function MasarElamiPage() {
  const [, navigate]         = useLocation();
  const [openIdx, setOpenIdx]   = useState<number | null>(null);
  const [expandAll, setExpandAll] = useState(false);

  function toggle(i: number) { setOpenIdx(openIdx === i ? null : i); setExpandAll(false); }
  function handleExpandAll() { setExpandAll(v => !v); setOpenIdx(null); }
  function isOpen(i: number) { return expandAll || openIdx === i; }

  return (
    <div dir="rtl" style={{ fontFamily: F, background: BG, color: OFF, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* spinning circle animation */}
      <style>{`
        @keyframes kaseetSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .ka-spin-ring { animation: kaseetSpin 18s linear infinite; transform-origin: 200px 200px; }
        .ka-spin-slow { animation: kaseetSpin 32s linear infinite reverse; transform-origin: 200px 200px; }
        @media (max-width: 768px) {
          .masar-hero-grid { grid-template-columns: 1fr !important; }
          .masar-hero-visual { max-width: 280px !important; order: -1; margin: 0 auto 32px; }
          .masar-standalone-grid { grid-template-columns: 1fr !important; }
          .masar-study-grid { grid-template-columns: 1fr !important; }
          .masar-consult-grid { grid-template-columns: 1fr !important; }
          .masar-enroll-grid { grid-template-columns: 1fr !important; }
          .masar-trainer-card { grid-template-columns: 1fr !important; }
          .masar-trainer-photo { min-height: 240px !important; }
        }
      `}</style>

      {/* ── back nav ─────────────────────────────────── */}
      <div style={{ ...INNER, paddingTop: 24, paddingBottom: 0 }}>
        <button onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 14, color: MUT, padding: 0 }}>
          <ArrowLeft size={14} /> الرئيسية
        </button>
      </div>

      {/* ════════════════ HERO ════════════════ */}
      <section style={{ position: 'relative', padding: '52px 0 88px', overflow: 'hidden' }}>
        {/* cover image — full-bleed background, lifted to show presenter's face */}
        <img
          src={coverMasar}
          alt=""
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', zIndex: 0 }}
        />
        {/* balanced gradient overlay — lets studio details breathe while keeping text readable */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(2,6,23,0.75) 0%, rgba(2,6,23,0.50) 45%, rgba(2,6,23,0.90) 100%)',
        }} />
        <div style={{ position: 'relative', zIndex: 2, ...INNER }}>
          <div className="masar-hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,0.85fr)', gap: 56, alignItems: 'center' }}>

            {/* text column */}
            <div>
              {/* top badge — amber outline style */}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,193,7,0.10)', border: '1px solid rgba(255,193,7,0.30)',
                color: GLD, fontFamily: F, fontSize: 13, fontWeight: 700,
                padding: '7px 16px', borderRadius: 999,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: GLD, display: 'block' }} />
                مسار متكامل · 10 محطات
              </span>

              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(36px,5.5vw,64px)', lineHeight: 1.2, letterSpacing: -1.2, margin: '18px 0 0', color: OFF }}>
                المسار <span style={{ color: GLD }}>الإعلامي</span>
              </h1>

              <p style={{ fontFamily: F, fontSize: 'clamp(14px,1.2vw,17px)', color: MUT, maxWidth: 560, marginTop: 16, lineHeight: 1.8 }}>
                منهج واحد متكامل من 10 محطات: يبدأ بالتقديم والحضور أمام الكاميرا، ويمرّ بكل تخصص إعلامي —
                صحافة، ميدان، محتوى، بودكاست، متحدث رسمي، وإنتاج — وكل محطة تُسلَّم فيها مشروع تطبيقي.
              </p>

              {/* 2×2 badge grid — 4 items only; Wajeez in its own card below */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 12, marginTop: 24, maxWidth: 520 }}>
                {([
                  { Icon: Layers,      num: '10', label: 'محطات تدريبية متسلسلة' },
                  { Icon: Clock,       num: '40', label: 'ساعة تدريبية موزَّعة'  },
                  { Icon: FolderCheck, num: '8',  label: 'مشاريع تطبيقية تُسلَّم' },
                  { Icon: MapPin,      num: null, label: 'حضوري في عمّان أو Online LIVE' },
                ] as const).map(({ Icon, num, label }, i) => (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 9,
                    background: 'rgba(2,6,23,0.60)', border: '1px solid rgba(255,255,255,0.10)',
                    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                    padding: '10px 14px', borderRadius: 12, fontFamily: F, fontSize: 13, color: LT,
                  }}>
                    <Icon size={15} color={GLD} strokeWidth={2} style={{ flexShrink: 0 }} />
                    {num && <b style={{ fontFamily: FP, color: OFF, fontWeight: 700 }}>{num}</b>}
                    {label}
                  </span>
                ))}
              </div>

              {/* Wajeez card — amber border, frosted */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14, marginTop: 20,
                background: 'rgba(2,6,23,0.80)', border: '1px solid rgba(255,193,7,0.20)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                borderRadius: 16, padding: '14px 18px', maxWidth: 520,
              }}>
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 9, background: '#fff', display: 'grid', placeContent: 'center', padding: 5 }}>
                  <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ fontFamily: F, fontSize: 13.5, fontWeight: 700, color: OFF }}>الشهادة معتمدة من تطبيق وجيز</div>
                  <div style={{ fontFamily: F, fontSize: 12, color: MUT }}>أكبر مكتبة صوتية وبودكاست في الشرق الأوسط</div>
                </div>
              </div>

              {/* CTA buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, marginTop: 24 }}>
                <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 28px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 8px 24px rgba(255,193,7,0.22)' }}>
                  تواصل مع المستشارة — مجاناً <ArrowLeft size={15} />
                </a>
                <a href="#tree"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', color: OFF, fontFamily: F, fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 12, textDecoration: 'none' }}>
                  استكشف شجرة المسار <ArrowLeft size={15} />
                </a>
              </div>
            </div>

            {/* SVG spinning circle */}
            <div className="masar-hero-visual" style={{ position: 'relative', aspectRatio: '1', maxWidth: 400, width: '100%', marginInline: 'auto' }}>
              <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', display: 'block' }}>
                {/* static outer rings */}
                <circle cx="200" cy="200" r="186" fill="none" stroke="rgba(255,255,255,0.06)" />
                <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.05)" />
                {/* spinning arc group */}
                <g className="ka-spin-ring">
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(255,193,7,0.90)" strokeWidth="3" strokeLinecap="round" strokeDasharray="300 1056" transform="rotate(-90 200 200)" />
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(255,193,7,0.42)" strokeWidth="3" strokeLinecap="round" strokeDasharray="380 1056" strokeDashoffset="-330" transform="rotate(-90 200 200)" />
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth="3" strokeLinecap="round" strokeDasharray="150 1056" strokeDashoffset="-740" transform="rotate(-90 200 200)" />
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(30,122,133,0.95)" strokeWidth="3" strokeLinecap="round" strokeDasharray="120 1056" strokeDashoffset="-910" transform="rotate(-90 200 200)" />
                  {/* dots */}
                  <circle cx="200" cy="32"  r="6" fill="#FFC107" />
                  <circle cx="352" cy="268" r="6" fill="#FFC107" />
                  <circle cx="66"  cy="286" r="6" fill="#1E7A85" />
                </g>
                {/* slow counter-spin outer ring */}
                <g className="ka-spin-slow">
                  <circle cx="200" cy="200" r="186" fill="none" stroke="rgba(255,193,7,0.08)" strokeWidth="1" strokeDasharray="12 20" />
                </g>
              </svg>
              {/* center content */}
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeContent: 'center', textAlign: 'center' }}>
                <div style={{ fontFamily: FP, fontSize: 68, fontWeight: 700, color: OFF, lineHeight: 1 }}>10</div>
                <div style={{ fontFamily: F, fontSize: 16, color: MUT, marginTop: 4 }}>محطات</div>
                <div style={{ width: 40, height: 1, background: 'rgba(255,193,7,0.40)', margin: '10px auto' }} />
                <div style={{ fontFamily: F, fontSize: 12, color: 'rgba(255,193,7,0.70)', letterSpacing: 0.5 }}>تأسيس ← تخصصات ← قيادة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ TREE ════════════════ */}
      <section id="tree" style={{ background: BG2, borderBlock: `1px solid ${HAIR}`, padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${GL}`, color: GLD, background: GS, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>شجرة المسار</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35, color: OFF }}>
              10 محطات من أول يوم <span style={{ color: GLD }}>حتى الشهادة</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: MUT, maxWidth: 640, marginInline: 'auto', marginTop: 14, lineHeight: 1.75 }}>
              كل محطة إلزامية ومرتَّبة بتسلسل مدروس — كل واحدة تُبنى على التي قبلها. اضغط على أي محطة لاستعراض محاورها ومشروعها.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 880, marginInline: 'auto', marginBottom: 18 }}>
            <button onClick={handleExpandAll} style={{
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${HAIR}`,
              color: MUT, fontFamily: F, fontSize: 13, fontWeight: 700,
              padding: '9px 18px', borderRadius: 999, cursor: 'pointer',
            }}>
              {expandAll ? 'طيّ جميع المحاور' : 'فتح جميع المحاور'}
            </button>
          </div>

          <div style={{ maxWidth: 880, marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STATIONS.map((s, i) => {
              const prevPhase = i > 0 ? STATIONS[i-1].phase : null;
              const showBand  = s.phase !== prevPhase;
              return (
                <div key={s.n}>
                  {showBand && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: i === 0 ? '0 0 12px' : '20px 0 12px' }}>
                      <div style={{ flex: 1, height: 1, background: HAIR }} />
                      <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: PHASE_LABELS[s.phase].color, letterSpacing: '.4px', whiteSpace: 'nowrap', padding: '4px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: `1px solid ${HAIR}` }}>
                        {PHASE_LABELS[s.phase].label}
                      </span>
                      <div style={{ flex: 1, height: 1, background: HAIR }} />
                    </div>
                  )}
                  {!showBand && i > 0 && (
                    <div style={{ width: 2, height: 14, background: `linear-gradient(180deg, ${GL}, rgba(255,193,7,0.5))`, margin: '4px auto', borderRadius: 2 }} />
                  )}
                  <Station s={s} open={isOpen(i)} onToggle={() => toggle(i)} />
                </div>
              );
            })}

            <div style={{ width: 2, height: 24, background: `linear-gradient(180deg, ${GL}, rgba(30,122,133,0.6))`, margin: '8px auto', borderRadius: 2 }} />

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
                التسجيل في المسار <ArrowLeft size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ OUTCOMES (cream) ════════════════ */}
      <section style={{ background: LBG, padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid rgba(255,193,7,0.35)`, color: '#92600a', background: 'rgba(255,193,7,0.12)', fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>مخرجات المسار</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35, color: DH }}>
              ما الذي ستُحقّقه <span style={{ color: '#92600a' }}>بعد المسار؟</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: DM, maxWidth: 640, marginInline: 'auto', marginTop: 14 }}>
              مخرجات ملموسة تُقدّمها لأصحاب العمل والعملاء — لا مجرد شعور عام بالتحسّن.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))', gap: 18 }}>
            {OUTCOMES.map(o => (
              <div key={o.n} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: '28px 24px', boxShadow: '0 4px 18px rgba(0,0,0,0.06)' }}>
                <div style={{ fontFamily: FP, fontSize: 13, fontWeight: 700, color: '#B8860B', letterSpacing: 1, marginBottom: 10 }}>{o.n}</div>
                <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: DH, marginBottom: 10, lineHeight: 1.55 }}>{o.title}</h4>
                <p style={{ fontFamily: F, fontSize: 14.5, color: DM, lineHeight: 1.75 }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ TRAINERS / EXPERTS ════════════════ */}
      <section style={{ background: BG2, borderBlock: `1px solid ${HAIR}`, padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${GL}`, color: GLD, background: GS, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>خبراء المسار الإعلامي</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35, color: OFF }}>
              مَن <span style={{ color: GLD }}>يُرشدك</span> في هذا المسار
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: MUT, maxWidth: 580, marginInline: 'auto', marginTop: 14 }}>
              خبراء إعلاميون بمسيرات مهنية حقيقية — يُرشدونك ويُقيّمونك على مدار المسار.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 920, marginInline: 'auto' }}>

            {/* ── Rami card ── */}
            <div className="masar-trainer-card" style={{
              background: `linear-gradient(135deg, rgba(255,193,7,0.05), ${CARD} 50%)`,
              border: `1px solid ${GL}`, borderRadius: 24, overflow: 'hidden',
              display: 'grid', gridTemplateColumns: 'minmax(0,300px) 1fr',
              boxShadow: '0 12px 48px rgba(0,0,0,0.30)',
            }}>
              {/* photo */}
              <div className="masar-trainer-photo" style={{ position: 'relative', minHeight: 360, background: '#0d111a', overflow: 'hidden' }}>
                <img src={instructorRami} alt="رامي أبو جبارة"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', position: 'absolute', inset: 0 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(22,30,43,0.85) 0%, transparent 60%)' }} />
                {/* wajeez badge */}
                <div style={{
                  position: 'absolute', bottom: 18, right: 18,
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,193,7,0.30)', borderRadius: 12, padding: '8px 14px',
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: '#fff', display: 'grid', placeContent: 'center', flexShrink: 0, padding: 3 }}>
                    <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: GLD, lineHeight: 1.3 }}>الشريك المؤسس<br/>لتطبيق وجيز</span>
                </div>
              </div>

              {/* info */}
              <div style={{ padding: '36px 36px 32px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GS, border: `1px solid ${GL}`, borderRadius: 999, padding: '5px 14px', marginBottom: 14, alignSelf: 'flex-start' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD, display: 'block' }} />
                  <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: GLD }}>مدرّب برنامج الإعلامي الشامل</span>
                </div>
                <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(22px,2.2vw,30px)', color: OFF, margin: '0 0 8px', lineHeight: 1.25 }}>
                  رامي أبو جبارة
                </h3>
                <p style={{ fontFamily: F, fontSize: 14.5, color: MUT, lineHeight: 1.85, marginBottom: 22 }}>
                  خبرة تمتد لـ 17 عاماً في الصحافة التلفزيونية والقيادة التحريرية؛ تنقّل خلالها بين كبرى المؤسسات الإعلامية مثل <b style={{ color: LT }}>Sky News عربية</b>، وصولاً إلى رئاسة تحرير <b style={{ color: LT }}>«الشرق مع Bloomberg»</b>.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
                  {['الصحافة التلفزيونية','القيادة التحريرية','Sky News عربية','الشرق مع Bloomberg'].map(t => (
                    <span key={t} style={{ fontFamily: F, fontSize: 12.5, color: GLD, background: GS, border: `1px solid ${GL}`, borderRadius: 999, padding: '5px 13px' }}>{t}</span>
                  ))}
                </div>
                <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                  style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', background: GLD, color: NAVY, fontFamily: F, fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 12, textDecoration: 'none' }}>
                  تواصل للاستفسار <ArrowLeft size={14} />
                </a>
              </div>
            </div>

            {/* ── Rana card ── */}
            <div className="masar-trainer-card" style={{
              background: `linear-gradient(135deg, rgba(103,232,249,0.04), ${CARD} 50%)`,
              border: `1px solid rgba(103,232,249,0.22)`, borderRadius: 24, overflow: 'hidden',
              display: 'grid', gridTemplateColumns: 'minmax(0,300px) 1fr',
              boxShadow: '0 12px 48px rgba(0,0,0,0.30)',
            }}>
              {/* photo */}
              <div className="masar-trainer-photo" style={{ position: 'relative', minHeight: 320, background: '#0d111a', overflow: 'hidden' }}>
                <img src={instructorRana} alt="أ. رنا محمد العزام"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', position: 'absolute', inset: 0 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(22,30,43,0.85) 0%, transparent 60%)' }} />
              </div>

              {/* info */}
              <div style={{ padding: '36px 36px 32px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(103,232,249,0.08)', border: '1px solid rgba(103,232,249,0.25)', borderRadius: 999, padding: '5px 14px', marginBottom: 14, alignSelf: 'flex-start' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#67e8f9', display: 'block' }} />
                  <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: '#67e8f9' }}>مدرّبة الأداء والتحرير اللغوي</span>
                </div>
                <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(22px,2.2vw,30px)', color: OFF, margin: '0 0 8px', lineHeight: 1.25 }}>
                  أ. رنا محمد العزام
                </h3>
                <p style={{ fontFamily: F, fontSize: 14.5, color: MUT, lineHeight: 1.85, marginBottom: 22 }}>
                  إعلامية ومدربة أداء متخصصة في <b style={{ color: LT }}>التقديم التلفزيوني</b> والتحرير اللغوي وتأهيل المتحدث الرسمي — تُدرّس محطتَي التأسيس في المسار.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
                  {['الإعلام التلفزيوني','التحرير اللغوي','المتحدث الرسمي','الحضور الإعلامي'].map(t => (
                    <span key={t} style={{ fontFamily: F, fontSize: 12.5, color: '#67e8f9', background: 'rgba(103,232,249,0.08)', border: '1px solid rgba(103,232,249,0.22)', borderRadius: 999, padding: '5px 13px' }}>{t}</span>
                  ))}
                </div>
                <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                  style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', background: 'rgba(103,232,249,0.12)', border: '1px solid rgba(103,232,249,0.35)', color: '#67e8f9', fontFamily: F, fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 12, textDecoration: 'none' }}>
                  تواصل للاستفسار <ArrowLeft size={14} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════ STUDY MODES — "اختر أسلوب تعلّمك" ════════════════ */}
      <section style={{ padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${GL}`, color: GLD, background: GS, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>أسلوب الدراسة</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35, color: OFF }}>
              اختر <span style={{ color: GLD }}>أسلوب تعلّمك</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: MUT, marginTop: 14, maxWidth: 560, marginInline: 'auto' }}>
              نفس المنهج ونفس المدربين والشهادة المعتمدة — فقط اختر ما يناسب جدولك وحياتك
            </p>
          </div>

          {/* comparison card */}
          <div style={{
            background: CARD,
            borderRadius: 20,
            border: `1px solid ${HAIR}`,
            padding: 'clamp(20px,3vw,32px)',
            marginBottom: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          }}>
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(16px,2vw,19px)', color: OFF, margin: '0 0 5px' }}>قارن بين الأسلوبين</h3>
              <p style={{ fontFamily: F, fontSize: 13.5, color: MUT, margin: 0, lineHeight: 1.6 }}>
                نفس المحتوى والشهادات — فقط الاختلاف في مكان الحضور وتوقيته
              </p>
            </div>

            <div className="masar-study-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 }}>

              {/* حضوري tile */}
              <div style={{ background: 'rgba(255,193,7,0.06)', border: '1.5px solid rgba(255,193,7,0.28)', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,193,7,0.16)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={18} color={GLD} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 900, fontSize: 15, color: GLD }}>حضوري — استوديو كاسيت</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: MUT, lineHeight: 1.4 }}>حضور فعلي في استوديو كاسيت وعمّان</div>
                  </div>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['تفاعل مباشر مع المدرب والزملاء', 'تطبيق عملي داخل الاستوديوهات المجهَّزة', 'بيئة تعلم منظَّمة بلا إلهاء', 'تشبيك مع المتدربين وفرص العمل'].map(pt => (
                    <li key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: F, fontSize: 13, color: LT }}>
                      <CheckCircle2 size={14} color={GLD} strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 2 }} />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.30)', borderRadius: 999, padding: '5px 12px', marginTop: 14, fontFamily: F, fontWeight: 700, fontSize: 12, color: GLD }}>
                  <MapPin size={13} color={GLD} strokeWidth={2} />
                  عمّان — الأردن
                </div>
              </div>

              {/* أونلاين tile */}
              <div style={{ background: 'rgba(103,232,249,0.05)', border: '1.5px solid rgba(103,232,249,0.26)', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(103,232,249,0.13)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Wifi size={18} color="#67e8f9" strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 900, fontSize: 15, color: '#67e8f9' }}>كاسيت لايف — Online LIVE</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: MUT, lineHeight: 1.4 }}>جلسات مباشرة تفاعلية من أي مكان</div>
                  </div>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['جلسات مباشرة مع المدرب في الوقت الفعلي', 'تسجيلات الجلسات متاحة للمراجعة', 'تسليم واجبات وتقييم فردي', 'متاح من أي مكان في العالم العربي'].map(pt => (
                    <li key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: F, fontSize: 13, color: LT }}>
                      <CheckCircle2 size={14} color="#67e8f9" strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 2 }} />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(103,232,249,0.13)', border: '1px solid rgba(103,232,249,0.32)', borderRadius: 999, padding: '5px 12px', marginTop: 14, fontFamily: F, fontWeight: 700, fontSize: 12, color: '#67e8f9' }}>
                  <Wifi size={13} color="#67e8f9" strokeWidth={2} />
                  بث مباشر تفاعلي
                </div>
              </div>

            </div>
          </div>

          {/* حضوري details accordion */}
          <StudyAccordion
            variant="inperson"
            label="حضوري — داخل استوديو كاسيت"
            sub="تدريب ميداني مع معدات احترافية وتصحيح فوري"
            badges={['10 محطات', '40 ساعة']}
            items={[
              { title: 'تطبيق عملي أمام الكاميرا',     desc: 'كل محطة تنتهي بمشروع مصوَّر أو مسجَّل يُسلَّم ويُقيَّم من لجنة المدربين.' },
              { title: 'استوديو مجهَّز احترافياً',       desc: 'كاميرات، إضاءة، وأجهزة تسجيل صوتي متاحة طوال فترة التدريب.' },
              { title: 'مجموعات صغيرة — تصحيح فردي',    desc: 'لا يتجاوز عدد المجموعة 12 متدرباً لضمان اهتمام المدرب بكل متدرب.' },
              { title: 'تشبيك مهني مع الزملاء',          desc: 'بيئة تعلم جماعية تفتح أبواب الفرص المهنية والتعاون بين المتدربين.' },
            ]}
          />

          {/* أونلاين details accordion */}
          <StudyAccordion
            variant="online"
            label="Online LIVE — بث مباشر تفاعلي"
            sub="من أي مكان في العالم العربي — بث حي لا تسجيلات مسبقة"
            badges={['10 محطات', '40 ساعة', 'بث مباشر']}
            items={[
              { title: 'جلسات حية مع المدرب',           desc: 'كل محطة تُقدَّم مباشرةً في الوقت الفعلي — لا محاضرات مسجَّلة مسبقاً.' },
              { title: 'تسجيلات للمراجعة',               desc: 'تسجيلات الجلسات محفوظة ومتاحة للمشتركين لمراجعتها في أي وقت.' },
              { title: 'تسليم مشاريع وتقييم فردي',       desc: 'نفس آلية التسليم والتقييم المطبَّقة في الحضوري — لا تنازل عن المعايير.' },
              { title: 'متاح من أي مكان',                desc: 'الأردن، السعودية، الإمارات، مصر، أو أي مكان آخر — بشرط اتصال جيد.' },
            ]}
          />

        </div>
      </section>

      {/* ════════════════ STANDALONE COURSES (cream) ════════════════ */}
      <section style={{ background: LBG, borderBlock: '1px solid rgba(0,0,0,0.08)', padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,193,7,0.35)', color: '#92600a', background: 'rgba(255,193,7,0.12)', fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>الدورات المستقلة</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35, color: DH }}>
              3 دورات <span style={{ color: '#92600a' }}>تشتريها منفردةً</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: DM, maxWidth: 640, marginInline: 'auto', marginTop: 14 }}>
              ابدأ بدورة واحدة، وقرّر لاحقاً ما إذا كنت تودّ الالتحاق بالمسار الكامل. قيمة أي دورة تُستقطع من سعر المسار.
            </p>
          </div>

          <div className="masar-standalone-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {STANDALONE_COURSES.map(c => (
              <div key={c.n} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 18, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontFamily: FP, fontWeight: 800, fontSize: 13, color: '#92600a', background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.30)', borderRadius: 999, padding: '4px 12px' }}>{c.n}</span>
                  <span style={{ fontFamily: F, fontSize: 12, color: DM, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 999, padding: '4px 11px' }}>{c.note}</span>
                </div>
                <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 17, color: DH, lineHeight: 1.5, marginBottom: 10, flex: 0 }}>{c.title}</h3>
                <p style={{ fontFamily: F, fontSize: 14, color: DM, lineHeight: 1.75, marginBottom: 16, flex: 1 }}>{c.desc}</p>
                <div style={{ fontFamily: F, fontSize: 13, color: '#92600a', marginBottom: 6 }}>
                  <b>المدرب:</b> {c.instructor}
                </div>
                <div style={{ fontFamily: F, fontSize: 13, color: DM, marginBottom: 20 }}>
                  <b>المدة:</b> {c.duration}
                </div>
                <Link href={c.route}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: NAVY, color: '#fff', fontFamily: F, fontWeight: 700, fontSize: 14, padding: '12px 20px', borderRadius: 12, textDecoration: 'none', marginTop: 'auto' }}>
                  عرض التفاصيل والتسجيل <ArrowLeft size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, background: '#fff', border: '1px dashed rgba(255,193,7,0.50)', borderRadius: 14, padding: '20px 26px', display: 'flex', gap: 14, alignItems: 'flex-start', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.30)', display: 'grid', placeContent: 'center', color: '#92600a', fontWeight: 800, fontSize: 17 }}>؟</div>
            <p style={{ fontFamily: F, fontSize: 15.5, color: DM, lineHeight: 1.7 }}>
              <b style={{ color: DH }}>الفرق باختصار:</b> الدورة تمنحك مهارة، والمسار يمنحك مهنة.
              ابدأ بدورة إن أردت التجربة، والتحق بالمسار حين تقرّر أن الإعلام هو مستقبلك — عندها ستمرّ بجميع التخصصات دون استثناء.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════ ENROLL (dark) ════════════════ */}
      <section id="enroll" style={{ padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${GL}`, color: GLD, background: GS, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>الالتحاق بالمسار</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35, color: OFF }}>
              اختر <span style={{ color: GLD }}>خيار الالتحاق</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: MUT, marginTop: 14 }}>سر المسار الكامل، أو ابدأ بدورة تأسيسية وحدِّد مسارك لاحقاً.</p>
          </div>

          <div className="masar-enroll-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20 }}>
            {/* track plan */}
            <div style={{ background: `linear-gradient(180deg, rgba(255,193,7,0.07), ${CARD} 40%)`, border: `1px solid ${GL}`, borderRadius: 18, padding: '36px 32px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <span style={{ position: 'absolute', top: 22, left: 26, fontFamily: F, fontSize: 11.5, fontWeight: 700, background: GLD, color: '#1A1206', padding: '5px 12px', borderRadius: 999 }}>الأشمل والأوفر</span>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 24, color: OFF, marginBottom: 10 }}>المسار الإعلامي الكامل</h3>
              <p style={{ fontFamily: F, fontSize: 15, color: MUT, lineHeight: 1.7 }}>10 محطات كاملة: التأسيس + كل التخصصات الإعلامية + القيادة الإعلامية.</p>

              {/* price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '26px 0 6px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FP, fontSize: 44, fontWeight: 700, color: GLD, lineHeight: 1 }}>$1,000</span>
                <span style={{ fontFamily: F, fontSize: 15, color: MUT }}>للمسار الكامل</span>
              </div>

              {/* installment banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 24 }}>
                <Award size={16} color={GLD} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: OFF }}>التقسيط متاح</div>
                  <div style={{ fontFamily: F, fontSize: 12, color: MUT }}>ادفع الدفعة الأولى لتثبيت مقعدك وقسِّط الباقي على مراحل المسار</div>
                </div>
              </div>

              <p style={{ fontFamily: F, fontSize: 13, color: MUT, marginBottom: 24 }}>40 ساعة موزَّعة · حضوري أو Online LIVE</p>

              <ul style={{ listStyle: 'none', display: 'grid', gap: 11, marginBottom: 28, flex: 1 }}>
                {['10 محطات متسلسلة · 3 مراحل','جميع التخصصات الإعلامية','8 محطات حصرية داخل المسار','8 مشاريع تطبيقية بإشراف مباشر','محطة القيادة الإعلامية','شهادة معتمدة من تطبيق وجيز','إمكانية خصم دورة درستها مسبقاً'].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, fontFamily: F, fontSize: 14.5, color: LT, lineHeight: 1.7 }}>
                    <span style={{ color: GLD, fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '15px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,193,7,0.22)' }}>
                التسجيل في المسار <ArrowLeft size={15} />
              </a>
            </div>

            {/* single course plan */}
            <div style={{ background: CARD, border: `1px solid ${HAIR}`, borderRadius: 18, padding: '36px 32px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 24, color: OFF, marginBottom: 10 }}>دورة منفردة</h3>
              <p style={{ fontFamily: F, fontSize: 15, color: MUT, lineHeight: 1.7 }}>ابدأ بدورة واحدة قبل الالتزام بالمسار الكامل.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '26px 0 6px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FP, fontSize: 40, fontWeight: 700, color: GLD, lineHeight: 1 }}>$150 – $250</span>
              </div>
              <p style={{ fontFamily: F, fontSize: 13, color: MUT, marginBottom: 24 }}>للدورة الواحدة · القيمة تُستقطع عند الالتحاق بالمسار</p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 11, marginBottom: 28, flex: 1 }}>
                {['16 ساعة · 8 جلسات','مشروع تطبيقي واحد','شهادة إتمام الدورة','قيمتها تُستقطع عند الالتحاق بالمسار'].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, fontFamily: F, fontSize: 14.5, color: LT, lineHeight: 1.7 }}>
                    <span style={{ color: GLD, fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', border: `1px solid ${HAIR}`, color: OFF, fontFamily: F, fontWeight: 700, fontSize: 15, padding: 15, borderRadius: 999, cursor: 'pointer' }}>
                استعراض الدورات <ArrowLeft size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ FAQ (dark alt) ════════════════ */}
      <section style={{ background: BG2, borderBlock: `1px solid ${HAIR}`, padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 13, fontWeight: 700, padding: '7px 16px', borderRadius: 999, boxShadow: '0 6px 22px rgba(255,193,7,0.2)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206', display: 'block' }} />
              أسئلة شائعة
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35, color: OFF }}>
              قبل أن <span style={{ color: GLD }}>تسأل</span>
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
              الإعلامي لا يُبنى بدورة واحدة — <span style={{ color: GLD }}>يُبنى بمسار متكامل</span>
            </h2>
            <p style={{ fontFamily: F, color: MUT, fontSize: 16.5, margin: '16px auto 32px', maxWidth: 560, lineHeight: 1.75 }}>
              مقاعد كل مجموعة محدودة للحفاظ على جودة التصحيح الفردي. ابدأ بالاستشارة المجانية وقرّر بعدها.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15.5, padding: '15px 30px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,193,7,0.22)' }}>
                تواصل مع المستشارة — مجاناً <ArrowLeft size={15} />
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
