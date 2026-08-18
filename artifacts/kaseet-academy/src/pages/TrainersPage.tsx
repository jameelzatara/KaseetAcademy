/**
 * ⑫ TrainersPage — صفحة قائمة المدرّبين
 */
import { useEffect } from 'react';
import { Link } from 'wouter';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { usePageMeta } from '../hooks/usePageMeta';
import { TRAINERS } from '../data/trainers';

// صور المدرّبين (import مباشر)
import yasar from '@assets/المدربة_يسار_عبده_1785855126478.jpeg';
import rana  from '@assets/trainer-rana-azzam_1785428982698.JPG';
import omar  from '@assets/trainer-omar_1785428945248.jpg';

const PHOTOS: Record<string, string> = {
  'yasar-abdo':           yasar,
  'rana-azzam':           rana,
  'omar-darabkeh':        omar,
  // 'dr-soheib-khawaldeh' ← لا صورة — avatar احتياطي
};

const GOLD   = '#FFC107';
const CREAM  = '#F5F4F0';
const INK    = '#18202F';
const INK2   = '#56617A';
const F      = "'Tajawal', sans-serif";
const FP     = "'Poppins', sans-serif";

const COURSE_LABELS: Record<string, string> = {
  'voiceover':         'أساسيات التعليق',
  'voiceover-live':    'أساسيات التعليق (أونلاين)',
  'presenter':         'المذيع المحترف',
  'arabic-language':   'اللغة العربية للمذيعين',
  'public-speaking':   'فن الخطابة',
};

export default function TrainersPage() {
  usePageMeta({
    title:       'فريق المدرّبين | كاسيت أكاديمي',
    description: 'تعرّف على مدرّبي كاسيت أكاديمي — خبراء الأداء الصوتي والإعلام وفن الخطابة.',
  });

  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []);

  return (
    <>
      <Navbar />
      <div style={{ background: CREAM, minHeight: '100vh', paddingTop: 80 }}>

        {/* Hero */}
        <section style={{
          background: '#0D0B14',
          padding: 'clamp(48px,8vw,96px) clamp(16px,4vw,48px)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto 20px', direction: 'rtl' }}>
            <PageBreadcrumb crumbs={[{ label: 'الرئيسية', href: '/' }, { label: 'المدرّبون' }]} theme="dark" />
          </div>
          <p style={{
            fontFamily: FP, fontSize: 12, fontWeight: 600, letterSpacing: '0.12em',
            color: GOLD, textTransform: 'uppercase', marginBottom: 12,
          }}>Our Trainers</p>
          <h1 style={{
            fontFamily: F, fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900,
            color: '#fff', margin: 0,
          }}>فريق المدرّبين</h1>
          <p style={{
            fontFamily: F, fontSize: 'clamp(15px,1.8vw,18px)', color: 'rgba(255,255,255,0.65)',
            marginTop: 12, maxWidth: 600, marginInline: 'auto',
          }}>
            محترفون يجمعون بين الممارسة الميدانية والأسلوب التعليمي المتقن
          </p>
        </section>

        {/* Cards */}
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          padding: 'clamp(40px,6vw,72px) clamp(16px,4vw,48px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px,100%),1fr))',
          gap: 28,
        }}>
          {TRAINERS.map((trainer) => {
            const photo = PHOTOS[trainer.slug];
            return (
              <Link key={trainer.slug} href={`/trainers/${trainer.slug}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background: '#fff', borderRadius: 20,
                    boxShadow: '0 2px 20px rgba(0,0,0,0.07)',
                    border: '1px solid rgba(24,32,47,0.07)',
                    overflow: 'hidden', cursor: 'pointer',
                    transition: 'transform .2s, box-shadow .2s',
                  }}
                  onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, {
                    transform: 'translateY(-4px)', boxShadow: '0 8px 36px rgba(0,0,0,0.14)',
                  })}
                  onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, {
                    transform: 'none', boxShadow: '0 2px 20px rgba(0,0,0,0.07)',
                  })}
                >
                  {/* Avatar */}
                  <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                    {photo ? (
                      <img
                        src={photo}
                        alt={`صورة المدرّب/ة ${trainer.name}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        background: `linear-gradient(135deg, ${trainer.avatarColor}cc, ${trainer.avatarColor}55)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{
                          fontFamily: F, fontWeight: 900, fontSize: 64,
                          color: '#fff',
                        }}>
                          {trainer.name.split(' ').map(w => w.charAt(0)).join('').substring(0, 2)}
                        </span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      height: 80,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.40), transparent)',
                    }} />
                  </div>

                  {/* Content */}
                  <div style={{ padding: '18px 20px 22px' }}>
                    <h2 style={{
                      fontFamily: F, fontWeight: 800, fontSize: 20,
                      color: INK, margin: '0 0 4px',
                    }}>{trainer.name}</h2>
                    <p style={{
                      fontFamily: F, fontSize: 13, color: GOLD,
                      fontWeight: 700, margin: '0 0 12px',
                    }}>{trainer.title}</p>
                    <p style={{
                      fontFamily: F, fontSize: 14, color: INK2,
                      lineHeight: 1.75, margin: '0 0 14px',
                    }}>
                      {trainer.bio.substring(0, 110)}{trainer.bio.length > 110 ? '…' : ''}
                    </p>

                    {/* Course tags */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {trainer.courses.map((c) => (
                        <span key={c} style={{
                          background: `${GOLD}18`, border: `1px solid ${GOLD}44`,
                          color: '#8A6200', fontFamily: F, fontSize: 12, fontWeight: 700,
                          padding: '3px 10px', borderRadius: 999,
                        }}>
                          {COURSE_LABELS[c] ?? c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
