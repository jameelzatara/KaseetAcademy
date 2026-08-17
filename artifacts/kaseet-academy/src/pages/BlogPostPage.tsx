/**
 * BlogPostPage — التصميم منقول حرفياً من blog-article.html
 * ⛔ لا Tailwind · ⛔ لا تعديل على الألوان أو المقاسات
 */
import { useEffect, useRef } from 'react';
import { Link, useParams } from 'wouter';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import { usePageMeta } from '../hooks/usePageMeta';
import { getBlogPost, getRelatedPosts } from '../data/blog';

const BASE_SITE = 'https://kaseet.com';

/* ── حقن mid-cta بعد ثاني عنصر h2 ─────────────────────── */
const MID_CTA = `
<div class="mid-cta">
  <div class="mc-ic">🎙</div>
  <div class="mc-b">
    <b>هل تريد معرفة مستوى صوتك الحقيقي؟</b>
    <span>تقييم صوتي مجاني يستمع إليه مدرّب متخصّص — يحدّد نقاط قوّتك ومسار تطوّرك.</span>
  </div>
  <a class="btn btn-gold" href="/kaseet-academy/voiceover">سمّعنا صوتك ←</a>
</div>`;

function injectMidCta(html: string): string {
  let count = 0;
  return html.replace(/<h2/g, (match) => {
    count++;
    return count === 2 ? MID_CTA + match : match;
  });
}

/* ── الغلاف المولَّد ─────────────────────────────────────── */
function GeneratedCover({ slug, title, category }: { slug: string; title: string; category: string }) {
  const catGrad: Record<string, string> = {
    'البداية':  'radial-gradient(ellipse 80% 74% at 28% 18%,rgba(255,193,7,.26),transparent 72%)',
    'المهارة':  'radial-gradient(ellipse 80% 74% at 28% 18%,rgba(74,130,196,.26),transparent 72%)',
    'التقنية':  'radial-gradient(ellipse 80% 74% at 28% 18%,rgba(30,122,133,.26),transparent 72%)',
    'السوق':    'radial-gradient(ellipse 80% 74% at 28% 18%,rgba(107,91,168,.26),transparent 72%)',
    'قصص':      'radial-gradient(ellipse 80% 74% at 28% 18%,rgba(31,157,87,.22),transparent 72%)',
  };
  return (
    <div className="gc" style={{ ['--gc-grad' as string]: catGrad[category] || catGrad['المهارة'] }}>
      <svg className="gc-pat" preserveAspectRatio="none" viewBox="0 0 800 400" aria-hidden="true">
        <defs>
          <pattern id={`fm-art-${slug}`} width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M0,0 L22,22 L0,44 Z" fill="rgba(255,255,255,.022)" />
            <path d="M44,0 L22,22 L44,44 Z" fill="rgba(255,255,255,.042)" />
            <path d="M0,0 L22,22 L44,0 Z" fill="rgba(255,255,255,.034)" />
            <path d="M0,44 L22,22 L44,44 Z" fill="rgba(255,255,255,.012)" />
          </pattern>
        </defs>
        <rect width="800" height="400" fill={`url(#fm-art-${slug})`} />
      </svg>
      <span className="gc-cat">{category}</span>
      <h2 className="gc-title">{title}</h2>
      <span className="gc-mark">كاسيت</span>
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post     = getBlogPost(slug ?? '');
  const related  = getRelatedPosts(slug ?? '', 3);
  const barRef   = useRef<HTMLDivElement>(null);

  usePageMeta({
    title:       post ? `${post.title} | مدوّنة كاسيت` : 'مدوّنة كاسيت',
    description: post?.description ?? '',
  });

  /* ── شريط التقدّم (منقول حرفياً من blog-article.html) ─── */
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    function onScroll() {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar!.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
    }
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, [slug]);

  /* ── OG + canonical + JSON-LD ─────────────────────────── */
  useEffect(() => {
    if (!post) return;
    const canonical = `${BASE_SITE}/blog/${post.slug}`;
    const ogImg     = `${BASE_SITE}/og-blog-${post.slug}.jpg`;

    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.querySelector<HTMLMetaElement>(sel);
      if (!el) {
        el = document.createElement('meta');
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };

    // canonical
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = canonical;

    // OG
    setMeta('meta[property="og:title"]',       'property', 'og:title');
    setMeta('meta[property="og:title"]',       'content',  post.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description');
    setMeta('meta[property="og:description"]', 'content',  post.description);
    setMeta('meta[property="og:image"]',       'property', 'og:image');
    setMeta('meta[property="og:image"]',       'content',  ogImg);
    setMeta('meta[property="og:type"]',        'property', 'og:type');
    setMeta('meta[property="og:type"]',        'content',  'article');
    setMeta('meta[property="og:url"]',         'property', 'og:url');
    setMeta('meta[property="og:url"]',         'content',  canonical);
    setMeta('meta[property="article:published_time"]', 'property', 'article:published_time');
    setMeta('meta[property="article:published_time"]', 'content',  post.publishedAt);
    setMeta('meta[property="article:author"]', 'property', 'article:author');
    setMeta('meta[property="article:author"]', 'content',  post.author);

    // Twitter
    setMeta('meta[name="twitter:card"]',        'name',    'twitter:card');
    setMeta('meta[name="twitter:card"]',        'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]',       'name',    'twitter:title');
    setMeta('meta[name="twitter:title"]',       'content', post.title);
    setMeta('meta[name="twitter:description"]', 'name',    'twitter:description');
    setMeta('meta[name="twitter:description"]', 'content', post.description);
    setMeta('meta[name="twitter:image"]',       'name',    'twitter:image');
    setMeta('meta[name="twitter:image"]',       'content', ogImg);

    // JSON-LD Article (بلا aggregateRating)
    let ld = document.getElementById('ld-article') as HTMLScriptElement | null;
    if (!ld) { ld = document.createElement('script'); ld.id = 'ld-article'; ld.type = 'application/ld+json'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      author: { '@type': 'Organization', name: post.author },
      datePublished: post.publishedAt,
      publisher: { '@type': 'Organization', name: 'كاسيت أكاديمي', url: BASE_SITE },
      image: ogImg,
      url: canonical,
    });

    return () => {
      document.getElementById('ld-article')?.remove();
    };
  }, [post]);

  if (!post) {
    return (
      <>
        <Navbar />
        <div style={{ background: '#1A2533', minHeight: '100vh', paddingTop: 120, textAlign: 'center', color: '#FFC107', fontFamily: 'Tajawal,sans-serif' }}>
          <h1 style={{ fontSize: 32 }}>المقال غير موجود</h1>
          <Link href="/blog" style={{ color: '#FFC107', marginTop: 24, display: 'inline-block' }}>← العودة للمدوّنة</Link>
        </div>
        <SiteFooter />
      </>
    );
  }

  const bodyWithCta = injectMidCta(post.body);

  return (
    <>
      {/* ── الأنماط المنقولة حرفياً ────────────────────── */}
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Poppins:wght@600&display=swap');
.art-page{font-family:'Tajawal',sans-serif;background:#1A2533;color:#FFFFFF;line-height:1.9;-webkit-font-smoothing:antialiased;padding-top:64px}
.art-page::before{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(to right,rgba(255,255,255,.016) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.016) 1px,transparent 1px);background-size:64px 64px}
.art-page .page{position:relative;z-index:1}
.art-num{font-family:'Poppins'}
.art-page .btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;font-family:inherit;font-size:15px;font-weight:700;padding:13px 26px;border-radius:999px;border:1px solid transparent;cursor:pointer;text-decoration:none;transition:.22s;white-space:nowrap}
.art-page .btn-gold{background:#FFC107;color:#1A1206;box-shadow:0 10px 28px rgba(255,193,7,.22)}
.art-page .btn-gold:hover{transform:translateY(-2px)}
.art-page .btn-ghost{background:rgba(255,255,255,.05);color:#FFFFFF;border-color:rgba(255,255,255,.16)}
.art-page .btn-ghost:hover{border-color:rgba(255,193,7,.28);color:#FFC107}
.bar{position:fixed;top:0;inset-inline-start:0;height:3px;background:#FFC107;z-index:70;width:0;transition:width .1s linear}
.crumb{max-width:720px;margin:0 auto;padding:30px 24px 0;font-size:13.5px;color:#7B879B}
.crumb a{color:#7B879B;text-decoration:none}
.crumb a:hover{color:#FFC107}
.crumb .sep{margin:0 8px;opacity:.5}
.head{max-width:720px;margin:0 auto;padding:20px 24px 0}
.head .tag{display:inline-block;font-size:12px;font-weight:700;color:#FFC107;background:rgba(255,193,7,.10);border:1px solid rgba(255,193,7,.28);padding:5px 14px;border-radius:999px}
.head h1{font-size:clamp(27px,4.2vw,40px);font-weight:800;line-height:1.4;letter-spacing:-.8px;margin:18px 0 16px}
.head .meta{display:flex;align-items:center;gap:14px;font-size:13.5px;color:#7B879B;padding-bottom:26px;border-bottom:1px solid rgba(255,255,255,.09)}
.cover{max-width:900px;margin:30px auto;padding:0 24px}
.gc{position:relative;aspect-ratio:2/1;overflow:hidden;border-radius:20px;display:flex;flex-direction:column;justify-content:flex-end;padding:32px;background:#1A2533;border:1px solid rgba(255,255,255,.09)}
.gc::before{content:"";position:absolute;inset:0;z-index:1;background:var(--gc-grad,radial-gradient(ellipse 80% 74% at 28% 18%,rgba(74,130,196,.26),transparent 72%))}
.gc-pat{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.gc-cat{position:relative;z-index:2;align-self:flex-start;margin-bottom:auto;font-size:12px;font-weight:700;color:#FFC107;background:rgba(0,0,0,.4);border:1px solid rgba(255,193,7,.28);padding:5px 14px;border-radius:999px}
.gc-title{position:relative;z-index:2;font-size:clamp(20px,3vw,30px);font-weight:800;color:#fff;line-height:1.5;text-shadow:0 2px 18px rgba(0,0,0,.7);max-width:80%}
.gc-mark{position:absolute;top:28px;inset-inline-end:32px;z-index:2;font-size:19px;font-weight:800;color:#FFC107;opacity:.55}
article{max-width:720px;margin:0 auto;padding:14px 24px 60px}
article p{font-size:17.5px;line-height:2.1;color:#C7D1DF;margin-bottom:22px}
article p.lead{font-size:19px;color:#FFFFFF;line-height:2.05}
article b,article strong{color:#FFFFFF;font-weight:700}
article h2{font-size:27px;font-weight:800;color:#FFFFFF;margin:46px 0 18px;padding-top:26px;border-top:1px solid rgba(255,255,255,.09)}
article h3{font-size:20px;font-weight:800;color:#FFFFFF;margin:32px 0 12px}
article ul{margin:0 22px 24px 0;padding:0}
article ol{margin:0 22px 24px 0;padding:0}
article li{font-size:17px;line-height:2;color:#C7D1DF;margin-bottom:11px}
article blockquote{border-inline-start:3px solid #FFC107;background:rgba(255,193,7,.09);padding:20px 24px;border-radius:0 14px 14px 0;margin:30px 0;font-size:18px;color:#FFFFFF;line-height:2}
article .note{font-size:14.5px;color:#7B879B;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:16px 20px}
article table{width:100%;border-collapse:collapse;margin:28px 0;font-size:15px}
article th{background:rgba(255,193,7,.12);color:#FFC107;font-weight:700;padding:12px 16px;text-align:right;border:1px solid rgba(255,255,255,.09)}
article td{padding:11px 16px;border:1px solid rgba(255,255,255,.09);color:#C7D1DF}
article tr:hover td{background:rgba(255,255,255,.03)}
.mid-cta{display:flex;align-items:center;gap:18px;flex-wrap:wrap;background:linear-gradient(100deg,rgba(255,193,7,.14),#22303F 62%);border:1px solid rgba(255,193,7,.28);border-radius:18px;padding:24px 26px;margin:40px 0}
.mc-ic{width:52px;height:52px;border-radius:15px;background:#FFC107;display:grid;place-content:center;font-size:24px;flex:0 0 auto}
.mc-b{flex:1;min-width:210px}
.mc-b b{display:block;font-size:17px;color:#FFFFFF}
.mc-b span{display:block;font-size:14.5px;color:#C7D1DF;margin-top:5px;line-height:1.8}
.art-page .endcta{background:#22303F;border-top:1px solid rgba(255,193,7,.28);padding:54px 0;text-align:center}
.art-page .endcta h2{font-size:26px;font-weight:800;line-height:1.45}
.art-page .endcta h2 span{color:#FFC107}
.art-page .endcta p{color:#9DA9BB;margin:14px auto 26px;max-width:520px;padding:0 24px}
.art-page .endcta .row{display:flex;gap:13px;justify-content:center;flex-wrap:wrap;padding:0 24px}
.rels{max-width:1160px;margin:0 auto;padding:56px 24px 70px}
.rels h3{font-size:22px;font-weight:800;margin-bottom:22px}
.rgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.rel{background:#22303F;border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:22px 20px;text-decoration:none;display:block;transition:.25s}
.rel:hover{border-color:rgba(255,193,7,.28);background:#2B3B4E;transform:translateY(-3px)}
.rtag{font-size:11.5px;font-weight:700;color:#FFC107}
.rel h4{font-size:16px;font-weight:800;color:#FFFFFF;line-height:1.55;margin:10px 0 12px}
.rm{font-size:12.5px;color:#7B879B}
@media(max-width:820px){.rgrid{grid-template-columns:1fr}}
      `}</style>

      <Navbar />

      <div className="art-page">
        {/* ── شريط التقدّم ──────────────────────────────── */}
        <div className="bar" ref={barRef} id="bar" />

        <div className="page">

          {/* ── التنقّل الفتاتي ────────────────────────── */}
          <div className="crumb">
            <Link href="/">الرئيسية</Link>
            <span className="sep">/</span>
            <Link href="/blog">المدوّنة</Link>
            <span className="sep">/</span>
            {post.category}
          </div>

          {/* ── رأس المقال ────────────────────────────── */}
          <div className="head">
            <span className="tag">{post.category}</span>
            <h1>{post.title}</h1>
            <div className="meta">
              <span>{post.publishedAt}</span>
              <span>·</span>
              <span><span className="art-num">{post.readingMinutes}</span> دقائق قراءة</span>
              <span>·</span>
              <span>{post.author}</span>
            </div>
          </div>

          {/* ── الغلاف ────────────────────────────────── */}
          <div className="cover">
            {post.cover
              ? <img src={`${import.meta.env.BASE_URL}blog-images/${post.cover}`} alt={post.title} style={{ width: '100%', borderRadius: 20, display: 'block' }} />
              : <GeneratedCover slug={post.slug} title={post.title} category={post.category} />
            }
          </div>

          {/* ── جسم المقال ────────────────────────────── */}
          <article dangerouslySetInnerHTML={{ __html: bodyWithCta }} />

          {/* ── الدعوة الختامية ────────────────────────── */}
          <section className="endcta">
            <h2>تريد أن تعرف أين يقف <span>صوتك فعلاً</span>؟</h2>
            <p>تقييم صوتي مجاني يستمع إليه مدرّب من كاسيت — لا خوارزمية. النتيجة خلال 24 ساعة.</p>
            <div className="row">
              <Link href="/voiceover" className="btn btn-gold">سمّعنا صوتك — مجاناً ←</Link>
              <Link href="/voiceover" className="btn btn-ghost">تحدّث مع ياقوت 💬</Link>
            </div>
          </section>

          {/* ── اقرأ أيضاً ────────────────────────────── */}
          {related.length > 0 && (
            <section className="rels">
              <h3>اقرأ أيضاً</h3>
              <div className="rgrid">
                {related.map(rel => (
                  <Link key={rel.slug} href={`/blog/${rel.slug}`} className="rel">
                    <span className="rtag">{rel.category}</span>
                    <h4>{rel.title}</h4>
                    <span className="rm"><span className="art-num">{rel.readingMinutes}</span> دقائق</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      <SiteFooter />
    </>
  );
}
