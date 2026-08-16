/**
 * MasterclassLayout — القالب الموحّد للماستركلاسات الثلاث.
 * كل البيانات تأتي من masterclasses.ts؛ هذا الملف للعرض فقط.
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronDown, ArrowLeft, MapPin, Wifi, Layers, Clock, FolderCheck } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { GOLD, OFF, F, FP, INNER, waLink } from '../pages/shared/coursePageHelpers';
import MasterclassGuarantee from '../components/masterclass/MasterclassGuarantee';
import MasterclassFaqAccordion from '../components/masterclass/MasterclassFaqAccordion';
import MasterclassAdvisorCard from '../components/masterclass/MasterclassAdvisorCard';
import PaymentModal from '../components/PaymentModal';
import wajeezLogo from '@assets/wajeez-logo_1785688262989.png';
import type { MasterclassData, StationItem } from '../data/masterclasses';

/* ── design tokens ─────────────────────────────────────────── */
const GLD  = GOLD;
const GS   = 'rgba(255,193,7,0.09)';
const GL   = 'rgba(255,193,7,0.26)';
const MUT  = '#8A97AE';
const LT   = '#C8D3E2';
const CARD = 'rgba(255,255,255,0.04)';
const CBR  = 'rgba(255,255,255,0.08)';
const INK  = '#18202F';
const INK2 = '#56617A';
const TEAL = 'rgba(30,122,133,';

const WRP = INNER;

/* ── tiny helpers ──────────────────────────────────────────── */
function SectionHead({ badge, dark, heading, headingGold, sub }: {
  badge: string; dark?: boolean; heading: string; headingGold: string; sub?: string;
}) {
  const textColor = dark ? INK : OFF;
  const badgeBg   = dark ? 'rgba(138,98,0,.09)' : GLD;
  const badgeTxt  = dark ? '#8A6200' : '#1A1206';
  const badgeBdr  = dark ? 'rgba(138,98,0,.28)' : 'none';
  return (
    <div style={{ textAlign: 'center', marginBottom: 52, direction: 'rtl' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: badgeBg, border: `1px solid ${badgeBdr}`, color: badgeTxt, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: badgeTxt }} />
        {badge}
      </span>
      <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: textColor }}>
        {heading} <span style={{ color: dark ? '#8A6200' : GLD }}>{headingGold}</span>
      </h2>
      {sub && <p style={{ fontFamily: F, fontSize: 16, color: dark ? INK2 : MUT, maxWidth: 680, marginTop: 14, marginInline: 'auto', lineHeight: 1.8 }}>{sub}</p>}
    </div>
  );
}

function GoldChip({ text, outline }: { text: string; outline?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: outline ? GS : 'none', border: `1px solid ${GL}`, color: GLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD }} />
      {text}
    </span>
  );
}

/* ── wave thumb (SVG) for portfolio ───────────────────────── */
function waveThumb(seed: number, n = 38, w = 120, h = 26): string {
  let s = ((seed * 1234567 + 89) >>> 0);
  const rand = () => { s = ((s * 1664525 + 1013904223) >>> 0); return s / 4294967296; };
  const step = w / n;
  const lines = Array.from({ length: n }, (_, i) => {
    const a = (0.28 + rand() * 0.72) * (h / 2 - 1);
    const x = (i * step + step / 2);
    return `<line x1="${x.toFixed(1)}" y1="${(h/2-a).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(h/2+a).toFixed(1)}"/>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round">${lines.join('')}</g></svg>`;
}

/* ── Station accordion item ────────────────────────────────── */
function StationRow({ st, open, onToggle }: { st: StationItem; open: boolean; onToggle: () => void }) {
  const isWj = st.badge === 'محطة وجيز';
  const isOpt = !!st.optional;
  const borderColor = isWj
    ? (open ? 'rgba(30,122,133,.55)' : 'rgba(30,122,133,.36)')
    : isOpt
      ? 'rgba(167,139,250,0.22)'
      : (open ? GL : CBR);
  const numColor = isWj ? '#8FDAE3' : isOpt ? '#a78bfa' : GLD;

  return (
    <div
      role="button" tabIndex={0} aria-expanded={open}
      onClick={onToggle}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      style={{
        background: isWj
          ? `linear-gradient(180deg, rgba(30,122,133,.14), ${open ? GS : CARD} 55%)`
          : (open ? `linear-gradient(160deg, ${GS}, rgba(255,255,255,0.025) 60%)` : CARD),
        border: `1px solid ${borderColor}`,
        borderRadius: 14, padding: '18px 22px', cursor: 'pointer',
        transition: 'border-color .2s, background .2s',
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 12, background: 'rgba(0,0,0,.22)', border: `1px solid ${borderColor}`, display: 'grid', placeContent: 'center', fontFamily: FP, fontSize: 13, fontWeight: 700, color: numColor }}>
          {st.n}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: F, fontSize: 16.5, fontWeight: 800, color: OFF, lineHeight: 1.5 }}>{st.title}</span>
            {st.standalone && !st.optional && (
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: GLD, color: '#1A1206', padding: '2px 9px', borderRadius: 999 }}>متاحة منفردةً</span>
            )}
            {st.hot && (
              <span style={{ background: GLD, color: INK, fontFamily: F, fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999 }}>★ مميّز</span>
            )}
            {isWj && (
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: 'rgba(30,122,133,.18)', border: '1px solid rgba(30,122,133,.45)', color: '#8FDAE3', padding: '2px 9px', borderRadius: 999 }}>محطة وجيز</span>
            )}
            {isOpt && (
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.35)', color: '#c4b5fd', padding: '2px 9px', borderRadius: 999 }}>القيادة</span>
            )}
          </div>
          <div style={{ fontFamily: F, fontSize: 13, color: MUT, lineHeight: 1.7 }}>{st.sub}</div>
        </div>
        <ChevronDown size={16} color={isWj ? '#8FDAE3' : GLD} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s', flexShrink: 0 }} />
      </div>
      {open && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${CBR}` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
            {(st.chips as readonly string[]).map(chip => (
              <span key={chip} style={{ fontFamily: F, fontSize: 12, color: LT, background: 'rgba(255,255,255,.04)', border: `1px solid ${CBR}`, padding: '4px 11px', borderRadius: 999 }}>{chip}</span>
            ))}
          </div>
          {st.project && (
            <div style={{ background: GS, border: `1px solid ${GL}`, borderRadius: 12, padding: '12px 16px', marginBottom: 10 }}>
              <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 700, color: GLD, marginBottom: 5, display: 'block' }}>مشروع المحطة</span>
              <p style={{ fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.75, margin: 0 }}>{st.project}</p>
            </div>
          )}
          {st.ref && <span style={{ fontFamily: FP, fontSize: 11, color: MUT }}>المرجع: {st.ref}</span>}
          {st.hours && !st.ref && <div style={{ fontFamily: F, fontSize: 12, color: MUT }}>⏱ {st.hours}</div>}
          {st.note && <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginTop: 6 }}>{st.note}</div>}
        </div>
      )}
    </div>
  );
}

/* ── StudyAccordion ────────────────────────────────────────── */
function StudyAccordion({ variant, label, sub, items }: {
  variant: 'inperson' | 'online';
  label: string; sub: string;
  items: { title: string; desc: string }[];
}) {
  const [open, setOpen] = useState(false);
  const isIP   = variant === 'inperson';
  const accent = isIP ? GLD : '#67e8f9';
  const acRgb  = isIP ? '255,193,7' : '103,232,249';
  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${open ? `rgba(${acRgb},.40)` : CBR}`, transition: 'border-color .2s', marginBottom: 10 }}>
      <button onClick={() => setOpen(v => !v)} aria-expanded={open}
        style={{ width: '100%', background: open ? `rgba(${acRgb},.05)` : CARD, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer', textAlign: 'right', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: open ? accent : `rgba(${acRgb},.12)`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s' }}>
            {isIP ? <MapPin size={15} color={open ? '#060A14' : accent} strokeWidth={2.2} /> : <Wifi size={15} color={open ? '#060A14' : accent} strokeWidth={2.2} />}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: OFF }}>{label}</div>
            <div style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 2 }}>{sub}</div>
          </div>
        </div>
        <ChevronDown size={15} color={open ? accent : MUT} strokeWidth={2.5} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s', flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ borderTop: `1px solid rgba(${acRgb},.18)` }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 20px', borderBottom: i < items.length - 1 ? `1px solid ${CBR}` : 'none' }}>
              <span style={{ fontFamily: FP, fontWeight: 800, fontSize: 11, color: '#060A14', background: accent, borderRadius: '50%', flexShrink: 0, width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: OFF, marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MASTERCLASS LAYOUT
══════════════════════════════════════════════════════════ */
export default function MasterclassLayout({ data }: { data: MasterclassData }) {
  const [, navigate]   = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [openIdx, setOpenIdx]     = useState<number | null>(null);
  const [expandAll, setExpandAll] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('payment_intent') && p.get('redirect_status') === 'succeeded') setModalOpen(true);
  }, []);

  usePageMeta({ title: data.meta.title, description: data.meta.description });
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  function toggle(i: number) { setOpenIdx(openIdx === i ? null : i); setExpandAll(false); }
  function isOpen(i: number) { return expandAll || openIdx === i; }
  function handleExpandAll()  { setExpandAll(v => !v); setOpenIdx(null); }

  const openModal = (e: React.MouseEvent) => { e.preventDefault(); setModalOpen(true); };
  const waOnline  = waLink(data.wa.phoneOnline, `مرحباً، أودّ الاستفسار عن ${data.meta.title}`);
  const waConsult = waLink(data.wa.phoneOnline, `مرحباً، أودّ حجز استشارة تعليمية مجانية عن ${data.meta.title}`);
  const waCorp    = data.wa.phoneCorp ? waLink(data.wa.phoneCorp, `مرحباً، أودّ طلب عرض لفوج مؤسسي من ${data.meta.title}`) : '#';

  const isCoverHero = !!data.hero.heroBgSrc;

  return (
    <div dir="rtl" className="page-masar-canvas" style={{ fontFamily: F, color: OFF, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @keyframes mc-vu { 0%,100%{height:22%} 50%{height:100%} }
        @keyframes mc-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes kaseetSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .mc-vu-bar { width:3px; border-radius:2px; background:rgba(255,193,7,.85); animation:mc-vu 1.5s ease-in-out infinite; }
        .mc-live-dot { animation:mc-pulse 2s ease-in-out infinite; }
        .mc-spin-ring { animation:kaseetSpin 18s linear infinite; transform-origin:200px 200px; }
        .mc-spin-slow  { animation:kaseetSpin 32s linear infinite reverse; transform-origin:200px 200px; }
        .mc-arc { position:absolute; pointer-events:none; border-radius:50%; border:1px solid rgba(255,193,7,0.07); }
        .mc-kh-gallery { columns:3; column-gap:14px; }
        .mc-kh-gallery-item { break-inside:avoid; margin-bottom:14px; border-radius:14px; overflow:hidden; position:relative; }
        .mc-kh-gallery-item img { width:100%; height:auto; display:block; transition:transform .45s ease, filter .45s ease; filter:brightness(.88) saturate(.9); }
        .mc-kh-gallery-item:hover img { transform:scale(1.04); filter:brightness(1) saturate(1); }
        .mc-kh-gallery-item::after { content:''; position:absolute; inset:0; background:linear-gradient(to top, rgba(10,14,24,.55) 0%, transparent 55%); pointer-events:none; }
        @media (max-width:768px) {
          .mc-hero-grid { grid-template-columns:1fr !important; }
          .mc-hero-visual { max-width:270px !important; order:1; margin:28px auto 0 !important; }
          .mc-modes-grid { grid-template-columns:1fr !important; }
          .mc-acc-grid { grid-template-columns:1fr !important; }
          .mc-trainer-card { grid-template-columns:1fr !important; }
          .mc-trainer-photo { min-height:220px !important; }
          .mc-advisor-grid { grid-template-columns:1fr !important; }
          .mc-kh-gallery { columns:2; }
          .mc-hud { display:none !important; }
          .mc-hero-cta-row { flex-direction:column !important; }
          .mc-hero-cta-row a { width:100% !important; justify-content:center !important; }
        }
        @media (max-width:480px) { .mc-kh-gallery { columns:1; } }
        :focus-visible { outline:2px solid #FFC107 !important; outline-offset:3px !important; border-radius:4px !important; }
        @media (prefers-reduced-motion:reduce) { .mc-spin-ring,.mc-spin-slow { animation:none !important; } .mc-live-dot { animation:none !important; } }
      `}</style>

      {/* ── back nav (non-cover pages only) ───────────────── */}
      {!isCoverHero && (
        <div style={{ ...WRP, paddingTop: 94, paddingBottom: 0 }}>
          <button onClick={() => navigate('/')} aria-label="العودة إلى الدورات"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 13, color: MUT, padding: 0 }}>
            <ArrowLeft size={13} /> العودة إلى الدورات
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════
          01. HERO
      ═══════════════════════════════════ */}
      <section className="sec sec--hero" style={{
        position: 'relative',
        padding: isCoverHero ? '108px 0 clamp(80px,10vw,130px)' : '52px 0 88px',
        overflow: 'hidden',
        minHeight: isCoverHero ? 620 : undefined,
      }}>
        {/* cover bg */}
        {isCoverHero && data.hero.heroBgSrc && (
          <>
            <img src={data.hero.heroBgSrc} alt="" aria-hidden="true" fetchPriority="high" decoding="async"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 22%', zIndex: 0 }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(2,6,23,0.80) 0%, rgba(2,6,23,0.48) 40%, rgba(2,6,23,0.92) 100%)' }} />
            {/* arc decorations */}
            {[320, 500, 680].map((r, i) => (
              <div key={i} className="mc-arc" style={{ width: r, height: r, bottom: -r*0.4, left: '50%', transform: 'translateX(-50%)', opacity: 0.28 - i*0.08, zIndex: 2 }} />
            ))}
          </>
        )}

        {/* ── viewfinder HUD (elam only) ─────────────────── */}
        {isCoverHero && data.hero.useSpinningRing && (
          <div className="mc-hud" style={{ position: 'absolute', top: 72, left: 0, right: 0, zIndex: 5, padding: '0 clamp(16px,4vw,48px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.4, pointerEvents: 'none', direction: 'ltr' }}>
            {/* left: REC + resolution */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: FP, fontSize: 11, color: LT, letterSpacing: 1 }}>
              <span className="mc-live-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF3333', flexShrink: 0 }} />
              <span>REC</span>
              <span style={{ color: 'rgba(200,211,226,0.4)', marginInline: 2 }}>|</span>
              <span>1920×1080</span>
            </div>
            {/* center: timecode */}
            <div style={{ fontFamily: FP, fontSize: 13, color: LT, letterSpacing: 2 }}>00:00:08:15</div>
            {/* right: fps + focal + battery */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: FP, fontSize: 11, color: LT, letterSpacing: 1 }}>
              <span>50FPS</span>
              <span style={{ color: 'rgba(200,211,226,0.4)', marginInline: 2 }}>|</span>
              <span>35mm</span>
              <span style={{ color: 'rgba(200,211,226,0.4)', marginInline: 2 }}>|</span>
              <svg width="20" height="11" viewBox="0 0 22 12" fill="none"><rect x=".5" y=".5" width="18" height="11" rx="2.5" stroke="currentColor" strokeOpacity=".7"/><rect x="2" y="2" width="12" height="8" rx="1.5" fill="currentColor" fillOpacity=".6"/><path d="M19.5 4.5v3" stroke="currentColor" strokeOpacity=".7" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span>78%</span>
            </div>
          </div>
        )}

        <div style={{ position: 'relative', zIndex: 3, ...WRP }}>
          {/* breadcrumbs (cover-hero pages) — 24px below HUD, pinned right */}
          {isCoverHero && (
            <div style={{ marginBottom: 20, marginTop: 24, direction: 'rtl', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 0 }}>
              <button onClick={() => navigate('/')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: F, fontSize: 12.5, color: 'rgba(180,190,210,0.7)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <ArrowLeft size={10} style={{ opacity: 0.6 }} />
                الرئيسية
              </button>
              <span style={{ color: 'rgba(180,190,210,0.3)', marginInline: 7, fontSize: 12 }}>/</span>
              <span style={{ fontFamily: F, fontSize: 12.5, color: 'rgba(180,190,210,0.55)' }}>الماستركلاسات</span>
              <span style={{ color: 'rgba(180,190,210,0.3)', marginInline: 7, fontSize: 12 }}>/</span>
              <span style={{ fontFamily: F, fontSize: 12.5, color: 'rgba(180,190,210,0.38)' }}>{data.meta.title}</span>
            </div>
          )}

          <div className="mc-hero-grid" style={{ display: 'grid', gridTemplateColumns: (data.hero.heroCardSrc || data.hero.useSpinningRing) ? '1.12fr .88fr' : '1fr', gap: 52, alignItems: 'center' }}>

            {/* text column */}
            <div>
              {/* audience tags — elam */}
              {data.hero.audienceTags && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 18 }}>
                  {data.hero.audienceTags.map(tag => (
                    <span key={tag} style={{ fontFamily: F, fontSize: 11.5, color: LT, background: 'rgba(255,255,255,.07)', border: `1px solid ${CBR}`, padding: '4px 12px', borderRadius: 999 }}>{tag}</span>
                  ))}
                </div>
              )}
              {/* chip badge — hide when audienceTags are present (elam) */}
              {!data.hero.audienceTags && <GoldChip text={data.hero.chip} outline />}

              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(34px,5vw,60px)', lineHeight: 1.22, letterSpacing: -1.2, margin: '18px 0 0', color: OFF, maxWidth: 720 }}>
                {data.hero.h1Line1}<br />
                <span style={{ color: GLD }}>{data.hero.h1GoldLine}</span>
                {data.hero.h1Line3 && <><br />{data.hero.h1Line3}</>}
              </h1>

              <p style={{
                fontFamily: F, fontSize: isCoverHero ? 16.5 : 17, color: MUT,
                maxWidth: 560, marginTop: 16, lineHeight: 1.85,
                ...(isCoverHero ? { background: 'rgba(2,6,23,.50)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: '16px 20px', marginBottom: 24 } : {}),
              }}>
                {data.hero.desc}
              </p>

              {/* stats — voice only */}
              {data.hero.statsEnabled && data.hero.stats && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28 }}>
                  {data.hero.stats.map(({ num, label }) => (
                    <div key={label} style={{ background: 'rgba(255,255,255,.045)', border: `1px solid ${CBR}`, borderRadius: 12, padding: '10px 16px', textAlign: 'center', minWidth: 80 }}>
                      <div style={{ fontFamily: FP, fontSize: 24, fontWeight: 700, color: GLD, lineHeight: 1 }}>{num}</div>
                      <div style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* mode chip */}
              {!isCoverHero && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, fontFamily: F, fontSize: 13.5, color: LT }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD, flexShrink: 0 }} />
                  {data.hero.modeChip}
                </div>
              )}

              {/* fact chips for cover hero — data-driven */}
              {isCoverHero && !data.hero.statsEnabled && !data.hero.useSpinningRing && data.hero.factChips && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
                  {data.hero.factChips.map(text => (
                    <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(2,6,23,.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: `1px solid ${CBR}`, fontFamily: F, fontSize: 13, color: LT, padding: '8px 14px', borderRadius: 10 }}>
                      {text}
                    </span>
                  ))}
                </div>
              )}

              {/* spinning ring stats for elam — 2×2 grid with dedicated icons */}
              {data.hero.useSpinningRing && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10, marginTop: 32, maxWidth: 500 }}>
                  {([
                    { Icon: Layers,      num: '10', label: 'محطات تدريبية متسلسلة' },
                    { Icon: Clock,       num: '40', label: 'ساعة تدريبية موزَّعة'  },
                    { Icon: FolderCheck, num: '8',  label: 'مشاريع تطبيقية تُسلَّم' },
                    { Icon: MapPin,      num: null, label: 'حضوري أو مباشر تفاعلي (Online LIVE)' },
                  ] as const).map(({ Icon, num, label }, i) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(2,6,23,0.60)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '11px 14px', borderRadius: 11, fontFamily: F, fontSize: 13, color: LT }}>
                      <Icon size={15} color={GLD} strokeWidth={1.8} style={{ flexShrink: 0 }} />
                      {num && <b style={{ fontFamily: FP, color: OFF, fontWeight: 700 }}>{num}</b>}
                      {label}
                    </span>
                  ))}
                </div>
              )}

              {/* wajeez chip */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: isCoverHero ? 10 : 13, marginTop: 22, background: isCoverHero ? 'rgba(2,6,23,.60)' : `${TEAL}0.16)`, backdropFilter: isCoverHero ? 'blur(10px)' : 'none', WebkitBackdropFilter: isCoverHero ? 'blur(10px)' : 'none', border: `1px solid ${isCoverHero ? CBR : `${TEAL}0.48)`}`, borderRadius: 14, padding: '11px 16px 11px 13px', marginBottom: isCoverHero ? 28 : 0 }}>
                <div style={{ flexShrink: 0, width: isCoverHero ? 38 : 40, height: isCoverHero ? 38 : 40, borderRadius: 9, background: '#fff', display: 'grid', placeContent: 'center', padding: 5 }}>
                  <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <span style={{ fontFamily: F, fontSize: 13, color: MUT, lineHeight: 1.5 }}>
                  <strong style={{ color: OFF, display: 'block' }}>شهادة معتمدة من تطبيق وجيز</strong>
                  {data.hero.wajeezSubtitle}
                </span>
              </div>

              {/* CTAs */}
              <div className="mc-hero-cta-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
                <a href={data.hero.ctaEnrollIsWa ? waOnline : '#enroll'}
                  onClick={data.hero.ctaEnrollIsWa ? undefined : openModal}
                  target={data.hero.ctaEnrollIsWa ? '_blank' : undefined}
                  rel={data.hero.ctaEnrollIsWa ? 'noopener noreferrer' : undefined}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '13px 26px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 6px 20px rgba(255,193,7,.22)', justifyContent: 'center' }}>
                  {data.hero.ctaEnrollIsWa && (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  )}
                  {data.hero.ctaEnroll}
                  {!data.hero.ctaEnrollIsWa && <ArrowLeft size={14} />}
                </a>
                <a href={data.hero.ctaExploreHref}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: isCoverHero ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.05)', backdropFilter: isCoverHero ? 'blur(8px)' : 'none', WebkitBackdropFilter: isCoverHero ? 'blur(8px)' : 'none', border: '1px solid rgba(255,255,255,.18)', color: OFF, fontFamily: F, fontWeight: 700, fontSize: 15, padding: '13px 26px', borderRadius: 12, textDecoration: 'none', justifyContent: 'center' }}>
                  {data.hero.ctaExplore} <ArrowLeft size={14} />
                </a>
              </div>
            </div>

            {/* visual column */}
            {data.hero.heroCardSrc && (
              <div className="mc-hero-visual" style={{ position: 'relative', maxWidth: 380, marginInline: 'auto', width: '100%' }}>
                <div style={{ position: 'absolute', inset: '-14% -10% -8%', borderRadius: 40, background: 'radial-gradient(ellipse at 50% 40%, rgba(255,193,7,.22), transparent 68%)', filter: 'blur(8px)', zIndex: -1 }} />
                <div style={{ position: 'relative', borderRadius: 26, overflow: 'hidden', border: `1px solid ${GL}`, aspectRatio: '3/4', boxShadow: '0 34px 90px rgba(0,0,0,.5)' }}>
                  <img src={data.hero.heroCardSrc} alt={data.meta.title} fetchPriority="high"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: data.hero.heroCardPosition || '50% 20%', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,37,51,.95) 0%, rgba(26,37,51,.32) 30%, transparent 58%)' }} />
                  <span style={{ position: 'absolute', top: 18, right: 18, zIndex: 3, display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(26,37,51,.74)', backdropFilter: 'blur(6px)', border: `1px solid ${GL}`, color: GLD, fontSize: 11.5, fontWeight: 700, fontFamily: F, padding: '7px 13px', borderRadius: 999 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: GLD }} /> تسجيل داخل استوديو كاسيت
                  </span>
                  <div style={{ position: 'absolute', inset: 'auto 0 0 0', zIndex: 3, padding: '22px 22px 24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                      <span style={{ fontFamily: FP, fontSize: 38, fontWeight: 700, color: GLD, lineHeight: .95 }}>44</span>
                      <span style={{ fontFamily: F, fontSize: 12.5, color: LT, marginTop: 4, display: 'block' }}>ساعة · 13 مخرجاً صوتياً</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 34 }}>
                      {Array.from({ length: 9 }, (_, i) => (
                        <span key={i} className="mc-vu-bar" style={{ animationDelay: `${i * 0.11}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* spinning SVG ring — elam */}
            {data.hero.useSpinningRing && (
              <div className="mc-hero-visual" style={{ position: 'relative', aspectRatio: '1', maxWidth: 400, width: '100%', marginInline: 'auto' }}>
                {/* dark radial shadow behind ring so gold arc doesn't clash with presenter */}
                <div style={{ position: 'absolute', inset: '-8%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(2,6,23,0.78) 0%, rgba(2,6,23,0.50) 52%, transparent 72%)', zIndex: 0, pointerEvents: 'none' }} />
                <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', display: 'block', position: 'relative', zIndex: 1 }}>
                  <circle cx="200" cy="200" r="186" fill="none" stroke="rgba(255,255,255,0.05)" />
                  <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.04)" />
                  <g className="mc-spin-ring">
                    <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(255,193,7,0.90)" strokeWidth="3" strokeLinecap="round" strokeDasharray="300 1056" transform="rotate(-90 200 200)" />
                    <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(255,193,7,0.40)" strokeWidth="3" strokeLinecap="round" strokeDasharray="380 1056" strokeDashoffset="-330" transform="rotate(-90 200 200)" />
                    <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" strokeLinecap="round" strokeDasharray="150 1056" strokeDashoffset="-740" transform="rotate(-90 200 200)" />
                    <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(30,122,133,0.90)" strokeWidth="3" strokeLinecap="round" strokeDasharray="120 1056" strokeDashoffset="-910" transform="rotate(-90 200 200)" />
                    <circle cx="200" cy="32"  r="6" fill={GLD} />
                    <circle cx="352" cy="268" r="6" fill={GLD} />
                    <circle cx="66"  cy="286" r="6" fill="#1E7A85" />
                  </g>
                  <g className="mc-spin-slow">
                    <circle cx="200" cy="200" r="186" fill="none" stroke="rgba(255,193,7,0.06)" strokeWidth="1" strokeDasharray="12 20" />
                  </g>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeContent: 'center', textAlign: 'center', zIndex: 2 }}>
                  <div style={{ fontFamily: FP, fontSize: 72, fontWeight: 800, color: OFF, lineHeight: 1 }}>{data.curriculum.stations.length}</div>
                  <div style={{ fontFamily: F, fontSize: 15, color: MUT, marginTop: 6 }}>محطات</div>
                  <div style={{ width: 36, height: 1, background: 'rgba(255,193,7,0.35)', margin: '12px auto' }} />
                  <div style={{ fontFamily: F, fontSize: 12.5, color: LT, letterSpacing: 0.5 }}>تأسيس · تخصيص · قيادة</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          01-B. AUDIENCE (elam + khataba)
      ═══════════════════════════════════ */}
      {data.audience && (
        <section className="sec sec--audience" style={{ padding: '80px 0', background: '#0B1628' }}>
          <div style={WRP}>
            <div style={{ textAlign: 'center', marginBottom: 44, direction: 'rtl' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206' }} />
                {data.audience.badge}
              </span>
              <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(22px,3.4vw,36px)', lineHeight: 1.5, margin: '16px 0 0', color: OFF, maxWidth: 700, marginInline: 'auto' }}>
                {data.audience.heading}
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, maxWidth: 960, marginInline: 'auto' }}>
              {data.audience.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 14, padding: '16px 18px' }}>
                  <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 12, display: 'grid', placeContent: 'center' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: F, fontSize: 14.5, color: LT, lineHeight: 1.75 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          01-C. METHOD (elam — right after audience)
      ═══════════════════════════════════ */}
      {data.method && data.slug === 'masar-elami' && (
        <section className="sec sec--method" style={{ padding: '80px 0' }}>
          <div style={WRP}>
            <SectionHead badge={data.method.badge} heading={data.method.heading} headingGold={data.method.headingGold} sub={data.method.lead} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginTop: 48 }}>
              {data.method.items.map((item, i) => (
                <div key={i} style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 18, padding: '26px 22px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', marginBottom: 14 }}>
                    <span style={{ fontFamily: FP, fontSize: 13, fontWeight: 700, color: GLD }}>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 17, color: OFF, marginBottom: 8, lineHeight: 1.4 }}>{item.title}</h4>
                  <p style={{ fontFamily: F, fontSize: 13.5, color: MUT, lineHeight: 1.8, margin: 0 }}>{item.body}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18, background: `linear-gradient(135deg, ${GS}, rgba(255,193,7,0.04) 60%)`, border: `1px solid ${GL}`, borderRadius: 18, padding: '24px 26px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <span style={{ flexShrink: 0, fontFamily: FP, fontSize: 22, color: GLD }}>★</span>
              <div>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GLD, marginBottom: 6 }}>{data.method.finalOutput.title}</div>
                <p style={{ fontFamily: F, fontSize: 14, color: LT, lineHeight: 1.8, margin: 0 }}>{data.method.finalOutput.body}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          01-D. OUTCOMES/ACQUISITIONS (khataba — before curriculum)
      ═══════════════════════════════════ */}
      {data.outcomes.acquisitions && (
        <section className="sec sec--acq" style={{ padding: '80px 0', background: '#0B1628' }}>
          <div style={WRP}>
            <SectionHead badge={data.outcomes.badge} heading={data.outcomes.heading} headingGold={data.outcomes.headingGold} sub={data.outcomes.desc} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginTop: 48 }}>
              {data.outcomes.items.map((oc, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 18, padding: '26px 22px' }}>
                  <div style={{ width: 10, height: 3, background: GLD, borderRadius: 2, marginBottom: 16 }} />
                  <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 17, lineHeight: 1.4, color: OFF, marginBottom: 10 }}>{oc.title}</h4>
                  <p style={{ fontFamily: F, fontSize: 14, color: MUT, lineHeight: 1.8, margin: 0 }}>{oc.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <a href="#enroll" onClick={openModal}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 8px 24px rgba(255,193,7,.24)' }}>
                احجز مقعدك الآن <ArrowLeft size={14} />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          02. CURRICULUM (station tree)
      ═══════════════════════════════════ */}
      <section id="tree" className="sec sec--tree" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={{ textAlign: 'center', marginBottom: 52, direction: 'rtl' }}>
            <GoldChip text="منهج الماستركلاس" outline />
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, letterSpacing: -.5, margin: '18px 0 0', color: OFF }}>
              {data.curriculum.sectionHeading} <span style={{ color: GLD }}>{data.curriculum.sectionHeadingGold}</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: MUT, maxWidth: 680, marginTop: 14, marginInline: 'auto', lineHeight: 1.8 }}>{data.curriculum.sectionDesc}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 900, margin: '0 auto 18px' }}>
            <button onClick={handleExpandAll}
              style={{ background: CARD, border: `1px solid ${CBR}`, color: MUT, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '9px 18px', borderRadius: 999, cursor: 'pointer' }}>
              {expandAll ? 'إغلاق جميع المحاور' : 'فتح جميع المحاور'}
            </button>
          </div>

          {data.curriculum.phaseBands.map(band => (
            <div key={band.label} style={{ maxWidth: 900, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '4px 0', margin: '18px 0 12px' }}>
                <div style={{ flex: 1, height: 1, background: CBR }} />
                <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: MUT, whiteSpace: 'nowrap' }}>
                  {band.label} · <span style={{ color: band.color }}>{band.sub}</span>
                </span>
                <div style={{ flex: 1, height: 1, background: CBR }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.curriculum.stations.slice(band.from, band.to).map((st, localI) => {
                  const gi = band.from + localI;
                  return <StationRow key={st.n} st={st} open={isOpen(gi)} onToggle={() => toggle(gi)} />;
                })}
              </div>
            </div>
          ))}

          {/* graduation project */}
          {data.curriculum.gradProject.steps.length > 0 ? (
            <div style={{ maxWidth: 900, margin: '32px auto 0', background: `linear-gradient(160deg, rgba(255,193,7,.16), ${CARD} 54%)`, border: `1px solid ${GLD}`, borderRadius: 20, padding: '32px 30px', boxShadow: `0 0 0 1px rgba(255,193,7,.18), 0 26px 70px rgba(0,0,0,.4)` }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
                <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 15, background: GLD, color: '#1A1206', display: 'grid', placeContent: 'center', fontSize: 22, boxShadow: '0 10px 26px rgba(255,193,7,.32)' }}>★</div>
                  <div>
                    <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 22, lineHeight: 1.4, margin: 0, color: OFF }}>{data.curriculum.gradProject.title}</h3>
                    <p style={{ fontFamily: F, fontSize: 14, color: LT, marginTop: 8, maxWidth: 540, lineHeight: 1.8 }}>{data.curriculum.gradProject.desc}</p>
                  </div>
                </div>
                <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: GLD, background: 'rgba(0,0,0,.3)', border: `1px solid ${GL}`, padding: '7px 14px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {data.curriculum.gradProject.label}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {data.curriculum.gradProject.steps.map(({ n, t, d }) => (
                  <div key={n} style={{ background: 'rgba(0,0,0,.24)', border: `1px solid ${CBR}`, borderRadius: 14, padding: '16px 15px' }}>
                    <div style={{ fontFamily: FP, fontSize: 11.5, fontWeight: 700, color: GLD, letterSpacing: 1, marginBottom: 6 }}>الجلسة {n}</div>
                    <div style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, marginBottom: 6, color: OFF }}>{t}</div>
                    <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, lineHeight: 1.7 }}>{d}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: F, fontSize: 14, color: LT, marginTop: 20, lineHeight: 1.8 }}>
                <strong style={{ color: GLD }}>{data.curriculum.gradProject.outputTitle}:</strong> {data.curriculum.gradProject.outputText}
              </p>
            </div>
          ) : (
            /* elam: wajeez badge instead */
            <div style={{ maxWidth: 900, margin: '32px auto 0', border: '1px solid rgba(30,122,133,0.40)', borderRadius: 16, background: 'linear-gradient(160deg,rgba(30,122,133,0.14), rgba(11,17,32,0.8) 60%)', padding: '26px 24px', display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ width: 54, height: 54, borderRadius: 12, background: '#fff', display: 'grid', placeContent: 'center', padding: 7, flexShrink: 0 }}>
                  <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: OFF, margin: 0 }}>{data.curriculum.gradProject.title}</h4>
                  <p style={{ fontFamily: F, fontSize: 13, color: MUT, marginTop: 3 }}>{data.curriculum.gradProject.desc}</p>
                </div>
              </div>
              <a href="#enroll" onClick={openModal}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 700, fontSize: 13.5, padding: '11px 22px', borderRadius: 12, textDecoration: 'none' }}>
                التسجيل في المسار <ArrowLeft size={13} />
              </a>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 34 }}>
            <a href="#enroll" onClick={openModal}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15.5, padding: '14px 30px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,193,7,.24)' }}>
              احجز مقعدك في الفوج القادم <ArrowLeft size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          03. PORTFOLIO (optional)
      ═══════════════════════════════════ */}
      {data.portfolio && (
        <section className="sec sec--album" style={{ padding: '96px 0', background: '#F5F4F0' }}>
          <div style={WRP}>
            <SectionHead dark badge={data.portfolio.badge} heading={data.portfolio.heading} headingGold={data.portfolio.headingGold} sub={data.portfolio.desc} />

            <div style={{ maxWidth: 760, margin: '0 auto', background: '#fff', borderRadius: 22, boxShadow: '0 22px 60px rgba(24,32,47,.12)', overflow: 'hidden', border: '1px solid rgba(24,32,47,.10)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid rgba(24,32,47,.10)' }}>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: '#374151' }}>{data.portfolio.tableHeader}</div>
                <span style={{ background: '#8A6200', color: '#fff', fontFamily: FP, fontSize: 12, fontWeight: 800, padding: '4px 14px', borderRadius: 999 }}>{data.portfolio.tableCount}</span>
              </div>
              {data.portfolio.items.map((item, i) => (
                <div key={item.n} style={{ display: 'grid', gridTemplateColumns: '44px 1fr 108px 130px', gap: 14, alignItems: 'center', padding: '13px 28px', borderBottom: '1px solid rgba(24,32,47,.08)', background: item.hot ? 'rgba(255,193,7,.07)' : 'transparent' }}>
                  <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 12.5, color: item.hot ? '#8A6200' : INK2 }}>{item.n}</span>
                  <span style={{ fontFamily: F, fontSize: 14, fontWeight: item.hot ? 700 : 400, color: item.hot ? '#8A6200' : INK, lineHeight: 1.5 }}>
                    {item.title}
                    {item.hot && <span style={{ marginInlineStart: 8, background: '#8A6200', color: '#fff', fontSize: 10, fontWeight: 800, padding: '1px 7px', borderRadius: 999 }}>★ ذهبي</span>}
                  </span>
                  <span style={{ fontFamily: F, fontSize: 11.5, color: INK2, border: '1px solid rgba(24,32,47,.10)', background: 'rgba(24,32,47,.035)', padding: '3px 11px', borderRadius: 999, textAlign: 'center', whiteSpace: 'nowrap' }}>{item.kind}</span>
                  <span style={{ color: item.hot ? 'rgba(138,98,0,.78)' : 'rgba(138,98,0,.34)', height: 26, display: 'block' }}
                    dangerouslySetInnerHTML={{ __html: waveThumb(50 + i) }} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 108px 130px', gap: 14, alignItems: 'center', padding: '14px 28px', background: 'linear-gradient(90deg, rgba(255,193,7,.18), rgba(255,193,7,.06))', borderTop: '1px solid rgba(138,98,0,.28)' }}>
                <span style={{ fontFamily: FP, fontSize: 14, fontWeight: 700, color: '#8A6200' }}>★</span>
                <span style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: '#8A6200' }}>{data.portfolio.gradRow.title}</span>
                <span style={{ fontFamily: F, fontSize: 11.5, color: '#8A6200', border: '1px solid rgba(138,98,0,.32)', background: 'rgba(138,98,0,.08)', padding: '3px 11px', borderRadius: 999, textAlign: 'center' }}>{data.portfolio.gradRow.kind}</span>
                <span style={{ color: 'rgba(138,98,0,.9)', height: 26, display: 'block' }}
                  dangerouslySetInnerHTML={{ __html: waveThumb(999) }} />
              </div>
              <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(24,32,47,.10)', fontFamily: F, fontSize: 13.5, color: '#6B7280', lineHeight: 1.85 }}>
                <strong style={{ color: INK }}>الأعمال المميّزة بالذهبي</strong> — {data.portfolio.footerNote}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          03-B. METHOD (khataba — after portfolio)
      ═══════════════════════════════════ */}
      {data.method && data.slug === 'masar-khataba' && (
        <section className="sec sec--method" style={{ padding: '80px 0' }}>
          <div style={WRP}>
            <SectionHead badge={data.method.badge} heading={data.method.heading} headingGold={data.method.headingGold} sub={data.method.lead} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginTop: 48 }}>
              {data.method.items.map((item, i) => (
                <div key={i} style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 18, padding: '26px 22px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', marginBottom: 14 }}>
                    <span style={{ fontFamily: FP, fontSize: 13, fontWeight: 700, color: GLD }}>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 17, color: OFF, marginBottom: 8, lineHeight: 1.4 }}>{item.title}</h4>
                  <p style={{ fontFamily: F, fontSize: 13.5, color: MUT, lineHeight: 1.8, margin: 0 }}>{item.body}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18, background: `linear-gradient(135deg, ${GS}, rgba(255,193,7,0.04) 60%)`, border: `1px solid ${GL}`, borderRadius: 18, padding: '24px 26px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <span style={{ flexShrink: 0, fontFamily: FP, fontSize: 22, color: GLD }}>★</span>
              <div>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GLD, marginBottom: 6 }}>{data.method.finalOutput.title}</div>
                <p style={{ fontFamily: F, fontSize: 14, color: LT, lineHeight: 1.8, margin: 0 }}>{data.method.finalOutput.body}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          04. WAJEEZ (optional)
      ═══════════════════════════════════ */}
      {data.wajeez && (
        <section className="sec sec--wajeez" style={{ padding: '96px 0' }}>
          <div style={WRP}>
            <div style={{ border: '1px solid rgba(30,122,133,.48)', borderRadius: 26, background: 'linear-gradient(150deg, rgba(30,122,133,.24), rgba(0,0,0,.18) 56%)', padding: 'clamp(28px,3.5vw,44px)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22, alignItems: 'center', marginBottom: 32 }}>
                <div style={{ flexShrink: 0, width: 72, height: 72, borderRadius: 15, background: '#fff', display: 'grid', placeContent: 'center', padding: 9 }}>
                  <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(22px,3.2vw,34px)', lineHeight: 1.35, margin: 0, color: OFF }}>
                    {data.wajeez.heading} <span style={{ color: '#8FDAE3' }}>{data.wajeez.headingGold}</span>
                  </h2>
                  <p style={{ fontFamily: F, fontSize: 15, color: MUT, marginTop: 8, maxWidth: 540 }}>{data.wajeez.desc}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                {data.wajeez.steps.map(({ n, t, d }) => (
                  <div key={n} style={{ background: 'rgba(255,255,255,.05)', border: `1px solid ${CBR}`, borderRadius: 14, padding: '22px 20px' }}>
                    <div style={{ fontFamily: FP, fontSize: 12, fontWeight: 700, color: '#8FDAE3', letterSpacing: 1.2, marginBottom: 8 }}>{n}</div>
                    <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 17, marginBottom: 8, color: OFF, lineHeight: 1.5 }}>{t}</h4>
                    <p style={{ fontFamily: F, fontSize: 13.5, color: MUT, lineHeight: 1.75 }}>{d}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: F, fontSize: 13, color: MUT, borderTop: `1px solid ${CBR}`, paddingTop: 20, marginTop: 24, lineHeight: 1.8 }}>
                {data.wajeez.disclaimer}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          05. OUTCOMES (numbered — voice + elam; skip khataba which rendered earlier)
      ═══════════════════════════════════ */}
      {!data.outcomes.acquisitions && (
        <section className="sec sec--out" style={{ padding: '96px 0' }}>
          <div style={WRP}>
            <SectionHead badge={data.outcomes.badge} heading={data.outcomes.heading} headingGold={data.outcomes.headingGold} sub={data.outcomes.desc} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginTop: 52 }}>
              {data.outcomes.items.map(oc => (
                <div key={oc.n} style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 18, padding: '30px 26px' }}>
                  <span style={{ display: 'block', fontFamily: FP, fontSize: 44, fontWeight: 700, lineHeight: 1, color: GLD, opacity: .28 }}>{oc.n}</span>
                  <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${CBR}`, position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 32, height: 3, background: GLD, borderRadius: 2 }} />
                    <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 18, lineHeight: 1.5, color: OFF, marginBottom: 10 }}>{oc.title}</h4>
                    <p style={{ fontFamily: F, fontSize: 14, color: MUT, lineHeight: 1.8 }}>{oc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 34 }}>
              <a href="#enroll" onClick={openModal}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 8px 24px rgba(255,193,7,.24)' }}>
                احجز مقعدك الآن <ArrowLeft size={14} />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          06. TRAINERS
      ═══════════════════════════════════ */}
      <section id="trainers" className="sec sec--trainers" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <SectionHead badge={data.trainers.badge} heading={data.trainers.heading} headingGold={data.trainers.headingGold} sub={data.trainers.sub} />

          {data.slug === 'masar-elami' ? (
            /* elam: large landscape trainer cards */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 900, marginInline: 'auto' }}>
              {data.trainers.items.map((tr, idx) => {
                const accent = idx === 0 ? GLD : '#67e8f9';
                const accentBg = idx === 0 ? `linear-gradient(135deg, rgba(255,193,7,0.04), rgba(255,255,255,0.025) 60%)` : `linear-gradient(135deg, rgba(103,232,249,0.04), rgba(255,255,255,0.020) 60%)`;
                const accentBdr = idx === 0 ? GL : 'rgba(103,232,249,0.20)';
                return (
                  <div key={tr.name} className="mc-trainer-card" style={{ background: accentBg, border: `1px solid ${accentBdr}`, borderRadius: 22, overflow: 'hidden', display: 'grid', gridTemplateColumns: 'minmax(0,290px) 1fr' }}>
                    <div className="mc-trainer-photo" style={{ position: 'relative', minHeight: 300, background: '#050810', overflow: 'hidden' }}>
                      <img src={tr.imgSrc} alt={tr.name} loading="lazy" decoding="async"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: tr.imgPosition || 'center top', display: 'block', position: 'absolute', inset: 0 }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(8,13,23,0.85) 0%, transparent 55%)' }} />
                    </div>
                    <div style={{ padding: '32px 32px 28px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: idx === 0 ? GS : 'rgba(103,232,249,0.07)', border: `1px solid ${accentBdr}`, borderRadius: 999, padding: '4px 13px', marginBottom: 12, alignSelf: 'flex-start' }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: accent }} />
                        <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: accent }}>{tr.role}</span>
                      </div>
                      <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.2vw,28px)', color: OFF, margin: '0 0 8px' }}>{tr.name}</h3>
                      <p style={{ fontFamily: F, fontSize: 14, color: MUT, lineHeight: 1.85, marginBottom: 20 }}>{tr.bio}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                        {tr.chips.map(c => (
                          <span key={c} style={{ fontFamily: F, fontSize: 12, color: accent, background: idx === 0 ? GS : 'rgba(103,232,249,0.07)', border: `1px solid ${accentBdr}`, borderRadius: 999, padding: '4px 12px' }}>{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* voice & khataba: standard grid cards */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 52 }}>
              {data.trainers.items.map(tr => (
                <article key={tr.name} style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: 'clamp(22px,2.5vw,30px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 88, height: 88, borderRadius: '50%', flexShrink: 0, border: '2px solid rgba(255,193,7,.32)', overflow: 'hidden' }}>
                      <img src={tr.imgSrc} alt={tr.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: tr.imgPosition || 'center top' }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: OFF }}>{tr.name}</div>
                      <div style={{ fontFamily: F, fontSize: 12.5, color: GLD, marginTop: 4, lineHeight: 1.5 }}>{tr.role}</div>
                    </div>
                  </div>
                  <p style={{ fontFamily: F, fontSize: 13.5, color: MUT, lineHeight: 1.85, flex: 1 }}>{tr.bio}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {tr.chips.map(c => (
                      <span key={c} style={{ fontFamily: F, fontSize: 12, color: LT, background: 'rgba(255,255,255,.04)', border: `1px solid ${CBR}`, padding: '4px 11px', borderRadius: 999 }}>{c}</span>
                    ))}
                  </div>
                  {tr.tag && (
                    <div style={{ fontFamily: F, fontSize: 12, color: MUT, paddingTop: 10, borderTop: `1px solid ${CBR}` }}>{tr.tag}</div>
                  )}
                </article>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 34 }}>
            <a href={waConsult} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: CARD, color: OFF, border: `1px solid ${CBR}`, fontFamily: F, fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 999, textDecoration: 'none' }}>
              اسأل عن جدول المدرّبين <ArrowLeft size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          07. GALLERY (optional — khataba)
      ═══════════════════════════════════ */}
      {data.gallery && (
        <section className="sec sec--gallery" style={{ padding: '96px 0' }}>
          <div style={WRP}>
            <SectionHead badge={data.gallery.badge} heading={data.gallery.heading} headingGold={data.gallery.headingGold} sub={data.gallery.desc} />
            <div className="mc-kh-gallery">
              {data.gallery.items.map(({ src, alt }, i) => (
                <div key={i} className="mc-kh-gallery-item">
                  <img src={src} alt={alt} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          08. STUDY MODES
      ═══════════════════════════════════ */}
      <section className="sec sec--modes" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <SectionHead badge={data.modes.badge} heading={data.modes.heading} headingGold={data.modes.headingGold} sub={data.modes.desc} />

          <div className="mc-modes-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 52 }}>
            {[
              { v: 'inperson' as const, m: data.modes.inperson, ac: GLD, acRgb: '255,193,7', icon: <MapPin size={18} color="#1A1206" strokeWidth={2.2} /> },
              { v: 'online'   as const, m: data.modes.online,   ac: '#67e8f9', acRgb: '103,232,249', icon: <Wifi size={18} color="#1A1206" strokeWidth={2.2} /> },
            ].map(({ v, m, ac, acRgb, icon }) => (
              <div key={v} style={{ background: CARD, border: `1px solid rgba(${acRgb},.22)`, borderRadius: 20, padding: 'clamp(22px,2.5vw,28px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: ac, display: 'grid', placeContent: 'center', flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15.5, color: OFF }}>{m.label}</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 2 }}>{m.sub}</div>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', display: 'grid', gap: 9, margin: 0, padding: 0 }}>
                  {m.items.map(item => (
                    <li key={item} style={{ display: 'flex', gap: 10, fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.7 }}>
                      <span style={{ color: ac, fontSize: 14, marginTop: 3, flexShrink: 0 }}>✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18 }}>
            <StudyAccordion variant="inperson" label={data.modes.inperson.label} sub={data.modes.inperson.sub} items={data.modes.inperson.details} />
            <StudyAccordion variant="online"   label={data.modes.online.label}   sub={data.modes.online.sub}   items={data.modes.online.details} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          09. PRICING
      ═══════════════════════════════════ */}
      <section id="pricing" className="sec sec--access" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <SectionHead badge={data.pricing.badge} heading={data.pricing.heading} headingGold={data.pricing.headingGold} />

          <div style={{ maxWidth: 620, margin: '48px auto 0', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -2, background: 'linear-gradient(135deg, rgba(255,193,7,0.18), rgba(103,232,249,0.08))', borderRadius: 28, filter: 'blur(18px)', opacity: 0.6, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', background: '#131B27', border: '1px solid rgba(255,193,7,.55)', borderRadius: 24, padding: 'clamp(26px,4vw,40px)', boxShadow: '0 0 0 1px rgba(255,193,7,.20), inset 0 1px 0 rgba(255,193,7,.10), 0 34px 70px rgba(24,32,47,.28)' }}>
              {data.pricing.topBadge && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 12, padding: '5px 18px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(255,193,7,0.28)' }}>
                  {data.pricing.topBadge}
                </div>
              )}
              <div style={{ textAlign: 'center', paddingBottom: 24, borderBottom: `1px solid ${CBR}`, paddingTop: data.pricing.topBadge ? 10 : 0 }}>
                <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 21, color: OFF }}>{data.pricing.cardTitle}</h3>
                <p style={{ fontFamily: F, fontSize: 13, color: MUT, marginTop: 6, lineHeight: 1.65 }}>{data.pricing.cardDesc}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 28, margin: '20px 0 0', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: FP, fontSize: 48, fontWeight: 700, color: GLD, lineHeight: 1, display: 'block' }}>{data.pricing.priceJOD}</span>
                    <span style={{ fontFamily: F, fontSize: 13, color: MUT, display: 'block', marginTop: 4 }}>JOD · حضوري عمّان</span>
                  </div>
                  <div style={{ width: 1, height: 52, background: CBR, flexShrink: 0 }} />
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: FP, fontSize: 48, fontWeight: 700, color: GLD, lineHeight: 1, display: 'block' }}>{data.pricing.priceUSD}</span>
                    <span style={{ fontFamily: F, fontSize: 13, color: MUT, display: 'block', marginTop: 4 }}>USD · مباشر تفاعلي (Online LIVE)</span>
                  </div>
                </div>
                {data.pricing.showPerHourLine && (
                  <p style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 8 }}>
                    ما يعادل <span style={{ fontFamily: FP, color: LT, fontWeight: 700 }}>${data.pricing.equivalentUSD}</span> USD — أقلّ من <span style={{ fontFamily: FP, color: LT, fontWeight: 700 }}>17$</span> للساعة التدريبية
                  </p>
                )}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, background: GS, border: `1px solid ${GL}`, borderRadius: 12, padding: '9px 15px' }}>
                  <span className="mc-live-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: GLD, flexShrink: 0 }} />
                  <span style={{ fontFamily: F, fontSize: 13, color: LT }}>
                    التقسيط متاح · <b style={{ color: GLD, fontFamily: FP }}>{data.pricing.installments[0]} د.أ</b> تُثبَّت مقعدك
                  </span>
                </div>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 13, padding: '24px 0', margin: 0 }}>
                {data.pricing.features.map(feat => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, fontFamily: F, fontSize: 14, color: LT, lineHeight: 1.65 }}>
                    <span style={{ color: GLD, fontWeight: 800, flexShrink: 0 }}>✓</span> {feat}
                  </li>
                ))}
              </ul>
              <a href="#enroll" onClick={openModal}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', boxSizing: 'border-box', background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 24px', borderRadius: 14, textDecoration: 'none', boxShadow: '0 6px 22px rgba(255,193,7,0.20)' }}>
                {data.pricing.ctaLabel} <ArrowLeft size={15} />
              </a>
            </div>
          </div>

          {/* corporate card — khataba */}
          {data.pricing.corporate && (
            <div style={{ maxWidth: 860, margin: '24px auto 0', background: CARD, border: `1px solid ${CBR}`, borderRadius: 22, padding: 'clamp(24px,3.5vw,40px)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 28 }}>
              <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                {data.pricing.corporate.photos.slice(0, 3).map((src, i) => (
                  <div key={i} style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={src} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(.82) saturate(.88)' }} />
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: GS, border: `1px solid ${GL}`, borderRadius: 999, padding: '4px 12px', marginBottom: 10 }}>
                  <span style={{ fontFamily: F, fontSize: 11.5, color: GLD, fontWeight: 700 }}>للمؤسسات والشركات</span>
                </div>
                <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 19, color: OFF, marginBottom: 8, lineHeight: 1.3 }}>{data.pricing.corporate.heading}</h3>
                <p style={{ fontFamily: F, fontSize: 14, color: MUT, lineHeight: 1.78, margin: 0 }}>{data.pricing.corporate.body}</p>
              </div>
              <a href={waCorp} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 28px', borderRadius: 14, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, boxShadow: '0 6px 22px rgba(255,193,7,.22)' }}>
                {data.pricing.corporate.cta} <ArrowLeft size={14} />
              </a>
            </div>
          )}

          {/* downsell */}
          {data.pricing.downsellText && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <p style={{ fontFamily: F, fontSize: 13.5, color: MUT }}>
                <a href={data.pricing.downsellHref || '/'} style={{ color: GLD, textDecoration: 'underline', textUnderlineOffset: 3, fontWeight: 700 }}>
                  {data.pricing.downsellText} ←
                </a>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════
          10. GUARANTEE
      ═══════════════════════════════════ */}
      <section style={{ padding: '72px 0' }}>
        <div style={WRP}>
          <MasterclassGuarantee />
        </div>
      </section>

      {/* ═══════════════════════════════════
          11. ADVISORS
      ═══════════════════════════════════ */}
      <section id="consult" className="sec sec--advisor" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <GoldChip text={data.advisors.badge} outline />
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(26px,3.8vw,40px)', lineHeight: 1.35, margin: '16px 0 0', color: OFF }}>
              {data.advisors.heading} <span style={{ color: GLD }}>{data.advisors.headingGold}</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 15.5, color: MUT, marginTop: 12, maxWidth: 540, marginInline: 'auto', lineHeight: 1.85 }}>{data.advisors.sub}</p>
          </div>

          <div className="mc-acc-grid" style={{ display: 'grid', gridTemplateColumns: data.advisors.items.length > 1 ? '1fr 1fr' : '1fr', gap: 18, maxWidth: data.advisors.items.length === 1 ? 560 : '100%', marginInline: 'auto' }}>
            {data.advisors.items.map(adv => (
              <MasterclassAdvisorCard key={adv.name} {...adv} />
            ))}
          </div>

          {data.advisors.footNote && (
            <p style={{ textAlign: 'center', fontFamily: F, fontSize: 13.5, color: MUT, marginTop: 22, lineHeight: 1.8 }}>
              {data.advisors.footNote} <a href={waConsult} target="_blank" rel="noopener noreferrer" style={{ color: GLD, textDecoration: 'underline', textUnderlineOffset: 3 }}>تحدّث مع ياقوت</a>
            </p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════
          12. FAQ
      ═══════════════════════════════════ */}
      <section className="sec sec--faq" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206' }} /> أسئلة متكرّرة
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: OFF }}>
              قبل أن <span style={{ color: GLD }}>تسأل</span>
            </h2>
          </div>
          <div style={{ maxWidth: 840, margin: '0 auto' }}>
            <MasterclassFaqAccordion faqs={data.faqs} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          13. COHORT (closing CTA)
      ═══════════════════════════════════ */}
      <section id="cohort" className="sec sec--cohort" style={{ padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
          <svg viewBox="0 0 1440 480" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }} aria-hidden="true">
            <path d="M-120,470 Q400,150 760,270 T1560,120" fill="none" stroke="rgba(255,193,7,.28)" strokeWidth="2.5"/>
            <path d="M-120,500 Q380,220 740,330 T1560,190" fill="none" stroke="rgba(255,255,255,.09)" strokeWidth="1.5"/>
          </svg>
        </div>
        <div style={{ ...WRP, position: 'relative', zIndex: 3, textAlign: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206' }} /> {data.cohort.badge}
          </span>
          <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(30px,4.4vw,46px)', lineHeight: 1.3, margin: '16px 0 0', letterSpacing: -.6, color: OFF }}>
            {data.cohort.startLabel} <span style={{ color: GLD }}>{data.cohort.startGold}</span>
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0, margin: '28px auto 36px', maxWidth: 800 }}>
            {data.cohort.facts.map(fact => (
              <div key={fact.label} style={{ flex: '1 0 220px', padding: '20px 28px', borderLeft: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: 11.5, color: MUT, marginBottom: 6, fontFamily: F }}>{fact.label}</span>
                <b style={{ fontFamily: F, fontSize: 14, color: OFF, whiteSpace: 'pre-line' }}>{fact.value}</b>
              </div>
            ))}
          </div>

          <a href="#enroll" onClick={openModal}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15.5, padding: '15px 32px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,193,7,.28)' }}>
            {data.cohort.ctaLabel} <ArrowLeft size={14} />
          </a>
          <p style={{ fontFamily: F, fontSize: 14, color: MUT, marginTop: 18 }}>
            {data.cohort.consultNote.split('—')[0]}—{' '}
            <a href={data.cohort.consultHref} style={{ color: GLD, textDecoration: 'underline', textUnderlineOffset: 3 }}>
              {data.cohort.consultNote.split('—')[1] || 'تحدّث معنا أوّلاً'}
            </a>
          </p>
        </div>
      </section>

      {/* ── sticky CTA (mobile) ───────────────────────── */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, padding: '12px 16px', background: 'rgba(10,14,24,0.94)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'none' }} className="mc-sticky-cta">
        <a href="#enroll" onClick={openModal}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 14.5, padding: '12px 20px', borderRadius: 12, textDecoration: 'none' }}>
          التسجيل في الماستركلاس <ArrowLeft size={13} />
        </a>
      </div>
      <style>{`@media (max-width:768px) { .mc-sticky-cta { display:block !important; } }`}</style>

      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        courseSlug={data.payment.courseSlug}
        courseTitle={data.payment.courseTitle}
        cohortIdOnsite={data.payment.cohortIdOnsite}
        cohortIdLive={data.payment.cohortIdLive}
        cohortStartAr={data.payment.cohortStartAr}
        cohortDays={data.payment.cohortDays}
        cohortTimeAr={data.payment.cohortTimeAr}
        cohortTrainer={data.payment.cohortTrainer}
        priceJOD={data.payment.priceJOD}
        priceUSD={data.payment.priceUSD}
      />
    </div>
  );
}
