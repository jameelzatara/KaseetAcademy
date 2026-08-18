/**
 * ⑪ EventsPage — صفحة الفعاليات
 * حالة فارغة افتراضية — تُملأ تلقائيًا عند إضافة أحداث
 */
import { useEffect } from 'react';
import { Link } from 'wouter';
import Navbar from '../components/Navbar';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import SiteFooter from '../components/SiteFooter';
import { usePageMeta } from '../hooks/usePageMeta';

const GOLD   = '#FFC107';
const CREAM  = '#F5F4F0';
const INK    = '#18202F';
const INK2   = '#56617A';
const F      = "'Tajawal', sans-serif";
const FP     = "'Poppins', sans-serif";

// ── بيانات الفعاليات — تُضاف هنا يدوياً ─────────────────
export interface KaseetEvent {
  slug:        string;
  title:       string;
  date:        string;      // YYYY-MM-DD
  date_ar:     string;
  time_ar:     string;
  location:    string;
  description: string;
  registerUrl?: string;
  isFree:      boolean;
}

export const EVENTS: KaseetEvent[] = [
  // أضف الفعاليات هنا:
  // {
  //   slug: 'webinar-voice-aug-2026',
  //   title: 'ويبنار: أسرار الصوت الاحترافي',
  //   date: '2026-09-10',
  //   date_ar: '10 سبتمبر 2026',
  //   time_ar: '8:00 مساءً (توقيت عمّان)',
  //   location: 'Google Meet',
  //   description: 'جلسة مباشرة مع المدرّبة يسار عبده …',
  //   registerUrl: 'https://kaseet.com/checkout',
  //   isFree: false,
  // },
];

export default function EventsPage() {
  usePageMeta({
    title:       'الفعاليات | كاسيت أكاديمي',
    description: 'فعاليات وندوات مباشرة من أكاديمية كاسيت في مجال الصوت والإعلام.',
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const upcoming = EVENTS.filter((e) => new Date(e.date) >= new Date());
  const past     = EVENTS.filter((e) => new Date(e.date) <  new Date());

  return (
    <>
      <Navbar />
      <div style={{ background: CREAM, minHeight: '100vh', paddingTop: 80 }}>

        {/* ── Hero ── */}
        <section style={{
          background: '#0D0B14',
          padding: 'clamp(48px,8vw,96px) clamp(16px,4vw,48px)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 860, margin: '0 auto 20px', direction: 'rtl' }}>
            <PageBreadcrumb crumbs={[{ label: 'الرئيسية', href: '/' }, { label: 'الفعاليات' }]} theme="dark" />
          </div>
          <p style={{
            fontFamily: FP, fontSize: 12, fontWeight: 600, letterSpacing: '0.12em',
            color: GOLD, textTransform: 'uppercase', marginBottom: 12,
          }}>Events</p>
          <h1 style={{
            fontFamily: F, fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900,
            color: '#fff', margin: 0,
          }}>الفعاليات والندوات</h1>
          <p style={{
            fontFamily: F, fontSize: 'clamp(15px,1.8vw,18px)', color: 'rgba(255,255,255,0.65)',
            marginTop: 12, maxWidth: 600, marginInline: 'auto',
          }}>
            ندوات مباشرة، ورش عمل، وأحداث استثنائية من كاسيت أكاديمي
          </p>
        </section>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(32px,6vw,64px) clamp(16px,4vw,48px)' }}>

          {upcoming.length === 0 && past.length === 0 ? (
            /* ── الحالة الفارغة ── */
            <div style={{ textAlign: 'center', padding: '64px 24px' }}>
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                background: `${GOLD}18`, border: `2px solid ${GOLD}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 38, margin: '0 auto 24px',
              }}>🗓️</div>
              <h2 style={{
                fontFamily: F, fontSize: 'clamp(20px,3vw,26px)', fontWeight: 800,
                color: INK, margin: '0 0 12px',
              }}>
                لا توجد أحداث قادمة
              </h2>
              <p style={{
                fontFamily: F, fontSize: 16, color: INK2, maxWidth: 460,
                marginInline: 'auto', lineHeight: 1.8,
              }}>
                نعمل على تجهيز فعاليات مميّزة — تابعنا على إنستغرام أو واتساب لتكون أوّل من يعلم.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
                <a
                  href="https://www.instagram.com/kaseetmedia/"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    background: GOLD, color: '#121927',
                    fontFamily: F, fontWeight: 700, fontSize: 15,
                    padding: '12px 28px', borderRadius: 999,
                    textDecoration: 'none', display: 'inline-block',
                  }}
                >
                  تابعنا على إنستغرام
                </a>
                <Link
                  href="/courses/voiceover"
                  style={{
                    background: 'transparent', border: `2px solid ${INK}`,
                    color: INK, fontFamily: F, fontWeight: 700, fontSize: 15,
                    padding: '12px 28px', borderRadius: 999,
                    textDecoration: 'none', display: 'inline-block',
                  }}
                >
                  استكشف الدورات
                </Link>
              </div>
            </div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <>
                  <h2 style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: INK, marginBottom: 24 }}>
                    الأحداث القادمة
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {upcoming.map((ev) => <EventCard key={ev.slug} event={ev} />)}
                  </div>
                </>
              )}

              {past.length > 0 && (
                <div style={{ marginTop: 48 }}>
                  <h2 style={{ fontFamily: F, fontSize: 18, fontWeight: 700, color: INK2, marginBottom: 20 }}>
                    أحداث سابقة
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.65 }}>
                    {past.map((ev) => <EventCard key={ev.slug} event={ev} isPast />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

function EventCard({ event, isPast }: { event: KaseetEvent; isPast?: boolean }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      border: '1px solid rgba(24,32,47,0.08)',
      padding: '20px 24px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Date box */}
        <div style={{
          background: isPast ? '#f3f4f6' : `${GOLD}18`,
          border: `1px solid ${isPast ? '#d1d5db' : `${GOLD}40`}`,
          borderRadius: 12, padding: '10px 16px', textAlign: 'center',
          minWidth: 70, flexShrink: 0,
        }}>
          <p style={{
            fontFamily: F, fontWeight: 800, fontSize: 16,
            color: isPast ? '#9ca3af' : '#8A6200', margin: 0,
          }}>
            {event.date_ar.split(' ')[0]}
          </p>
          <p style={{
            fontFamily: F, fontSize: 12, color: isPast ? '#9ca3af' : INK2, margin: 0,
          }}>
            {event.date_ar.split(' ').slice(1).join(' ')}
          </p>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={{
              background: event.isFree ? '#d1fae5' : `${GOLD}22`,
              color: event.isFree ? '#065f46' : '#8A6200',
              fontFamily: F, fontSize: 12, fontWeight: 700,
              padding: '2px 10px', borderRadius: 999,
            }}>
              {event.isFree ? 'مجاناً' : 'مدفوع'}
            </span>
          </div>
          <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: INK, margin: '0 0 6px' }}>
            {event.title}
          </h3>
          <p style={{ fontFamily: F, fontSize: 14, color: INK2, margin: '0 0 6px', lineHeight: 1.7 }}>
            {event.description}
          </p>
          <p style={{ fontFamily: F, fontSize: 13, color: INK2, margin: 0 }}>
            🕐 {event.time_ar} &nbsp;·&nbsp; 📍 {event.location}
          </p>
        </div>

        {/* CTA */}
        {!isPast && event.registerUrl && (
          <a
            href={event.registerUrl}
            target="_blank" rel="noopener noreferrer"
            style={{
              background: GOLD, color: '#121927',
              fontFamily: F, fontWeight: 700, fontSize: 14,
              padding: '10px 22px', borderRadius: 999,
              textDecoration: 'none', flexShrink: 0,
              alignSelf: 'center',
            }}
          >
            سجّل الآن
          </a>
        )}
      </div>
    </div>
  );
}
