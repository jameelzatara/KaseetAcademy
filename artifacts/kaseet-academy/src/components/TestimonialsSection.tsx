// ── Testimonials — cream background, wrap-around carousel ────
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';
import SectionHeader, { Gold } from './SectionHeader';
import { STATS } from '../data/stats';

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
  { id: 7,  name: 'فؤاد حمتي',      avatar: avatarFouad,  text: 'تدريب عملي ممتاز ومعدات استوديو على أعلى مستوى، الاستفادة كانت مضاعفة.' },
  { id: 8,  name: 'سحر العساف',     avatar: avatarSahar,  text: 'كاسيت أكاديمي أضافت لي الكثير على المستوى الشخصي والمهني في مجال الخطابة والتواصل.' },
  { id: 9,  name: 'يزن مصاروة',     avatar: avatarYazan,  text: 'أسلوب التدريب عملي ومتخصص جداً، شعرت بتطور حقيقي في أدائي الصوتي منذ الجلسة الأولى.' },
  { id: 10, name: 'أحلام العيساوي', avatar: avatarAhlam,  text: 'كاسيت ليست مجرد أكاديمية، هي منظومة دعم كاملة. المدربون ملتزمون والمحتوى على مستوى عالمي.' },
];

// Long-text threshold (~4 lines ≈ 120 chars)
const CLAMP_THRESHOLD = 120;

function getPerPage(): number {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768)  return 2;
  return 1;
}

/* ── Review card (cream background variant) ── */
function ReviewCard({
  review, open, onToggle,
}: { review: Review; open: boolean; onToggle: () => void }) {
  const isLong = review.text.length > CLAMP_THRESHOLD;

  return (
    <div style={{
      background:   'rgba(255,255,255,0.80)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border:       '1px solid rgba(26,37,51,0.09)',
      borderRadius: 20,
      padding:      'clamp(18px,2.2vw,26px)',
      display:      'flex',
      flexDirection:'column',
      gap:           14,
      textAlign:    'right',
      boxShadow:    '0 4px 18px rgba(26,37,51,0.10)',
      direction:    'rtl',
      minWidth:     0,
    }}>
      {/* Header row: avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ textAlign: 'right', flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1A2533', lineHeight: 1.3 }}>
            {review.name}
          </div>
          <div style={{ display: 'inline-flex', gap: 2, alignItems: 'center', direction: 'ltr', marginTop: 3 }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill="#FFC107" color="#FFC107" />
            ))}
          </div>
        </div>
        <img
          src={review.avatar}
          alt={review.name}
          width={54}
          height={54}
          style={{
            width: 54, height: 54, borderRadius: '50%',
            objectFit: 'cover', objectPosition: 'center top',
            border: '2px solid rgba(255,193,7,0.55)',
            flexShrink: 0,
          }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.background = '#d1d5db'; }}
        />
      </div>

      <div style={{ height: 1, background: 'rgba(26,37,51,0.07)' }} />

      {/* Review text with optional expand */}
      <div>
        <p style={{
          fontWeight: 400, fontSize: 14.5,
          color: 'rgba(26,37,51,0.72)',
          lineHeight: 1.85, margin: 0, textAlign: 'right',
          display: isLong && !open ? '-webkit-box' : 'block',
          WebkitLineClamp: isLong && !open ? 4 : undefined,
          WebkitBoxOrient: isLong && !open ? 'vertical' as const : undefined,
          overflow: isLong && !open ? 'hidden' : 'visible',
        }}>
          "{review.text}"
        </p>
        {isLong && (
          <button
            onClick={onToggle}
            style={{
              display: 'inline-block', marginTop: 6,
              fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 13,
              color: '#FFC107', background: 'none', border: 'none', cursor: 'pointer',
              padding: 0, textDecoration: 'underline',
            }}
          >
            {open ? 'طيّ النص' : 'اقرأ المزيد'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Arrow button (dark border on cream background) ── */
function ArrowBtn({
  onClick, children,
}: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        width: 46, height: 46, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,193,7,0.10)',
        border: '1px solid rgba(255,193,7,0.35)',
        color: '#9a7200',
        cursor: 'pointer',
        transition: 'all 200ms',
      }}
      onMouseEnter={e => Object.assign(e.currentTarget.style, {
        background: 'rgba(255,193,7,0.20)',
        transform: 'scale(1.07)',
      })}
      onMouseLeave={e => Object.assign(e.currentTarget.style, {
        background: 'rgba(255,193,7,0.10)',
        transform: 'scale(1)',
      })}
    >
      {children}
    </button>
  );
}

export default function TestimonialsSection() {
  const [perPage, setPerPage] = useState(getPerPage);
  const [page,    setPage]    = useState(0);
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());

  const toggleOpen = (id: number) => setOpenIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  useEffect(() => {
    function handleResize() {
      const next = getPerPage();
      setPerPage(prev => {
        if (prev === next) return prev;
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

  // Wrap-around — never disabled
  const prevPage = () => setPage(p => (p - 1 + totalPages) % totalPages);
  const nextPage = () => setPage(p => (p + 1) % totalPages);

  return (
    <section
      className="sec sec--reviews section-block relative overflow-hidden"
      style={{ direction: 'rtl' }}
    >
      {/* Decorative arcs */}
      <div className="geo geo--btm" aria-hidden="true">
        <svg viewBox="0 0 1440 180" preserveAspectRatio="none" fill="none"
          style={{width:'100%',height:'100%',display:'block'}}>
          <path d="M0 180 Q720 -40 1440 180" stroke="rgba(255,193,7,.22)" strokeWidth="1.5"/>
          <path d="M0 180 Q720 10 1440 180"  stroke="rgba(255,193,7,.10)" strokeWidth="1"/>
          {[0,1,2,3,4].flatMap(row => [0,1,2,3].map(col => (
            <circle key={`l-${row}-${col}`}
              cx={col * 28 + 22} cy={row * 26 + 76}
              r={2.5} fill={`rgba(255,255,255,${0.05 + row * 0.01})`}/>
          )))}
          {[0,1,2,3,4].flatMap(row => [0,1,2,3].map(col => (
            <circle key={`r-${row}-${col}`}
              cx={1440 - col * 28 - 22} cy={row * 26 + 76}
              r={2.5} fill={`rgba(255,255,255,${0.05 + row * 0.01})`}/>
          )))}
        </svg>
      </div>

      <div className="relative z-10 px-4" style={{ maxWidth: 1160, margin: '0 auto' }}>
        <SectionHeader
          badge="آراء الطلاب"
          heading={<>آراء طلابنا <Gold>وقصص نجاحهم</Gold></>}
          description="أصوات حقيقية عبرت من الشغف إلى الاحتراف"
          style={{ marginBottom: 20 }}
        />


        {/* ── Carousel row ── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 'clamp(12px,2vw,20px)',
          direction: 'rtl',
        }}>
          {/* Right arrow → previous */}
          <ArrowBtn onClick={prevPage}>
            <ChevronRight size={22} strokeWidth={2.5} />
          </ArrowBtn>

          {/* Cards */}
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: `repeat(${perPage}, 1fr)`,
            gap: 'clamp(14px,2vw,20px)',
          }}>
            {visible.map(r => (
              <ReviewCard
                key={r.id}
                review={r}
                open={openIds.has(r.id)}
                onToggle={() => toggleOpen(r.id)}
              />
            ))}
          </div>

          {/* Left arrow → next */}
          <ArrowBtn onClick={nextPage}>
            <ChevronLeft size={22} strokeWidth={2.5} />
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
                background: i === page ? '#FFC107' : 'rgba(255,255,255,0.22)',
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
