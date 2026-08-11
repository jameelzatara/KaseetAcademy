// ── Testimonials — dark section · 15 Google Maps reviews ─────────────────
import { useState, useEffect, useRef, useCallback } from 'react';
import { Star, ChevronRight, ChevronLeft, MapPin, BadgeCheck } from 'lucide-react';
import SectionHeader, { Gold } from './SectionHeader';
import rawData from '../data/testimonials.json';

/* ── Constants ─────────────────────────────────────────── */
const PLACE_URL = 'https://maps.app.goo.gl/WmBQBMA6f3nbb6gn7';
const F   = 'Tajawal, sans-serif';
const FP  = 'Poppins, sans-serif';
const GOLD     = '#FFC107';
const GOLD_LINE= 'rgba(255,193,7,0.28)';
const GOLD_BG  = 'rgba(255,193,7,0.09)';
const OFF      = 'rgba(252,251,251,0.96)';
const T2       = 'rgba(203,213,225,0.72)';
const T3       = 'rgba(203,213,225,0.42)';
const CARD_BG  = 'rgba(255,255,255,0.055)';
const CARD_HI  = 'rgba(255,255,255,0.10)';
const CARD_LINE= 'rgba(255,255,255,0.10)';

const CLAMP = 180; // chars — show "اقرأ المزيد" above this

/* ── Types ─────────────────────────────────────────────── */
interface Testimonial {
  id: string; name: string; name_ar: string;
  lang: string; when: string; stars: number;
  guide: boolean; reviews: number;
  text: string; text_ar?: string;
  course?: string; mentions?: string[];
  avatar: string | null; source: string; verify: boolean;
}

const REVIEWS: Testimonial[] = rawData.testimonials as Testimonial[];

/* ── Five‑star row ───────────────────────────────────────── */
function Stars({ n = 5 }: { n?: number }) {
  return (
    <div style={{ display: 'inline-flex', gap: 2, direction: 'ltr' }}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={13} fill={GOLD} color={GOLD} />
      ))}
    </div>
  );
}

/* ── Avatar — photo or initial ────────────────────────────── */
function Avatar({ src, name }: { src: string | null; name: string }) {
  const [err, setErr] = useState(false);
  const initial = name.trim()[0] ?? '؟';
  if (!src || err) {
    return (
      <div style={{
        width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(140deg,rgba(255,193,7,.55),rgba(255,193,7,.18))',
        display: 'grid', placeContent: 'center',
        fontFamily: F, fontWeight: 900, fontSize: 22, color: GOLD,
        border: `2px solid ${GOLD_LINE}`,
      }}>
        {initial}
      </div>
    );
  }
  return (
    <div style={{
      width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
      padding: 2,
      background: `linear-gradient(140deg, ${GOLD}, rgba(255,193,7,.22))`,
    }}>
      <img
        src={src}
        alt={name}
        onError={() => setErr(true)}
        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
}

/* ── Single review card ────────────────────────────────────── */
function Card({ t }: { t: Testimonial }) {
  const [open, setOpen] = useState(false);
  const isLong = t.text.length > CLAMP;
  const isEn   = t.lang === 'en';

  return (
    <div
      className="tst-card"
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_LINE}`,
        borderRadius: 20,
        padding: 'clamp(18px,2vw,26px)',
        display: 'flex', flexDirection: 'column', gap: 14,
        textAlign: 'right', direction: 'rtl',
        transition: 'border-color .22s, background .22s, transform .22s',
        minWidth: 0, height: '100%', boxSizing: 'border-box',
      }}
      onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, {
        background: CARD_HI, borderColor: GOLD_LINE, transform: 'translateY(-3px)',
      })}
      onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, {
        background: CARD_BG, borderColor: CARD_LINE, transform: 'none',
      })}
    >
      {/* ── Header: avatar + name + meta ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15.5, color: OFF, lineHeight: 1.3 }}>
            {t.name_ar}
          </div>
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Stars n={t.stars} />
            <span style={{ fontFamily: F, fontSize: 12, color: T3 }}>{t.when}</span>
          </div>
          {/* Badges row */}
          <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Google Maps badge — on every card */}
            <a
              href={PLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontFamily: F, fontWeight: 700, fontSize: 11.5, color: T2,
                background: 'rgba(255,255,255,.06)', border: `1px solid ${CARD_LINE}`,
                borderRadius: 999, padding: '3px 10px', textDecoration: 'none',
                transition: 'border-color .18s, color .18s',
              }}
              onMouseEnter={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, { borderColor: GOLD_LINE, color: GOLD })}
              onMouseLeave={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, { borderColor: CARD_LINE, color: T2 })}
            >
              <MapPin size={10} strokeWidth={2} />
              خرائط جوجل
            </a>

            {/* Local Guide badge */}
            {t.guide && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontFamily: F, fontWeight: 700, fontSize: 11, color: '#4ade80',
                background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.22)',
                borderRadius: 999, padding: '3px 10px',
              }}>
                <BadgeCheck size={10} strokeWidth={2} />
                مرشد محلي
              </span>
            )}
          </div>
        </div>
        <Avatar src={t.avatar} name={t.name_ar} />
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'rgba(255,255,255,.07)', flexShrink: 0 }} />

      {/* ── Review text ── */}
      <div style={{ flex: 1 }}>
        {/* English original */}
        {isEn && (
          <p style={{
            fontFamily: FP, fontSize: 13.5, color: T2, lineHeight: 1.9, margin: '0 0 10px',
            direction: 'ltr', textAlign: 'left',
            whiteSpace: 'pre-line',
          }}>
            &ldquo;{t.text}&rdquo;
          </p>
        )}

        {/* Arabic text (native or translation) */}
        <p style={{
          fontFamily: F, fontSize: 14.5, color: T2, lineHeight: 2,
          margin: 0, textAlign: 'right', direction: 'rtl',
          whiteSpace: 'pre-line',
          ...(isLong && !open ? {
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          } : {}),
        }}>
          {isEn
            ? (t.text_ar ? `«${t.text_ar}»` : null)
            : `«${t.text}»`}
        </p>

        {/* Read more */}
        {((isEn && t.text_ar && t.text_ar.length > CLAMP) || (!isEn && isLong)) && (
          <button
            onClick={() => setOpen(v => !v)}
            style={{
              display: 'inline-block', marginTop: 6, padding: 0, background: 'none', border: 'none',
              fontFamily: F, fontWeight: 700, fontSize: 13, color: GOLD,
              cursor: 'pointer', textDecoration: 'underline',
            }}
          >
            {open ? 'طيّ النص' : 'اقرأ المزيد'}
          </button>
        )}
      </div>

      {/* ── Course tag ── */}
      {t.course && (
        <div style={{
          fontFamily: F, fontSize: 11.5, color: T3,
          borderTop: `1px solid rgba(255,255,255,.06)`, paddingTop: 10, marginTop: 'auto',
        }}>
          📌 {t.course}
        </div>
      )}
    </div>
  );
}

/* ── Arrow button ──────────────────────────────────────────── */
function ArrowBtn({ onClick, children, label }: { onClick: () => void; children: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        flexShrink: 0, width: 48, height: 48, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: GOLD_BG, border: `1px solid ${GOLD_LINE}`, color: GOLD,
        cursor: 'pointer', transition: 'all .2s',
      }}
      onMouseEnter={e => Object.assign(e.currentTarget.style, { background: 'rgba(255,193,7,.18)', transform: 'scale(1.07)' })}
      onMouseLeave={e => Object.assign(e.currentTarget.style, { background: GOLD_BG, transform: 'scale(1)' })}
    >
      {children}
    </button>
  );
}

/* ── Helpers ────────────────────────────────────────────────── */
function getPerPage(): number {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 680)  return 2;
  return 1;
}

/* ══════════════════════════════════════════════════════════════
   § TestimonialsSection
   ══════════════════════════════════════════════════════════════ */
export default function TestimonialsSection() {
  const [perPage, setPerPage]   = useState(getPerPage);
  const [page,    setPage]      = useState(0);
  const touchStartX             = useRef<number | null>(null);

  const totalPages = Math.ceil(REVIEWS.length / perPage);
  const visible    = REVIEWS.slice(page * perPage, (page + 1) * perPage);

  const prevPage = useCallback(() => setPage(p => (p - 1 + totalPages) % totalPages), [totalPages]);
  const nextPage = useCallback(() => setPage(p => (p + 1) % totalPages), [totalPages]);

  useEffect(() => {
    function handle() {
      const next = getPerPage();
      setPerPage(prev => {
        if (prev === next) return prev;
        setPage(p => Math.min(p, Math.ceil(REVIEWS.length / next) - 1));
        return next;
      });
    }
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  /* Swipe support */
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? nextPage() : prevPage();
    touchStartX.current = null;
  };

  return (
    <section
      id="reviews"
      dir="rtl"
      style={{ background: '#0F1620', borderTop: '1px solid rgba(255,193,7,0.10)', position: 'relative', overflow: 'hidden' }}
    >
      {/* ── Geometric background arcs ── */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none"
          style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 100, display: 'block' }}>
          <path d="M0 100 Q720 20 1440 100" stroke="rgba(255,193,7,.12)" strokeWidth="1.5" fill="none"/>
          <path d="M0 100 Q720 50 1440 100" stroke="rgba(255,193,7,.06)" strokeWidth="1" fill="none"/>
        </svg>
        {/* Scattered dots */}
        <svg viewBox="0 0 1440 600" preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }}>
          {[80,200,360,520,680,820,980,1120,1300].map((x, i) => (
            <circle key={i} cx={x} cy={[80,160,60,200,120,70,180,100,140][i]} r="2" fill="rgba(255,193,7,.35)"/>
          ))}
        </svg>
      </div>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '72px clamp(16px,4vw,48px) 80px', position: 'relative', zIndex: 1 }}>

        {/* ── Section header ── */}
        <SectionHeader
          badge="آراء الطلاب"
          heading={<>آراء طلابنا <Gold>وقصص نجاحهم</Gold></>}
          description="أصوات حقيقية عبرت من الشغف إلى الاحتراف"
          style={{ marginBottom: 16 }}
        />

        {/* ── Google Maps source chip ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
          <a
            href={PLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: CARD_BG, border: `1px solid ${CARD_LINE}`,
              borderRadius: 999, padding: '9px 20px', textDecoration: 'none',
              transition: 'border-color .2s, background .2s',
            }}
            onMouseEnter={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, { borderColor: GOLD_LINE, background: CARD_HI })}
            onMouseLeave={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, { borderColor: CARD_LINE, background: CARD_BG })}
          >
            <MapPin size={15} color={GOLD} strokeWidth={2} />
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: OFF }}>
              استوديو كاسيت
            </span>
            <div style={{ display: 'flex', gap: 1, direction: 'ltr' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill={GOLD} color={GOLD} />
              ))}
            </div>
            <span style={{ fontFamily: F, fontSize: 12, color: T3 }}>خرائط جوجل</span>
          </a>
        </div>

        {/* ── Carousel ── */}
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px,2vw,18px)' }}
        >
          {/* Right arrow = prev (RTL) */}
          <ArrowBtn onClick={prevPage} label="السابق">
            <ChevronRight size={22} strokeWidth={2.5} />
          </ArrowBtn>

          {/* Cards grid */}
          <div style={{
            flex: 1, display: 'grid',
            gridTemplateColumns: `repeat(${perPage},1fr)`,
            gap: 'clamp(12px,2vw,18px)',
            alignItems: 'stretch',
          }}>
            {visible.map(r => <Card key={r.id} t={r} />)}
          </div>

          {/* Left arrow = next (RTL) */}
          <ArrowBtn onClick={nextPage} label="التالي">
            <ChevronLeft size={22} strokeWidth={2.5} />
          </ArrowBtn>
        </div>

        {/* ── Dot indicators ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginTop: 32, direction: 'ltr' }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`صفحة ${i + 1}`}
              style={{
                width: i === page ? 28 : 8, height: 8, borderRadius: 4,
                background: i === page ? GOLD : 'rgba(255,255,255,.18)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all .25s',
              }}
            />
          ))}
        </div>

        {/* ── Count line ── */}
        <p style={{
          textAlign: 'center', fontFamily: F, fontSize: 13, color: T3,
          marginTop: 14, marginBottom: 0,
        }}>
          {page * perPage + 1}–{Math.min((page + 1) * perPage, REVIEWS.length)} من {REVIEWS.length} مراجعة
        </p>

        {/* ── CTA strip ── */}
        <div style={{
          marginTop: 52, display: 'flex', justifyContent: 'center',
          flexWrap: 'wrap', gap: 14, direction: 'rtl',
        }}>
          <a
            href={PLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: F, fontWeight: 800, fontSize: 14.5,
              padding: '13px 28px', borderRadius: 14,
              background: GOLD_BG, border: `1.5px solid ${GOLD_LINE}`,
              color: GOLD, textDecoration: 'none', transition: 'all .2s',
            }}
            onMouseEnter={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, { background: 'rgba(255,193,7,.16)', borderColor: 'rgba(255,193,7,.55)' })}
            onMouseLeave={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, { background: GOLD_BG, borderColor: GOLD_LINE })}
          >
            <Star size={16} fill={GOLD} color={GOLD} />
            اترك رأيك على خرائط جوجل
          </a>

          <a
            href="#consultant"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: F, fontWeight: 800, fontSize: 14.5,
              padding: '13px 28px', borderRadius: 14,
              background: GOLD, color: '#121927',
              textDecoration: 'none', transition: 'all .2s',
              boxShadow: '0 4px 18px rgba(255,193,7,.30)',
            }}
            onMouseEnter={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, { boxShadow: '0 8px 28px rgba(255,193,7,.45)', transform: 'translateY(-2px)' })}
            onMouseLeave={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, { boxShadow: '0 4px 18px rgba(255,193,7,.30)', transform: 'none' })}
          >
            استشر مجاناً
          </a>
        </div>
      </div>
    </section>
  );
}
