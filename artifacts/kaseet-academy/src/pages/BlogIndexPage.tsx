/**
 * ⑩ BlogIndexPage — فهرس المدوّنة
 */
import { useEffect } from 'react';
import { Link } from 'wouter';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import { usePageMeta } from '../hooks/usePageMeta';
import { BLOG_POSTS } from '../data/blog';

const BASE   = import.meta.env.BASE_URL;
const GOLD   = '#FFC107';
const CREAM  = '#F5F4F0';
const INK    = '#18202F';
const INK2   = '#56617A';
const F      = "'Tajawal', sans-serif";
const FP     = "'Poppins', sans-serif";

export default function BlogIndexPage() {
  usePageMeta({
    title:       'المدوّنة | كاسيت أكاديمي',
    description: 'أدلة ومقالات مجانية في الأداء الصوتي والإعلام واللغة العربية من خبراء كاسيت أكاديمي.',
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
          <p style={{
            fontFamily: FP, fontSize: 12, fontWeight: 600, letterSpacing: '0.12em',
            color: GOLD, textTransform: 'uppercase', marginBottom: 12,
          }}>Free Resources</p>
          <h1 style={{
            fontFamily: F, fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900,
            color: '#fff', margin: '0 0 14px',
          }}>أدلة مجانية ومقالات</h1>
          <p style={{
            fontFamily: F, fontSize: 'clamp(15px,1.8vw,18px)', color: 'rgba(255,255,255,0.65)',
            maxWidth: 580, marginInline: 'auto', lineHeight: 1.8,
          }}>
            محتوى تعليمي معمّق من خبراء كاسيت أكاديمي — اقرأ المقال، ثم حمّل الدليل الكامل مجانًا.
          </p>
        </section>

        {/* Articles grid */}
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          padding: 'clamp(40px,6vw,72px) clamp(16px,4vw,48px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px,100%),1fr))',
          gap: 28,
        }}>
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <article
                style={{
                  background: '#fff', borderRadius: 20,
                  boxShadow: '0 2px 20px rgba(0,0,0,0.07)',
                  border: '1px solid rgba(24,32,47,0.07)',
                  overflow: 'hidden', cursor: 'pointer',
                  transition: 'transform .2s, box-shadow .2s',
                }}
                onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, {
                  transform: 'translateY(-4px)', boxShadow: '0 8px 36px rgba(0,0,0,0.12)',
                })}
                onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, {
                  transform: 'none', boxShadow: '0 2px 20px rgba(0,0,0,0.07)',
                })}
              >
                {/* Cover image or emoji */}
                {post.cover ? (
                  <img
                    src={`${BASE}blog-images/${post.cover}`}
                    alt={post.title}
                    loading="lazy"
                    style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{
                    height: 180, background: '#0D0B14',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 56,
                  }}>
                    {post.coverEmoji}
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: '20px 22px 24px' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                    <span style={{
                      background: `${GOLD}22`, border: `1px solid ${GOLD}44`,
                      color: '#8A6200', fontFamily: F, fontSize: 12, fontWeight: 700,
                      padding: '3px 12px', borderRadius: 999,
                    }}>
                      {post.category}
                    </span>
                    <span style={{ fontFamily: FP, fontSize: 12, color: INK2 }}>
                      {post.readMins} دقائق للقراءة
                    </span>
                  </div>
                  <h2 style={{
                    fontFamily: F, fontWeight: 800, fontSize: 18, color: INK,
                    margin: '0 0 10px', lineHeight: 1.5,
                  }}>
                    {post.title}
                  </h2>
                  <p style={{
                    fontFamily: F, fontSize: 14, color: INK2,
                    lineHeight: 1.8, margin: '0 0 16px',
                  }}>
                    {post.excerpt}
                  </p>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    color: '#8A6200', fontFamily: F, fontWeight: 700, fontSize: 14,
                  }}>
                    <span>📥</span>
                    <span>اقرأ وحمّل الدليل مجانًا</span>
                    <span style={{ marginInlineStart: 'auto' }}>←</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
