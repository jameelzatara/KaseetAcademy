import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

/* ── Asset imports ─────────────────────────────────────────── */
import ayaImg      from '@assets/اية_القماز_1785619557679.jpeg';
import yaqoutImg   from '@assets/ياقوت__1785619557679.jpeg';
import yasar       from '@assets/course_01_instructor_1785428932171.jpeg';
import rana        from '@assets/trainer-rana-azzam_1785428982698.JPG';
import omar        from '@assets/trainer-omar_1785428945248.jpg';
import heroCover   from '@assets/course_01_cover_1785428932170.png';
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const inPersonPdf = `${BASE}/voiceover-inperson.pdf`;
const onlinePdf   = `${BASE}/voiceover-online.pdf`;

/* ── Design tokens ─────────────────────────────────────────── */
const NAVY    = '#1D2738';
const DARK    = '#161f2e';
const CARD    = '#2a3549';
const CARD2   = '#313d54';
const GOLD    = '#FFC107';
const OFF     = 'rgba(252,251,251,0.96)';
const MUTED   = 'rgba(252,251,251,0.62)';
const F       = "'Tajawal', sans-serif";
const FP      = "'Poppins', sans-serif";
const WA_BASE = 'https://wa.me/';

function waLink(phone: string, msg: string) {
  return `${WA_BASE}${phone}?text=${encodeURIComponent(msg)}`;
}

/* ── Reusable tiny components ──────────────────────────────── */
function GoldDot() {
  return (
    <span style={{
      display: 'inline-block', width: 8, height: 8,
      borderRadius: '50%', background: GOLD,
      boxShadow: '0 0 6px rgba(255,193,7,0.60)',
      flexShrink: 0, marginTop: 4,
    }} />
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'rgba(255,193,7,0.10)',
      border: '1px solid rgba(255,193,7,0.30)',
      color: GOLD, borderRadius: 999,
      fontFamily: F, fontWeight: 700, fontSize: 12,
      padding: '5px 13px', whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: 28, direction: 'rtl',
    }}>
      <div style={{
        width: 4, height: 28, background: GOLD, borderRadius: 4, flexShrink: 0,
      }} />
      <h2 style={{
        fontFamily: F, fontWeight: 900,
        fontSize: 'clamp(20px,2.4vw,26px)',
        color: OFF, margin: 0, lineHeight: 1.2,
      }}>
        {children}
      </h2>
    </div>
  );
}

/* ── Curriculum data ───────────────────────────────────────── */
const LECTURES_INPERSON = [
  {
    title: 'الصوت',
    desc:  'رحلة لاكتشاف مفهوم الصوت ومناطق خروجه ومعادنه، وصولاً إلى تحديد البصمة الصوتية الخاصة بك وإتقان فن تنويع الصوت.',
  },
  {
    title: 'التنفس',
    desc:  'مفتاح الصوت القوي؛ تتعلم فيه تشريح الجهاز التنفسي، تقنيات التنفس الحجابي والتحكم المركزي، وكيفية قراءة النَفَس داخل النص.',
  },
  {
    title: 'جهاز النطق',
    desc:  'تتبع رحلة الهواء من الرئة إلى نطق الحرف، مع التعرف على مخارج الحروف العربية الـ 28، وطرق التخلص من "الفم الكسول".',
  },
  {
    title: 'مهارة الاستماع والنقد السمعيّ',
    desc:  'تدريب أذنك لتصبح ناقدك الأول. يشمل حلقة التغذية الصوتية، منهجية نقد التسجيلات، والاستفادة من تجارب المحترفين.',
  },
  {
    title: 'اللغة العربيّة للمعلّق',
    desc:  'قواعد مصممة خصيصاً لاحتياجات المعلق؛ تغطي الهمزات، اللام الشمسية والقمرية، فن الوقف والابتداء، ومنهجية التحرير اللغوي.',
  },
  {
    title: 'المشاعر',
    desc:  'اكتشف شجرة المشاعر وكيفية استحضار العاطفة بصدق دون تمثيل، مع تعلم ترميز المشاعر داخل النص والتحكم بكثافتها.',
  },
  {
    title: 'التطبيق المهنيّ ومشروع التخرّج',
    desc:  'خطوتك نحو السوق؛ بناء هويتك وتسعير صوتك، التعامل مع العملاء والمنصات، وإنجاز مشروع التخرج.',
  },
  {
    title: 'ألوان التعليق الصوتي',
    desc:  'التدريب العملي والتطبيقي على الإعلانات التجارية، الرد الآلي (IVR)، الكتب الصوتية، الوثائقيات، الأخبار، والدوبلاج.',
  },
];

/* ── Main page component ───────────────────────────────────── */
export default function CourseVoiceoverPage() {
  const [, navigate]   = useLocation();
  const [track, setTrack] = useState<'inperson' | 'online'>('inperson');
  const [currTab, setCurrTab] = useState<'inperson' | 'online'>('inperson');
  const [openLec, setOpenLec] = useState<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const INNER: React.CSSProperties = {
    maxWidth: 1120,
    margin: '0 auto',
    padding: '0 clamp(16px,4vw,40px)',
  };

  return (
    <div dir="rtl" style={{
      position: 'relative', zIndex: 1,
      minHeight: '100vh', color: OFF,
    }}>

      {/* ══════════════════════════════════════════════════════
          HERO SECTION — two-column layout
      ══════════════════════════════════════════════════════ */}
      <section style={{
        paddingTop: 'clamp(24px,4vw,56px)',
        paddingBottom: 'clamp(36px,4vw,64px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ ...INNER, display: 'flex', gap: 'clamp(24px,3vw,48px)', alignItems: 'flex-start' }}>

          {/* ── Right column — main content ── */}
          <div style={{ flex: 1, minWidth: 0, direction: 'rtl' }}>

            {/* breadcrumb */}
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: MUTED, fontFamily: F, fontSize: 14, padding: 0,
                marginBottom: 22,
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>←</span>
              الرجوع إلى قائمة الدورات
            </button>

            {/* tags row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              <Tag>صنّاع المحتوى</Tag>
              <Tag>المذيعون والمقدّمون</Tag>
              <Tag>المعلّقون الصّوتيون</Tag>
              <Tag>المستوى المبتدئ</Tag>
            </div>

            {/* title */}
            <h1 style={{
              fontFamily: F, fontWeight: 900,
              fontSize: 'clamp(26px,3.8vw,46px)',
              color: OFF, lineHeight: 1.2, margin: '0 0 16px',
            }}>
              البرنامج الشامل للتعليق والأداء الصوتي
            </h1>

            {/* quote */}
            <p style={{
              fontFamily: F, fontWeight: 500,
              fontSize: 'clamp(14px,1.6vw,17px)',
              color: GOLD, lineHeight: 1.8,
              margin: '0 0 24px',
              borderRight: `3px solid ${GOLD}`,
              paddingRight: 14,
            }}>
              "رؤيتنا تنبع من أن لكل نبرة قصة فريدة تستحق سردها"
            </p>

            {/* stats row */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 'clamp(12px,2vw,22px)',
              marginBottom: 28, fontFamily: F, fontSize: 14, color: MUTED,
            }}>
              {[
                ['🪑', '10 مقاعد محدودة'],
                ['📜', 'شهادة معتمدة'],
                ['🗓️', '8 لقاءات'],
                ['⏳', '16 ساعة تدريبية'],
                ['🌍', 'عربي'],
              ].map(([icon, label]) => (
                <span key={label} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 999, padding: '6px 14px',
                  fontWeight: 500,
                }}>
                  {icon} {label}
                </span>
              ))}
            </div>

            {/* instructors row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28,
            }}>
              <div style={{ display: 'inline-flex' }}>
                {[yasar, rana, omar].map((img, i) => (
                  <img key={i} src={img} alt="" style={{
                    width: 44, height: 44, borderRadius: '50%',
                    objectFit: 'cover', objectPosition: 'center top',
                    border: '2px solid rgba(255,193,7,0.50)',
                    marginInlineStart: i > 0 ? -14 : 0,
                    boxShadow: '0 3px 8px rgba(0,0,0,0.45)',
                  }} />
                ))}
              </div>
              <div>
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: OFF, display: 'block' }}>
                  بإشراف نخبة من أفضل المدربين
                </span>
                <span style={{ fontFamily: F, fontSize: 12.5, color: MUTED }}>
                  يسار عبده · رنا عزام · عمر درابكة
                </span>
              </div>
            </div>

            {/* trust badges */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 30,
              fontFamily: F, fontSize: 13, color: MUTED,
            }}>
              {[
                '🎓 شهادة معتمدة دولياً',
                '👨‍🏫 خبراء معتمدون',
                '🔄 إعادة التدريب مدى الحياة',
              ].map(b => (
                <span key={b} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  {b}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a
                href={waLink('962771052222', 'السلام عليكم، أرغب في التسجيل في البرنامج الشامل للتعليق والأداء الصوتي')}
                target="_blank" rel="noopener noreferrer"
                style={{
                  background: GOLD, color: NAVY,
                  fontFamily: F, fontWeight: 800, fontSize: 15,
                  padding: '13px 30px', borderRadius: 12,
                  textDecoration: 'none', display: 'inline-block',
                  boxShadow: '0 8px 22px rgba(255,193,7,0.30)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
              >
                سجل الآن ←
              </a>

              <a
                href={inPersonPdf} download
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: OFF,
                  fontFamily: F, fontWeight: 700, fontSize: 14,
                  padding: '13px 22px', borderRadius: 12,
                  textDecoration: 'none', display: 'inline-flex',
                  alignItems: 'center', gap: 7,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              >
                ⬇ تحميل الكتيب الوجاهي
              </a>

              <a
                href={onlinePdf} download
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: OFF,
                  fontFamily: F, fontWeight: 700, fontSize: 14,
                  padding: '13px 22px', borderRadius: 12,
                  textDecoration: 'none', display: 'inline-flex',
                  alignItems: 'center', gap: 7,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              >
                ⬇ تحميل كتيب الأونلاين
              </a>
            </div>
          </div>

          {/* ── Left column — sticky registration card ── */}
          <div ref={sidebarRef} style={{
            width: 'clamp(280px,28vw,320px)',
            flexShrink: 0,
            position: 'sticky', top: 20,
          }}>
            <RegistrationCard track={track} onRegister={() => {
              window.open(
                waLink('962771052222', `السلام عليكم، أرغب في التسجيل في البرنامج الشامل للتعليق والأداء الصوتي — المسار: ${track === 'inperson' ? 'حضوري' : 'أونلاين'}`),
                '_blank',
              );
            }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          REGISTRATION OPTIONS
      ══════════════════════════════════════════════════════ */}
      <section style={{
        paddingBlock: 'clamp(48px,5vw,80px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={INNER}>
          <SectionTitle>خيارات التسجيل والمواعيد المتاحة</SectionTitle>
          <p style={{
            fontFamily: F, fontSize: 15, color: MUTED, marginBottom: 28,
            lineHeight: 1.8, margin: '0 0 28px',
          }}>
            اختر طريقة التدريب التي تتوافق تماماً مع وقتك وأسلوب حياتك:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {/* In-person card */}
            <TrackCard
              selected={track === 'inperson'}
              onClick={() => { setTrack('inperson'); setCurrTab('inperson'); }}
              icon="🏢"
              badge="الأكثر طلباً"
              title="حضوري (في القاعة)"
              subtitle="بيئة تعلم منظمة وتفاعل مباشر مع المدرب والزملاء."
              details={[
                { label: 'تاريخ البدء', value: '6 أغسطس 2026' },
                { label: 'الأيام والوقت', value: 'الإثنين والأربعاء — 6:00-8:00 مساءً' },
                { label: 'موعد إضافي', value: '12 أغسطس — الفترة الصباحية (12:00-2:00)' },
                { label: 'الساعات', value: '16 ساعة (8 محاضرات)' },
                { label: 'المقاعد', value: '10 مقاعد فقط لكل مجموعة' },
                { label: 'الدورات شهرياً', value: '5 دورات (دورتان صباحية + 3 مسائية)' },
              ]}
              price="218 دينار"
              priceStrike="260"
              priceLabel="بعد الخصم"
              cta="اختر المسار الوجاهي"
              installment
            />

            {/* Online card */}
            <TrackCard
              selected={track === 'online'}
              onClick={() => { setTrack('online'); setCurrTab('online'); }}
              icon="🌐"
              badge="الأعمق تأثيراً"
              title="عن بُعد (أونلاين Zoom)"
              subtitle="مرونة كاملة في الوقت والمكان مع الحفاظ على جودة التدريب التفاعلي."
              details={[
                { label: 'الدفعة الأولى', value: '5 أغسطس 2026 (الإثنين والأربعاء، 6:00-8:00م)' },
                { label: 'الدفعة الثانية', value: '10 أغسطس 2026' },
                { label: 'الدفعة الثالثة', value: '18 أغسطس 2026' },
                { label: 'الدورات شهرياً', value: '8 دورات أونلاين شهرياً' },
              ]}
              price="$150"
              priceLabel="رسوم التسجيل"
              cta="اختر المسار الأونلاين"
              installment
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ABOUT + GOALS
      ══════════════════════════════════════════════════════ */}
      <section style={{
        paddingBlock: 'clamp(48px,5vw,80px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={INNER}>
          <SectionTitle>نبذة عن البرنامج وأهدافه</SectionTitle>

          <p style={{
            fontFamily: F, fontSize: 'clamp(14px,1.5vw,16.5px)', color: 'rgba(252,251,251,0.80)',
            lineHeight: 2, marginBottom: 40, maxWidth: 760,
          }}>
            يسعى هذا البرنامج إلى إعداد وتأهيل المتدربين لاحتراف مجال التعليق الصوتي وتجهيزهم بالمهارات اللازمة
            للاندماج في سوق العمل. ترتكز أهدافنا على تطوير مخارج الحروف والنطق السليم، والتمكن من التحكم في
            الطبقات الصوتية وضبط الإيقاع، بالإضافة إلى كسر رهبة الميكروفون تماماً لتعزيز الثقة بالنفس وتنمية
            مهارات الإلقاء والتواصل المهني.
          </p>

          <SectionTitle>الأهداف المتحققة</SectionTitle>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {[
              { icon: '🌟', text: 'إتقان كافة ألوان التعليق الصوتي: الإعلانات التجارية، الرد الآلي (IVR)، الكتب الصوتية، الوثائقيات، الأخبار، والدوبلاج.' },
              { icon: '🔤', text: 'تحسين مخارج الحروف والنطق السليم: التخلص من عيوب النطق، ضبط الأداء اللغوي، وإتقان مخارج الحروف بشكل محترف.' },
              { icon: '🎚️', text: 'التحكم بالطبقات الصوتية والإيقاع والنفس: اكتساب مرونة صوتية كاملة للتحول بين النبرات والتحكم بالأنفاس أثناء التسجيل.' },
              { icon: '🎤', text: 'كسر رهبة الميكروفون والاستوديو نهائياً: التأقلم التام مع البيئة الصوتية الاحترافية والعمل بثقة كاملة أمام اللاقط.' },
              { icon: '💪', text: 'تعزيز الثقة بالنفس والحضور الصوتي: بناء شخصية صوتية قوية وجذابة تعكس الاحترافية أمام الجمهور والعملاء.' },
              { icon: '💼', text: 'تنمية مهارات التواصل والأداء المهني: فهم متطلبات سوق العمل والتفاعل مع التوجيهات الإخراجية مع مختلف أنواع النصوص.' },
            ].map((g, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14,
                background: CARD, borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.07)',
                padding: '18px 20px',
              }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{g.icon}</span>
                <p style={{
                  fontFamily: F, fontSize: 14, color: 'rgba(252,251,251,0.80)',
                  lineHeight: 1.8, margin: 0,
                }}>
                  {g.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          EXPECTED OUTCOMES
      ══════════════════════════════════════════════════════ */}
      <section style={{
        paddingBlock: 'clamp(48px,5vw,80px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={INNER}>
          <SectionTitle>المخرجات التدريبية المتوقعة</SectionTitle>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
          }}>
            {[
              {
                icon: '📜',
                title: 'شهادة معتمدة رسمياً',
                desc:  'شهادة إتمام البرنامج معتمدة رسمياً من منصة "وجيز" وأكاديمية "كاسيت ميديا".',
              },
              {
                icon: '🎙️',
                title: 'ديمو صوتي احترافي (Voice Demo CV)',
                desc:  'ملف صوتي متكامل مُهندَس بأحدث المؤثرات، يستعرض خامات صوتك في مختلف ألوان التعليق.',
              },
              {
                icon: '🎚️',
                title: 'تسجيلات استوديو عالية الجودة',
                desc:  'عينات صوتية احترافية مسجلة بأحدث اللاقطات داخل استوديوهات كاسيت الفعلية.',
              },
              {
                icon: '🏆',
                title: 'عضوية قاعدة بيانات كاسيت + مشروع التخرج',
                desc:  'إدراج اسمك وصوتك في بنك الأصوات المعتمد للحصول على فرص ترشيح لمشاريع إنتاجية حقيقية.',
              },
            ].map((o, i) => (
              <div key={i} style={{
                background: CARD2, borderRadius: 16,
                border: `1px solid rgba(255,193,7,0.15)`,
                padding: '24px 22px',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <span style={{ fontSize: 32 }}>{o.icon}</span>
                <h4 style={{
                  fontFamily: F, fontWeight: 800, fontSize: 16,
                  color: GOLD, margin: 0, lineHeight: 1.3,
                }}>
                  {o.title}
                </h4>
                <p style={{
                  fontFamily: F, fontSize: 13.5, color: MUTED, lineHeight: 1.8, margin: 0,
                }}>
                  {o.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CURRICULUM
      ══════════════════════════════════════════════════════ */}
      <section style={{
        paddingBlock: 'clamp(48px,5vw,80px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={INNER}>
          <SectionTitle>الخطة الدراسية</SectionTitle>

          {/* Track toggle */}
          <div style={{
            display: 'inline-flex', gap: 0,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 12, padding: 4, marginBottom: 28,
            border: '1px solid rgba(255,255,255,0.10)',
          }}>
            {(['inperson', 'online'] as const).map(t => (
              <button key={t} onClick={() => setCurrTab(t)}
                style={{
                  background: currTab === t ? GOLD : 'transparent',
                  color: currTab === t ? NAVY : MUTED,
                  border: 'none', borderRadius: 9,
                  fontFamily: F, fontWeight: 700, fontSize: 14,
                  padding: '9px 22px', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                {t === 'inperson' ? '🏢 حضوري (16 ساعة)' : '🌐 عن بُعد (أونلاين)'}
              </button>
            ))}
          </div>

          {currTab === 'inperson' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LECTURES_INPERSON.map((lec, i) => (
                <div key={i} style={{
                  background: CARD,
                  border: `1px solid ${openLec === i ? 'rgba(255,193,7,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 14, overflow: 'hidden',
                  transition: 'border 0.2s',
                }}>
                  <button
                    onClick={() => setOpenLec(openLec === i ? null : i)}
                    style={{
                      width: '100%', background: 'none', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 20px', cursor: 'pointer', textAlign: 'right',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                      <span style={{
                        fontFamily: FP, fontWeight: 700, fontSize: 13,
                        color: GOLD, flexShrink: 0,
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'rgba(255,193,7,0.12)',
                        border: '1px solid rgba(255,193,7,0.30)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {i + 1}
                      </span>
                      <span style={{
                        fontFamily: F, fontWeight: 700, fontSize: 15, color: OFF,
                        textAlign: 'right',
                      }}>
                        {lec.title}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span style={{
                        fontFamily: FP, fontSize: 11, color: MUTED,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        borderRadius: 6, padding: '3px 8px',
                      }}>
                        4 ساعات
                      </span>
                      <span style={{
                        fontSize: 18, color: openLec === i ? GOLD : MUTED,
                        transform: openLec === i ? 'rotate(45deg)' : 'none',
                        transition: 'transform 0.2s, color 0.2s',
                        display: 'inline-block',
                      }}>+</span>
                    </div>
                  </button>
                  {openLec === i && (
                    <div style={{
                      padding: '0 20px 18px 20px',
                      fontFamily: F, fontSize: 14, color: MUTED,
                      lineHeight: 1.85, borderTop: '1px solid rgba(255,255,255,0.06)',
                      paddingTop: 16,
                    }}>
                      {lec.desc}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: CARD, borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.08)',
              padding: 'clamp(20px,3vw,32px)',
            }}>
              <h4 style={{
                fontFamily: F, fontWeight: 800, fontSize: 17, color: GOLD,
                margin: '0 0 14px',
              }}>
                نبذة عن المنهج الأونلاين
              </h4>
              <p style={{
                fontFamily: F, fontSize: 15, color: 'rgba(252,251,251,0.80)',
                lineHeight: 2, margin: 0,
              }}>
                منهج متكامل يعتمد على فلسفة "كاسيت" التعليمية. يأخذك خطوة بخطوة بدءاً من تأسيس
                استوديو منزلي احترافي، مروراً بتمارين التنفس، النطق، التحرير اللغوي، وصولاً إلى
                الطبقات الصوتية والتلوين الانفعالي. يغطي المنهج تطبيقات الدوبلاج والإعلانات،
                ويختتم بملاحق خاصة لإنشاء الـ Voice Demo، مشروع التخرج، وخطة الانطلاق لسوق العمل
                في أول 100 يوم.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          INSTRUCTORS
      ══════════════════════════════════════════════════════ */}
      <section style={{
        paddingBlock: 'clamp(48px,5vw,80px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={INNER}>
          <SectionTitle>خبراؤنا في التدريس</SectionTitle>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {[
              {
                photo: yasar, name: 'يسار عبده',
                role: 'مدربة إعلامية وخبيرة تعليق صوتي',
                bio:  'تتمتع بخبرة تزيد عن 20 عاماً، وهي مدربة معتمدة لدى الأمم المتحدة. تحمل البكالوريوس في اللغة الإنجليزية وعلم الأصوات والماجستير في حقوق الإنسان. خبرتها تغطي الدبلجة، الأخبار، الأفلام الوثائقية والإعلانات.',
              },
              {
                photo: rana, name: 'رنا عزام',
                role: 'إعلامية مختصة بالتحرير والتدقيق اللغوي',
                bio:  'معدة ومقدمة برامج فضائية وإذاعية وبودكاست معتمدة. عملت لسنوات كمحررة ومدققة ومذيعة في مجمع اللغة العربية. حاصلة على بكالوريوس اللغة العربية وآدابها من جامعة اليرموك.',
              },
              {
                photo: omar, name: 'عمر درابكة',
                role: 'معلّق صوتي محترف ومدرب أداء وإلقاء خطابي',
                bio:  'يمتلك خبرة تتجاوز 12 عاماً، سجّل خلالها مئات الأفلام الوثائقية والإعلانات التجارية لكبرى الشركات في الخليج والشرق الأوسط. حاصل على دبلوم الإعلام من الأكاديمية العالمية للفنون.',
              },
            ].map((ins, i) => (
              <div key={i} style={{
                background: CARD, borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '26px 24px', textAlign: 'right',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <img src={ins.photo} alt={ins.name} style={{
                    width: 60, height: 60, borderRadius: '50%',
                    objectFit: 'cover', objectPosition: 'center top',
                    border: '2px solid rgba(255,193,7,0.50)',
                    flexShrink: 0,
                  }} />
                  <div>
                    <div style={{
                      fontFamily: F, fontWeight: 800, fontSize: 16, color: OFF, marginBottom: 3,
                    }}>
                      {ins.name}
                    </div>
                    <div style={{ fontFamily: F, fontSize: 12.5, color: GOLD }}>
                      {ins.role}
                    </div>
                  </div>
                </div>
                <p style={{
                  fontFamily: F, fontSize: 13.5, color: MUTED, lineHeight: 1.85, margin: 0,
                }}>
                  {ins.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HELP / ADVISOR SECTION
      ══════════════════════════════════════════════════════ */}
      <section style={{ paddingBlock: 'clamp(48px,5vw,80px)' }}>
        <div style={INNER}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{
              fontFamily: F, fontWeight: 900,
              fontSize: 'clamp(20px,2.6vw,30px)',
              color: OFF, margin: '0 0 10px',
            }}>
              هل تحتاج مساعدة في التسجيل؟
            </h2>
            <p style={{
              fontFamily: F, fontSize: 15, color: MUTED, lineHeight: 1.8, margin: 0,
            }}>
              تواصل مع مستشاراتنا الأكاديميات مباشرة — نحن هنا للرد على كافة استفساراتك ومساعدتك في إتمام حجزك.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}>
            <AdvisorCard
              name="آية القماز"
              role="مستشارة التسجيل للمسار الوجاهي"
              badge="🏢 تأهيل واستوديو حي"
              photo={ayaImg}
              waLink={waLink('962790234483', 'السلام عليكم، أرغب في الاستفسار عن المسار الوجاهي للبرنامج الشامل للتعليق الصوتي')}
              ctaLabel="تواصل مع آية 💬"
              highlighted={track === 'inperson'}
            />
            <AdvisorCard
              name="ياقوت الخشاشنة"
              role="مستشارة التسجيل للمسار الأونلاين"
              badge="💻 تدريب أونلاين مباشر"
              photo={yaqoutImg}
              waLink={waLink('962771052222', 'السلام عليكم، أرغب في الاستفسار عن المسار الأونلاين للبرنامج الشامل للتعليق الصوتي')}
              ctaLabel="تواصل مع ياقوت 💬"
              highlighted={track === 'online'}
            />
          </div>
        </div>
      </section>

    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   REGISTRATION CARD (sticky sidebar)
════════════════════════════════════════════════════════════ */
function RegistrationCard({ track, onRegister }: {
  track: 'inperson' | 'online';
  onRegister: () => void;
}) {
  return (
    <div style={{
      background: CARD2,
      border: '1px solid rgba(255,193,7,0.20)',
      borderRadius: 20,
      padding: 'clamp(20px,2.5vw,28px)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.40)',
      direction: 'rtl',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20,
      }}>
        {/* In-person price */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 14px',
          background: track === 'inperson' ? 'rgba(255,193,7,0.10)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${track === 'inperson' ? 'rgba(255,193,7,0.35)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 12, transition: 'all 0.3s',
        }}>
          <div>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: MUTED }}>حضوري</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 22, color: GOLD }}>
                218
              </span>
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: MUTED }}>
                دينار
              </span>
              <span style={{
                fontFamily: FP, fontSize: 12, color: 'rgba(252,251,251,0.35)',
                textDecoration: 'line-through',
              }}>
                260
              </span>
            </div>
          </div>
          {track === 'inperson' && (
            <span style={{
              fontFamily: F, fontWeight: 700, fontSize: 11,
              background: GOLD, color: NAVY, borderRadius: 6, padding: '4px 9px',
            }}>
              مختار
            </span>
          )}
        </div>

        {/* Online price */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 14px',
          background: track === 'online' ? 'rgba(255,193,7,0.10)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${track === 'online' ? 'rgba(255,193,7,0.35)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 12, transition: 'all 0.3s',
        }}>
          <div>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: MUTED }}>أونلاين</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 22, color: GOLD }}>
                $150
              </span>
            </div>
          </div>
          {track === 'online' && (
            <span style={{
              fontFamily: F, fontWeight: 700, fontSize: 11,
              background: GOLD, color: NAVY, borderRadius: 6, padding: '4px 9px',
            }}>
              مختار
            </span>
          )}
        </div>
      </div>

      {/* installment note */}
      <p style={{
        fontFamily: F, fontSize: 12.5, color: 'rgba(255,193,7,0.75)',
        textAlign: 'center', margin: '0 0 18px',
      }}>
        ✦ بإمكانية التقسيط
      </p>

      {/* instructor avatars */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
        paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'inline-flex' }}>
          {[yasar, rana, omar].map((img, i) => (
            <img key={i} src={img} alt="" style={{
              width: 36, height: 36, borderRadius: '50%',
              objectFit: 'cover', objectPosition: 'center top',
              border: '2px solid rgba(255,193,7,0.45)',
              marginInlineStart: i > 0 ? -10 : 0,
            }} />
          ))}
        </div>
        <span style={{ fontFamily: F, fontSize: 12.5, color: MUTED }}>
          3 مدربين متخصصين
        </span>
      </div>

      {/* Register CTA */}
      <button
        onClick={onRegister}
        style={{
          width: '100%', background: GOLD, color: NAVY,
          border: 'none', borderRadius: 12,
          fontFamily: F, fontWeight: 800, fontSize: 15,
          padding: '14px 0', cursor: 'pointer',
          boxShadow: '0 8px 22px rgba(255,193,7,0.30)',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
      >
        عرض المواعيد والتسجيل ←
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TRACK CARD
════════════════════════════════════════════════════════════ */
function TrackCard({
  selected, onClick, icon, badge, title, subtitle, details,
  price, priceStrike, priceLabel, cta, installment,
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  badge: string;
  title: string;
  subtitle: string;
  details: { label: string; value: string }[];
  price: string;
  priceStrike?: string;
  priceLabel: string;
  cta: string;
  installment?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? 'rgba(255,193,7,0.07)' : CARD,
        border: `2px solid ${selected ? GOLD : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 18, padding: 'clamp(20px,2.5vw,28px)',
        cursor: 'pointer', transition: 'all 0.25s',
        direction: 'rtl',
      }}
    >
      {/* header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 16, gap: 10,
      }}>
        <div>
          <span style={{ fontSize: 28 }}>{icon}</span>
          <h3 style={{
            fontFamily: F, fontWeight: 900, fontSize: 20,
            color: selected ? GOLD : OFF, margin: '8px 0 6px',
          }}>
            {title}
          </h3>
          <p style={{ fontFamily: F, fontSize: 13.5, color: MUTED, margin: 0, lineHeight: 1.7 }}>
            {subtitle}
          </p>
        </div>
        <span style={{
          fontFamily: F, fontWeight: 700, fontSize: 11,
          background: selected ? GOLD : 'rgba(255,255,255,0.08)',
          color: selected ? NAVY : MUTED,
          borderRadius: 6, padding: '5px 10px', flexShrink: 0, whiteSpace: 'nowrap',
          transition: 'all 0.2s',
        }}>
          {badge}
        </span>
      </div>

      {/* details list */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 8,
        marginBottom: 20, paddingBottom: 20,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        {details.map(d => (
          <div key={d.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <GoldDot />
            <span style={{ fontFamily: F, fontSize: 13.5, color: MUTED, lineHeight: 1.7 }}>
              <strong style={{ color: 'rgba(252,251,251,0.85)', fontWeight: 700 }}>{d.label}:</strong>
              {' '}{d.value}
            </span>
          </div>
        ))}
      </div>

      {/* price + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: F, fontSize: 12, color: MUTED, marginBottom: 2 }}>{priceLabel}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 24, color: GOLD }}>
              {price}
            </span>
            {priceStrike && (
              <span style={{
                fontFamily: FP, fontSize: 13, color: 'rgba(252,251,251,0.30)',
                textDecoration: 'line-through',
              }}>
                {priceStrike}
              </span>
            )}
          </div>
          {installment && (
            <div style={{ fontFamily: F, fontSize: 11.5, color: 'rgba(255,193,7,0.65)', marginTop: 3 }}>
              بإمكانية التقسيط
            </div>
          )}
        </div>

        <div style={{
          background: selected ? GOLD : 'rgba(255,255,255,0.08)',
          color: selected ? NAVY : OFF,
          border: selected ? 'none' : '1px solid rgba(255,255,255,0.15)',
          borderRadius: 10, padding: '10px 20px',
          fontFamily: F, fontWeight: 700, fontSize: 13.5,
          transition: 'all 0.2s', whiteSpace: 'nowrap',
        }}>
          {selected ? '✓ تم الاختيار' : cta}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ADVISOR CARD
════════════════════════════════════════════════════════════ */
function AdvisorCard({ name, role, badge, photo, waLink: link, ctaLabel, highlighted }: {
  name: string;
  role: string;
  badge: string;
  photo: string;
  waLink: string;
  ctaLabel: string;
  highlighted: boolean;
}) {
  return (
    <div style={{
      background: highlighted ? 'rgba(255,193,7,0.07)' : CARD,
      border: `2px solid ${highlighted ? GOLD : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 18, padding: 'clamp(20px,2.5vw,28px)',
      display: 'flex', flexDirection: 'column', gap: 16,
      direction: 'rtl', transition: 'all 0.3s',
      boxShadow: highlighted ? '0 8px 30px rgba(255,193,7,0.15)' : 'none',
    }}>
      {/* badge */}
      <span style={{
        alignSelf: 'flex-start',
        fontFamily: F, fontWeight: 700, fontSize: 12,
        background: highlighted ? GOLD : 'rgba(255,255,255,0.08)',
        color: highlighted ? NAVY : MUTED,
        borderRadius: 6, padding: '5px 12px',
        transition: 'all 0.3s',
      }}>
        {badge}
      </span>

      {/* photo + info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img src={photo} alt={name} style={{
            width: 72, height: 72, borderRadius: '50%',
            objectFit: 'cover', objectPosition: 'center top',
            border: `2px solid ${highlighted ? GOLD : 'rgba(255,255,255,0.20)'}`,
            transition: 'border 0.3s',
          }} />
          <span style={{
            position: 'absolute', bottom: 2, right: 2,
            width: 12, height: 12, borderRadius: '50%',
            background: '#22c55e',
            border: '2px solid #1D2738',
          }} />
        </div>
        <div>
          <div style={{
            fontFamily: F, fontWeight: 800, fontSize: 17,
            color: highlighted ? GOLD : OFF, marginBottom: 4,
            transition: 'color 0.3s',
          }}>
            {name}
          </div>
          <div style={{ fontFamily: F, fontSize: 13, color: MUTED }}>
            {role}
          </div>
        </div>
      </div>

      {/* availability */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: F, fontSize: 13, color: '#86efac',
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#22c55e', display: 'inline-block',
        }} />
        متواجدة للرد الآن
      </div>

      {/* CTA */}
      <a
        href={link}
        target="_blank" rel="noopener noreferrer"
        style={{
          display: 'block', textAlign: 'center',
          background: highlighted ? GOLD : 'rgba(255,255,255,0.08)',
          color: highlighted ? NAVY : OFF,
          border: highlighted ? 'none' : '1px solid rgba(255,255,255,0.15)',
          borderRadius: 10, padding: '12px 0',
          fontFamily: F, fontWeight: 800, fontSize: 14,
          textDecoration: 'none', transition: 'all 0.3s',
        }}
        onMouseEnter={e => {
          if (!highlighted) e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
        }}
        onMouseLeave={e => {
          if (!highlighted) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
        }}
      >
        {ctaLabel}
      </a>
    </div>
  );
}
