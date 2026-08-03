/**
 * الدورة المكثفة: المذيع المحترف ومهارات الإعلام الرقمي
 * المدربة: رنا العزام | السعر: 250 د.أ (من 340) | 8 جلسات / 16 ساعة | حضوري
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft, Clock, Users, Tv, Award, GraduationCap,
  Star, Mic, Globe, BookOpen, Zap, Briefcase, MapPin,
  Sparkles, RefreshCw, Printer, Video,
} from 'lucide-react';
import InstructorsSection, { type Instructor as InstructorData } from '@/components/InstructorsSection';
import {
  NAVY, DARK, GOLD, OFF, MUTED, F, FP, LBG, DH, DM,
  INNER, waLink, SectionTitle, LightSectionTitle, AdvisorMini,
  ScheduleEntry, SessionItem, TrackCard2, PartnerBar,
} from './shared/coursePageHelpers';
import coverPresenter from '@assets/cover_كورس_اﻟﺪورة_اﻟﻤﻜﺜﻔﺔ_اﻟﻤﺬﻳﻊ_اﻟﻤﺤﺘﺮف_وﻣﻬﺎرات_اﻹﻋﻼم_اﻟﺮﻗﻤﻲ_1785692222453';
import photoRana     from '@assets/trainer-rana-azzam_1785692178863.JPG';
import ayaImg        from '@assets/اية_القماز_1785619557679.jpeg';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const brochurePdf = `${BASE}/presenter-brochure.pdf`;

/* ── tokens ─────────────────────────────────────────────────── */
const DF   = '#64748b';

/* ── schedule ────────────────────────────────────────────────── */
const ACTIVE_IP:     ScheduleEntry[] = [];
const UPCOMING_IP:   ScheduleEntry[] = [
  { id:'ip-p101', group:'دفعة #101 — أمسيات', course:'الدورة المكثفة: المذيع المحترف',
    instructor:'رنا العزام', days:'أمسيات (4 أيام/أسبوع)', time:'6:00م – 8:00م',
    month:'أغسطس', day:'01', status:'upcoming',
    batchNumber:'#101', availableSeats:10, registeredCount:3, badgeDate:'أغسطس 2026' },
  { id:'ip-p102', group:'دفعة #102 — صباحي', course:'الدورة المكثفة: المذيع المحترف',
    instructor:'رنا العزام', days:'صباحي (4 أيام/أسبوع)', time:'10:00ص – 12:00م',
    month:'أغسطس', day:'01', status:'upcoming',
    batchNumber:'#102', availableSeats:8, registeredCount:5, badgeDate:'أغسطس 2026' },
];

/* ── curriculum ──────────────────────────────────────────────── */
const SESSIONS: SessionItem[] = [
  { title:'التحرير الصحفي الإعلامي',              desc:'أسس التحرير الصحفي وأساليب الكتابة الإخبارية — من الهرم المقلوب إلى كتابة الخبر والتقرير بمعايير غرف الأخبار العالمية.' },
  { title:'فن العناوين والمقدمات الإذاعية',         desc:'صياغة عناوين جاذبة ومقدمات موجزة ومؤثرة للأخبار والبرامج — التقنيات والأخطاء الشائعة والتطبيق الفوري.' },
  { title:'التحقق من المعلومات وأخلاقيات الإعلام',  desc:'معايير التثبّت من المعلومات وتحرّي الدقة في عصر السوشيال ميديا — الأدوات والمنهجية والمسؤولية المهنية.' },
  { title:'مهارات الإلقاء والتقديم المرئي',         desc:'تقنيات الإلقاء أمام الكاميرا: الصوت والنبرة والإيقاع والتعامل مع الـ teleprompter وأساليب التقديم الاحترافي.' },
  { title:'لغة الجسد والتعبير غير اللفظي',          desc:'قراءة لغة الجسد وتوظيفها في الأداء الإعلامي — التعبير بالعيون والوجه واليدين والوضعية الجسدية الصحيحة.' },
  { title:'إدارة الحوار والمقابلات الصحفية',         desc:'فن إدارة الحوار المرئي والمسموع: التحضير، طرح الأسئلة، التعامل مع المتحدثين الصعبين، وإنهاء الحوار بتأثير.' },
  { title:'التغطية الميدانية والبث المباشر',          desc:'مهارات العمل في الميدان، التقرير المباشر، وإعداد التحقيقات الصحفية المرئية وفق معايير الاحترافية الإعلامية.' },
  { title:'مشروع التخرج: برنامج متكامل',             desc:'إنتاج برنامج إذاعي أو مرئي متكامل يشمل التحرير والتقديم والمونتاج الأساسي — مع تقييم لجنة من المدربين.' },
];

/* ── goals grid ─────────────────────────────────────────────── */
const GOALS_GRID = [
  { Icon: Tv,       text:'إنتاج تقرير صحفي متكامل محرَّر بمعايير غرف الأخبار العالمية.' },
  { Icon: Mic,      text:'تقديم احترافي أمام الكاميرا بصوت وأداء ومظهر مثالي.' },
  { Icon: Video,    text:'إتقان فن إدارة الحوار والمقابلات الصحفية الصعبة بثقة.' },
  { Icon: Globe,    text:'فهم أخلاقيات الإعلام الرقمي والتحقق من المعلومات.' },
  { Icon: BookOpen, text:'صياغة عناوين ومقدمات إذاعية جذابة وموجزة ومؤثرة.' },
  { Icon: Zap,      text:'أداء محترف أمام الكاميرا بلغة جسد واثقة وتعبير غير لفظي إيجابي.' },
] as { Icon: React.ElementType; text: string }[];

/* ── outcomes ───────────────────────────────────────────────── */
const OUTCOMES = [
  { Icon: Award,    title:'شهادة معتمدة رسمياً',             desc:'شهادة إتمام البرنامج معتمدة رسمياً من منصة "وجيز" وأكاديمية "كاسيت ميديا".' },
  { Icon: Tv,       title:'تقرير صحفي مرئي متكامل',           desc:'إنتاج تقرير صحفي احترافي بمعايير غرف الأخبار يمكن استخدامه في المحفظة المهنية.' },
  { Icon: Mic,      title:'تسجيل تقديمي أمام الكاميرا',       desc:'تسجيل تقديمي مقيَّم ومراجَع مباشرةً من المدربة لتقييم الأداء الإعلامي.' },
  { Icon: Star,     title:'توصية مهنية وعضوية شبكة الخريجين', desc:'توصية مهنية وفرصة الانضمام لشبكة خريجي كاسيت الإعلاميين والوصول لفرص التوظيف.' },
] as { Icon: React.ElementType; title: string; desc: string }[];

/* ── instructor ─────────────────────────────────────────────── */
const INSTRUCTORS: InstructorData[] = [
  { initials:'ر.ع', photo: photoRana,
    name:'رنا محمد العزام', role:'إعلامية ومدربة أداء ومختصة تحرير لغوي',
    badges: [
      { icon: Tv,    label:'رؤيا | صاد | حياة FM' },
      { icon: Clock, label:'خبرة 10+ سنوات' },
      { icon: Globe, label:'مجمع اللغة العربية' },
      { icon: Users, label:'مئات المتدربين' },
    ],
    bio:'الإعلامية رنا محمد العزام معدّة ومقدّمة برامج فضائية وإذاعية وبودكاست معتمدة. تنقّلت بين كبرى المؤسسات الإعلامية كقناة رؤيا الفضائية وقناة صاد وإذاعة حياة FM. عملت محررةً ومدققةً لغوية في مجمع اللغة العربية الأردني ومذيعةً في إذاعة المجمع. قدّمت برامج تدريبية متخصصة لطلبة الإعلام في جامعة البتراء ولمؤسسات حكومية كبرى.' },
];

/* ════════════════════════════════════════════════
   PRICING CARD — reference style (NAVY bg)
════════════════════════════════════════════════ */
function PricingCard() {
  const waMsg = 'السلام عليكم، أرغب في التسجيل في الدورة المكثفة: المذيع المحترف ومهارات الإعلام الرقمي.';
  return (
    <div style={{ width:'100%', background: NAVY, borderRadius:22, overflow:'hidden', boxShadow:'0 28px 64px rgba(29,39,56,0.22), 0 8px 20px rgba(0,0,0,0.12)' }}>
      {/* Cover photo */}
      <div style={{ position:'relative', height:200, overflow:'hidden' }}>
        <img src={coverPresenter} alt="الدورة المكثفة" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center', display:'block' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(29,39,56,0.05) 40%,rgba(29,39,56,0.75) 100%)' }} />
      </div>
      {/* Body */}
      <div style={{ padding:'18px 16px 20px' }}>
        {/* Price row */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,193,7,0.10)', border:'1px solid rgba(255,193,7,0.28)', borderRadius:10, padding:'9px 12px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <MapPin size={13} color={GOLD} strokeWidth={2.5} />
              <span style={{ fontFamily:F, fontWeight:700, fontSize:13, color:'rgba(252,251,251,0.85)' }}>حضوري — عمّان</span>
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:4, direction:'ltr' }}>
              <span style={{ fontFamily:FP, fontWeight:900, fontSize:18, color:GOLD }}>250</span>
              <span style={{ fontFamily:F, fontWeight:600, fontSize:12, color:'rgba(252,251,251,0.65)' }}>JOD</span>
              <span style={{ fontFamily:FP, fontSize:11.5, color:'rgba(252,251,251,0.28)', textDecoration:'line-through' }}>340</span>
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
        <a href={waLink('962790234483', waMsg)} target="_blank" rel="noopener noreferrer"
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
export default function CoursePresenterPage() {
  const [, navigate]    = useLocation();
  const [openCurr, setOpenCurr] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [partnerOpen, setPartner] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const waMsg   = 'السلام عليكم، أرغب في التسجيل في الدورة المكثفة: المذيع المحترف ومهارات الإعلام الرقمي.';
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
              {['الإعلام الرقمي', 'مذيع محترف', 'حضوري في عمّان', 'مستوى مبتدئ ومتوسط'].map(t => (
                <span key={t} style={{ display:'inline-flex', alignItems:'center', background:'rgba(255,193,7,0.12)', border:'1px solid rgba(255,193,7,0.35)', color:'#92670a', borderRadius:999, fontFamily:F, fontWeight:700, fontSize:12, padding:'5px 13px', whiteSpace:'nowrap' }}>{t}</span>
              ))}
            </div>

            <h1 style={{ fontFamily:F, fontWeight:900, fontSize:'clamp(26px,3.8vw,46px)', color:'#1e293b', lineHeight:1.2, margin:'0 0 16px' }}>
              الدورة المكثفة: المذيع المحترف ومهارات الإعلام الرقمي
            </h1>

            <p style={{ fontFamily:F, fontWeight:500, fontSize:'clamp(14px,1.6vw,17px)', color:GOLD, lineHeight:1.8, margin:'0 0 24px', borderRight:`3px solid ${GOLD}`, paddingRight:14 }}>
              "كل إعلامي محترف بدأ خطواته الأولى أمام كاميرا — هذه دورتك لتبدأ من المكان الصحيح"
            </p>

            {/* Stats pills */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'clamp(10px,1.5vw,18px)', marginBottom:28, fontFamily:F, fontSize:13.5, color:'#475569' }}>
              {[
                { icon:<Users size={13} />,  label:'10 مقاعد محدودة' },
                { icon:<Award size={13} />,  label:'شهادة معتمدة' },
                { icon:<MapPin size={13} />, label:'حضوري — عمّان' },
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
                <span style={{ fontFamily:F, fontWeight:700, fontSize:14, color:'#1e293b', display:'block' }}>بإشراف خبيرة إعلامية معتمدة</span>
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
              <a href={waLink('962790234483', waMsg)} target="_blank" rel="noopener noreferrer"
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
            اختر الدفعة التي تناسب جدولك — المقاعد محدودة لضمان أعلى جودة تدريب وتفاعل مباشر مع المدربة
          </p>
          <TrackCard2 variant="inperson" activeBatches={ACTIVE_IP} upcomingBatches={UPCOMING_IP} expanded={expanded} onToggle={() => setExpanded(v => !v)} price="250 د.أ" priceStrike="340 د.أ" waPhone="962790234483" waMsg={waMsg} />
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
              يسعى هذا البرنامج إلى إعداد وتأهيل إعلاميين متكاملين يجمعون بين مهارات التحرير الصحفي والأداء الإعلامي أمام الكاميرا. ترتكز أهدافنا على إتقان فنون الكتابة الإخبارية والتحقق من المعلومات، والتمكن من الإلقاء الاحترافي ولغة الجسد، بالإضافة إلى إدارة الحوار والمقابلات وبناء حضور إعلامي متميز.
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
              <p style={{ fontFamily:F, fontSize:12.5, color:MUTED, lineHeight:1.7, margin:'0 0 20px' }}>تواصل مع مستشارتنا الأكاديمية مباشرة — نحن هنا للمساعدة</p>
              <div style={{ height:1, background:'rgba(255,255,255,0.08)', marginBottom:20 }} />
              <AdvisorMini name="آية القماز" role="مستشارة التسجيل — وجاهي" photo={ayaImg} href={waLink('962790234483', waMsg)} />
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
              <a href={brochurePdf} download="كتيب-الدورة-المكثفة-المذيع-المحترف.pdf"
                style={{ display:'inline-flex', alignItems:'center', gap:7, background:GOLD, color:NAVY, fontFamily:F, fontWeight:700, fontSize:13.5, padding:'9px 18px', borderRadius:10, textDecoration:'none', boxShadow:'0 2px 6px rgba(255,193,7,0.22)' }}>
                ⬇ تحميل الكتيب
              </a>
              <button onClick={() => window.print()} style={{ display:'inline-flex', alignItems:'center', gap:7, background:'#fff', border:'1px solid rgba(0,0,0,0.12)', color:DM, fontFamily:F, fontWeight:700, fontSize:13.5, padding:'9px 18px', borderRadius:10, cursor:'pointer', boxShadow:'0 2px 6px rgba(0,0,0,0.06)' }}>
                <Printer size={15} color={DM} strokeWidth={2} /> طباعة المنهج
              </button>
            </div>
          </div>

          <div style={{ borderRadius:18, overflow:'hidden', border:`1px solid ${openCurr ? 'rgba(255,193,7,0.45)' : 'rgba(0,0,0,0.09)'}`, boxShadow: openCurr ? '0 6px 24px rgba(255,193,7,0.10)' : '0 2px 8px rgba(0,0,0,0.05)', transition:'border-color 0.2s,box-shadow 0.2s' }}>
            <button onClick={() => setOpenCurr(!openCurr)} style={{ width:'100%', background: openCurr ? 'rgba(255,193,7,0.05)' : '#fff', border:'none', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', cursor:'pointer', textAlign:'right', gap:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:'50%', flexShrink:0, background: openCurr ? GOLD : 'rgba(255,193,7,0.12)', display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s' }}>
                  <MapPin size={17} color={openCurr ? NAVY : GOLD} strokeWidth={2.2} />
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:F, fontWeight:900, fontSize:16, color:DH }}>حضوري — عمّان</div>
                  <div style={{ fontFamily:F, fontSize:12.5, color:DF, marginTop:2 }}>داخل قاعة كاسيت</div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
                <span style={{ fontFamily:FP, fontSize:11, color:DF, background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.09)', borderRadius:6, padding:'3px 8px', whiteSpace:'nowrap' }}>8 جلسات</span>
                <span style={{ fontFamily:FP, fontSize:11, color:DF, background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.09)', borderRadius:6, padding:'3px 8px', whiteSpace:'nowrap' }}>16 ساعة</span>
              </div>
            </button>
            {openCurr && (
              <div style={{ background:'rgba(255,193,7,0.03)', borderTop:'1px solid rgba(255,193,7,0.16)' }}>
                {SESSIONS.map((s, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'16px 22px', borderBottom: i < SESSIONS.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                    <span style={{ fontFamily:FP, fontWeight:800, fontSize:12, color:NAVY, background:GOLD, borderRadius:'50%', flexShrink:0, width:28, height:28, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>{i+1}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:F, fontWeight:800, fontSize:14.5, color:DH, marginBottom:5 }}>{s.title}</div>
                      <div style={{ fontFamily:F, fontSize:13.5, color:DM, lineHeight:1.75 }}>{s.desc}</div>
                    </div>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:5, flexShrink:0, background:'rgba(255,193,7,0.10)', border:'1px solid rgba(255,193,7,0.28)', borderRadius:8, padding:'4px 10px', fontFamily:FP, fontWeight:700, fontSize:11, color:'#92670a', whiteSpace:'nowrap' }}>
                      <MapPin size={11} strokeWidth={2} color={GOLD} /> داخل القاعة
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
