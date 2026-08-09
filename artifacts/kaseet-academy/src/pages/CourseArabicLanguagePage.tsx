/**
 * دورة تمكين اللغة العربية وفنون التحرير اللغوي
 * المدربة: رنا العزام | السعر: $150 | 8 جلسات / 16 ساعة | مباشر تفاعلي (Online LIVE)
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  ArrowLeft, Clock, Users, Tv, Award, GraduationCap,
  BookOpen, Globe, Zap, Briefcase, Star, Sliders, Wifi,
  Sparkles, RefreshCw, Printer,
} from 'lucide-react';
import InstructorsSection, { type Instructor as InstructorData } from '@/components/InstructorsSection';
import {
  NAVY, DARK, GOLD, OFF, MUTED, F, FP, LBG, DH, DM,
  INNER, waLink, SectionTitle, LightSectionTitle, AdvisorMini,
  ScheduleEntry, SessionItem, TrackCard2, PartnerBar,
} from './shared/coursePageHelpers';
import coverArabic from '@assets/دورة_اللغة_العربية_1785758462657.png';
import photoRana   from '@assets/trainer-rana-azzam_1785692178863.JPG';
import yaqoutImg   from '@assets/ياقوت__1785619557679.jpeg';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const brochurePdf = `${BASE}/arabic-brochure.pdf`;

/* ── tokens ─────────────────────────────────────────────────── */
const DF   = '#64748b';

/* ── schedule ────────────────────────────────────────────────── */
const ACTIVE_ONLINE:   ScheduleEntry[] = [];
const UPCOMING_ONLINE: ScheduleEntry[] = [
  { id:'rm-al101', group:'دفعة #101 — مباشر تفاعلي (Online LIVE)', course:'تمكين اللغة العربية وفنون التحرير',
    instructor:'رنا العزام', days:'سيتم التحديد', time:'تحدد المواعيد قريباً',
    month:'أغسطس', day:'--', status:'upcoming',
    batchNumber:'#101', availableSeats:15, registeredCount:5, badgeDate:'أغسطس 2026' },
  { id:'rm-al102', group:'دفعة #102 — مباشر تفاعلي (Online LIVE)', course:'تمكين اللغة العربية وفنون التحرير',
    instructor:'رنا العزام', days:'سيتم التحديد', time:'تحدد المواعيد قريباً',
    month:'أغسطس', day:'--', status:'upcoming',
    batchNumber:'#102', availableSeats:25, registeredCount:0, badgeDate:'أغسطس 2026' },
];

/* ── curriculum ──────────────────────────────────────────────── */
const SESSIONS: SessionItem[] = [
  { title:'النظام اللغوي وبنية الجملة العربية',      desc:'فهم منظومة اللغة العربية وبنية الجملة الاسمية والفعلية — الأساس الذي تُبنى عليه كل المهارات اللغوية.' },
  { title:'النحو الوظيفي والقواعد التطبيقية',         desc:'نحو عملي غير نظري — إعراب الجمل في السياق الحقيقي وتطبيق القواعد في الكتابة والتحرير اليومي.' },
  { title:'أساليب التعبير وفنون الكتابة',              desc:'أنماط التعبير العربي المختلفة: الخبري والإنشائي، المباشر والأدبي — وكيف تختار الأسلوب المناسب لكل سياق.' },
  { title:'الصرف العربي والاشتقاق اللغوي',             desc:'أوزان الأفعال والمصادر والمشتقات — مفتاح توسيع المعجم الذهني واستخدام الألفاظ بدقة ومرونة.' },
  { title:'الإملاء والكتابة الصحيحة',                  desc:'قواعد الإملاء الحاسمة: الهمزات، التاء المربوطة والمفتوحة، الألف اللينة — مع تدريبات تصحيح نصوص حية.' },
  { title:'تطوير الأسلوب والأداء الكتابي',              desc:'الانتقال من الكتابة الصحيحة إلى الكتابة المؤثرة — تقنيات تحسين الأسلوب وبناء الفقرات وتدفق الأفكار.' },
  { title:'البلاغة وأسرار البيان العربي',               desc:'مقدمة في علمَي البيان والبديع — كيف يُحيي التشبيه والاستعارة والمجاز النصوص ويرفع مستوى الكتابة.' },
  { title:'التطبيقات العملية وورشة الكتابة',            desc:'ورشة تحرير نصوص إعلامية وأدبية وأكاديمية مع تصويب فوري — وإنتاج مشروع ختامي يُقيَّم من المدربة.' },
];

/* ── goals grid ─────────────────────────────────────────────── */
const GOALS_GRID = [
  { Icon: BookOpen, text:'إتقان قواعد النحو والصرف بأسلوب عملي تطبيقي بعيد عن التلقين.' },
  { Icon: Sliders,  text:'كتابة عربية فصيحة سليمة خالية من أخطاء الإملاء والنحو.' },
  { Icon: Star,     text:'توسيع الثروة اللغوية عبر الاشتقاق ومعرفة أوزان الأفعال والمشتقات.' },
  { Icon: Globe,    text:'تحرير ومراجعة النصوص بمعايير مجمع اللغة العربية الأردني.' },
  { Icon: Zap,      text:'تطوير الأسلوب الكتابي وبناء فقرات متماسكة مؤثرة في أي سياق مهني.' },
  { Icon: Briefcase, text:'إنتاج مشروع ختامي محرَّر احترافياً لتوظيفه في المحفظة المهنية.' },
] as { Icon: React.ElementType; text: string }[];

/* ── outcomes ───────────────────────────────────────────────── */
const OUTCOMES = [
  { Icon: Award,    title:'شهادة معتمدة رسمياً',               desc:'شهادة إتمام البرنامج معتمدة رسمياً من منصة "وجيز" وأكاديمية "كاسيت أكاديمي".' },
  { Icon: BookOpen, title:'حقيبة مرجعية رقمية شاملة',          desc:'أدلة رقمية تلخّص قواعد النحو والإملاء للتدقيق الذاتي والمراجعة السريعة.' },
  { Icon: Globe,    title:'أسلوب عربي متميز ومؤثر',            desc:'القدرة على الكتابة بأسلوب عربي فصيح مؤثر يناسب كل سياق مهني أو أدبي.' },
  { Icon: Star,     title:'مشروع ختامي محرَّر احترافياً',        desc:'نص محرَّر بمعايير مجمع اللغة العربية مُقيَّم مباشرةً من المدربة مع تغذية راجعة.' },
] as { Icon: React.ElementType; title: string; desc: string }[];

/* ── instructor ─────────────────────────────────────────────── */
const INSTRUCTORS: InstructorData[] = [
  { initials:'ر.ع', photo: photoRana,
    name:'رنا محمد العزام', role:'إعلامية ومختصة تحرير لغوي ومدققة لغة',
    badges: [
      { icon: Globe, label:'مجمع اللغة العربية — محررة ومدققة' },
      { icon: Tv,    label:'رؤيا | صاد | حياة FM' },
      { icon: Clock, label:'خبرة 10+ سنوات' },
      { icon: Users, label:'مئات المتدربين' },
    ],
    bio:'الإعلامية رنا محمد العزام معدّة ومقدّمة برامج فضائية وإذاعية وبودكاست معتمدة. عملت سنواتٍ محررةً ومدققةً لغوية في مجمع اللغة العربية الأردني — المرجع اللغوي الأول في المنطقة. تمتلك خبرة عريقة في تمكين المتدربين من اللغة العربية الفصيحة للاستخدام المهني والإعلامي.' },
];

/* ════════════════════════════════════════════════
   PRICING CARD — reference style (NAVY bg)
════════════════════════════════════════════════ */
function PricingCard() {
  const waMsg = 'السلام عليكم، أرغب في التسجيل في دورة تمكين اللغة العربية وفنون التحرير اللغوي.';
  return (
    <div style={{ width:'100%', background: NAVY, borderRadius:22, overflow:'hidden', boxShadow:'0 28px 64px rgba(29,39,56,0.22), 0 8px 20px rgba(0,0,0,0.12)' }}>
      {/* Cover photo */}
      <div style={{ position:'relative', height:200, overflow:'hidden' }}>
        <img src={coverArabic} alt="تمكين اللغة العربية" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 42%', display:'block' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(29,39,56,0.05) 40%,rgba(29,39,56,0.75) 100%)' }} />
      </div>
      {/* Body */}
      <div style={{ padding:'18px 16px 20px' }}>
        {/* Price row */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:10, padding:'9px 12px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <Wifi size={13} color='rgba(252,251,251,0.55)' strokeWidth={2.5} />
              <span style={{ fontFamily:F, fontWeight:700, fontSize:13, color:'rgba(252,251,251,0.72)' }}>مباشر تفاعلي (Online LIVE)</span>
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
          {[{ img: photoRana, name:'رنا محمد العزام' }].map(({ img, name }) => (
            <div key={name} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <img src={img} alt={name} style={{ width:34, height:34, borderRadius:'50%', objectFit:'cover', objectPosition:'center top', border:'2px solid rgba(255,193,7,0.42)', flexShrink:0 }} />
              <span style={{ fontFamily:F, fontWeight:700, fontSize:13.5, color:'rgba(252,251,251,0.88)' }}>{name}</span>
            </div>
          ))}
        </div>
        {/* CTA */}
        <a href={waLink('962771052222', waMsg)} target="_blank" rel="noopener noreferrer"
          style={{ display:'block', textAlign:'center', background:GOLD, color:NAVY, fontFamily:F, fontWeight:800, fontSize:14, padding:'11px 0', borderRadius:10, textDecoration:'none', boxShadow:'0 6px 18px rgba(255,193,7,0.28)' }}>
          سجل الآن <ArrowLeft size={14} style={{ display:'inline-block', verticalAlign:'middle', marginInlineStart:4 }} />
        </a>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════ */
export default function CourseArabicLanguagePage() {
  const [, navigate]    = useLocation();
  const [openCurr, setOpenCurr] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [partnerOpen, setPartner] = useState(false);

  usePageMeta({
    title: 'دورة تمكين اللغة العربية وفنون التحرير اللغوي',
    description: 'دورة 16 ساعة مباشر تفاعلي مع المدربة رنا العزام. صقّل أسلوبك وارتقِ بلغتك العربية وفنون التحرير. شهادة معتمدة من وجيز — كاسيت أكاديمي.',
  });
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const waMsg   = 'السلام عليكم، أرغب في التسجيل في دورة تمكين اللغة العربية وفنون التحرير اللغوي.';
  const INNER_S: React.CSSProperties = { maxWidth:1120, margin:'0 auto', padding:'0 clamp(16px,4vw,40px)' };

  return (
    <div dir="rtl" style={{ position:'relative', zIndex:1, minHeight:'100vh', color:OFF }}>

      {/* ══════════════════ HERO ══════════════════ */}
      <section style={{ paddingTop:'clamp(98px,9vw,130px)', paddingBottom:'clamp(36px,4vw,64px)', background:'#F5F3EF', borderBottom:'1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ ...INNER_S, display:'flex', gap:'clamp(24px,3vw,48px)', alignItems:'flex-start' }}>

          {/* Right — text */}
          <div style={{ flex:1, minWidth:0, direction:'rtl' }}>
            <button onClick={() => navigate('/')} style={{ background:'none', border:'none', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6, color:'#64748b', fontFamily:F, fontSize:14, padding:0, marginBottom:22 }}>
              <ArrowLeft size={16} /> العودة إلى الدورات
            </button>

            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:18 }}>
              {['اللغة العربية', 'تحرير لغوي', 'مباشر تفاعلي (Online LIVE)', 'جميع المستويات'].map(t => (
                <span key={t} style={{ display:'inline-flex', alignItems:'center', background:'rgba(255,193,7,0.12)', border:'1px solid rgba(255,193,7,0.35)', color:'#92670a', borderRadius:999, fontFamily:F, fontWeight:700, fontSize:12, padding:'5px 13px', whiteSpace:'nowrap' }}>{t}</span>
              ))}
            </div>

            <h1 style={{ fontFamily:F, fontWeight:900, fontSize:'clamp(26px,3.8vw,46px)', color:'#1e293b', lineHeight:1.2, margin:'0 0 16px' }}>
              تمكين اللغة العربية وفنون التحرير اللغوي
            </h1>

            <p style={{ fontFamily:F, fontWeight:500, fontSize:'clamp(14px,1.6vw,17px)', color:GOLD, lineHeight:1.8, margin:'0 0 24px', borderRight:`3px solid ${GOLD}`, paddingRight:14 }}>
              "لغتنا العربية درعٌ تصونك وسيفٌ تعبّر به — تعلّمها ليس خياراً بل ضرورة"
            </p>

            {/* Stats pills */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'clamp(10px,1.5vw,18px)', marginBottom:28, fontFamily:F, fontSize:13.5, color:'#475569' }}>
              {[
                { icon:<Users size={13} />,  label:'25 مقعداً' },
                { icon:<Award size={13} />,  label:'شهادة معتمدة' },
                { icon:<Wifi size={13} />,   label:'زوم — تفاعلي مباشر' },
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
                {[photoRana].map((img, i) => (
                  <img key={i} src={img} alt="" style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', objectPosition:'center top', border:'2px solid rgba(255,193,7,0.60)', marginInlineStart:i > 0 ? -14 : 0, boxShadow:'0 3px 8px rgba(0,0,0,0.18)' }} />
                ))}
              </div>
              <div>
                <span style={{ fontFamily:F, fontWeight:700, fontSize:14, color:'#1e293b', display:'block' }}>بإشراف خبيرة اللغة العربية والتحرير</span>
                <span style={{ fontFamily:F, fontSize:12.5, color:'#64748b' }}>رنا محمد العزام</span>
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

            {/* CTA */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
              <a href={waLink('962771052222', waMsg)} target="_blank" rel="noopener noreferrer"
                style={{ background:GOLD, color:NAVY, fontFamily:F, fontWeight:800, fontSize:15, padding:'13px 30px', borderRadius:12, textDecoration:'none', display:'inline-block', boxShadow:'0 8px 22px rgba(255,193,7,0.32)' }}>
                سجل الآن <ArrowLeft size={14} style={{ display:'inline-block', verticalAlign:'middle', marginInlineStart:4 }} />
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
        <div aria-hidden className="ka-blob-2" style={{ position:'absolute', width:420, height:420, borderRadius:'50%', background:'radial-gradient(circle,rgba(224,30,140,0.10) 0%,transparent 70%)', bottom:'-60px', left:'10%', pointerEvents:'none' }} />
        <div aria-hidden className="ka-blob-3" style={{ position:'absolute', width:340, height:340, borderRadius:'50%', background:'radial-gradient(circle,rgba(103,232,249,0.09) 0%,transparent 70%)', top:'30%', left:'-60px', pointerEvents:'none' }} />
        <div style={{ ...INNER_S, position:'relative', zIndex:1 }}>
          <SectionTitle>المواعيد المتاحة للتسجيل</SectionTitle>
          <p style={{ fontFamily:F, fontSize:15, color:MUTED, lineHeight:1.8, margin:'0 0 32px' }}>
            اختر الدفعة التي تناسب جدولك — لقاءات تفاعلية مباشرة عبر زوم بمجموعات مدروسة لأعلى قدر من التفاعل
          </p>
          <TrackCard2 variant="online" activeBatches={ACTIVE_ONLINE} upcomingBatches={UPCOMING_ONLINE} expanded={expanded} onToggle={() => setExpanded(v => !v)} price="$150" priceStrike="$200" waPhone="962771052222" waMsg={waMsg} />
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
              يسعى هذا البرنامج إلى تمكين المتدربين من اللغة العربية الفصيحة بأسلوب عملي تطبيقي يبتعد عن الحفظ والتلقين. ترتكز أهدافنا على إتقان قواعد النحو والصرف في سياقهما الحقيقي، والتمكن من الكتابة الصحيحة والتحرير الاحترافي، بالإضافة إلى تطوير الأسلوب وفنون البلاغة لإنتاج نصوص مؤثرة ومتميزة.
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
          {/* Advisor sidebar */}
          <div style={{ width:'clamp(260px,26vw,310px)', flexShrink:0, position:'sticky', top:24 }}>
            <div style={{ background:'#181325', borderRadius:20, padding:'24px 20px', boxShadow:'0 20px 50px rgba(0,0,0,0.20)' }}>
              <h3 style={{ fontFamily:F, fontWeight:900, fontSize:18, color:OFF, margin:'0 0 8px' }}>هل تحتاج مساعدة في التسجيل؟</h3>
              <p style={{ fontFamily:F, fontSize:12.5, color:MUTED, lineHeight:1.7, margin:'0 0 20px' }}>تحدّث مع مستشارتك الأكاديمية 💬</p>
              <div style={{ height:1, background:'rgba(255,255,255,0.08)', marginBottom:20 }} />
              <AdvisorMini name="ياقوت الخشاشنة" role="مستشارة التسجيل — مباشر تفاعلي (Online LIVE)" photo={yaqoutImg} href={waLink('962771052222', waMsg)} />
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
              <a href={brochurePdf} download="كتيب-تمكين-اللغة-العربية.pdf"
                style={{ display:'inline-flex', alignItems:'center', gap:7, background:GOLD, color:NAVY, fontFamily:F, fontWeight:700, fontSize:13.5, padding:'9px 18px', borderRadius:10, textDecoration:'none', boxShadow:'0 2px 6px rgba(255,193,7,0.22)' }}>
                ⬇ تحميل الكتيب
              </a>
              <button onClick={() => window.print()} style={{ display:'inline-flex', alignItems:'center', gap:7, background:'#fff', border:'1px solid rgba(0,0,0,0.12)', color:DM, fontFamily:F, fontWeight:700, fontSize:13.5, padding:'9px 18px', borderRadius:10, cursor:'pointer', boxShadow:'0 2px 6px rgba(0,0,0,0.06)' }}>
                <Printer size={15} color={DM} strokeWidth={2} /> طباعة المنهج
              </button>
            </div>
          </div>

          <div style={{ borderRadius:18, overflow:'hidden', border:`1px solid ${openCurr ? 'rgba(103,232,249,0.40)' : 'rgba(0,0,0,0.09)'}`, boxShadow: openCurr ? '0 6px 24px rgba(103,232,249,0.08)' : '0 2px 8px rgba(0,0,0,0.05)', transition:'border-color 0.2s,box-shadow 0.2s' }}>
            <button onClick={() => setOpenCurr(!openCurr)} style={{ width:'100%', background: openCurr ? 'rgba(103,232,249,0.04)' : '#fff', border:'none', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', cursor:'pointer', textAlign:'right', gap:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:'50%', flexShrink:0, background: openCurr ? '#67e8f9' : 'rgba(103,232,249,0.10)', display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s' }}>
                  <Wifi size={17} color={openCurr ? '#0a1020' : '#67e8f9'} strokeWidth={2.2} />
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:F, fontWeight:900, fontSize:16, color:DH }}>مباشر تفاعلي (Online LIVE)</div>
                  <div style={{ fontFamily:F, fontSize:12.5, color:DF, marginTop:2 }}>من أي مكان في العالم عبر زوم</div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
                <span style={{ fontFamily:FP, fontSize:11, color:DF, background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.09)', borderRadius:6, padding:'3px 8px', whiteSpace:'nowrap' }}>8 جلسات</span>
                <span style={{ fontFamily:FP, fontSize:11, color:DF, background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.09)', borderRadius:6, padding:'3px 8px', whiteSpace:'nowrap' }}>16 ساعة</span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontFamily:FP, fontSize:11, color:'#0e7490', background:'rgba(103,232,249,0.12)', border:'1px solid rgba(103,232,249,0.28)', borderRadius:6, padding:'3px 8px', whiteSpace:'nowrap' }}>
                  <Wifi size={11} strokeWidth={2} color="#67e8f9" /> بث مباشر
                </span>
              </div>
            </button>
            {openCurr && (
              <div style={{ background:'rgba(103,232,249,0.03)', borderTop:'1px solid rgba(103,232,249,0.16)' }}>
                {SESSIONS.map((s, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'16px 22px', borderBottom: i < SESSIONS.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                    <span style={{ fontFamily:FP, fontWeight:800, fontSize:12, color:'#0a1020', background:'#67e8f9', borderRadius:'50%', flexShrink:0, width:28, height:28, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>{i+1}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:F, fontWeight:800, fontSize:14.5, color:DH, marginBottom:5 }}>{s.title}</div>
                      <div style={{ fontFamily:F, fontSize:13.5, color:DM, lineHeight:1.75 }}>{s.desc}</div>
                    </div>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:5, flexShrink:0, background:'rgba(103,232,249,0.12)', border:'1px solid rgba(103,232,249,0.28)', borderRadius:8, padding:'4px 10px', fontFamily:FP, fontWeight:700, fontSize:11, color:'#0e7490', whiteSpace:'nowrap' }}>
                      <Wifi size={11} strokeWidth={2} color="#67e8f9" /> لقاء تفاعلي مباشر
                    </span>
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
