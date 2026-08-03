/**
 * دورة التعليق والأداء الصوتي — عن بُعد (تفاعلية مباشرة)
 * المدرب: عمر درابكة | السعر: $150 | 7 وحدات / 12 ساعة
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft, Clock, Users, Mic, Award, GraduationCap,
  Star, Volume2, Sliders, Zap, Briefcase, Wifi,
  Sparkles, RefreshCw, Globe, Printer, MessageCircle,
} from 'lucide-react';
import InstructorsSection, { type Instructor as InstructorData } from '@/components/InstructorsSection';
import {
  NAVY, DARK, GOLD, OFF, MUTED, F, FP, LBG, DH, DM,
  INNER, waLink, SectionTitle, LightSectionTitle, AdvisorMini,
  ScheduleEntry, SessionItem, TrackCard2, PartnerBar,
} from './shared/coursePageHelpers';
import coverOmar   from '@assets/course-omar-bg_1785692015818.png';
import photoOmar   from '@assets/trainer-omar_1785692015818.jpg';
import photoRana   from '@assets/trainer-rana-azzam_1785692178863.JPG';
import ayaImg      from '@assets/اية_القماز_1785619557679.jpeg';
import yaqoutImg   from '@assets/ياقوت__1785619557679.jpeg';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const brochurePdf = `${BASE}/voiceover-live-brochure.pdf`;

/* ── tokens ─────────────────────────────────────────────────── */
const DF   = '#64748b';

/* ── schedule ────────────────────────────────────────────────── */
const ACTIVE_ONLINE: ScheduleEntry[]   = [];
const UPCOMING_ONLINE: ScheduleEntry[] = [
  { id:'rm-vl201', group:'دفعة #201 — عن بُعد', course:'أساسيات التعليق والأداء الصوتي (عن بُعد)',
    instructor:'عمر درابكة + رنا العزام', days:'الجمعة', time:'7:00م – 9:00م',
    month:'أغسطس', day:'01', status:'upcoming',
    batchNumber:'#201', availableSeats:8, registeredCount:4, badgeDate:'أغسطس 2026' },
  { id:'rm-vl202', group:'دفعة #202 — عن بُعد', course:'أساسيات التعليق والأداء الصوتي (عن بُعد)',
    instructor:'عمر درابكة + رنا العزام', days:'ثلاثاء / خميس', time:'7:00م – 9:00م',
    month:'أغسطس', day:'01', status:'upcoming',
    batchNumber:'#202', availableSeats:12, registeredCount:3, badgeDate:'أغسطس 2026' },
];

/* ── curriculum ──────────────────────────────────────────────── */
const MODULES: SessionItem[] = [
  { title:'الاستوديو المنزلي والمعدات',      desc:'كيفية تجهيز بيئة تسجيل احترافية في المنزل دون ميزانية ضخمة — اختيار الميكروفون، العزل الصوتي بالمواد المتاحة، وبرامج التسجيل للمبتدئين. (لقاء تفاعلي مباشر)' },
  { title:'أساسيات الصوت والتنفس',           desc:'تأسيس مهاري شامل يبني جسراً بين الصوت الطبيعي والصوت الاحترافي — مناطق الرنين، التنفس الحجابي، وإدارة النَفَس أثناء التسجيل. (لقاء تفاعلي مباشر)' },
  { title:'النطق ومخارج الحروف',             desc:'تشريح عملي وتدريب مكثّف على النطق السليم لكل حرف عربي — مخارج الحروف الـ 28، التخلص من النطق الرخو، وتمارين اللسان والشفتين يومياً. (لقاء تفاعلي مباشر)' },
  { title:'اللغة العربية والتحرير اللغوي',   desc:'قواعد لغوية تطبيقية مصممة خصيصاً لاحتياجات المعلق الصوتي — الهمزات والمدود، فن الوقف والابتداء، ومنهجية التحرير قبل التسجيل. (لقاء تفاعلي مباشر)' },
  { title:'التلوين الانفعالي والمشاعر',      desc:'أداء صادق يستحضر العاطفة دون تمثيل مصطنع — شجرة المشاعر وتصنيفاتها الصوتية، ترميز النص عاطفياً، والتحكم بكثافة الأداء. (لقاء تفاعلي مباشر)' },
  { title:'تطبيقات التعليق الصوتي',         desc:'ورشة تطبيقية على مختلف أنواع التعليق المطلوبة في السوق — إعلانات، رد آلي IVR، كتب صوتية، وثائقيات، دوبلاج، وبرامج أطفال. (لقاء تفاعلي مباشر)' },
  { title:'مشروع التخرج والانطلاق في السوق', desc:'خطوتك الفعلية نحو سوق العمل الصوتي — إنتاج Voice Demo CV احترافي، بناء الهوية الصوتية الشخصية، وخطة الـ 100 يوم الأولى. (لقاء تفاعلي مباشر)' },
];

/* ── goals grid ─────────────────────────────────────────────── */
const GOALS_GRID = [
  { Icon: Volume2,   text:'ضبط مخارج الحروف والنطق السليم والتخلص من عيوب الصوت.' },
  { Icon: Mic,       text:'التحكم الكامل بالطبقات الصوتية والإيقاع وإدارة النَفَس أثناء التسجيل.' },
  { Icon: Sliders,   text:'التلوين الانفعالي وأداء صادق يستحضر العاطفة دون تصنّع.' },
  { Icon: Star,      text:'قراءة احترافية لأنواع النصوص: وثائقي، إعلاني، كتب صوتية.' },
  { Icon: Zap,       text:'إعداد بيئة تسجيل منزلية وإنتاج تسجيلات بجودة استوديو.' },
  { Icon: Briefcase, text:'إنتاج Voice Demo متكامل جاهز لسوق العمل وتأسيس الهوية الصوتية.' },
] as { Icon: React.ElementType; text: string }[];

/* ── outcomes ───────────────────────────────────────────────── */
const OUTCOMES = [
  { Icon: Award,    title:'شهادة معتمدة رسمياً',               desc:'شهادة إتمام البرنامج معتمدة رسمياً من منصة "وجيز" وأكاديمية "كاسيت ميديا".' },
  { Icon: Mic,      title:'ملف صوتي احترافي (Voice Demo CV)',  desc:'ملف صوتي متكامل يستعرض خامات صوتك في مختلف ألوان التعليق الصوتي.' },
  { Icon: Volume2,  title:'هوية صوتية متميزة',                 desc:'تحديد بصمتك الصوتية الشخصية وأسلوبك في الأداء الاحترافي وبناء الثقة.' },
  { Icon: Star,     title:'عضوية قاعدة بيانات كاسيت',          desc:'إدراج اسمك وصوتك في بنك الأصوات المعتمد للحصول على فرص ترشيح لمشاريع إنتاجية.' },
] as { Icon: React.ElementType; title: string; desc: string }[];

/* ── instructor ─────────────────────────────────────────────── */
const INSTRUCTORS: InstructorData[] = [
  { initials:'ع.د', photo: photoOmar,
    name:'عمر الدرابكة', role:'معلّق صوتي محترف ومدرب أداء وإلقاء',
    badges: [
      { icon: Users,        label:'2,000+ طالب مدرّب' },
      { icon: Clock,        label:'خبرة 12+ سنة' },
      { icon: Mic,          label:'مئات التسجيلات الاحترافية' },
      { icon: GraduationCap, label:'دبلوم إعلام — فلوريدا' },
    ],
    bio:'معلّق صوتي محترف ومدرب أداء وإلقاء. سجّل بصوته مئات الأفلام الوثائقية والإعلانات لكبرى الشركات والمؤسسات الإعلامية في الخليج والشرق الأوسط. حاصل على دبلوم الإعلام من الأكاديمية العالمية للفنون والإبداع بفلوريدا، ويمتلك خبرة واسعة في التدريب الصوتي تتجاوز 12 عامًا.' },
  { initials:'ر.ع', photo: photoRana,
    name:'رنا محمد العزام', role:'إعلامية ومختصة تحرير لغوي ومدققة لغة',
    badges: [
      { icon: Globe, label:'مجمع اللغة العربية — محررة ومدققة' },
      { icon: Mic,   label:'رؤيا | صاد | حياة FM' },
      { icon: Clock, label:'خبرة 10+ سنوات' },
      { icon: Users, label:'مئات المتدربين' },
    ],
    bio:'الإعلامية رنا محمد العزام معدّة ومقدّمة برامج فضائية وإذاعية وبودكاست معتمدة. عملت سنواتٍ محررةً ومدققةً لغوية في مجمع اللغة العربية الأردني — المرجع اللغوي الأول في المنطقة. تمتلك خبرة عريقة في تمكين المتدربين من اللغة العربية الفصيحة للاستخدام المهني والإعلامي.' },
];

/* ════════════════════════════════════════════════
   PRICING CARD — reference style (NAVY bg)
════════════════════════════════════════════════ */
function PricingCard() {
  const waMsg = 'السلام عليكم، أرغب في التسجيل في دورة التعليق والأداء الصوتي (عن بُعد — تفاعلية مباشرة).';
  return (
    <div style={{ width:'100%', background: NAVY, borderRadius:22, overflow:'hidden', boxShadow:'0 28px 64px rgba(29,39,56,0.22), 0 8px 20px rgba(0,0,0,0.12)' }}>
      {/* Cover photo */}
      <div style={{ position:'relative', height:200, overflow:'hidden' }}>
        <img src={coverOmar} alt="دورة التعليق الصوتي" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center', display:'block' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(29,39,56,0.05) 40%,rgba(29,39,56,0.75) 100%)' }} />
      </div>
      {/* Body */}
      <div style={{ padding:'18px 16px 20px' }}>
        {/* Price row */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
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
          {[{ img: photoOmar, name:'عمر درابكة' }, { img: photoRana, name:'رنا محمد العزام' }].map(({ img, name }) => (
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
export default function CourseVoiceoverLivePage() {
  const [, navigate]    = useLocation();
  const [openCurr, setOpenCurr] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [partnerOpen, setPartner] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const waMsg   = 'السلام عليكم، أرغب في التسجيل في دورة التعليق والأداء الصوتي (عن بُعد — تفاعلية مباشرة).';
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
              {['التعليق الصوتي', 'عن بُعد — تفاعلية مباشرة', 'مستوى متوسط', 'أداء إعلامي'].map(t => (
                <span key={t} style={{ display:'inline-flex', alignItems:'center', background:'rgba(255,193,7,0.12)', border:'1px solid rgba(255,193,7,0.35)', color:'#92670a', borderRadius:999, fontFamily:F, fontWeight:700, fontSize:12, padding:'5px 13px', whiteSpace:'nowrap' }}>{t}</span>
              ))}
            </div>

            <h1 style={{ fontFamily:F, fontWeight:900, fontSize:'clamp(26px,3.8vw,46px)', color:'#1e293b', lineHeight:1.2, margin:'0 0 16px' }}>
              أساسيات التعليق والأداء الصوتي
            </h1>

            <p style={{ fontFamily:F, fontWeight:500, fontSize:'clamp(14px,1.6vw,17px)', color:GOLD, lineHeight:1.8, margin:'0 0 24px', borderRight:`3px solid ${GOLD}`, paddingRight:14 }}>
              "رؤيتنا تنبع من أن لكل نبرة فريدة صوتاً يستحق أن يُسمع في كل مكان"
            </p>

            {/* Stats pills */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'clamp(10px,1.5vw,18px)', marginBottom:28, fontFamily:F, fontSize:13.5, color:'#475569' }}>
              {[
                { icon:<Users size={13} />,   label:'15 مقعداً محدوداً' },
                { icon:<Award size={13} />,   label:'شهادة معتمدة' },
                { icon:<Wifi size={13} />,    label:'زوم — تفاعلي مباشر' },
                { icon:<Clock size={13} />,   label:'12 ساعة تدريبية' },
                { icon:<Globe size={13} />,   label:'عربي' },
              ].map(({ icon, label }) => (
                <span key={label} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.10)', borderRadius:999, padding:'6px 14px', fontWeight:500 }}>
                  {icon} {label}
                </span>
              ))}
            </div>

            {/* Instructor avatars */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
              <div style={{ display:'inline-flex' }}>
                {[photoOmar, photoRana].map((img, i) => (
                  <img key={i} src={img} alt="" style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', objectPosition:'center top', border:'2px solid rgba(255,193,7,0.60)', marginInlineStart:i > 0 ? -14 : 0, boxShadow:'0 3px 8px rgba(0,0,0,0.18)' }} />
                ))}
              </div>
              <div>
                <span style={{ fontFamily:F, fontWeight:700, fontSize:14, color:'#1e293b', display:'block' }}>بإشراف خبراء أداء صوتي</span>
                <span style={{ fontFamily:F, fontSize:12.5, color:'#64748b' }}>عمر درابكة · رنا العزام</span>
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
            اختر الدفعة التي تناسب جدولك — كل لقاء تفاعلي مباشر عبر زوم بمجموعة محدودة لا تتجاوز 15 متدرباً
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
              يسعى هذا البرنامج إلى تأسيس وتطوير مهارات التعليق الصوتي والأداء الإعلامي عن بُعد عبر لقاءات تفاعلية مباشرة. ترتكز أهدافنا على ضبط مخارج الحروف والنطق السليم، والتمكن من إدارة الطبقات الصوتية وضبط الإيقاع، بالإضافة إلى كسر رهبة الميكروفون وبناء هوية صوتية احترافية جاهزة لسوق العمل.
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
              <AdvisorMini name="ياقوت الخشاشنة" role="مستشارة التسجيل — عن بُعد" photo={yaqoutImg} href={waLink('962771052222', waMsg)} />
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
          {/* Header row */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:28 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:4, height:28, background:GOLD, borderRadius:4, flexShrink:0 }} />
              <h2 style={{ fontFamily:F, fontWeight:900, fontSize:'clamp(20px,2.4vw,26px)', color:DH, margin:0, lineHeight:1.2 }}>الخطة الدراسية</h2>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <a href={brochurePdf} download="كتيب-دورة-التعليق-الصوتي.pdf"
                style={{ display:'inline-flex', alignItems:'center', gap:7, background:GOLD, color:NAVY, fontFamily:F, fontWeight:700, fontSize:13.5, padding:'9px 18px', borderRadius:10, textDecoration:'none', boxShadow:'0 2px 6px rgba(255,193,7,0.22)' }}>
                ⬇ تحميل الكتيب
              </a>
              <button
                onClick={() => {
                  const rows = MODULES.map((m,i) => `<div class="lec"><div class="num">${i+1}</div><div><div class="lt">${m.title}</div><div class="ld">${m.desc}</div></div></div>`).join('');
                  const html = `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"/><title>الخطة الدراسية — أساسيات التعليق الصوتي</title><style>@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Tajawal',Arial,sans-serif;direction:rtl;color:#1e293b;max-width:760px;margin:0 auto;padding:32px 28px}h1{font-size:22px;font-weight:900;border-bottom:3px solid #FFC107;padding-bottom:10px;margin-bottom:6px}.sub{font-size:12px;color:#64748b;margin-bottom:28px}.lec{display:flex;gap:12px;padding:11px 0;border-bottom:1px solid #f1f5f9;align-items:flex-start}.num{width:26px;height:26px;border-radius:50%;background:#67e8f9;color:#051520;font-weight:900;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.lt{font-weight:800;font-size:13.5px;margin-bottom:3px}.ld{font-size:12px;color:#475569;line-height:1.7}@media print{body{padding:16px}}</style></head><body><h1>أساسيات التعليق والأداء الصوتي — عن بُعد</h1><p class="sub">أكاديمية كاسيت ميديا — 7 وحدات · 12 ساعة · شهادة معتمدة</p>${rows}</body></html>`;
                  const win = window.open('','_blank','width=860,height=900');
                  if(win){ win.document.write(html); win.document.close(); win.focus(); setTimeout(()=>win.print(),600); }
                }}
                style={{ display:'inline-flex', alignItems:'center', gap:7, background:'#fff', border:'1px solid rgba(0,0,0,0.12)', color:DM, fontFamily:F, fontWeight:700, fontSize:13.5, padding:'9px 18px', borderRadius:10, cursor:'pointer', boxShadow:'0 2px 6px rgba(0,0,0,0.06)' }}>
                <Printer size={15} color={DM} strokeWidth={2} /> طباعة المنهج
              </button>
            </div>
          </div>

          {/* Accordion */}
          <div style={{ borderRadius:18, overflow:'hidden', border:`1px solid ${openCurr ? 'rgba(103,232,249,0.40)' : 'rgba(0,0,0,0.09)'}`, boxShadow: openCurr ? '0 6px 24px rgba(103,232,249,0.08)' : '0 2px 8px rgba(0,0,0,0.05)', transition:'border-color 0.2s,box-shadow 0.2s' }}>
            <button onClick={() => setOpenCurr(!openCurr)} style={{ width:'100%', background: openCurr ? 'rgba(103,232,249,0.04)' : '#fff', border:'none', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', cursor:'pointer', textAlign:'right', gap:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:'50%', flexShrink:0, background: openCurr ? '#67e8f9' : 'rgba(103,232,249,0.10)', display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s' }}>
                  <Wifi size={17} color={openCurr ? '#0a1020' : '#67e8f9'} strokeWidth={2.2} />
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:F, fontWeight:900, fontSize:16, color:DH }}>عن بُعد — تفاعلية مباشرة</div>
                  <div style={{ fontFamily:F, fontSize:12.5, color:DF, marginTop:2 }}>من أي مكان في العالم عبر زوم</div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
                <span style={{ fontFamily:FP, fontSize:11, color:DF, background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.09)', borderRadius:6, padding:'3px 8px', whiteSpace:'nowrap' }}>7 وحدات</span>
                <span style={{ fontFamily:FP, fontSize:11, color:DF, background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.09)', borderRadius:6, padding:'3px 8px', whiteSpace:'nowrap' }}>12 ساعة</span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontFamily:FP, fontSize:11, color:'#0e7490', background:'rgba(103,232,249,0.12)', border:'1px solid rgba(103,232,249,0.28)', borderRadius:6, padding:'3px 8px', whiteSpace:'nowrap' }}>
                  <Wifi size={11} strokeWidth={2} color="#67e8f9" /> بث مباشر
                </span>
              </div>
            </button>
            {openCurr && (
              <div style={{ background:'rgba(103,232,249,0.03)', borderTop:'1px solid rgba(103,232,249,0.16)' }}>
                {MODULES.map((m, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'16px 22px', borderBottom: i < MODULES.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                    <span style={{ fontFamily:FP, fontWeight:800, fontSize:12, color:'#0a1020', background:'#67e8f9', borderRadius:'50%', flexShrink:0, width:28, height:28, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>{i+1}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:F, fontWeight:800, fontSize:14.5, color:DH, marginBottom:5 }}>{m.title}</div>
                      <div style={{ fontFamily:F, fontSize:13.5, color:DM, lineHeight:1.75 }}>{m.desc}</div>
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
