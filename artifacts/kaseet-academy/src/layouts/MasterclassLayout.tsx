/**
 * MasterclassLayout — القالب الموحّد للماستركلاسات الثلاث.
 * كل البيانات تأتي من masterclasses.ts؛ هذا الملف للعرض فقط.
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronDown, ArrowLeft, MapPin, Wifi, Layers, Clock, FolderCheck, ShieldCheck, Video, AudioLines, FileText, Clapperboard, Lock, CheckCircle2, Home, Target, Radio, Mic } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { GOLD, OFF, F, FP, INNER, waLink } from '../pages/shared/coursePageHelpers';
import type { MasterclassData, StationItem } from '../data/masterclasses';
import MasterclassGuarantee from '../components/masterclass/MasterclassGuarantee';
import MasterclassFaqAccordion from '../components/masterclass/MasterclassFaqAccordion';
import MasterclassAdvisorCard from '../components/masterclass/MasterclassAdvisorCard';
import PaymentModal from '../components/PaymentModal';
import wajeezLogo from '@assets/wajeez-logo_1785688262989.png';

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
/* ── section chip (non-gold) ───────────────────────────────── */
const CHIP_BG  = 'rgba(255,255,255,0.06)';
const CHIP_BR  = 'rgba(255,255,255,0.10)';
const CHIP_TXT = '#C8D3E2';
const CHIP_DOT = '#30B8C4';

/* ── dark-theme chip ───────────────────────────────────────── */
const CHIP_BG_D  = 'rgba(138,98,0,.09)';
const CHIP_BR_D  = 'rgba(138,98,0,.28)';
const CHIP_TXT_D = '#8A6200';

function SectionHead({ badge, dark, heading, headingGold, sub }: {
  badge: string; dark?: boolean; heading: string; headingGold: string; sub?: string;
}) {
  const textColor = dark ? INK : OFF;
  return (
    <div style={{ textAlign: 'center', marginBottom: 52, direction: 'rtl' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: dark ? CHIP_BG_D : CHIP_BG, border: `1px solid ${dark ? CHIP_BR_D : CHIP_BR}`, color: dark ? CHIP_TXT_D : CHIP_TXT, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: dark ? CHIP_TXT_D : CHIP_DOT }} />
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

/* ── Portfolio section renderer (defined outside component to avoid React remount) ── */
function renderPortfolio(
  p: NonNullable<MasterclassData['portfolio']>,
  styles: { INK: string; INK2: string; WRP: React.CSSProperties }
) {
  const { INK, INK2, WRP } = styles;
  const isPaper = p.theme === 'paper';
  const PK    = '#8A6200';
  const tINK  = isPaper ? '#201A12' : INK;
  const tINK2 = isPaper ? '#8B8073' : INK2;
  const tBDR  = isPaper ? 'rgba(122,88,26,.10)' : 'rgba(24,32,47,.10)';

  const typePill = (text: string, hot: boolean) => (
    <span style={{ fontFamily: F, fontSize: 11.5, color: hot ? PK : tINK2, border: `1px solid ${hot ? 'rgba(138,98,0,.28)' : tBDR}`, background: hot ? 'rgba(138,98,0,.07)' : (isPaper ? 'rgba(122,88,26,.05)' : 'rgba(24,32,47,.03)'), padding: '3px 11px', borderRadius: 999, textAlign: 'center' as const, whiteSpace: 'nowrap' as const, display: 'inline-block' }}>
      {text}
    </span>
  );

  return (
    <section key="portfolio" className="sec sec--album" style={{ padding: '96px 0', position: 'relative', background: isPaper ? '#F4EFE4' : '#F5F4F0' }}>
      {isPaper && <>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(122,88,26,.14) 1.3px,transparent 1.3px),radial-gradient(rgba(122,88,26,.14) 1.3px,transparent 1.3px)', backgroundSize: '24px 24px', backgroundPosition: '0 0,12px 12px', WebkitMaskImage: 'radial-gradient(ellipse 110% 80% at 50% 10%,#000 35%,transparent 100%)', maskImage: 'radial-gradient(ellipse 110% 80% at 50% 10%,#000 35%,transparent 100%)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom,#0D0B14,transparent)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom,transparent,#EFE8DA)' }} />
      </>}
      <div style={{ ...WRP, position: 'relative', zIndex: 2 }}>
        {/* heading — for paper theme invert SectionHead colours manually */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: isPaper ? 'rgba(138,98,0,.10)' : 'rgba(255,193,7,.12)', border: `1px solid ${isPaper ? 'rgba(138,98,0,.28)' : 'rgba(255,193,7,.35)'}`, color: PK, fontFamily: F, fontSize: 12, fontWeight: 700, padding: '5px 16px', borderRadius: 999 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: PK, flexShrink: 0 }} />{p.badge}
          </span>
          <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4vw,44px)', lineHeight: 1.28, margin: '14px 0 0', letterSpacing: -.5, color: tINK }}>
            {p.heading} <span style={{ color: PK }}>{p.headingGold}</span>
          </h2>
          <p style={{ fontFamily: F, fontSize: 16, color: tINK2, marginTop: 12, lineHeight: 1.8, maxWidth: 560, margin: '12px auto 0' }}>{p.desc}</p>
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto', background: isPaper ? 'rgba(255,255,255,.70)' : '#fff', borderRadius: 22, boxShadow: isPaper ? '0 16px 48px rgba(122,88,26,.13)' : '0 22px 60px rgba(24,32,47,.12)', overflow: 'hidden', border: `1px solid ${tBDR}` }}>
          {/* table head */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: `1px solid ${tBDR}` }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: tINK }}>{p.tableHeader}</div>
            <span style={{ background: PK, color: '#fff', fontFamily: FP, fontSize: 12, fontWeight: 800, padding: '4px 14px', borderRadius: 999 }}>{p.tableCount}</span>
          </div>
          {/* rows */}
          {p.items.map((item, i) => (
            <div key={item.n} style={{ display: 'grid', gridTemplateColumns: '44px 1fr 96px 110px', gap: 12, alignItems: 'center', padding: '13px 28px', borderBottom: `1px solid ${isPaper ? 'rgba(122,88,26,.08)' : 'rgba(24,32,47,.08)'}`, background: item.hot ? (isPaper ? 'rgba(138,98,0,.06)' : 'rgba(255,193,7,.07)') : 'transparent' }}>
              <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 12.5, color: item.hot ? PK : tINK2 }}>{item.n}</span>
              <span style={{ fontFamily: F, fontSize: 14, fontWeight: item.hot ? 700 : 400, color: item.hot ? PK : tINK, lineHeight: 1.5 }}>
                {item.title}
                {item.hot && <span style={{ marginInlineStart: 8, background: PK, color: '#fff', fontSize: 10, fontWeight: 800, padding: '1px 7px', borderRadius: 999 }}>★ ذهبي</span>}
              </span>
              <span style={{ fontFamily: F, fontSize: 11.5, color: tINK2, border: `1px solid ${tBDR}`, background: isPaper ? 'rgba(122,88,26,.05)' : 'rgba(24,32,47,.03)', padding: '3px 10px', borderRadius: 999, textAlign: 'center', whiteSpace: 'nowrap' }}>{item.kind}</span>
              {item.outputType
                ? typePill(item.outputType, !!item.hot)
                : <span style={{ color: item.hot ? 'rgba(138,98,0,.78)' : 'rgba(138,98,0,.34)', height: 26, display: 'block' }} dangerouslySetInnerHTML={{ __html: waveThumb(50 + i) }} />}
            </div>
          ))}
          {/* grad row */}
          <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 96px 110px', gap: 12, alignItems: 'center', padding: '14px 28px', background: isPaper ? 'linear-gradient(90deg,rgba(138,98,0,.14),rgba(138,98,0,.04))' : 'linear-gradient(90deg,rgba(255,193,7,.18),rgba(255,193,7,.06))', borderTop: '1px solid rgba(138,98,0,.28)' }}>
            <span style={{ fontFamily: FP, fontSize: 14, fontWeight: 700, color: PK }}>★</span>
            <span style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: PK }}>{p.gradRow.title}</span>
            <span style={{ fontFamily: F, fontSize: 11.5, color: PK, border: '1px solid rgba(138,98,0,.28)', background: 'rgba(138,98,0,.07)', padding: '3px 10px', borderRadius: 999, textAlign: 'center', whiteSpace: 'nowrap' }}>{p.gradRow.kind}</span>
            {p.gradRow.outputType
              ? typePill(p.gradRow.outputType, true)
              : <span style={{ color: 'rgba(138,98,0,.9)', height: 26, display: 'block' }} dangerouslySetInnerHTML={{ __html: waveThumb(999) }} />}
          </div>
          {/* footer */}
          <div style={{ padding: '18px 28px', borderTop: `1px solid ${tBDR}`, fontFamily: F, fontSize: 13.5, color: isPaper ? '#5A5145' : '#6B7280', lineHeight: 1.85 }}>
            <strong style={{ color: tINK }}>الأعمال المميّزة بالذهبي</strong> — {p.footerNote}
          </div>
        </div>
      </div>
    </section>
  );
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
  const [modalOpen, setModalOpen]       = useState(false);
  const [checkoutMode, setCheckoutMode] = useState<'onsite' | 'live'>('onsite');
  const [openIdx, setOpenIdx]           = useState<number | null>(null);
  const [expandAll, setExpandAll]       = useState(false);
  const [stickyVisible, setStickyVisible] = useState(true);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('payment_intent') && p.get('redirect_status') === 'succeeded') setModalOpen(true);
  }, []);

  useEffect(() => {
    const el = document.getElementById('checkout');
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStickyVisible(false);
      } else {
        setStickyVisible(entry.boundingClientRect.top > 0);
      }
    }, { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  usePageMeta({ title: data.meta.title, description: data.meta.description });
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  function toggle(i: number) { setOpenIdx(openIdx === i ? null : i); setExpandAll(false); }
  function isOpen(i: number) { return expandAll || openIdx === i; }
  function handleExpandAll()  { setExpandAll(v => !v); setOpenIdx(null); }

  const scrollToCheckout = () =>
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
        @media (min-width:769px) { .mc-hud { display:flex !important; } }
        @media (max-width:768px) {
          .mc-hero-grid { grid-template-columns:1fr !important; }
          .mc-hero-visual { max-width:270px !important; order:1; margin:24px auto 0 !important; }
          .mc-modes-grid { grid-template-columns:1fr !important; }
          .mc-acc-grid { grid-template-columns:1fr !important; }
          .mc-trainer-card { grid-template-columns:1fr !important; }
          .mc-trainer-photo { min-height:220px !important; }
          .mc-advisor-grid { grid-template-columns:1fr !important; }
          .mc-kh-gallery { columns:2; }
          .mc-hero-cta-row { flex-direction:column !important; }
          .mc-hero-cta-row a { width:100% !important; justify-content:center !important; }
        }
        @media (max-width:480px) { .mc-kh-gallery { columns:1; } }
        :focus-visible { outline:2px solid #FFC107 !important; outline-offset:3px !important; border-radius:4px !important; }
        @media (prefers-reduced-motion:reduce) { .mc-spin-ring,.mc-spin-slow { animation:none !important; } .mc-live-dot { animation:none !important; } }
      `}</style>

      {/* back nav removed — breadcrumb is now inside the hero for non-cover pages */}

      {/* ═══════════════════════════════════
          01. HERO
      ═══════════════════════════════════ */}
      <section className="sec sec--hero" style={{
        position: 'relative',
        padding: isCoverHero ? '92px 0 clamp(60px,8vw,100px)' : '0 0 88px',
        overflow: 'hidden',
        minHeight: isCoverHero ? 580 : undefined,
      }}>
        {/* cover bg */}
        {isCoverHero && data.hero.heroBgSrc && (
          <>
            <img src={data.hero.heroBgSrc} alt="" aria-hidden="true" fetchPriority="high" decoding="async"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '18% 18%', zIndex: 0 }} />
            {/* vertical vignette */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(2,6,23,0.80) 0%, rgba(2,6,23,0.32) 38%, rgba(2,6,23,0.92) 100%)' }} />
            {/* side vignette — darkens text/right side, leaves subject on left clear */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to left, rgba(2,6,23,0.90) 0%, rgba(2,6,23,0.60) 38%, transparent 62%)' }} />
            {/* arc decorations */}
            {[320, 500, 680].map((r, i) => (
              <div key={i} className="mc-arc" style={{ width: r, height: r, bottom: -r*0.4, left: '50%', transform: 'translateX(-50%)', opacity: 0.28 - i*0.08, zIndex: 2 }} />
            ))}
          </>
        )}

        {/* ── viewfinder HUD (hidden on mobile via CSS) ──────────── */}
        {isCoverHero && data.hero.useSpinningRing && (
          <div className="mc-hud" style={{ position: 'absolute', top: 72, left: 0, right: 0, zIndex: 5, padding: '0 clamp(16px,4vw,48px)', display: 'none', alignItems: 'center', justifyContent: 'space-between', opacity: 0.4, pointerEvents: 'none', direction: 'ltr' }}>
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
          {/* breadcrumb */}
          {isCoverHero ? (
            <div style={{ marginBottom: 16, marginTop: 18, direction: 'rtl', display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'nowrap', overflow: 'hidden' }}>
              <button onClick={() => navigate('/')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: F, fontSize: 12, color: 'rgba(180,190,210,0.65)', display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <ArrowLeft size={9} style={{ opacity: 0.5 }} />
                الرئيسية
              </button>
              <span style={{ color: 'rgba(180,190,210,0.28)', marginInline: 6, fontSize: 11, flexShrink: 0 }}>/</span>
              <span style={{ fontFamily: F, fontSize: 12, color: 'rgba(180,190,210,0.50)', flexShrink: 0 }}>الماستركلاسات</span>
              <span style={{ color: 'rgba(180,190,210,0.28)', marginInline: 6, fontSize: 11, flexShrink: 0 }}>/</span>
              <span style={{ fontFamily: F, fontSize: 12, color: 'rgba(180,190,210,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {data.hero.h1GoldLine ?? data.meta.title}
              </span>
            </div>
          ) : (
            /* non-cover: Soti-style breadcrumb inside hero */
            <nav aria-label="مسار التنقل" style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 96, paddingBottom: 0, marginBottom: 28 }}>
              <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: F, fontSize: 12.5, color: MUT, textDecoration: 'none' }}>
                <Home size={12} strokeWidth={2} /> الرئيسية
              </a>
              <span style={{ color: 'rgba(255,255,255,.20)', fontSize: 11 }}>/</span>
              <a href="/#masterclasses" style={{ fontFamily: F, fontSize: 12.5, color: MUT, textDecoration: 'none' }}>الماستركلاسات</a>
              <span style={{ color: 'rgba(255,255,255,.20)', fontSize: 11 }}>/</span>
              <span style={{ fontFamily: F, fontSize: 12.5, color: GLD }}>{data.hero.h1GoldLine}</span>
            </nav>
          )}

          <div className="mc-hero-grid" style={{ display: 'grid', gridTemplateColumns: (data.hero.heroCardSrc || data.hero.useSpinningRing) ? '1.12fr .88fr' : '1fr', gap: 52, alignItems: 'center' }}>

            {/* text column */}
            <div>
              {/* audience pills — Soti-style two colored pills */}
              {data.hero.heroPills ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                  {data.hero.heroPills.map(pill => (
                    <span key={pill.text} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      background: pill.variant === 'gold' ? GS : 'rgba(103,232,249,.08)',
                      border: `1px solid ${pill.variant === 'gold' ? GL : 'rgba(103,232,249,.22)'}`,
                      color: pill.variant === 'gold' ? GLD : '#67e8f9',
                      fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999,
                    }}>
                      {pill.variant === 'gold'
                        ? <Target size={12} strokeWidth={2.2} />
                        : <Radio size={12} strokeWidth={2.2} />}
                      {pill.text}
                    </span>
                  ))}
                </div>
              ) : data.hero.audienceTags ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 18 }}>
                  {data.hero.audienceTags.map(tag => (
                    <span key={tag} style={{ fontFamily: F, fontSize: 11.5, color: LT, background: 'rgba(255,255,255,.07)', border: `1px solid ${CBR}`, padding: '4px 12px', borderRadius: 999 }}>{tag}</span>
                  ))}
                </div>
              ) : (
                <GoldChip text={data.hero.chip} outline />
              )}

              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(34px,5vw,58px)', lineHeight: 1.22, letterSpacing: -1.2, margin: data.hero.heroPills ? '0 0 0' : '12px 0 0', color: OFF, maxWidth: 720 }}>
                {data.hero.h1Line1}<br />
                <span style={{ color: GLD }}>{data.hero.h1GoldLine}</span>
                {data.hero.h1Line3 && <><br />{data.hero.h1Line3}</>}
              </h1>

              <p style={{
                fontFamily: F, fontSize: isCoverHero ? 15.5 : 16, color: isCoverHero ? LT : MUT,
                maxWidth: 560, marginTop: 16, lineHeight: 1.85,
                ...(isCoverHero ? { background: 'rgba(2,6,23,.52)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: '13px 18px', marginBottom: 14 } : {}),
              }}>
                {data.hero.desc}
              </p>

              {/* fact chips for cover hero */}
              {isCoverHero && !data.hero.statsEnabled && !data.hero.useSpinningRing && data.hero.factChips && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
                  {data.hero.factChips.map(text => (
                    <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(2,6,23,.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: `1px solid ${CBR}`, fontFamily: F, fontSize: 13, color: LT, padding: '8px 14px', borderRadius: 10 }}>
                      {text}
                    </span>
                  ))}
                </div>
              )}

              {/* stats — Soti-style 2×2 grid with icons */}
              {data.hero.statsEnabled && data.hero.stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10, marginTop: 24, maxWidth: 500 }}>
                  {data.hero.stats.map(({ num, label, hot }, i) => {
                    const icons = [Layers, Clock, AudioLines, MapPin] as const;
                    const Icon = icons[i] ?? Layers;
                    return (
                      <span key={label} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 9,
                        background: hot ? 'rgba(255,193,7,.11)' : 'rgba(255,255,255,.04)',
                        border: `1px solid ${hot ? GL : CBR}`,
                        padding: '10px 13px', borderRadius: 11,
                        fontFamily: F, fontSize: 13,
                        color: hot ? GLD : LT, fontWeight: hot ? 700 : 400,
                      }}>
                        <Icon size={14} color={GLD} strokeWidth={2} style={{ flexShrink: 0 }} />
                        {num && <b style={{ fontFamily: FP, fontSize: hot ? 19 : undefined, color: hot ? GLD : OFF, fontWeight: hot ? 900 : 700, lineHeight: hot ? 1 : undefined }}>{num}</b>}
                        {label}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* mode chip — non-Soti pages only */}
              {!isCoverHero && !data.hero.heroPills && data.hero.modeChip && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, fontFamily: F, fontSize: 13.5, color: LT }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD, flexShrink: 0 }} />
                  {data.hero.modeChip}
                </div>
              )}

              {/* spinning ring stats — legacy path */}
              {data.hero.useSpinningRing && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 8, marginTop: 18, maxWidth: 500 }}>
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

              {/* wajeez badge — clickable link for non-cover (Soti-style), static chip for cover */}
              {!isCoverHero ? (
                <a href="https://wajeez.com" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18, background: 'rgba(2,6,23,.75)', border: '1px solid rgba(255,193,7,.18)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 14, padding: '12px 16px', maxWidth: 500, textDecoration: 'none', cursor: 'pointer', transition: 'border-color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,193,7,.42)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,193,7,.18)')}>
                  <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 8, background: '#fff', display: 'grid', placeContent: 'center', padding: 4 }}>
                    <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: OFF }}>شريك الاعتماد الرسمي — تطبيق وجيز</div>
                    <div style={{ fontFamily: F, fontSize: 11.5, color: MUT }}>{data.hero.wajeezSubtitle}</div>
                  </div>
                </a>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 14, background: 'rgba(2,6,23,.60)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: `1px solid ${CBR}`, borderRadius: 14, padding: '11px 16px 11px 13px', marginBottom: 28 }}>
                  <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 9, background: '#fff', display: 'grid', placeContent: 'center', padding: 5 }}>
                    <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <span style={{ fontFamily: F, fontSize: 13, color: MUT, lineHeight: 1.5 }}>
                    <strong style={{ color: OFF, display: 'block' }}>شهادة معتمدة من تطبيق وجيز</strong>
                    {data.hero.wajeezSubtitle}
                  </span>
                </div>
              )}

              {/* CTAs */}
              <div className="mc-hero-cta-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
                <a href={data.hero.ctaEnrollIsWa ? waOnline : '#checkout'}
                  onClick={data.hero.ctaEnrollIsWa ? undefined : (e => { e.preventDefault(); scrollToCheckout(); })}
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
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: GLD }} />
                    {data.hero.heroCardPillText ?? 'تسجيل داخل استوديو كاسيت'}
                  </span>
                  <div style={{ position: 'absolute', inset: 'auto 0 0 0', zIndex: 3, padding: '22px 22px 24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                      <span style={{ fontFamily: FP, fontSize: 38, fontWeight: 700, color: GLD, lineHeight: .95 }}>{data.hero.heroCardBottomNum ?? '44'}</span>
                      <span style={{ fontFamily: F, fontSize: 12.5, color: LT, marginTop: 4, display: 'block' }}>{data.hero.heroCardBottomLabel ?? 'ساعة · 13 مخرجاً صوتياً'}</span>
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
                <div style={{ position: 'absolute', inset: '-8%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(2,6,23,0.50) 0%, rgba(2,6,23,0.30) 44%, rgba(2,6,23,0.10) 65%, transparent 76%)', zIndex: 0, pointerEvents: 'none' }} />
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
          01-B. FOR WHOM — لمن صُمِّم البرنامج؟
      ═══════════════════════════════════ */}
      <section className="sec sec--forwho" style={{ padding: '88px 0', borderTop: `1px solid ${CBR}` }}>
        <div style={WRP}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: GS, border: `1px solid ${GL}`, color: GLD, fontFamily: F, fontSize: 12, fontWeight: 700, padding: '5px 15px', borderRadius: 999 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD, flexShrink: 0 }} />
              لمن صُمِّم البرنامج؟
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(26px,3.6vw,40px)', color: OFF, marginTop: 18, marginBottom: 12, lineHeight: 1.35 }}>
              ما الذي ستُتقنه <span style={{ color: GLD }}>بعد الماستركلاس؟</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 15.5, color: MUT, maxWidth: 560, marginInline: 'auto', lineHeight: 1.8 }}>
              ثلاثة محاور تُغطّي مهارة الخطابة كاملةً — من الحضور القيادي حتى إدارة أصعب الجماهير.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 980, marginInline: 'auto' }}>
            {[
              {
                focus: 'الثقة والحضور أمام الجمهور',
                title: 'الحضور والاتزان القيادي',
                desc: 'تتحدّث أمام الجمهور بثقة ووضوح، وتبني حضوراً قيادياً يسبق كلماتك وتعزّز به تقديم خبرتك دون مبالغة أو تقليل من الذات.',
              },
              {
                focus: 'الهيكل والقصة والتكيّف',
                title: 'بناء الرسالة والارتجال الذكي',
                desc: 'تصمّم رسالة مترابطة تخدم هدفاً محدداً، ترتجل بوعي وتتكيّف مع المواقف المفاجئة، وتصنع بدايات ونهايات راسخة باستخدام القصص والدعابة بذكاء.',
              },
              {
                focus: 'التواصل الحقيقي تحت الضغط',
                title: 'إدارة الجمهور والضغوط',
                desc: 'تفهم جمهورك وتكيّف لغتك وأمثلتك دون أن تفقد هويتك، مع القدرة على إدارة مقاومة الجمهور والحفاظ على هدوئك الكامل تحت الضغط.',
              },
            ].map((card, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '30px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ width: 36, height: 3, background: GLD, borderRadius: 2 }} />
                <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 700, color: MUT, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ color: GLD }}>التركيز:</span> {card.focus}
                </span>
                <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(17px,2.2vw,21px)', color: OFF, margin: 0, lineHeight: 1.45 }}>
                  {card.title}
                </h3>
                <p style={{ fontFamily: F, fontSize: 14, color: MUT, lineHeight: 1.85, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 01-C elam method removed per design update */}

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
            {/* portfolio lead note — merged from portfolio section */}
            {data.portfolio && (
              <div style={{ marginTop: 28, background: GS, border: `1px solid ${GL}`, borderRadius: 16, padding: '22px 24px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <span style={{ flexShrink: 0, fontFamily: FP, fontSize: 22, color: GLD, marginTop: 2 }}>★</span>
                <div>
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GLD, marginBottom: 6 }}>{data.portfolio.heading}</div>
                  <p style={{ fontFamily: F, fontSize: 14, color: LT, lineHeight: 1.8, margin: 0 }}>{data.portfolio.desc}</p>
                </div>
              </div>
            )}
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <a href="#checkout" onClick={e => { e.preventDefault(); scrollToCheckout(); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 8px 24px rgba(255,193,7,.24)' }}>
                احجز مقعدك الآن <ArrowLeft size={14} />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          01-E. PORTFOLIO TABLE (elam only)
      ═══════════════════════════════════ */}
      {data.portfolio && data.portfolio.items && data.portfolio.items.some(it => it.outputType) && (() => {
        const p = data.portfolio!;
        function portIcon(t?: string) {
          if (t === 'صوت')         return <AudioLines size={15} color={MUT} />;
          if (t === 'وثيقة')       return <FileText   size={15} color={MUT} />;
          if (t === 'إنتاج كامل')  return <Clapperboard size={15} color={MUT} />;
          return                          <Video      size={15} color={MUT} />;
        }
        const hotStyle: React.CSSProperties = {
          background: 'rgba(255,193,7,.055)',
          borderInlineStart: `2px solid ${GLD}`,
          borderRadius: 0,
        };
        return (
          <section className="sec sec--portfolio" style={{ padding: '80px 0' }}>
            <div style={WRP}>
              <div style={{ textAlign: 'center', marginBottom: 40, direction: 'rtl' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: CHIP_BG, border: `1px solid ${CHIP_BR}`, color: CHIP_TXT, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: CHIP_DOT }} />
                  {p.badge}
                </span>
                <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(26px,4vw,42px)', lineHeight: 1.35, margin: '16px 0 8px', color: OFF }}>
                  {p.heading} <span style={{ color: GLD }}>{p.headingGold}</span>
                </h2>
                <p style={{ fontFamily: F, fontSize: 15, color: MUT, maxWidth: 620, marginInline: 'auto', lineHeight: 1.85 }}>{p.desc}</p>
              </div>

              {/* table */}
              <div style={{ maxWidth: 880, marginInline: 'auto', border: `1px solid ${CBR}`, borderRadius: 14, overflow: 'hidden' }}>
                {/* header row */}
                <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 88px 72px', gap: 12, alignItems: 'center', padding: '12px 24px', background: 'rgba(255,255,255,0.04)', borderBottom: `1px solid ${CBR}` }}>
                  <span style={{ fontFamily: FP, fontSize: 11, color: MUT, textAlign: 'center' }}>#</span>
                  <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: LT }}>
                    {p.tableHeader}
                    <span style={{ marginInlineStart: 10, fontFamily: F, fontSize: 11, fontWeight: 700, color: GLD, background: GS, border: `1px solid ${GL}`, padding: '2px 10px', borderRadius: 999 }}>{p.tableCount}</span>
                  </span>
                  <span style={{ fontFamily: F, fontSize: 11, color: MUT, textAlign: 'center' }}>الوسم</span>
                  <span style={{ fontFamily: F, fontSize: 11, color: MUT, textAlign: 'center' }}>النوع</span>
                </div>
                {/* items */}
                {p.items.map(it => (
                  <div key={it.n} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 88px 72px', gap: 12, alignItems: 'center', padding: '13px 24px', borderBottom: `1px solid ${CBR}`, ...(it.hot ? hotStyle : {}) }}>
                    <span style={{ fontFamily: FP, fontSize: 13, fontWeight: 700, color: it.hot ? GLD : MUT, textAlign: 'center' }}>{it.n}</span>
                    <span style={{ fontFamily: F, fontSize: 14, color: it.hot ? OFF : LT, lineHeight: 1.5 }}>{it.title}</span>
                    <span style={{ fontFamily: F, fontSize: 11.5, color: MUT, background: CARD, border: `1px solid ${CBR}`, borderRadius: 6, padding: '3px 8px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.kind}</span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                      {portIcon(it.outputType)}
                      <span style={{ fontFamily: F, fontSize: 11.5, color: MUT }}>{it.outputType === 'إنتاج كامل' ? 'إنتاج' : it.outputType}</span>
                    </div>
                  </div>
                ))}
                {/* grad row */}
                <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 88px 72px', gap: 12, alignItems: 'center', padding: '14px 24px', background: 'rgba(255,193,7,.055)', borderInlineStart: `2px solid ${GLD}`, borderTop: `1px solid ${CBR}` }}>
                  <span style={{ fontFamily: FP, fontSize: 16, color: GLD, textAlign: 'center' }}>★</span>
                  <span style={{ fontFamily: F, fontSize: 14, color: OFF, fontWeight: 700, lineHeight: 1.5 }}>{p.gradRow.title}</span>
                  <span style={{ fontFamily: F, fontSize: 11.5, color: GLD, background: GS, border: `1px solid ${GL}`, borderRadius: 6, padding: '3px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{p.gradRow.kind}</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <Clapperboard size={15} color={GLD} />
                    <span style={{ fontFamily: F, fontSize: 11.5, color: GLD }}>إنتاج</span>
                  </div>
                </div>
              </div>

              {/* footer note */}
              {p.footerNote && (
                <p style={{ fontFamily: F, fontSize: 13, color: MUT, maxWidth: 700, marginInline: 'auto', marginTop: 18, lineHeight: 1.85, textAlign: 'center', direction: 'rtl' }}>{p.footerNote}</p>
              )}
            </div>
          </section>
        );
      })()}

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
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 34 }}>
            <a href="#checkout" onClick={e => { e.preventDefault(); scrollToCheckout(); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15.5, padding: '14px 30px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,193,7,.24)' }}>
              احجز مقعدك الآن <ArrowLeft size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* portfolio section merged into outcomes above */}

      {/* ═══════════════════════════════════
          03-B. METHOD (khataba — after curriculum)
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
              <a href="#checkout" onClick={e => { e.preventDefault(); scrollToCheckout(); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 8px 24px rgba(255,193,7,.24)' }}>
                احجز مقعدك الآن <ArrowLeft size={14} />
              </a>
            </div>
          </div>
        </section>
      )}

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
          08. STUDY MODES + COHORT (merged)
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: ac, display: 'grid', placeContent: 'center', flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15.5, color: OFF }}>{m.label}</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 2 }}>{m.sub}</div>
                  </div>
                </div>
                {/* schedule line */}
                {m.schedule && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: `rgba(${acRgb},.08)`, border: `1px solid rgba(${acRgb},.22)`, borderRadius: 8, padding: '6px 12px', marginBottom: 14, fontFamily: F, fontSize: 12.5, color: ac }}>
                    🗓 {m.schedule}
                  </div>
                )}
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
          06. TRAINERS
      ═══════════════════════════════════ */}
      <section id="trainers" className="sec sec--trainers" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <SectionHead badge={data.trainers.badge} heading={data.trainers.heading} headingGold={data.trainers.headingGold} sub={data.trainers.sub} />

          {data.slug === 'masar-elami' ? (
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
          08-B. CONSULTATION — WhatsApp chat mockup
      ═══════════════════════════════════ */}
      <section id="consult" className="sec sec--advisor" style={{ padding: '0 0 88px' }}>
        <div style={WRP}>
          {/* header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: GS, border: `1px solid ${GL}`, color: GLD, fontFamily: F, fontSize: 12, fontWeight: 700, padding: '5px 15px', borderRadius: 999 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD, flexShrink: 0 }} />
              استشارة مجانية · دون التزام
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(24px,3.4vw,36px)', lineHeight: 1.4, color: OFF, margin: '16px 0 10px' }}>
              قبل أن تسجّل، تحدّث مع <span style={{ color: GLD }}>مستشارتك</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 15.5, color: MUT, lineHeight: 1.75, maxWidth: 520, marginInline: 'auto' }}>
              جلسة قصيرة على واتساب تُحدَّد فيها نقطة بدايتك — لكلّ مسار مستشارة مخصّصة.
            </p>
          </div>

          {/* advisor toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 28 }}>
            {[
              { mode: 'onsite' as const, label: 'الحضوري',  adv: data.advisors.items[0] },
              { mode: 'live'   as const, label: 'المباشر',  adv: data.advisors.items[1] ?? data.advisors.items[0] },
            ].map(({ mode, label, adv }) => (
              <button key={mode} onClick={() => setCheckoutMode(mode)} style={{
                display: 'flex', alignItems: 'center', gap: 9,
                background: checkoutMode === mode ? GS : 'transparent',
                border: `1px solid ${checkoutMode === mode ? GL : CBR}`,
                borderRadius: 999, padding: '7px 16px 7px 10px', cursor: 'pointer',
              }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: checkoutMode === mode ? `2px solid ${GLD}` : '2px solid transparent' }}>
                  <img src={adv.imageSrc} alt={adv.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: checkoutMode === mode ? GLD : MUT }}>{label}</span>
              </button>
            ))}
          </div>

          {/* WhatsApp chat window */}
          {(() => {
            const isOnsite = checkoutMode === 'onsite';
            const adv = isOnsite ? data.advisors.items[0] : (data.advisors.items[1] ?? data.advisors.items[0]);
            const link = isOnsite
              ? waLink(adv.phone ?? data.wa.phoneOnline, `مرحباً ${adv.name}، أودّ حجز استشارة مجانية عن ماستركلاس الخطابة الحضوري`)
              : waConsult;
            const msg = isOnsite
              ? `أهلاً 👋 أنا ${adv.name}، مستشارة ماستركلاس الخطابة الحضوري. أخبريني عن تجربتك في التحدث أمام الجمهور — وأساعدك تختاري نقطة البداية الصح.`
              : `أهلاً 👋 أنا ${adv.name}، مستشارة ماستركلاس الخطابة المباشر. أخبريني عن تجربتك في التحدث أمام الجمهور — وأساعدك تختاري نقطة البداية الصح.`;
            return (
              <div style={{ maxWidth: 480, marginInline: 'auto', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,0.07)', border: `1px solid ${CBR}` }}>
                {/* WA top bar */}
                <div style={{ background: '#1F2C34', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid #25D366' }}>
                    <img src={adv.imageSrc} alt={adv.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14.5, color: '#E9EEF1', lineHeight: 1.3 }}>{adv.name}</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: '#8696A0', marginTop: 1 }}>{adv.role}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#25D366', boxShadow: '0 0 6px #25D366' }} />
                    <span style={{ fontFamily: F, fontSize: 11, color: '#25D366', fontWeight: 600 }}>متاحة</span>
                  </div>
                </div>
                {/* chat body */}
                <div style={{ background: '#0B141A', padding: '20px 16px 16px', minHeight: 140, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle,rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
                  <div style={{ position: 'relative', maxWidth: '82%', background: '#1F2C34', borderRadius: '0 14px 14px 14px', padding: '10px 14px 8px', marginRight: 'auto' }}>
                    <div style={{ position: 'absolute', top: 0, right: '100%', width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 8px 8px 0', borderColor: `transparent #1F2C34 transparent transparent` }} />
                    <p style={{ fontFamily: F, fontSize: 14.5, color: '#E9EEF1', lineHeight: 1.7, margin: 0 }} dir="rtl">{msg}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 5 }}>
                      <span style={{ fontFamily: F, fontSize: 10.5, color: '#8696A0' }}>الآن</span>
                      <svg width="14" height="9" viewBox="0 0 16 10" fill="none"><path d="M1 5l3.5 3.5L10 1M6 5l3.5 3.5L15 1" stroke="#53BDEB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>
                {/* input bar → opens WA */}
                <a href={link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#1F2C34', padding: '10px 12px', textDecoration: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                  <div style={{ flex: 1, background: '#2A3942', borderRadius: 22, padding: '9px 16px' }}>
                    <span style={{ fontFamily: F, fontSize: 14, color: '#8696A0' }}>ابدأ المحادثة…</span>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(37,211,102,.4)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                  </div>
                </a>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ═══════════════════════════════════
          09. CHECKOUT — interactive
      ═══════════════════════════════════ */}
      <section id="checkout" className="sec sec--access" style={{ padding: '96px 0', scrollMarginTop: 80 }}>
        <div style={WRP}>
          {/* heading */}
          <div style={{ textAlign: 'center', marginBottom: 52, direction: 'rtl' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GS, border: `1px solid ${GL}`, color: GLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD }} />
              {data.pricing.badge}
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: OFF }}>
              {data.pricing.heading} <span style={{ color: GLD }}>{data.pricing.headingGold}</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: LT, marginTop: 10, marginBottom: 0 }}>
              اختر أسلوب دراستك وابدأ فوراً
            </p>
          </div>

          <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
            {/* glow */}
            <div style={{ position: 'absolute', inset: -3, background: 'linear-gradient(135deg, rgba(255,193,7,.22), rgba(103,232,249,.10))', borderRadius: 30, filter: 'blur(20px)', opacity: 0.7, pointerEvents: 'none' }} />

            <div style={{ position: 'relative', background: '#131B27', border: `1px solid ${GL}`, borderRadius: 26, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(255,193,7,.12), 0 34px 70px rgba(13,11,20,.45)' }}>

              {/* ── mode tabs ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${CBR}` }}>
                {/* حضوري */}
                <button
                  onClick={() => setCheckoutMode('onsite')}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '18px 16px', border: 'none', cursor: 'pointer',
                    background: checkoutMode === 'onsite' ? 'rgba(255,193,7,.08)' : 'transparent',
                    borderBottom: checkoutMode === 'onsite' ? `2px solid ${GLD}` : '2px solid transparent',
                    transition: 'background .2s, border-color .2s',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={14} color={checkoutMode === 'onsite' ? GLD : MUT} strokeWidth={2.2} />
                    <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: checkoutMode === 'onsite' ? GLD : MUT }}>حضوري</span>
                  </div>
                  <span style={{ fontFamily: F, fontSize: 11.5, color: MUT }}>استوديو كاسيت · عمّان · {data.payment.cohortStartAr}</span>
                  <span style={{ fontFamily: FP, fontSize: 22, fontWeight: 700, color: checkoutMode === 'onsite' ? GLD : LT, lineHeight: 1 }}>{data.payment.priceJOD} <span style={{ fontSize: 13 }}>JOD</span></span>
                </button>
                {/* مباشر تفاعلي */}
                <button
                  onClick={() => setCheckoutMode('live')}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '18px 16px', border: 'none', cursor: 'pointer',
                    background: checkoutMode === 'live' ? 'rgba(103,232,249,.07)' : 'transparent',
                    borderBottom: checkoutMode === 'live' ? '2px solid #67e8f9' : '2px solid transparent',
                    transition: 'background .2s, border-color .2s',
                    borderRight: `1px solid ${CBR}`,
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Wifi size={14} color={checkoutMode === 'live' ? '#67e8f9' : MUT} strokeWidth={2.2} />
                    <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: checkoutMode === 'live' ? '#67e8f9' : MUT }}>مباشر تفاعلي</span>
                  </div>
                  <span style={{ fontFamily: F, fontSize: 11.5, color: MUT }}>عن بُعد (Online LIVE) · {data.payment.cohortStartAr}</span>
                  <span style={{ fontFamily: FP, fontSize: 22, fontWeight: 700, color: checkoutMode === 'live' ? '#67e8f9' : LT, lineHeight: 1 }}>${data.payment.priceUSD}</span>
                </button>
              </div>

              <div style={{ padding: 'clamp(24px,3.5vw,36px)' }}>

                {/* feature list */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0, margin: '0 0 24px' }}>
                  {data.pricing.features.map(feat => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: F, fontSize: 14, color: LT, lineHeight: 1.6 }}>
                      <CheckCircle2 size={16} color={GLD} strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 2 }} />
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* guarantee box */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, background: 'rgba(255,193,7,.07)', border: `1px solid rgba(255,193,7,.26)`, borderRadius: 16, padding: '16px 18px', marginBottom: 18 }}>
                  <ShieldCheck size={22} color={GLD} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: OFF, marginBottom: 5 }}>ضمان الجلسة الأولى — Risk Reversal</div>
                    <p style={{ fontFamily: F, fontSize: 13, color: LT, lineHeight: 1.8, margin: 0 }}>
                      جرّب الجلسة الأولى كاملة. إن شعرت أنّ الماستركلاس لا يلبّي توقّعاتك، اطلب استرداداً كاملاً خلال 24 ساعة — <strong style={{ color: OFF }}>دون أسئلة ولا شروط</strong>.
                    </p>
                  </div>
                </div>

                {/* installment notice — onsite only (live is always full payment) */}
                {checkoutMode === 'onsite' && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: GS, border: `1px solid ${GL}`, borderRadius: 12, padding: '11px 15px', marginBottom: 22 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: GLD, flexShrink: 0, marginTop: 6 }} />
                    <span style={{ fontFamily: F, fontSize: 13, color: LT, lineHeight: 1.7 }}>
                      <strong style={{ color: OFF }}>التقسيط متاح:</strong> يمكنك الدفع كاملاً أو تثبيت مقعدك بدفع الدفعة الأولى فقط
                      {' '}<strong style={{ color: GLD }}>({data.pricing.installments[0]} JOD)</strong>.
                    </span>
                  </div>
                )}
                {checkoutMode === 'live' && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: GS, border: `1px solid rgba(103,232,249,.22)`, borderRadius: 12, padding: '11px 15px', marginBottom: 22 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#67e8f9', flexShrink: 0, marginTop: 6 }} />
                    <span style={{ fontFamily: F, fontSize: 13, color: LT, lineHeight: 1.7 }}>
                      الدفع الكامل مطلوب للتسجيل في الخيار المباشر —{' '}
                      <strong style={{ color: '#67e8f9' }}>${data.payment.priceUSD}</strong>.
                    </span>
                  </div>
                )}

                {/* Stripe CTA */}
                <button
                  onClick={() => setModalOpen(true)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    width: '100%', boxSizing: 'border-box',
                    background: GLD, color: '#0f172a',
                    fontFamily: F, fontWeight: 800, fontSize: 15.5,
                    padding: '16px 24px', borderRadius: 16, border: 'none', cursor: 'pointer',
                    boxShadow: '0 8px 28px rgba(255,193,7,.30)',
                    transition: 'transform .15s, box-shadow .15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 38px rgba(255,193,7,.38)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,193,7,.30)'; }}>
                  <Lock size={15} />
                  {checkoutMode === 'onsite'
                    ? `احجز مقعدك — ادفع ${data.pricing.installments[0]} ديناراً الآن`
                    : `سجّل الآن — ادفع $${data.payment.priceUSD} كاملاً`}
                  <ArrowLeft size={15} />
                </button>

                {/* security footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 12, color: MUT }}>
                    <Lock size={12} color={MUT} strokeWidth={2} />
                    معاملة آمنة ومشفّرة 100% عبر Stripe
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="32" height="11" viewBox="0 0 48 16" aria-label="Visa"><rect width="48" height="16" rx="3" fill="#1A1F71"/><text x="50%" y="12" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#fff">VISA</text></svg>
                    <svg width="20" height="13" viewBox="0 0 34 22" aria-label="Mastercard"><circle cx="12" cy="11" r="11" fill="#EB001B"/><circle cx="22" cy="11" r="11" fill="#F79E1B"/><path d="M17 4.3a11 11 0 0 1 0 13.4A11 11 0 0 1 17 4.3z" fill="#FF5F00"/></svg>
                    <svg width="32" height="13" viewBox="0 0 50 20" aria-label="Apple Pay"><rect width="50" height="20" rx="4" fill="#000"/><text x="50%" y="14.5" textAnchor="middle" fontFamily="'-apple-system',sans-serif" fontWeight="600" fontSize="10" fill="#fff">Apple Pay</text></svg>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* corporate card — khataba */}
          {data.pricing.corporate && (
            <div style={{ maxWidth: 860, margin: '32px auto 0', background: CARD, border: `1px solid ${CBR}`, borderRadius: 22, padding: 'clamp(24px,3.5vw,40px)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 28 }}>
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
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <a href="#checkout" onClick={e => { e.preventDefault(); scrollToCheckout(); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 8px 24px rgba(255,193,7,.24)' }}>
              احجز مقعدك الآن <ArrowLeft size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ── sticky CTA (mobile only, hides when #checkout is visible) ── */}
      {stickyVisible && (
        <div className="mc-sticky-cta" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, padding: '10px 16px 16px', background: 'rgba(10,14,24,0.96)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={scrollToCheckout}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, width: '100%', boxSizing: 'border-box', background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 20px', borderRadius: 14, border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(255,193,7,.28)' }}>
            <Lock size={15} />
            احجز مقعدك في الماستركلاس
            <ArrowLeft size={14} />
          </button>
        </div>
      )}
      <style>{`@media (min-width:769px) { .mc-sticky-cta { display:none !important; } }`}</style>

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
        initialMode={checkoutMode}
      />
    </div>
  );
}
