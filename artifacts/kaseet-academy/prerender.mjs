/**
 * ⑥ prerender.mjs — Post-build OG meta injector
 *
 * يعمل بعد `vite build` ويكتب ملف index.html ثابتًا لكل مسار
 * يحتوي على وسوم OG / Twitter الصحيحة حتى تظهر المعاينة على
 * واتساب وتيليغرام وتويتر وغيرها.
 *
 * لا يحتاج puppeteer ولا SSR — مجرد Node.js خالص.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST  = join(__dirname, 'dist/public');
const BASE  = 'https://kaseet.com';
const IMAGE = `${BASE}/og-default.jpg`;   // صورة OG افتراضية

/* ── Blog posts (يطابق content/blog/*.md) ────────────── */
const BLOG = [
  { slug: 'ratha-lisp',          title: 'لُثغة حرف الراء — لماذا تحدث؟ وهل يمكن علاجها بعد سنّ معيّنة؟', desc: 'صوتك هو هويتك، وطريقة نطقك للحروف أوّل انطباع تتركه. دليل عملي لفهم لثغة الراء وعلاجها بخمسة تمارين.' },
  { slug: 'lazy-mouth',          title: 'ظاهرة الفم الكسول — لماذا يبدو كلامك غير واضح رغم سلامة صوتك؟', desc: 'خمول العضلات النطقية يبتلع الحروف ويجعل الكلام متداخلاً. كيف تشخّصه في دقيقة، وكيف تعالجه في أسبوعين.' },
  { slug: 'voiceover-markets',   title: 'الأسواق الخمسة للتعليق الصوتي — أيّها يناسب صوتك؟',              desc: 'الإعلانات والوثائقي والكتب الصوتية والدبلجة والمحتوى الرقمي. ما يطلبه كلّ سوق منك.' },
  { slug: 'home-studio',         title: 'استوديو منزلي بلا ميزانية — الغرفة أهمّ من الميكروفون',           desc: 'ثلاث مراحل للمعدّات لا تقفز مرحلة، وحقيقة غير مريحة عن الغرفة.' },
  { slug: 'mic-fright',          title: 'رهبة الميكروفون — لماذا يتغيّر صوتك لحظة الضغط على «تسجيل»؟',   desc: 'ظاهرة فسيولوجية لا نفسية فقط. أربع تقنيات تُعيدك إلى طبيعتك أمام الميكروفون.' },
  { slug: '90-days-plan',        title: 'خطّة التسعين يوماً — من صفر إلى أوّل عمل صوتي مدفوع',           desc: 'ليست خطّة للإتقان. هذه خطّة لتصل إلى أوّل عمل مدفوع.' },
  { slug: 'voiceover-vs-dubbing',title: 'التعليق الصوتي والدبلجة والتمثيل الصوتي — ما الفرق فعلاً؟',      desc: 'ثلاث مهن يخلط بينها الجميع، ولكلٍّ سوقها ومهارتها الحاكمة وأجرها.' },
  { slug: 'find-your-voice-type',title: 'صوتك لأيّ مجال يصلح؟ خمسة عناصر تكشف خامتك الحقيقية',          desc: 'لا يوجد صوت صالح لكلّ شيء. خمسة عناصر تقنية تحدّد أين يقف صوتك في السوق.' },
  { slug: 'warmup-exercises',    title: 'سبعة تمارين صوتية قبل أيّ تسجيل أو محاضرة أو اجتماع',           desc: 'عشر دقائق تفرق بين صوت متعب وصوت جاهز. تمارين تنفّس وإحماء ومخارج.' },
  { slug: 'where-clients-are',   title: 'أين تجد عملاء التعليق الصوتي فعلاً؟ ثلاث قنوات في السوق العربي', desc: 'منصّات العمل الحرّ، والاستوديوهات، والشبكة الشخصية. أيّها يعطي أوّل عمل.' },
];

/* ── Course pages ─────────────────────────────────────── */
const COURSES = [
  { slug: 'voiceover',           title: 'دورة التعليق الصوتي',                               desc: 'دورة احترافية في التعليق الصوتي — حضوري وأونلاين LIVE' },
  { slug: 'masar-soti',          title: 'مسار صوتي',                                          desc: 'المسار التدريبي الشامل للأداء الصوتي' },
  { slug: 'masterclass-elam',    title: 'ماستركلاس الإعلام',                                  desc: 'ماستركلاس المذيع المحترف ومهارات الإعلام الرقمي' },
  { slug: 'masterclass-voice',   title: 'ماستركلاس التعليق والأداء الصوتي',                   desc: 'ماستركلاس التعليق والأداء الصوتي الاحترافي' },
  { slug: 'masterclass-khataba', title: 'ماستركلاس الخطابة والتواصل القيادي',                  desc: 'ماستركلاس الخطابة والإلقاء الجماهيري المؤثر' },
  { slug: 'asasiyat',            title: 'أساسيات التعليق والأداء الصوتي',                      desc: 'دورة أساسيات التعليق والأداء الصوتي — المستوى التأسيسي' },
];

/* ── Trainers ─────────────────────────────────────────── */
const TRAINERS = [
  { slug: 'yasar-abdo',           name: 'يسار عبده',        title: 'مدرّبة الأداء الصوتي والتعليق' },
  { slug: 'rana-azzam',           name: 'رنا العزّام',       title: 'مدرّبة الخطابة والتواصل' },
  { slug: 'omar-darabkeh',        name: 'عمر الدرابكة',     title: 'مدرّب الإعلام والبودكاست' },
  { slug: 'dr-soheib-khawaldeh',  name: 'د. صهيب الخوالدة', title: 'مدرّب اللغة العربية والتحرير' },
];

/* ── Static pages ─────────────────────────────────────── */
const STATIC = [
  { path: '/blog',           title: 'أدلة مجانية ومقالات | كاسيت',              desc: 'محتوى تعليمي معمّق من خبراء كاسيت — اقرأ المقال ثم حمّل الدليل الكامل مجانًا.' },
  { path: '/trainers',       title: 'فريق المدرّبين | كاسيت أكاديمي',           desc: 'محترفون يجمعون بين الممارسة الميدانية والأسلوب التعليمي المتقن.' },
  { path: '/events',         title: 'الأحداث القادمة | كاسيت أكاديمي',          desc: 'ورش عمل وأحداث مباشرة قادمة في كاسيت أكاديمي.' },
  { path: '/privacy-policy', title: 'سياسة الخصوصية | كاسيت',                  desc: '' },
  { path: '/terms',          title: 'الشروط والأحكام | كاسيت',                  desc: '' },
  { path: '/refund-policy',  title: 'سياسة الاسترداد | كاسيت',                 desc: '' },
];

/* ── Helpers ───────────────────────────────────────────── */
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function injectMeta(template, { title, desc, url, image = IMAGE }) {
  const t = esc(title); const d = esc(desc); const u = esc(url); const i = esc(image);
  const tags = [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${u}" />`,
    `<meta property="og:image" content="${i}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="ar_JO" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${i}" />`,
  ].join('\n    ');
  return template
    .replace(/<title>[^<]*<\/title>/, '')      // أزل العنوان القديم
    .replace('</head>', `    ${tags}\n  </head>`);
}

/* ── محلّل frontmatter خفيف ────────────────────────────── */
function parseFm(raw) {
  const data = {};
  if (!raw.startsWith('---')) return { data, content: raw };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { data, content: raw };
  const fm      = raw.slice(4, end);
  const content = raw.slice(end + 4).trimStart();
  for (const line of fm.split('\n')) {
    const c = line.indexOf(':');
    if (c === -1) continue;
    const k = line.slice(0, c).trim();
    const v = line.slice(c + 1).trim();
    if (!k) continue;
    if (v === 'true') data[k] = true;
    else if (/^\d+$/.test(v)) data[k] = Number(v);
    else data[k] = v;
  }
  return { data, content };
}

/* ── تحميل بيانات المقالات من الملفّات ─────────────────── */
const CONTENT_DIR = join(__dirname, 'content/blog');
const MD_POSTS = {};
try {
  for (const file of readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'))) {
    const raw = readFileSync(join(CONTENT_DIR, file), 'utf-8');
    const { data, content } = parseFm(raw);
    if (data.slug) MD_POSTS[data.slug] = { data, content };
  }
} catch { /* الملفّات غير موجودة — يُهمَل */ }

function write(dir, meta, articleBody = null) {
  mkdirSync(dir, { recursive: true });
  let html = injectMeta(template, meta);
  if (articleBody) {
    // حقن المحتوى المقروء بالآلة في noscript (مرئي لـ Google وcurl لا للمستخدم)
    const noscript = `<noscript><article lang="ar" dir="rtl"><h1>${esc(meta.title)}</h1>${articleBody}</article></noscript>`;
    html = html.replace('</body>', `  ${noscript}\n</body>`);
  }
  writeFileSync(join(dir, 'index.html'), html);
}

/* ── Main ──────────────────────────────────────────────── */
let template;
try {
  template = readFileSync(join(DIST, 'index.html'), 'utf-8');
} catch {
  console.error('⛔ لم يُعثر على dist/public/index.html — شغّل vite build أولًا');
  process.exit(1);
}

let count = 0;

// مقالات المدوّنة — مع حقن المحتوى
for (const p of BLOG) {
  const md  = MD_POSTS[p.slug];
  const body = md ? marked(md.content) : null;
  const ogImg = `${BASE}/og-blog-${p.slug}.jpg`;
  write(
    join(DIST, 'blog', p.slug),
    { title: `${p.title} | مدوّنة كاسيت`, desc: p.desc, url: `${BASE}/blog/${p.slug}`, image: ogImg },
    body,
  );
  count++;
}

// فهرس المدوّنة
write(join(DIST, 'blog'), { title: 'أدلة مجانية ومقالات | كاسيت', desc: 'محتوى تعليمي معمّق من خبراء كاسيت — اقرأ المقال ثم حمّل الدليل الكامل مجانًا.', url: `${BASE}/blog` });
count++;

// صفحات الدورات
for (const c of COURSES) {
  write(join(DIST, 'courses', c.slug), { title: `${c.title} | كاسيت أكاديمي`, desc: c.desc, url: `${BASE}/courses/${c.slug}` });
  count++;
}

// قائمة المدرّبين وصفحاتهم
write(join(DIST, 'trainers'), { title: 'فريق المدرّبين | كاسيت أكاديمي', desc: 'محترفون يجمعون بين الممارسة الميدانية والأسلوب التعليمي المتقن.', url: `${BASE}/trainers` });
count++;
for (const t of TRAINERS) {
  write(join(DIST, 'trainers', t.slug), {
    title: `${t.name} — ${t.title} | كاسيت`,
    desc:  `تعرّف على ${t.name}، ${t.title} في كاسيت أكاديمي`,
    url:   `${BASE}/trainers/${t.slug}`,
  });
  count++;
}

// صفحة الأحداث
write(join(DIST, 'events'), { title: 'الأحداث القادمة | كاسيت أكاديمي', desc: 'ورش عمل وأحداث مباشرة قادمة.', url: `${BASE}/events` });
count++;

// الصفحات الثابتة
for (const s of STATIC) {
  write(join(DIST, s.path.slice(1)), { title: s.title, desc: s.desc, url: `${BASE}${s.path}` });
  count++;
}

console.log(`✅ Prerendered ${count} routes → dist/public/`);
