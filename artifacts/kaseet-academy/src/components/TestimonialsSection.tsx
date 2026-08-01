// ── Testimonials — infinite marquee ──────────────────────
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

function ReviewCard({ review }: { review: Review }) {
  return (
    <div style={{
      background:           'rgba(255,255,255,0.04)',
      backdropFilter:       'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border:               '1px solid rgba(255,255,255,0.09)',
      borderRadius:         20,
      /* 28px desktop / 22px mobile — breathing room */
      padding:              'clamp(22px,2.5vw,28px)',
      display:              'flex',
      flexDirection:        'column',
      gap:                  16,
      textAlign:            'right',
      flexShrink:           0,
      width:                'clamp(290px,28vw,360px)',
      boxShadow:            '0 10px 30px rgba(0,0,0,0.25)',
      cursor:               'default',
      direction:            'rtl',
    }}>
      {/* Top row — name+avatar RIGHT, Google badge LEFT */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>

        {/* Name + stars — first in DOM → RIGHT in RTL */}
        {/* gap:18px between name block and avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* Name text first (RIGHT), avatar image after (LEFT) */}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 700,
              fontSize: 14.5, color: 'rgba(252,251,251,0.95)', lineHeight: 1.3,
            }}>{review.name}</div>
            {/* Stars — LTR for correct ★ order, same baseline as name */}
            <div style={{
              display: 'flex', gap: 2,
              alignItems: 'baseline',   /* same baseline */
              direction: 'ltr', marginTop: 4,
            }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: '#FFC107', fontSize: 13, lineHeight: 1 }}>★</span>
              ))}
            </div>
          </div>
          {/* Avatar — 64px, AFTER Arabic name text → LEFT side in RTL */}
          <img
            src={review.avatar}
            alt={review.name}
            style={{
              width: 64, height: 64, borderRadius: '50%',
              objectFit: 'cover', objectPosition: 'center top',
              border: '2px solid rgba(255,193,7,0.45)',
              boxShadow: '0 0 14px rgba(255,193,7,0.18)',
              flexShrink: 0,
            }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.background = '#2d3748'; }}
          />
        </div>

        {/* Google badge — second → LEFT in RTL */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 99,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)',
          flexShrink: 0,
        }}>
          <GoogleLogo size={14} />
          <span style={{
            fontFamily: 'Poppins, sans-serif', fontSize: 10,
            color: 'rgba(252,251,251,0.48)', fontWeight: 500,
            direction: 'ltr',
          }}>موثّق</span>
        </div>
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

      {/* Review text — line-height:1.9 for breathing room */}
      <p style={{
        fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
        fontSize: 'clamp(13px,1.2vw,14.5px)',
        color: 'rgba(226,232,240,0.78)',
        lineHeight: 1.9, margin: 0, flex: 1,
        textAlign: 'right',
      }}>
        "{review.text}"
      </p>
    </div>
  );
}

export default function TestimonialsSection() {
  const all = [...REVIEWS, ...REVIEWS];

  return (
    <section className="section-block relative overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Subtle top glow */}
      <div className="absolute pointer-events-none" style={{
        top: -60, left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: 200,
        background: 'radial-gradient(ellipse at top, rgba(255,193,7,0.07) 0%, transparent 70%)',
      }} />

      {/* Edge fade masks — colour matches global page canvas */}
      <div className="absolute inset-y-0 right-0 pointer-events-none" style={{
        width: 120, zIndex: 10,
        background: 'linear-gradient(to left, var(--page-mid) 0%, transparent 100%)',
      }} />
      <div className="absolute inset-y-0 left-0 pointer-events-none" style={{
        width: 120, zIndex: 10,
        background: 'linear-gradient(to right, var(--page-mid) 0%, transparent 100%)',
      }} />

      <div className="relative z-10" style={{ maxWidth: 1160, margin: '0 auto' }}>

        {/* Section header */}
        <div style={{
          padding: '0 clamp(16px,3vw,32px)',
          marginBottom: 48,
          textAlign: 'right',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
          direction: 'rtl',
        }}>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 900,
              fontSize: 'clamp(24px,3.5vw,42px)',
              color: 'rgba(252,251,251,0.96)', lineHeight: 1.2, margin: '0 0 8px',
              textAlign: 'right',
            }}>
              آراء طلابنا{' '}
              <span style={{ color: '#FFC107' }}>وقصص نجاحهم</span>
            </h2>
            <p style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
              fontSize: 'clamp(13px,1.3vw,15.5px)',
              color: 'rgba(226,232,240,0.62)', margin: 0,
              textAlign: 'right',
            }}>
              أصوات حقيقية عبرت من الشغف إلى الاحتراف
            </p>
          </div>

          {/* Overall rating badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 20px', borderRadius: 99,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            flexShrink: 0,
          }}>
            <GoogleLogo size={18} />
            <span style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 13.5,
              color: 'rgba(252,251,251,0.85)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ color: '#FFC107' }}>★★★★★</span>
              <span>5.0 / 5 بناءً على تقييمات Google</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Infinite marquee track ── */}
      <div className="testimonials-marquee-wrap" style={{ overflow: 'hidden', width: '100%' }}>
        <div className="testimonials-marquee" style={{
          display: 'flex',
          gap: 'clamp(16px,2vw,22px)',
          width: 'max-content',
          direction: 'ltr',  // marquee scroll direction is LTR; cards remain RTL internally
        }}>
          {all.map((r, i) => (
            <ReviewCard key={`${r.id}-${i}`} review={r} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .testimonials-marquee {
          animation: marquee-scroll 48s linear infinite;
        }
        .testimonials-marquee:hover {
          animation-play-state: paused;
        }
        .testimonials-marquee-wrap {
          padding: 12px 0 16px;
        }
      `}</style>
    </section>
  );
}
