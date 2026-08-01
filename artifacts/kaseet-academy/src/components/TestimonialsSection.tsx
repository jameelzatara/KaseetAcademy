// ── Testimonials — arrow carousel ────────────────────────────
import { useState, useEffect } from 'react';
import SectionHeader, { Gold } from './SectionHeader';

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

interface Review { id: number; name: string; avatar: string; text: string; }

const REVIEWS: Review[] = [
  { id: 1,  name: 'دينا رعد يغنم',  avatar: avatarDina,   text: 'احترافية عالية وأجواء رائعة حقاً. أفضل طاقم عمل متميز لتطريب وتدريب الأداء الصوتي والتمثيل على الإطلاق.' },
  { id: 2,  name: 'هبة أبو حجلة',   avatar: avatarHiba,   text: 'ليس مجرد مكان للتعلم، بل هو مكان لاكتشاف الذات وتطوير المهارات. شكراً جزيلاً لكل من حضر وساعد.' },
  { id: 3,  name: 'عبير الزعبي',    avatar: avatarAbeer,  text: 'تجربة فريدة ومميزة جداً، التطبيق العملي والمتابعة المستمرة صنعت فارقاً كبيراً في حضوري الصوتي.' },
  { id: 4,  name: 'الـ مجدلاوي',    avatar: avatarMajd,   text: 'منظومة تعليمية متكاملة، اهتمام بالتفاصيل ونبرات الصوت بشكل احترافي دقيق.' },
  { id: 5,  name: 'أمجد قاسم',      avatar: avatarAmjad,  text: 'من أفضل الدورات التي شاركت بها. التوجيهات كانت دقيقة ومباشرة وساعدتني على تجاوز التوتر تماماً.' },
  { id: 6,  name: 'خالد الخض',      avatar: avatarKhaled, text: 'بيئة تحفيزية واحترافية بأعلى المستويات. المدربون يمتلكون خبرة عميقة وشغفاً حقيقياً.' },
  { id: 7,  name: 'فؤاد حمتي',      avatar: avatarFouad,  text: 'تدريب عملي ممتاز ومعدات استوديوهات على أعلى مستوى، الاستفادة كانت مضاعفة.' },
  { id: 8,  name: 'سحر العساف',     avatar: avatarSahar,  text: 'كاسيت أكاديمي أضافت لي الكثير على المستوى الشخصي والمهني في مجال الخطابة والتواصل.' },
  { id: 9,  name: 'يزن مصاروة',     avatar: avatarYazan,  text: 'أسلوب التدريب عملي ومتخصص جداً، شعرت بتطور حقيقي في أدائي الصوتي منذ الجلسة الأولى.' },
  { id: 10, name: 'أحلام العيساوي', avatar: avatarAhlam,  text: 'كاسيت ليست مجرد أكاديمية، هي منظومة دعم كاملة. المدربون ملتزمون والمحتوى على مستوى عالمي.' },
];

/** Returns cards-per-page based on current window width. */
function getPerPage(): number {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768)  return 2;
  return 1;
}

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

function ChevronRightIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div style={{
      background:           'rgba(255,255,255,0.035)',
      backdropFilter:       'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border:               '1px solid rgba(255,255,255,0.06)',
      borderRadius:         22,
      padding:              'clamp(20px,2.5vw,28px)',
      display:              'flex',
      flexDirection:        'column',
      gap:                  16,
      textAlign:            'right',
      boxShadow:            '0 10px 30px rgba(0,0,0,0.25)',
      direction:            'rtl',
      minWidth:             0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'rgba(252,251,251,0.95)', lineHeight: 1.3 }}>
              {review.name}
            </div>
            <div style={{ display: 'flex', gap: 2, alignItems: 'baseline', direction: 'ltr', marginTop: 4 }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: '#FFC107', fontSize: 13, lineHeight: 1 }}>★</span>
              ))}
            </div>
          </div>
          <img
            src={review.avatar}
            alt={review.name}
            style={{
              width: 58, height: 58, borderRadius: '50%',
              objectFit: 'cover', objectPosition: 'center top',
              border: '2px solid rgba(255,193,7,0.45)',
              boxShadow: '0 0 14px rgba(255,193,7,0.16)',
              flexShrink: 0,
            }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.background = '#2d3748'; }}
          />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 999,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.09)',
          flexShrink: 0,
        }}>
          <GoogleLogo size={14} />
          <span style={{
            fontFamily: 'Poppins, sans-serif', fontSize: 10,
            color: 'rgba(252,251,251,0.46)', fontWeight: 500, direction: 'ltr',
          }}>موثّق</span>
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

      <p style={{
        fontWeight: 400, fontSize: 15,
        color: 'rgba(226,232,240,0.75)',
        lineHeight: 1.85, margin: 0, flex: 1, textAlign: 'right',
      }}>
        "{review.text}"
      </p>
    </div>
  );
}

function ArrowBtn({
  onClick, disabled, children,
}: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flexShrink: 0,
        width: 46, height: 46, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: disabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,193,7,0.12)',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,193,7,0.35)'}`,
        color: disabled ? 'rgba(255,255,255,0.20)' : '#FFC107',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 200ms',
      }}
      onMouseEnter={e => {
        if (!disabled) Object.assign(e.currentTarget.style, {
          background: 'rgba(255,193,7,0.22)',
          transform: 'scale(1.07)',
        });
      }}
      onMouseLeave={e => {
        Object.assign(e.currentTarget.style, {
          background: disabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,193,7,0.12)',
          transform: 'scale(1)',
        });
      }}
    >
      {children}
    </button>
  );
}

export default function TestimonialsSection() {
  const [perPage, setPerPage]   = useState(getPerPage);
  const [page,    setPage]      = useState(0);

  /* Recompute perPage on resize; clamp active page if needed */
  useEffect(() => {
    function handleResize() {
      const next = getPerPage();
      setPerPage(prev => {
        if (prev === next) return prev;
        /* Clamp page so no empty page can appear */
        const maxPage = Math.ceil(REVIEWS.length / next) - 1;
        setPage(p => Math.min(p, maxPage));
        return next;
      });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(REVIEWS.length / perPage);
  const visible    = REVIEWS.slice(page * perPage, (page + 1) * perPage);
  const isFirst    = page === 0;
  const isLast     = page === totalPages - 1;

  return (
    <section className="section-block relative overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Subtle top glow */}
      <div className="absolute pointer-events-none" style={{
        top: -60, left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: 200,
        background: 'radial-gradient(ellipse at top, rgba(255,193,7,0.07) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 px-4" style={{ maxWidth: 1160, margin: '0 auto' }}>
        <SectionHeader
          badge="آراء الطلاب"
          heading={<>آراء طلابنا <Gold>وقصص نجاحهم</Gold></>}
          description="أصوات حقيقية عبرت من الشغف إلى الاحتراف"
          style={{ marginBottom: 20 }}
        />

        {/* Rating badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 20px', borderRadius: 999,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.11)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          }}>
            <GoogleLogo size={18} />
            <span style={{
              fontWeight: 700, fontSize: 13.5,
              color: 'rgba(252,251,251,0.85)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ color: '#FFC107', textShadow: '0 0 12px rgba(255,193,7,0.25)' }}>★★★★★</span>
              <span>5.0 / 5 بناءً على تقييمات Google</span>
            </span>
          </div>
        </div>

        {/* ── Carousel row: arrow · cards · arrow ── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 'clamp(12px,2vw,20px)',
          direction: 'rtl',
        }}>
          {/* Right arrow → previous page (RTL: right = start) */}
          <ArrowBtn onClick={() => setPage(p => p - 1)} disabled={isFirst}>
            <ChevronRightIcon />
          </ArrowBtn>

          {/* Cards — columns driven by perPage so grid always matches visible count */}
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: `repeat(${perPage}, 1fr)`,
            gap: 'clamp(14px,2vw,22px)',
          }}>
            {visible.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>

          {/* Left arrow → next page */}
          <ArrowBtn onClick={() => setPage(p => p + 1)} disabled={isLast}>
            <ChevronLeftIcon />
          </ArrowBtn>
        </div>

        {/* Dot indicators */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 8,
          marginTop: 36, direction: 'ltr',
        }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={{
                width: i === page ? 24 : 8, height: 8,
                borderRadius: 4,
                background: i === page ? '#FFC107' : 'rgba(255,255,255,0.18)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 250ms',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
