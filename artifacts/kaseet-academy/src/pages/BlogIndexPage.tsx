/**
 * BlogIndexPage — التصميم منقول حرفياً من blog-index.html
 * ⛔ لا Tailwind · ⛔ لا تعديل على الألوان أو المقاسات
 */
import { useEffect, useState } from 'react';
import { Link, useSearch } from 'wouter';
import Navbar from '../components/Navbar';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import SiteFooter from '../components/SiteFooter';
import { usePageMeta } from '../hooks/usePageMeta';
import { BLOG_POSTS, type BlogPost } from '../data/blog';

/* ── الغلاف المولَّد ─────────────────────────────────────── */
function GeneratedCover({
  slug, title, category, fontSize = '19px',
}: { slug: string; title: string; category: string; fontSize?: string }) {
  return (
    <div className="gc" data-cat={category}>
      <svg className="gc-pat" preserveAspectRatio="none" viewBox="0 0 800 400" aria-hidden="true">
        <defs>
          <pattern id={`fm-${slug}`} width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M0,0 L22,22 L0,44 Z" fill="rgba(255,255,255,.022)" />
            <path d="M44,0 L22,22 L44,44 Z" fill="rgba(255,255,255,.042)" />
            <path d="M0,0 L22,22 L44,0 Z" fill="rgba(255,255,255,.034)" />
            <path d="M0,44 L22,22 L44,44 Z" fill="rgba(255,255,255,.012)" />
          </pattern>
        </defs>
        <rect width="800" height="400" fill={`url(#fm-${slug})`} />
      </svg>
      <span className="gc-cat">{category}</span>
      <h3 className="gc-title" style={{ fontSize }}>{title}</h3>
      <span className="gc-mark">كاسيت</span>
    </div>
  );
}

/* ── بطاقة مقال عادية ────────────────────────────────────── */
function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="post">
        <GeneratedCover slug={post.slug} title={post.title} category={post.category} />
        <div className="pb">
          <span className="ptag">{post.category}</span>
          <h3>{post.title}</h3>
          <p>{post.description}</p>
          <div className="pm"><span className="num">{post.readingMinutes}</span> دقائق قراءة</div>
        </div>
      </article>
    </Link>
  );
}

const CATEGORIES = ['الكلّ', 'البداية', 'المهارة', 'التقنية', 'السوق', 'قصص'];

export default function BlogIndexPage() {
  usePageMeta({
    title: 'مدوّنة كاسيت — كلّ ما تحتاج معرفته عن الصوت والتعليق',
    description: 'مقالات عملية من داخل الاستوديو — عن المهارة، والمعدّات، والسوق، ومن أين تبدأ.',
  });

  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []);

  const search     = useSearch();
  const params     = new URLSearchParams(search);
  const initCat    = params.get('cat') || 'الكلّ';
  const [activeCat, setActiveCat] = useState(initCat);

  function selectCat(cat: string) {
    setActiveCat(cat);
    const url = cat === 'الكلّ' ? window.location.pathname : `${window.location.pathname}?cat=${encodeURIComponent(cat)}`;
    window.history.replaceState(null, '', url);
  }

  const featured = BLOG_POSTS.find(p => p.featured) ?? BLOG_POSTS[0];
  const filtered = BLOG_POSTS
    .filter(p => p.slug !== featured.slug)
    .filter(p => activeCat === 'الكلّ' || p.category === activeCat);

  return (
    <>
      {/* ── الأنماط المنقولة حرفياً ────────────────────── */}
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Poppins:wght@600&display=swap');
.blog-page{font-family:'Tajawal',sans-serif;background:#1A2533;color:#FFFFFF;line-height:1.9;-webkit-font-smoothing:antialiased;min-height:100vh;padding-top:64px}
.blog-page::before{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(to right,rgba(255,255,255,.016) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.016) 1px,transparent 1px);background-size:64px 64px}
.blog-page .page{position:relative;z-index:1}
.blog-page .wrap{max-width:1160px;margin:0 auto;padding:0 24px}
.blog-page .num{font-family:'Poppins'}
.blog-page .btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;font-family:inherit;font-size:15px;font-weight:700;padding:13px 26px;border-radius:999px;border:1px solid transparent;cursor:pointer;text-decoration:none;transition:.22s}
.blog-page .btn-gold{background:#FFC107;color:#1A1206;box-shadow:0 10px 28px rgba(255,193,7,.22)}
.blog-page .btn-gold:hover{transform:translateY(-2px)}
.blog-page .btn-ghost{background:rgba(255,255,255,.05);color:#FFFFFF;border-color:rgba(255,255,255,.16)}
.blog-page .btn-ghost:hover{border-color:rgba(255,193,7,.28);color:#FFC107}
.blog-page .eyebrow{display:inline-flex;align-items:center;gap:8px;background:#FFC107;color:#1A1206;font-size:12.5px;font-weight:700;padding:6px 15px;border-radius:999px}
.blog-page .eyebrow i{width:6px;height:6px;border-radius:50%;background:#1A1206;display:block}
.gc{position:relative;aspect-ratio:16/10;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:22px;background:#1A2533}
.gc::before{content:"";position:absolute;inset:0;z-index:1}
.gc[data-cat="البداية"]::before{background:radial-gradient(ellipse 82% 74% at 28% 18%,rgba(255,193,7,.22),transparent 72%)}
.gc[data-cat="المهارة"]::before{background:radial-gradient(ellipse 82% 74% at 28% 18%,rgba(74,130,196,.24),transparent 72%)}
.gc[data-cat="التقنية"]::before{background:radial-gradient(ellipse 82% 74% at 28% 18%,rgba(30,122,133,.24),transparent 72%)}
.gc[data-cat="السوق"]::before{background:radial-gradient(ellipse 82% 74% at 28% 18%,rgba(107,91,168,.24),transparent 72%)}
.gc[data-cat="قصص"]::before{background:radial-gradient(ellipse 82% 74% at 28% 18%,rgba(31,157,87,.20),transparent 72%)}
.gc-pat{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.gc-cat{position:relative;z-index:2;align-self:flex-start;margin-bottom:auto;font-size:11.5px;font-weight:700;color:#FFC107;background:rgba(0,0,0,.38);border:1px solid rgba(255,193,7,.28);padding:4px 12px;border-radius:999px}
.gc-title{position:relative;z-index:2;font-weight:800;color:#fff;line-height:1.5;text-shadow:0 2px 16px rgba(0,0,0,.65)}
.gc-mark{position:absolute;top:20px;inset-inline-end:22px;z-index:2;font-size:15px;font-weight:800;color:#FFC107;opacity:.55}
.blog-page .hero{position:relative;overflow:hidden;isolation:isolate;padding:84px 0 54px;text-align:center}
.blog-page .hero::before{content:"";position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 72% 62% at 50% 0%,rgba(255,193,7,.13),transparent 72%)}
.blog-page .hero .wrap{position:relative;z-index:2}
.blog-page .hero h1{font-size:clamp(29px,4.4vw,46px);font-weight:800;line-height:1.3;letter-spacing:-1px;margin-top:18px}
.blog-page .hero h1 span{color:#FFC107}
.blog-page .hero p{color:#9DA9BB;font-size:16.5px;max-width:640px;margin:15px auto 0}
.blog-page .cats{display:flex;gap:10px;overflow-x:auto;padding:26px 0 30px;justify-content:center;flex-wrap:wrap}
.blog-page .cat{padding:9px 18px;border-radius:999px;background:#22303F;border:1px solid rgba(255,255,255,.09);color:#C7D1DF;font-size:14px;font-weight:700;cursor:pointer;transition:.2s;white-space:nowrap}
.blog-page .cat:hover{border-color:rgba(255,193,7,.28)}
.blog-page .cat.on{background:#FFC107;color:#1A1206;border-color:#FFC107}
.feat{display:grid;grid-template-columns:1.12fr 1fr;background:#22303F;border:1px solid rgba(255,193,7,.28);border-radius:22px;overflow:hidden;margin-bottom:34px;cursor:pointer;box-shadow:0 0 0 1px rgba(255,193,7,.14),0 26px 66px rgba(0,0,0,.4);transition:.25s;text-decoration:none;color:inherit;display:grid}
.feat:hover{transform:translateY(-3px)}
.feat .fb{padding:34px 32px;display:flex;flex-direction:column;justify-content:center}
.feat .ftag{align-self:flex-start;font-size:11.5px;font-weight:700;color:#FFC107;background:rgba(255,193,7,.10);border:1px solid rgba(255,193,7,.28);padding:4px 12px;border-radius:999px}
.feat h2{font-size:26px;font-weight:800;line-height:1.5;margin:14px 0 12px}
.feat p{font-size:15px;color:#9DA9BB;line-height:1.95}
.feat .fm{margin-top:18px;padding-top:16px;border-top:1px solid rgba(255,255,255,.09);font-size:13px;color:#7B879B;display:flex;align-items:center;gap:10px}
.feat .fgo{color:#FFC107;font-weight:700;margin-inline-start:auto}
.posts{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;padding-bottom:70px}
.post{background:#22303F;border:1px solid rgba(255,255,255,.09);border-radius:18px;overflow:hidden;display:flex;flex-direction:column;cursor:pointer;transition:.25s;text-decoration:none;color:inherit}
.post:hover{transform:translateY(-4px);border-color:rgba(255,193,7,.28);background:#2B3B4E}
.pb{padding:22px 20px;display:flex;flex-direction:column;flex:1}
.ptag{align-self:flex-start;font-size:11.5px;font-weight:700;color:#FFC107;background:rgba(255,193,7,.10);border:1px solid rgba(255,193,7,.28);padding:4px 11px;border-radius:999px}
.post h3{font-size:17.5px;font-weight:800;line-height:1.55;margin:12px 0 8px}
.post p{font-size:14px;color:#9DA9BB;line-height:1.85;flex:1}
.pm{margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,.09);font-size:12.5px;color:#7B879B}
.blog-page .endcta{background:#22303F;border-top:1px solid rgba(255,193,7,.28);padding:56px 0;text-align:center}
.blog-page .endcta h2{font-size:27px;font-weight:800;line-height:1.45}
.blog-page .endcta h2 span{color:#FFC107}
.blog-page .endcta p{color:#9DA9BB;margin:14px auto 26px;max-width:520px}
.blog-page .endcta .row{display:flex;gap:13px;justify-content:center;flex-wrap:wrap}
@media(max-width:1000px){.posts{grid-template-columns:repeat(2,1fr)}.feat{grid-template-columns:1fr}}
@media(max-width:640px){.posts{grid-template-columns:1fr}}
      `}</style>

      <Navbar />

      <div className="blog-page">
        <div style={{ padding: '8px clamp(16px,4vw,48px)', direction: 'rtl' }}>
          <PageBreadcrumb crumbs={[{ label: 'الرئيسية', href: '/' }, { label: 'المدوّنة' }]} theme="dark" />
        </div>
        <div className="page">

          {/* ── الهيرو ──────────────────────────────────── */}
          <header className="hero">
            <div className="wrap">
              <span className="eyebrow"><i></i> مدوّنة كاسيت</span>
              <h1>كلّ ما تحتاج معرفته عن <span>الصوت والتعليق</span></h1>
              <p>مقالات عملية من داخل الاستوديو — عن المهارة، والمعدّات، والسوق، ومن أين تبدأ.</p>
            </div>
          </header>

          <div className="wrap">

            {/* ── شريط التصنيفات ───────────────────────── */}
            <div className="cats">
              {CATEGORIES.map(cat => (
                <span
                  key={cat}
                  className={`cat${activeCat === cat ? ' on' : ''}`}
                  onClick={() => selectCat(cat)}
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* ── المقال المميّز ───────────────────────── */}
            {(activeCat === 'الكلّ' || activeCat === featured.category) && (
              <Link href={`/blog/${featured.slug}`}>
                <article className="feat">
                  <GeneratedCover
                    slug={featured.slug}
                    title={featured.title}
                    category={featured.category}
                    fontSize="26px"
                  />
                  <div className="fb">
                    <span className="ftag">{featured.category} · مميّز</span>
                    <h2>{featured.title}</h2>
                    <p>{featured.description}</p>
                    <div className="fm">
                      <span><span className="num">{featured.readingMinutes}</span> دقائق قراءة</span>
                      <span className="fgo">اقرأ المقال ←</span>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* ── شبكة المقالات ───────────────────────── */}
            <div className="posts">
              {filtered.map(post => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>

          </div>

          {/* ── الدعوة الختامية ──────────────────────── */}
          <section className="endcta">
            <div className="wrap">
              <h2>تريد أن تعرف أين يقف <span>صوتك فعلاً</span>؟</h2>
              <p>تقييم صوتي مجاني يستمع إليه مدرّب من كاسيت — لا خوارزمية. النتيجة خلال 24 ساعة.</p>
              <div className="row">
                <Link href="/voiceover" className="btn btn-gold">سمّعنا صوتك — مجاناً ←</Link>
                <Link href="/voiceover" className="btn btn-ghost">تصفّح الدورات</Link>
              </div>
            </div>
          </section>

        </div>
      </div>

      <SiteFooter />
    </>
  );
}
