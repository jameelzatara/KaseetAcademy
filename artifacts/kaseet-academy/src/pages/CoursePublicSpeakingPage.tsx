/**
 * دورة فن الخطابة والإلقاء الجماهيري المؤثر
 * المدرب: د. صهيب الخوالدة | حضوري: 180 د.أ | عن بُعد: $150 | 3 وحدات / 8 جلسات / 16 ساعة
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft, Clock, Users, Award, GraduationCap,
  Star, Zap, Mic, MapPin, Wifi, Globe, Sliders, Briefcase,
  Sparkles, RefreshCw, Printer,
} from 'lucide-react';
import InstructorsSection, { type Instructor as InstructorData } from '@/components/InstructorsSection';
import {
  NAVY, DARK, GOLD, OFF, MUTED, F, FP, LBG, DH, DM,
  INNER, waLink, SectionTitle, LightSectionTitle, AdvisorMini,
  ScheduleEntry, SessionItem, TrackCard2, PartnerBar,
} from './shared/coursePageHelpers';
import coverPS     from '@assets/cover-public-speaking-tedx_1785692401460.jpeg';
import photoSohaib from '@assets/instructor-sohaib_1785692401461.jpeg';
import ayaImg      from '@assets/اية_القماز_1785619557679.jpeg';
import yaqoutImg   from '@assets/ياقوت__1785619557679.jpeg';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const brochurePdf = `${BASE}/public-speaking-brochure.pdf`;

/* ── tokens ─────────────────────────────────────────────────── */
const DF      = '#64748b';
const PURPLE  = '#a855f7';
const PURP_DK = '#7e22ce';

/* ── schedule ────────────────────────────────────────────────── */
const ACTIVE_IP:     ScheduleEntry[] = [];
const ACTIVE_ONLINE: ScheduleEntry[] = [];
const UPCOMING_IP:   ScheduleEntry[] = [
  { id:'ip-ps101', group:'دفعة #101 — حضوري', course:'فن الخطابة والإلقاء',
    instructor:'د. صهيب الخوالدة', days:'سيتم التحديد', time:'تحدد المواعيد قريباً',
    month:'أغسطس', day:'--', status:'upcoming',
    batchNumber:'#101', availableSeats:12, registeredCount:3, badgeDate:'أغسطس 2026' },
];
const UPCOMING_ONLINE: ScheduleEntry[] = [
  { id:'rm-ps201', group:'دفعة #201 — عن بُعد', course:'فن الخطابة والإلقاء',
    instructor:'د. صهيب الخوالدة', days:'سيتم التحديد', time:'تحدد المواعيد قريباً',
    month:'أغسطس', day:'--', status:'upcoming',
    batchNumber:'#201', availableSeats:15, registeredCount:5, badgeDate:'أغسطس 2026' },
];

/* ── curriculum ──────────────────────────────────────────────── */
const SESSIONS: SessionItem[] = [
  { unit:'الوحدة الأولى: الأساسيات والجمهور', title:'كسر الرهبة وبناء الثقة',              desc:'استراتيجيات عملية للتغلب على رهبة المنصة وبناء الثقة الداخلية — من خلال تمارين التعرّض التدريجي والتدريب الذهني.' },
  { unit:'الوحدة الأولى',                      title:'مخارج الحروف والصوت الجذاب',           desc:'تمارين صوتية عملية لتحسين النطق والإلقاء — الإيقاع، الطبقات الصوتية، واستخدام الصمت الاستراتيجي كأداة خطابية.' },
  { unit:'الوحدة الثانية: الإقناع والتأثير',   title:'الوقفات الذكية وإيقاع الخطاب',         desc:'فن توظيف الصمت والوقفة والتوقف في الخطاب — كيف يُضاعف السكوت في المكان الصحيح قوة الكلام ويُعمّق التأثير.' },
  { unit:'الوحدة الثانية',                      title:'فن الارتجال والتحدث بثقة',              desc:'تقنيات الحديث دون استعداد مسبق — مهارة قيّمة في المقابلات وجلسات النقاش وإدارة المواقف المفاجئة بكل احتراف.' },
  { unit:'الوحدة الثانية',                      title:'هيكل الخطاب المؤثر',                    desc:'منهجية بناء الخطاب من المقدمة الجذابة إلى الخاتمة التي تبقى في الذاكرة — نماذج TED وخطابات الإقناع العالمية.' },
  { unit:'الوحدة الثالثة: التطبيقات المتقدمة', title:'خطابة الإقناع والمواقف الصعبة',        desc:'أدوات الإقناع في الظروف الضاغطة والمواقف الحرجة — التعامل مع الجمهور المعترض وقلب الرأي بالحجة والأسلوب.' },
  { unit:'الوحدة الثالثة',                      title:'إدارة الأسئلة الصعبة والأزمات',         desc:'الرد على الأسئلة الحرجة أمام الجمهور وإدارة اللحظات المفاجئة بثقة — تقنيات الانتقال السلس وإعادة توجيه الحوار.' },
  { unit:'الوحدة الثالثة',                      title:'مشروع التخرج: خطاب TED x',              desc:'تصميم وتنفيذ خطاب TED x أمام لجنة تقييم — مع تقرير فردي لهويتك الخطابية وخريطة طريق للتطوير المستمر.' },
];

/* ── goals grid ─────────────────────────────────────────────── */
const GOALS_GRID = [
  { Icon: Mic,      text:'التخلص التام من رهبة المنصة وبناء ثقة داخلية حقيقية وراسخة.' },
  { Icon: Sliders,  text:'إتقان إيقاع الخطاب والوقفات الذكية لتضخيم التأثير والإقناع.' },
  { Icon: Zap,      text:'الارتجال بثقة والتعامل مع المواقف المفاجئة بكل احتراف وعفوية.' },
  { Icon: Star,     text:'بناء خطاب مؤثر من المقدمة الجذابة إلى الخاتمة الماكثة في الذاكرة.' },
  { Icon: Globe,    text:'إقناع أي جمهور في الظروف الصعبة والمواقف الحرجة بالحجة والأسلوب.' },
  { Icon: Briefcase, text:'تطوير هوية خطابية شخصية متميزة قائمة على الإقناع لا مجرد الإلقاء.' },
] as { Icon: React.ElementType; text: string }[];

/* ── outcomes ───────────────────────────────────────────────── */
const OUTCOMES = [
  { Icon: Award,    title:'شهادة معتمدة رسمياً',                  desc:'شهادة إتمام البرنامج معتمدة رسمياً من منصة "وجيز" وأكاديمية "كاسيت ميديا".' },
  { Icon: Mic,      title:'خطاب TED x متكامل',                    desc:'تصميم وتقديم خطاب TED x أمام لجنة تقييم متخصصة وتسجيل رسمي للمحفظة الشخصية.' },
  { Icon: Star,     title:'تقرير هوية خطابية فردي',               desc:'تقرير تفصيلي يحدد هويتك الخطابية الشخصية ونقاط القوة والتطوير مع خريطة طريق.' },
  { Icon: Zap,      title:'وصول كامل لتسجيلات اللقاءات',          desc:'تسجيلات الجلسات الثماني متاحة مدى الحياة للمراجعة والتطوير المستمر بعد انتهاء البرنامج.' },
] as { Icon: React.ElementType; title: string; desc: string }[];

/* ── instructor ─────────────────────────────────────────────── */
const INSTRUCTORS: InstructorData[] = [
  { initials:'ص.خ', photo: photoSohaib,
    name:'د. صهيب الخوالدة', role:'خبير تخطيط استراتيجي وتواصل قيادي',
    badges: [
      { icon: GraduationCap, label:'دكتوراه — جامعة أستون، المملكة المتحدة' },
      { icon: Globe,         label:'مدير الأبحاث — مؤسسة قطر' },
      { icon: Clock,         label:'خبرة 16+ سنة' },
      { icon: Award,         label:'MBA امتياز — الشرق الأوسط' },
    ],
    bio:'خبير تخطيط استراتيجي وتواصل قيادي، يشغل حالياً منصب مدير الأبحاث والسياسات في مؤسسة قطر، بخبرة مهنية تتجاوز 16 عاماً في تطوير الأعمال وإدارة المشاريع والقيادة الاستراتيجية. حاصل على دكتوراه في إدارة الأعمال من جامعة أستون (المملكة المتحدة)، وماجستير إدارة أعمال بامتياز من الجامعة الأردنية.' },
];

/* ════════════════════════════════════════════════
   PRICING CARD — reference style (NAVY bg, dual price)
════════════════════════════════════════════════ */
function PricingCard() {
  const waMsgIP     = 'السلام عليكم، أرغب في التسجيل في دورة فن الخطابة والإلقاء الجماهيري (حضوري).';
  const waMsgOnline = 'السلام عليكم، أرغب في التسجيل في دورة فن الخطابة والإلقاء الجماهيري (عن بُعد).';
  return (
    <div style={{ width:'100%', background: NAVY, borderRadius:22, overflow:'hidden', boxShadow:'0 28px 64px rgba(29,39,56,0.22), 0 8px 20px rgba(0,0,0,0.12)' }}>
      {/* Cover photo */}
      <div style={{ position:'relative', height:200, overflow:'hidden' }}>
        <img src={coverPS} alt="فن الخطابة" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center', display:'block' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(29,39,56,0.05) 40%,rgba(29,39,56,0.75) 100%)' }} />
      </div>
      {/* Body */}
      <div style={{ padding:'18px 16px 20px' }}>
        {/* Price rows */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
          {/* حضوري */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,193,7,0.10)', border:'1px solid rgba(255,193,7,0.28)', borderRadius:10, padding:'9px 12px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <MapPin size={13} color={GOLD} strokeWidth={2.5} />
              <span style={{ fontFamily:F, fontWeight:700, fontSize:13, color:'rgba(252,251,251,0.85)' }}>حضوري</span>
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:4, direction:'ltr' }}>
              <span style={{ fontFamily:FP, fontWeight:900, fontSize:18, color:GOLD }}>180</span>
              <span style={{ fontFamily:F, fontWeight:600, fontSize:12, color:'rgba(252,251,251,0.65)' }}>JOD</span>
              <span style={{ fontFamily:FP, fontSize:11.5, color:'rgba(252,251,251,0.28)', textDecoration:'line-through' }}>240</span>
            </div>
          </div>
          {/* عن بُعد */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:10, padding:'9px 12px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <Wifi size={13} color='rgba(252,251,251,0.55)' strokeWidth={2.5} />
              <span style={{ fontFamily:F, fontWeight:700, fontSize:13, color:'rgba(252,251,251,0.72)' }}>عن بُعد</span>
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:4, direction:'ltr' }}>
              <span style={{ fontFamily:FP, fontWeight:900, fontSize:18, color:GOLD }}>$150</span>
              <span style={{ fontFamily:FP, fontSize:11.5, color:'rgba(252,251,251,0.28)', textDecoration:'line-through' }}>$200</span>
            </div>
          </div>
        </div>
        {/* Installment */}
        <p style={{ fontFamily:F, fontSize:11.5, color:'rgba(255,193,7,0.72)', textAlign:'center', margin:'0 0 14px' }}>
          <Sparkles size={12} style={{ display:'inline-block', verticalAlign:'middle', marginInlineEnd:4 }} /> بإمكانية التقسيط
        </p>
        <div style={{ height:1, background:'rgba(255,255,255,0.08)', margin:'0 0 14px' }} />
        {/* Instructor */}
        <div style={{ display:'flex', flexDirection:'column', gap:9, marginBottom:16 }}>
          {[{ img: photoSohaib, name:'د. صهيب الخوالدة' }].map(({ img, name }) => (
            <div key={name} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <img src={img} alt={name} style={{ width:34, height:34, borderRadius:'50%', objectFit:'cover', objectPosition:'center top', border:'2px solid rgba(255,193,7,0.42)', flexShrink:0 }} />
              <span style={{ fontFamily:F, fontWeight:700, fontSize:13.5, color:'rgba(252,251,251,0.88)' }}>{name}</span>
            </div>
          ))}
        </div>
        {/* CTA buttons */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <a href={waLink('962790234483', waMsgIP)} target="_blank" rel="noopener noreferrer"
            style={{ display:'block', textAlign:'center', background:GOLD, color:NAVY, fontFamily:F, fontWeight:800, fontSize:13, padding:'10px 0', borderRadius:10, textDecoration:'none', boxShadow:'0 6px 18px rgba(255,193,7,0.28)' }}>
            سجّل حضوري <ArrowLeft size={13} style={{ display:'inline-block', verticalAlign:'middle', marginInlineStart:4 }} />
          </a>
          <a href={waLink('962771052222', waMsgOnline)} target="_blank" rel="noopener noreferrer"
            style={{ display:'block', textAlign:'center', background:'rgba(168,85,247,0.18)', border:'1px solid rgba(168,85,247,0.45)', color:'rgba(252,251,251,0.90)', fontFamily:F, fontWeight:800, fontSize:13, padding:'10px 0', borderRadius:10, textDecoration:'none' }}>
            سجّل عن بُعد <ArrowLeft size={13} style={{ display:'inline-block', verticalAlign:'middle', marginInlineStart:4 }} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════ */
export default function CoursePublicSpeakingPage() {
  const [, navigate]         = useLocation();
  const [openCurr, setOpenCurr]         = useState(false);
  const [expandIP, setExpandIP]         = useState(false);
  const [expandOnline, setExpandOnline] = useState(false);
  const [partnerOpen, setPartner]       = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const waMsgIP     = 'السلام عليكم، أرغب في التسجيل في دورة فن الخطابة والإلقاء الجماهيري (حضوري).';
  const waMsgOnline = 'السلام عليكم، أرغب في التسجيل في دورة فن الخطابة والإلقاء الجماهيري (عن بُعد).';
  const INNER_S: React.CSSProperties = { maxWidth:1120, margin:'0 auto', padding:'0 clamp(16px,4vw,40px)' };

  return (
    <div dir="rtl" style={{ position:'relative', zIndex:1, minHeight:'100vh', color:OFF }}>

      {/* ══════════════════ HERO ══════════════════ */}
      <section style={{ paddingTop:'clamp(24px,4vw,56px)', paddingBottom:'clamp(36px,4vw,64px)', background:'#F5F3EF', borderBottom:'1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ ...INNER_S, display:'flex', gap:'clamp(24px,3vw,48px)', alignItems:'flex-start' }}>

          {/* Right — text */}
          <div style={{ flex:1, minWidth:0, direction:'rtl' }}>
            <button onClick={() => navigate('/')} style={{ background:'none', border:'none', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6, color:'#64748b', fontFamily:F, fontSize:14, padding:0, marginBottom:22 }}>
              <ArrowLeft size={16} /> الرجوع إلى قائمة الدورات
            </button>

            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:18 }}>
              {['فن الخطابة', 'قيادة وتواصل', 'حضوري وعن بُعد', 'للمحترفين والقياديين'].map(t => (
                <span key={t} style={{ display:'inline-flex', alignItems:'center', background:'rgba(255,193,7,0.12)', border:'1px solid rgba(255,193,7,0.35)', color:'#92670a', borderRadius:999, fontFamily:F, fontWeight:700, fontSize:12, padding:'5px 13px', whiteSpace:'nowrap' }}>{t}</span>
              ))}
            </div>

            <h1 style={{ fontFamily:F, fontWeight:900, fontSize:'clamp(26px,3.8vw,46px)', color:'#1e293b', lineHeight:1.2, margin:'0 0 16px' }}>
              دورة فن الخطابة والإلقاء الجماهيري المؤثر
            </h1>

            <p style={{ fontFamily:F, fontWeight:500, fontSize:'clamp(14px,1.6vw,17px)', color:GOLD, lineHeight:1.8, margin:'0 0 24px', borderRight:`3px solid ${GOLD}`, paddingRight:14 }}>
              "الكلمة الصحيحة في المكان الصحيح تغيّر مجريات أي حوار وتُحوّل الاقتراح إلى قرار"
            </p>

            {/* Stats pills */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'clamp(10px,1.5vw,18px)', marginBottom:28, fontFamily:F, fontSize:13.5, color:'#475569' }}>
              {[
                { icon:<Users size={13} />,  label:'مقاعد محدودة' },
                { icon:<Award size={13} />,  label:'شهادة معتمدة' },
                { icon:<MapPin size={13} />, label:'حضوري وعن بُعد' },
                { icon:<Clock size={13} />,  label:'16 ساعة تدريبية' },
                { icon:<Globe size={13} />,  label:'عربي' },
              ].map(({ icon, label }) => (
                <span key={label} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.10)', borderRadius:999, padding:'6px 14px', fontWeight:500 }}>
                  {icon} {label}
                </span>
              ))}
            </div>

            {/* Instructor avatars */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
              <div style={{ display:'inline-flex' }}>
                {[photoSohaib].map((img, i) => (
                  <img key={i} src={img} alt="" style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', objectPosition:'center top', border:'2px solid rgba(255,193,7,0.60)', marginInlineStart:i > 0 ? -14 : 0, boxShadow:'0 3px 8px rgba(0,0,0,0.18)' }} />
                ))}
              </div>
              <div>
                <span style={{ fontFamily:F, fontWeight:700, fontSize:14, color:'#1e293b', display:'block' }}>بإشراف خبير تواصل قيادي دولي</span>
                <span style={{ fontFamily:F, fontSize:12.5, color:'#64748b' }}>د. صهيب الخوالدة</span>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:30, fontFamily:F, fontSize:13, color:'#64748b' }}>
              {[
                { icon:<GraduationCap size={13} />, text:'شهادة معتمدة دولياً' },
                { icon:<Users size={13} />,         text:'خبراء معتمدون' },
                { icon:<RefreshCw size={13} />,     text:'إعادة التدريب مدى الحياة' },
              ].map(({ icon, text }) => (
                <span key={text} style={{ display:'inline-flex', alignItems:'center', gap:5 }}>{icon} {text}</span>
              ))}
            </div>

            {/* CTA — dual buttons */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
              <a href={waLink('962790234483', waMsgIP)} target="_blank" rel="noopener noreferrer"
                style={{ background:GOLD, color:NAVY, fontFamily:F, fontWeight:800, fontSize:15, padding:'13px 30px', borderRadius:12, textDecoration:'none', display:'inline-block', boxShadow:'0 8px 22px rgba(255,193,7,0.32)' }}>
                سجّل حضوري <ArrowLeft size={14} style={{ display:'inline-block', verticalAlign:'middle', marginInlineStart:4 }} />
              </a>
              <a href={waLink('962771052222', waMsgOnline)} target="_blank" rel="noopener noreferrer"
                style={{ background:'rgba(168,85,247,0.18)', border:'1px solid rgba(168,85,247,0.45)', color:'#c084fc', fontFamily:F, fontWeight:800, fontSize:15, padding:'13px 30px', borderRadius:12, textDecoration:'none', display:'inline-block' }}>
                سجّل عن بُعد <ArrowLeft size={14} style={{ display:'inline-block', verticalAlign:'middle', marginInlineStart:4 }} />
              </a>
            </div>
          </div>

          {/* Left — sticky pricing card */}
          <div style={{ width:'clamp(340px,30vw,420px)', flexShrink:0, position:'sticky', top:20 }}>
            <PricingCard />
          </div>
        </div>
      </section>

      {/* ══════════════════ SCHEDULE — dark ══════════════════ */}
      <section style={{ background:'#0D0B14', paddingBlock:'clamp(48px,5vw,80px)', position:'relative', overflow:'hidden' }}>
        <div aria-hidden className="ka-blob-1" style={{ position:'absolute', width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,193,7,0.13) 0%,transparent 70%)', top:'-120px', right:'-80px', pointerEvents:'none' }} />
        <div aria-hidden className="ka-blob-2" style={{ position:'absolute', width:420, height:420, borderRadius:'50%', background:'radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 70%)', bottom:'-60px', left:'10%', pointerEvents:'none' }} />
        <div aria-hidden className="ka-blob-3" style={{ position:'absolute', width:340, height:340, borderRadius:'50%', background:'radial-gradient(circle,rgba(103,232,249,0.07) 0%,transparent 70%)', top:'30%', left:'-60px', pointerEvents:'none' }} />
        <div style={{ ...INNER_S, position:'relative', zIndex:1 }}>
          <SectionTitle>المواعيد المتاحة للتسجيل</SectionTitle>
          <p style={{ fontFamily:F, fontSize:15, color:MUTED, lineHeight:1.8, margin:'0 0 32px' }}>
            اختر مسارك التعليمي — حضوري مع تفاعل مباشر في القاعة، أو عن بُعد عبر زوم بنفس المحتوى والشهادة
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <TrackCard2 variant="inperson" activeBatches={ACTIVE_IP} upcomingBatches={UPCOMING_IP} expanded={expandIP} onToggle={() => setExpandIP(v => !v)} price="180 د.أ" priceStrike="240 د.أ" waPhone="962790234483" waMsg={waMsgIP} />
            <TrackCard2 variant="online" activeBatches={ACTIVE_ONLINE} upcomingBatches={UPCOMING_ONLINE} expanded={expandOnline} onToggle={() => setExpandOnline(v => !v)} price="$150" priceStrike="$200" waPhone="962771052222" waMsg={waMsgOnline} />
          </div>
          <PartnerBar open={partnerOpen} onToggle={() => setPartner(v => !v)} />
        </div>
      </section>

      {/* ══════════════════ ABOUT + GOALS — light, 2-col ══════════════════ */}
      <section style={{ background:LBG, paddingBlock:'clamp(48px,5vw,80px)', borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ ...INNER_S, display:'flex', gap:'clamp(24px,3vw,40px)', alignItems:'flex-start' }}>
          {/* Main */}
          <div style={{ flex:1, minWidth:0 }}>
            <LightSectionTitle>نبذة عن البرنامج وأهدافه</LightSectionTitle>
            <p style={{ fontFamily:F, fontSize:'clamp(14px,1.5vw,16.5px)', color:DM, lineHeight:2, marginBottom:40, maxWidth:720 }}>
              يسعى هذا البرنامج إلى تحويل الخوف من المنصة إلى ثقة راسخة، من خلال 3 وحدات متكاملة تغطي أساسيات الخطابة والإقناع والتطبيق المتقدم. ترتكز أهدافنا على بناء ثقة داخلية حقيقية، والتمكن من فن الارتجال والإقناع، بالإضافة إلى هيكلة الخطاب المؤثر وإدارة المواقف الصعبة.
            </p>
            <LightSectionTitle>الأهداف المتحققة</LightSectionTitle>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:14 }}>
              {GOALS_GRID.map(({ Icon, text }, i) => (
                <div key={i} style={{ display:'flex', gap:14, background:'#fff', borderRadius:14, border:'1px solid rgba(0,0,0,0.08)', padding:'18px 20px', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ flexShrink:0, width:36, height:36, borderRadius:9, background:'rgba(255,193,7,0.12)', border:'1px solid rgba(255,193,7,0.25)', display:'flex', alignItems:'center', justifyContent:'center', marginTop:2 }}>
                    <Icon size={17} color={GOLD} strokeWidth={2.2} />
                  </div>
                  <p style={{ fontFamily:F, fontSize:14, color:DM, lineHeight:1.8, margin:0 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Advisor sidebar — dual advisors */}
          <div style={{ width:'clamp(260px,26vw,310px)', flexShrink:0, position:'sticky', top:24 }}>
            <div style={{ background:'#181325', borderRadius:20, padding:'24px 20px', boxShadow:'0 20px 50px rgba(0,0,0,0.20)' }}>
              <h3 style={{ fontFamily:F, fontWeight:900, fontSize:18, color:OFF, margin:'0 0 8px' }}>هل تحتاج مساعدة في التسجيل؟</h3>
              <p style={{ fontFamily:F, fontSize:12.5, color:MUTED, lineHeight:1.7, margin:'0 0 20px' }}>تواصل مع مستشاراتنا الأكاديميات مباشرة — نحن هنا للمساعدة</p>
              <div style={{ height:1, background:'rgba(255,255,255,0.08)', marginBottom:20 }} />
              <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                <AdvisorMini name="آية القماز" role="مستشارة التسجيل — وجاهي" photo={ayaImg} href={waLink('962790234483', waMsgIP)} />
                <div style={{ height:1, background:'rgba(255,255,255,0.06)' }} />
                <AdvisorMini name="ياقوت الخشاشنة" role="مستشارة التسجيل — عن بُعد" photo={yaqoutImg} href={waLink('962771052222', waMsgOnline)} />
              </div>
              <div style={{ marginTop:20, padding:'12px 14px', background:'rgba(255,193,7,0.08)', border:'1px solid rgba(255,193,7,0.22)', borderRadius:10 }}>
                <p style={{ fontFamily:F, fontSize:12, color:'rgba(255,193,7,0.80)', lineHeight:1.65, margin:0 }}>⏱ أوقات التواصل: يومياً من 9 صباحاً حتى 10 مساءً</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ OUTCOMES — light ══════════════════ */}
      <section style={{ background:LBG, paddingBlock:'clamp(48px,5vw,80px)', borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
        <div style={INNER_S}>
          <LightSectionTitle>المخرجات التدريبية المتوقعة</LightSectionTitle>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
            {OUTCOMES.map(({ Icon, title, desc }, i) => (
              <div key={i} style={{ background:'#fff', borderRadius:18, border:'1px solid rgba(0,0,0,0.08)', padding:'26px 22px', display:'flex', flexDirection:'column', gap:14, boxShadow:'0 3px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ width:48, height:48, borderRadius:13, background:'rgba(255,193,7,0.10)', border:'1px solid rgba(255,193,7,0.28)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={22} color={GOLD} strokeWidth={2} />
                </div>
                <h4 style={{ fontFamily:F, fontWeight:800, fontSize:16, color:DH, margin:0, lineHeight:1.3 }}>{title}</h4>
                <p style={{ fontFamily:F, fontSize:13.5, color:DM, lineHeight:1.8, margin:0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CURRICULUM — light ══════════════════ */}
      <section style={{ background:LBG, paddingBlock:'clamp(48px,5vw,80px)', borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
        <div style={INNER_S}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:28 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:4, height:28, background:GOLD, borderRadius:4, flexShrink:0 }} />
              <h2 style={{ fontFamily:F, fontWeight:900, fontSize:'clamp(20px,2.4vw,26px)', color:DH, margin:0, lineHeight:1.2 }}>الخطة الدراسية</h2>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <a href={brochurePdf} download="كتيب-فن-الخطابة.pdf"
                style={{ display:'inline-flex', alignItems:'center', gap:7, background:GOLD, color:NAVY, fontFamily:F, fontWeight:700, fontSize:13.5, padding:'9px 18px', borderRadius:10, textDecoration:'none', boxShadow:'0 2px 6px rgba(255,193,7,0.22)' }}>
                ⬇ تحميل الكتيب
              </a>
              <button onClick={() => window.print()} style={{ display:'inline-flex', alignItems:'center', gap:7, background:'#fff', border:'1px solid rgba(0,0,0,0.12)', color:DM, fontFamily:F, fontWeight:700, fontSize:13.5, padding:'9px 18px', borderRadius:10, cursor:'pointer', boxShadow:'0 2px 6px rgba(0,0,0,0.06)' }}>
                <Printer size={15} color={DM} strokeWidth={2} /> طباعة المنهج
              </button>
            </div>
          </div>

          {/* 3-unit comparison card */}
          <div style={{ background:'#fff', borderRadius:20, border:'1px solid rgba(0,0,0,0.08)', padding:'clamp(20px,3vw,32px)', marginBottom:24, boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily:F, fontWeight:900, fontSize:'clamp(16px,2vw,19px)', color:DH, margin:'0 0 5px' }}>هيكل البرنامج — 3 وحدات متكاملة</h3>
            <p style={{ fontFamily:F, fontSize:13.5, color:DF, margin:'0 0 18px', lineHeight:1.6 }}>
              كل وحدة مبنية على السابقة — من كسر رهبة المنصة إلى خطاب TED x كامل
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 }}>
              {[
                { num:'01', title:'الأساسيات والجمهور', sessions:'جلسة 1–2', color:'rgba(255,193,7,0.28)', textColor:'#92670a' },
                { num:'02', title:'الإقناع والتأثير',    sessions:'جلسة 3–5', color:'rgba(168,85,247,0.22)', textColor:PURP_DK },
                { num:'03', title:'التطبيقات المتقدمة',  sessions:'جلسة 6–8', color:'rgba(103,232,249,0.18)', textColor:'#0e7490' },
              ].map(u => (
                <div key={u.num} style={{ background:`rgba(0,0,0,0.02)`, border:`1px solid ${u.color}`, borderRadius:14, padding:'16px 18px' }}>
                  <div style={{ fontFamily:FP, fontWeight:900, fontSize:28, color:u.textColor, lineHeight:1 }}>{u.num}</div>
                  <div style={{ fontFamily:F, fontWeight:800, fontSize:14, color:DH, margin:'6px 0 4px' }}>{u.title}</div>
                  <div style={{ fontFamily:F, fontSize:12, color:DF }}>{u.sessions}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Accordion */}
          <div style={{ borderRadius:18, overflow:'hidden', border:`1px solid ${openCurr ? 'rgba(168,85,247,0.40)' : 'rgba(0,0,0,0.09)'}`, boxShadow: openCurr ? '0 6px 24px rgba(168,85,247,0.08)' : '0 2px 8px rgba(0,0,0,0.05)', transition:'border-color 0.2s,box-shadow 0.2s' }}>
            <button onClick={() => setOpenCurr(!openCurr)} style={{ width:'100%', background: openCurr ? 'rgba(168,85,247,0.04)' : '#fff', border:'none', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', cursor:'pointer', textAlign:'right', gap:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:'50%', flexShrink:0, background: openCurr ? PURPLE : 'rgba(168,85,247,0.12)', display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s' }}>
                  <Mic size={17} color={openCurr ? '#fff' : PURPLE} strokeWidth={2.2} />
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:F, fontWeight:900, fontSize:16, color:DH }}>المحتوى التفصيلي — 8 جلسات</div>
                  <div style={{ fontFamily:F, fontSize:12.5, color:DF, marginTop:2 }}>3 وحدات متكاملة · حضوري وعن بُعد</div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
                <span style={{ fontFamily:FP, fontSize:11, color:DF, background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.09)', borderRadius:6, padding:'3px 8px', whiteSpace:'nowrap' }}>8 جلسات</span>
                <span style={{ fontFamily:FP, fontSize:11, color:DF, background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.09)', borderRadius:6, padding:'3px 8px', whiteSpace:'nowrap' }}>16 ساعة</span>
              </div>
            </button>
            {openCurr && (
              <div style={{ background:'rgba(168,85,247,0.02)', borderTop:'1px solid rgba(168,85,247,0.14)' }}>
                {SESSIONS.map((s, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'16px 22px', borderBottom: i < SESSIONS.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                    <span style={{ fontFamily:FP, fontWeight:800, fontSize:12, color:'#fff', background:PURPLE, borderRadius:'50%', flexShrink:0, width:28, height:28, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>{i+1}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      {s.unit && <div style={{ fontFamily:F, fontSize:11, fontWeight:700, color:PURP_DK, marginBottom:4 }}>{s.unit}</div>}
                      <div style={{ fontFamily:F, fontWeight:800, fontSize:14.5, color:DH, marginBottom:5 }}>{s.title}</div>
                      <div style={{ fontFamily:F, fontSize:13.5, color:DM, lineHeight:1.75 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <InstructorsSection instructors={INSTRUCTORS} />
    </div>
  );
}
