/**
 * ⑩ BlogPostPage — مقال المدوّنة + نموذج تحميل الدليل (lead magnet)
 *
 * الفلسفة:
 *  - المحتوى مجاني — لا paywall
 *  - الـPDF خلف نموذج بريدي (name + WhatsApp + email)
 *  - فشل الإرسال لا يحجب المحتوى
 */
import { useState, useEffect } from 'react';
import { Link, useParams } from 'wouter';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import { usePageMeta } from '../hooks/usePageMeta';
import { getBlogPost } from '../data/blog';

const GOLD    = '#FFC107';
const CREAM   = '#F5F4F0';
const INK     = '#18202F';
const INK2    = '#56617A';
const F       = "'Tajawal', sans-serif";
const FP      = "'Poppins', sans-serif";
const BASE    = import.meta.env.BASE_URL;

type FormState = 'idle' | 'sending' | 'success' | 'error';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post      = getBlogPost(slug ?? '');

  usePageMeta({
    title:       post ? post.title : 'مقال غير موجود | كاسيت أكاديمي',
    description: post?.excerpt ?? '',
  });

  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []);

  const [name,     setName]     = useState('');
  const [phone,    setPhone]    = useState('');
  const [email,    setEmail]    = useState('');
  const [state,    setState]    = useState<FormState>('idle');
  const [errMsg,   setErrMsg]   = useState('');

  if (!post) {
    return (
      <>
        <Navbar />
        <div style={{ background: CREAM, minHeight: '100vh', paddingTop: 120, textAlign: 'center' }}>
          <p style={{ fontFamily: F, fontSize: 22, color: INK }}>المقال غير موجود.</p>
          <Link href="/blog" style={{ color: GOLD, fontFamily: F, fontWeight: 700 }}>← عودة للمدوّنة</Link>
        </div>
        <SiteFooter />
      </>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setErrMsg('يرجى ملء جميع الحقول.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setErrMsg('البريد الإلكتروني غير صحيح.');
      return;
    }
    setErrMsg('');
    setState('sending');
    try {
      const res = await fetch(`${BASE}api/blog/lead-magnet`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, phone, email, slug: post!.slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'خطأ في الخادم');
      setState('success');
    } catch (err: any) {
      setState('error');
      setErrMsg(err.message ?? 'حدث خطأ ما — يرجى المحاولة مجدّدًا.');
    }
  }

  return (
    <>
      <Navbar />

      {/* Article JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type':    'Article',
          headline:   post.title,
          description: post.excerpt,
          author: { '@type': 'Organization', name: 'كاسيت أكاديمي' },
          publisher: {
            '@type': 'Organization', name: 'كاسيت أكاديمي',
            logo: { '@type': 'ImageObject', url: 'https://kaseet.com/favicon.svg' },
          },
          datePublished: post.publishDate,
          inLanguage: 'ar',
        }),
      }} />

      <div style={{ background: CREAM, minHeight: '100vh', paddingTop: 80 }}>

        {/* Hero */}
        <section style={{
          background: '#0D0B14',
          padding: 'clamp(40px,6vw,72px) clamp(16px,4vw,48px)',
        }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Link href="/blog" style={{
              fontFamily: F, fontSize: 14, color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none', display: 'inline-block', marginBottom: 16,
            }}>
              ← المدوّنة
            </Link>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              <span style={{
                background: `${GOLD}22`, border: `1px solid ${GOLD}44`,
                color: GOLD, fontFamily: F, fontSize: 13, fontWeight: 700,
                padding: '3px 14px', borderRadius: 999,
              }}>
                {post.category}
              </span>
              <span style={{ fontFamily: FP, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                {post.readMins} دقائق
              </span>
            </div>
            <h1 style={{
              fontFamily: F, fontWeight: 900, fontSize: 'clamp(22px,4vw,38px)',
              color: '#fff', margin: '0 0 14px', lineHeight: 1.4,
            }}>
              {post.title}
            </h1>
            <p style={{
              fontFamily: F, fontSize: 'clamp(14px,1.6vw,17px)',
              color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.8,
            }}>
              {post.excerpt}
            </p>
          </div>
        </section>

        {/* Body */}
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(32px,5vw,60px) clamp(16px,4vw,48px)' }}>

          {/* Cover image */}
          {post.cover && (
            <figure style={{ margin: '0 0 40px', borderRadius: 20, overflow: 'hidden' }}>
              <img
                src={`${BASE}blog-images/${post.cover}`}
                alt={post.title}
                loading="eager"
                style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }}
              />
            </figure>
          )}

          {/* Article content */}
          <article
            className="blog-body"
            dangerouslySetInnerHTML={{ __html: post.body.replace(/__BASE__/g, BASE) }}
            style={{
              fontFamily: F, fontSize: 'clamp(15px,1.6vw,17px)', color: INK2,
              lineHeight: 2, marginBottom: 48,
            }}
          />

          {/* Lead magnet gate */}
          <section style={{
            background: '#fff',
            border: `2px solid ${GOLD}55`,
            borderRadius: 24,
            padding: 'clamp(24px,4vw,40px)',
            boxShadow: '0 4px 32px rgba(255,193,7,0.12)',
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 36 }}>📥</span>
              <div>
                <h2 style={{
                  fontFamily: F, fontWeight: 900, fontSize: 'clamp(18px,2.5vw,24px)',
                  color: INK, margin: 0,
                }}>
                  {post.pdfLabel}
                </h2>
                <p style={{ fontFamily: F, fontSize: 14, color: INK2, margin: '4px 0 0' }}>
                  أدخل بياناتك وسيصلك الدليل مباشرةً إلى بريدك الإلكتروني
                </p>
              </div>
            </div>

            {state === 'success' ? (
              <div style={{
                background: '#d1fae5', border: '1px solid #6ee7b7',
                borderRadius: 14, padding: '20px 24px', textAlign: 'center',
              }}>
                <p style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: '#065f46', margin: 0 }}>
                  ✅ تمّ الإرسال! راجع صندوق بريدك
                </p>
                <p style={{ fontFamily: F, fontSize: 14, color: '#047857', margin: '8px 0 0' }}>
                  إذا لم تجد الرسالة، تحقق من مجلد «الرسائل غير المرغوب فيها» (Spam).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px,100%),1fr))', gap: 14, marginBottom: 14 }}>
                  <Field label="الاسم الكامل" type="text" value={name}
                    onChange={setName} placeholder="محمد عبدالله" required />
                  <Field label="رقم الواتساب" type="tel" value={phone}
                    onChange={setPhone} placeholder="+962 79 000 0000" required />
                  <Field label="البريد الإلكتروني" type="email" value={email}
                    onChange={setEmail} placeholder="you@example.com" required />
                </div>

                {errMsg && (
                  <p style={{ fontFamily: F, fontSize: 14, color: '#dc2626', marginBottom: 12 }}>
                    ⚠️ {errMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={state === 'sending'}
                  style={{
                    width: '100%', padding: '14px',
                    background: state === 'sending' ? '#d1d5db' : GOLD,
                    color: '#121927',
                    fontFamily: F, fontWeight: 800, fontSize: 16,
                    border: 'none', borderRadius: 14, cursor: state === 'sending' ? 'not-allowed' : 'pointer',
                    transition: 'background .15s, transform .12s',
                  }}
                  onMouseEnter={e => { if (state !== 'sending') (e.currentTarget.style.background = '#e6ad06'); }}
                  onMouseLeave={e => { if (state !== 'sending') (e.currentTarget.style.background = GOLD); }}
                >
                  {state === 'sending' ? 'جارٍ الإرسال…' : '📨 أرسل لي الدليل'}
                </button>

                <p style={{
                  fontFamily: F, fontSize: 12, color: '#9ca3af',
                  textAlign: 'center', margin: '10px 0 0',
                }}>
                  لن نُرسل لك رسائل غير مرغوب فيها. بياناتك آمنة.
                </p>
              </form>
            )}
          </section>

          {/* Back */}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/blog" style={{
              fontFamily: F, fontWeight: 700, fontSize: 15, color: INK2,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              ← عودة إلى المدوّنة
            </Link>
          </div>
        </div>
      </div>

      {/* Global blog article styles */}
      <style>{`
        .blog-body h2 {
          font-family: 'Tajawal', sans-serif;
          font-size: clamp(18px, 2.5vw, 22px);
          font-weight: 800;
          color: #18202F;
          margin: 36px 0 14px;
        }
        .blog-body h3 {
          font-family: 'Tajawal', sans-serif;
          font-size: clamp(15px, 2vw, 18px);
          font-weight: 700;
          color: #18202F;
          margin: 24px 0 10px;
        }
        .blog-body p {
          margin: 0 0 18px;
          line-height: 2;
        }
        .blog-body ul, .blog-body ol {
          padding-inline-start: 24px;
          margin: 0 0 18px;
        }
        .blog-body li {
          margin-bottom: 8px;
          line-height: 1.85;
        }
        .blog-body strong {
          color: #18202F;
          font-weight: 700;
        }
        .blog-body em {
          color: #8A6200;
          font-style: normal;
          font-weight: 600;
        }
      `}</style>
      <SiteFooter />
    </>
  );
}

function Field({
  label, type, value, onChange, placeholder, required,
}: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 14, fontWeight: 700, color: '#18202F' }}>
        {label}{required && <span style={{ color: '#dc2626' }}>*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{
          fontFamily: "'Tajawal', sans-serif", fontSize: 15,
          padding: '11px 14px', borderRadius: 12,
          border: '1.5px solid #e5e7eb', outline: 'none',
          direction: type === 'email' ? 'ltr' : 'rtl',
          background: '#fafafa',
          transition: 'border-color .15s',
        }}
        onFocus={e  => (e.currentTarget.style.borderColor = '#FFC107')}
        onBlur={e   => (e.currentTarget.style.borderColor = '#e5e7eb')}
      />
    </label>
  );
}
