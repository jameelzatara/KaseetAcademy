/**
 * ⑫ TrainerDetailPage — صفحة المدرّب الفردية
 */
import { useEffect } from 'react';
import { Link, useParams } from 'wouter';
import Navbar from '../components/Navbar';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import SiteFooter from '../components/SiteFooter';
import { usePageMeta } from '../hooks/usePageMeta';
import { getTrainer } from '../data/trainers';

// صور المدرّبين
import yasar from '@assets/المدربة_يسار_عبده_1785855126478.jpeg';
import rana  from '@assets/trainer-rana-azzam_1785428982698.JPG';
import omar  from '@assets/trainer-omar_1785428945248.jpg';

const PHOTOS: Record<string, string> = {
  'yasar-abdo':    yasar,
  'rana-azzam':    rana,
  'omar-darabkeh': omar,
};

const GOLD  = '#FFC107';
const INK   = '#18202F';
const INK2  = '#56617A';
const F     = "'Tajawal', sans-serif";
const FP    = "'Poppins', sans-serif";

const COURSE_LABELS: Record<string, string> = {
  'voiceover':         'أساسيات التعليق والأداء الصوتي',
  'voiceover-live':    'أساسيات التعليق — أونلاين LIVE',
  'presenter':         'المذيع المحترف',
  'arabic-language':   'اللغة العربية للمذيعين',
  'public-speaking':   'فن الخطابة والتأثير',
};

const COURSE_PATHS: Record<string, string> = {
  'voiceover':         '/courses/voiceover',
  'voiceover-live':    '/courses/voiceover-live',
  'presenter':         '/courses/presenter',
  'arabic-language':   '/courses/arabic-language',
  'public-speaking':   '/courses/public-speaking',
};

export default function TrainerDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const trainer = getTrainer(slug ?? '');

  usePageMeta({
    title:       trainer ? `${trainer.name} — مدرّب كاسيت أكاديمي` : 'مدرّب غير موجود',
    description: trainer?.bio ?? '',
  });

  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []);

  // Course JSON-LD for each course the trainer teaches
  useEffect(() => {
    if (!trainer) return;
    const existing = document.getElementById('trainer-jsonld');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id   = 'trainer-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type':    'Person',
      name:       trainer.name,
      alternateName: trainer.nameEn,
      jobTitle:   trainer.title,
      description: trainer.bio,
      worksFor: {
        '@type': 'EducationalOrganization',
        name:    'كاسيت أكاديمي',
        url:     'https://kaseet.com',
      },
      knowsAbout: trainer.specialties,
    });
    document.head.appendChild(script);
    return () => { document.getElementById('trainer-jsonld')?.remove(); };
  }, [trainer]);

  if (!trainer) {
    return (
      <>
        <Navbar />
        <div style={{ background: '#F5F4F0', minHeight: '100vh', paddingTop: 120, textAlign: 'center' }}>
          <p style={{ fontFamily: F, fontSize: 22, color: INK }}>لم يُعثر على المدرّب.</p>
          <Link href="/trainers" style={{ color: GOLD, fontFamily: F, fontWeight: 700 }}>
            ← عودة إلى فريق المدرّبين
          </Link>
        </div>
        <SiteFooter />
      </>
    );
  }

  const photo = PHOTOS[trainer.slug];

  return (
    <>
      <Navbar />
      <div style={{ background: '#F5F4F0', minHeight: '100vh', paddingTop: 80 }}>

        {/* Hero */}
        <section style={{
          background: '#0D0B14',
          padding: 'clamp(48px,7vw,80px) clamp(16px,4vw,48px)',
        }}>
          <div style={{ maxWidth: 860, margin: '0 auto 20px', direction: 'rtl' }}>
            <PageBreadcrumb crumbs={[{ label: 'الرئيسية', href: '/' }, { label: 'المدرّبون', href: '/trainers' }, { label: trainer.name }]} theme="dark" />
          </div>
          <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', gap: 36, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Avatar */}
            <div style={{
              width: 'clamp(100px,20vw,160px)', height: 'clamp(100px,20vw,160px)',
              borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
              border: `3px solid ${GOLD}55`,
            }}>
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
                  <span style={{ fontFamily: F, fontWeight: 900, fontSize: 56, color: '#fff' }}>
                    {trainer.name.split(' ').map(w => w.charAt(0)).join('').substring(0, 2)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: FP, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: GOLD, textTransform: 'uppercase', margin: '0 0 8px' }}>
                Kaseet Trainer
              </p>
              <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,4vw,42px)', color: '#fff', margin: '0 0 6px' }}>
                {trainer.name}
              </h1>
              <p style={{ fontFamily: F, fontSize: 'clamp(14px,1.6vw,17px)', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                {trainer.title}
              </p>
            </div>
          </div>
        </section>

        {/* Body */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(32px,6vw,64px) clamp(16px,4vw,48px)' }}>

          {/* Bio */}
          <section style={{ background: '#fff', borderRadius: 20, padding: '28px 32px', marginBottom: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: INK, marginBottom: 16 }}>
              نبذة عن {trainer.name}
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, color: INK2, lineHeight: 2, margin: 0, whiteSpace: 'pre-line' }}>
              {trainer.fullBio}
            </p>
          </section>

          {/* Specialties */}
          <section style={{ background: '#fff', borderRadius: 20, padding: '24px 32px', marginBottom: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: INK, marginBottom: 14 }}>
              مجالات التخصّص
            </h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {trainer.specialties.map((s) => (
                <span key={s} style={{
                  background: `${GOLD}18`, border: `1px solid ${GOLD}44`,
                  color: '#8A6200', fontFamily: F, fontSize: 14, fontWeight: 700,
                  padding: '5px 16px', borderRadius: 999,
                }}>
                  {s}
                </span>
              ))}
            </div>
          </section>

          {/* Courses */}
          <section style={{ background: '#fff', borderRadius: 20, padding: '24px 32px', marginBottom: 40, boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: INK, marginBottom: 14 }}>
              الدورات التي يُدرّسها
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {trainer.courses.map((c) => (
                <Link key={c} href={COURSE_PATHS[c] ?? '/'} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px',
                    background: '#f8f7f4', borderRadius: 12,
                    border: '1px solid rgba(24,32,47,0.08)',
                    transition: 'background .15s',
                  }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#f0ede5')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#f8f7f4')}
                  >
                    <span style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: INK }}>
                      {COURSE_LABELS[c] ?? c}
                    </span>
                    <span style={{ color: GOLD, fontSize: 18 }}>←</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Back */}
          <div style={{ textAlign: 'center' }}>
            <Link href="/trainers" style={{
              fontFamily: F, fontWeight: 700, fontSize: 15, color: INK2,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              ← عودة إلى جميع المدرّبين
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
