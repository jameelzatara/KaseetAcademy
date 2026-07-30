// ── Google-style Testimonials Carousel ────────────────────
import { useState, useRef, useEffect } from 'react';

import avatarDina    from '@assets/Dina Raad-Yaghnam.png';
import avatarHiba    from '@assets/Hiba Abu Hijleh.png';
import avatarAbeer   from '@assets/Abeer Alzoubi.png';
import avatarMajd    from '@assets/al majdalawi.png';
import avatarAmjad   from '@assets/Amjad Qasem.png';
import avatarKhaled  from '@assets/Khaled Alkhd.png';
import avatarFouad   from '@assets/Fouad Hamati.png';
import avatarSahar   from '@assets/sahar AL-Assaf.png';
import avatarYazan   from '@assets/yazan masarweh.png';
import avatarAhlam   from '@assets/Ahlam Al-Issawi.png';

interface Review {
  id: number;
  name: string;
  avatar: string;
  text: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'دينا رعد يغنم',
    avatar: avatarDina,
    text: 'احترافية عالية وأجواء رائعة حقاً. أفضل طاقم عمل متميز لتطريب وتدريب الأداء الصوتي والتمثيل على الإطلاق.',
  },
  {
    id: 2,
    name: 'هبة أبو حجلة',
    avatar: avatarHiba,
    text: 'ليس مجرد مكان للتعلم، بل هو مكان لاكتشاف الذات وتطوير المهارات. شكراً جزيلاً لكل من حضر وساعد.',
  },
  {
    id: 3,
    name: 'عبير الزعبي',
    avatar: avatarAbeer,
    text: 'تجربة فريدة ومميزة جداً، التطبيق العملي والمتابعة المستمرة صنعت فارقاً كبيراً في حضوري الصوتي.',
  },
  {
    id: 4,
    name: 'الـ مجدلاوي',
    avatar: avatarMajd,
    text: 'منظومة تعليمية متكاملة، اهتمام بالتفاصيل ونبرات الصوت بشكل احترافي دقيق.',
  },
  {
    id: 5,
    name: 'أمجد قاسم',
    avatar: avatarAmjad,
    text: 'من أفضل الدورات التي شاركت بها. التوجيهات كانت دقيقة ومباشرة وساعدتني على تجاوز التوتر تماماً.',
  },
  {
    id: 6,
    name: 'خالد الخض',
    avatar: avatarKhaled,
    text: 'بيئة تحفيزية واحترافية بأعلى المستويات. المدربون يمتلكون خبرة عميقة وشغفاً حقيقياً.',
  },
  {
    id: 7,
    name: 'فؤاد حمتي',
    avatar: avatarFouad,
    text: 'تدريب عملي ممتازة ومعدات استوديوهات على أعلى مستوى، الاستفادة كانت مضاعفة.',
  },
  {
    id: 8,
    name: 'سحر العساف',
    avatar: avatarSahar,
    text: 'كاسيت أكاديمي أضافت لي الكثير على المستوى الشخصي والمهني في مجال الخطابة والتواصل.',
  },
  {
    id: 9,
    name: 'يزن مصاروة',
    avatar: avatarYazan,
    text: 'أسلوب التدريب عملي ومتخصص جداً، شعرت بتطور حقيقي في أدائي الصوتي منذ الجلسة الأولى.',
  },
  {
    id: 10,
    name: 'أحلام العيساوي',
    avatar: avatarAhlam,
    text: 'كاسيت ليست مجرد أكاديمية، هي منظومة دعم كاملة. المدربون ملتزمون والمحتوى على مستوى عالمي.',
  },
];

// ── Google "G" logo (official colors) ─────────────────────
function GoogleLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

// ── Five gold stars ────────────────────────────────────────
function Stars() {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center', direction: 'ltr' }}>
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: '#FFC107', fontSize: 13, lineHeight: 1 }}>★</span>
      ))}
    </div>
  );
}

// ── Single review card ────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.035)',
        border: hovered ? '1px solid rgba(255,193,7,0.30)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 'clamp(18px,2vw,24px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        textAlign: 'right',
        flexShrink: 0,
        width: 'clamp(280px,30vw,340px)',
        boxShadow: hovered
          ? '0 0 24px rgba(255,193,7,0.10), 0 12px 40px rgba(0,0,0,0.50)'
          : '0 6px 24px rgba(0,0,0,0.35)',
        transition: 'background 0.3s, border 0.3s, box-shadow 0.3s, transform 0.3s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        cursor: 'default',
        scrollSnapAlign: 'start',
      }}
    >
      {/* Top row: avatar + name + Google badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
        {/* Google "verified" mark */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '3px 9px', borderRadius: 99,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)',
        }}>
          <GoogleLogo size={14} />
          <span style={{
            fontFamily: 'Poppins, sans-serif', fontSize: 10,
            color: 'rgba(252,251,251,0.50)', fontWeight: 500, direction: 'ltr',
            letterSpacing: '0.03em',
          }}>موثّق</span>
        </div>

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: 'row-reverse' }}>
          <img
            src={review.avatar}
            alt={review.name}
            style={{
              width: 46, height: 46, borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(255,193,7,0.40)',
              boxShadow: '0 0 10px rgba(255,193,7,0.18)',
              flexShrink: 0,
            }}
            onError={e => {
              (e.currentTarget as HTMLImageElement).style.background = '#2d3748';
            }}
          />
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 700,
              fontSize: 14.5, color: 'rgba(252,251,251,0.95)',
              lineHeight: 1.3,
            }}>{review.name}</div>
            <Stars />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

      {/* Review text */}
      <p style={{
        fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
        fontSize: 'clamp(13px,1.2vw,14.5px)',
        color: 'rgba(226,232,240,0.78)',
        lineHeight: 1.85,
        margin: 0,
        flex: 1,
      }}>
        "{review.text}"
      </p>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────
export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const CARD_W = 356; // approx card + gap

  const checkScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft < -8);   // RTL: scrollLeft is negative
    setCanScrollRight(el.scrollLeft > -(el.scrollWidth - el.clientWidth - 8));
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    // In RTL layout, "next" means scrolling negative (left in ltr == right visual)
    const delta = dir === 'right' ? -CARD_W : CARD_W;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Google overall rating badge
  const OverallRating = () => (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '8px 20px', borderRadius: 99,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }}>
      <GoogleLogo size={18} />
      <span style={{
        fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 13.5,
        color: 'rgba(252,251,251,0.85)', direction: 'rtl',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ color: '#FFC107' }}>★ ★ ★ ★ ★</span>
        <span>5.0/5 بناءً على تقييمات Google الموثقة</span>
      </span>
    </div>
  );

  // Nav arrow button
  const NavBtn = ({ dir, disabled }: { dir: 'left' | 'right'; disabled: boolean }) => (
    <button
      onClick={() => scroll(dir)}
      disabled={disabled}
      aria-label={dir === 'right' ? 'التالي' : 'السابق'}
      style={{
        width: 44, height: 44, borderRadius: '50%',
        background: disabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,193,7,0.10)',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,193,7,0.35)'}`,
        color: disabled ? 'rgba(255,255,255,0.25)' : '#FFC107',
        fontSize: 18, lineHeight: 1,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s, border 0.2s, color 0.2s',
        flexShrink: 0,
      }}
      onMouseEnter={e => { if (!disabled) Object.assign(e.currentTarget.style, { background: 'rgba(255,193,7,0.20)' }); }}
      onMouseLeave={e => { if (!disabled) Object.assign(e.currentTarget.style, { background: 'rgba(255,193,7,0.10)' }); }}
    >
      {dir === 'right' ? '→' : '←'}
    </button>
  );

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#1e293b',
        backgroundImage: [
          'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '85px 85px',
        padding: 'clamp(60px,8vh,100px) 0 clamp(70px,9vh,110px)',
      }}
    >
      {/* top glow */}
      <div className="absolute pointer-events-none" style={{
        top: -60, left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: 200,
        background: 'radial-gradient(ellipse at top, rgba(255,193,7,0.08) 0%, transparent 70%)',
      }} />

      <div className="relative z-10" style={{ maxWidth: 1160, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '0 clamp(16px,3vw,32px)',
          marginBottom: 'clamp(28px,3.5vh,44px)',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <NavBtn dir="left" disabled={!canScrollLeft} />
            <NavBtn dir="right" disabled={!canScrollRight} />
          </div>

          <div style={{ textAlign: 'right' }}>
            <h2 style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 900,
              fontSize: 'clamp(24px,3.5vw,42px)',
              color: 'rgba(252,251,251,0.96)',
              lineHeight: 1.2, margin: '0 0 8px',
            }}>
              آراء طلابنا{' '}
              <span style={{ color: '#FFC107' }}>وقصص نجاحهم</span>
            </h2>
            <p style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
              fontSize: 'clamp(13px,1.3vw,15.5px)',
              color: 'rgba(226,232,240,0.65)',
              margin: '0 0 12px',
            }}>
              أصوات حقيقية عبرت من الشغف إلى الاحتراف
            </p>
            <OverallRating />
          </div>
        </div>

        {/* ── Scrollable track ── */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: 'clamp(14px,2vw,20px)',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            padding: '0 clamp(16px,3vw,32px) 12px',
            direction: 'rtl',  // so first card starts from right
          }}
        >
          {REVIEWS.map(r => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>

      </div>

      <style>{`
        /* hide scrollbar */
        section .testimonials-track::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
