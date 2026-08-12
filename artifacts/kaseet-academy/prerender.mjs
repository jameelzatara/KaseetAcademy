/**
 * ⑥ prerender.mjs — Post-build OG meta injector
 *
 * يعمل بعد `vite build` ويكتب ملف index.html ثابتًا لكل مسار
 * يحتوي على وسوم OG / Twitter الصحيحة حتى تظهر المعاينة على
 * واتساب وتيليغرام وتويتر وغيرها.
 *
 * لا يحتاج puppeteer ولا SSR — مجرد Node.js خالص.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST  = join(__dirname, 'dist/public');
const BASE  = 'https://kaseet.com';
const IMAGE = `${BASE}/og-default.jpg`;   // صورة OG افتراضية

/* ── Blog posts (يطابق data/blog.ts) ─────────────────── */
const BLOG = [
  { slug: 'khamat-sawt',   title: 'دليل خامة الصوت: ما هي وأين مكانها في سوق العمل؟',      desc: 'تعرّف على الخامات التي يطلبها السوق، واختبر خامتك في 20 دقيقة، وسِر في خارطة طريق 90 يومًا.' },
  { slug: 'makharij-huruf', title: 'مخارج الحروف العربية: الدليل العملي لكل معلّق',         desc: 'خريطة صوتية كاملة: أين يخرج كل حرف، وأشيع الأخطاء، وروتين التمارين اليومي.' },
  { slug: 'studio-manzili', title: 'الاستوديو المنزلي: دليل البناء من صفر',                  desc: 'كيف تبني استوديو منزليًا احترافيًا بميزانية محدودة — المعدّات والغرفة والقواعد الذهبية.' },
  { slug: 'khomul-nutq',    title: 'خمول النطق (Lazy Mouth): ما هو وكيف تعالجه نهائيًا؟',   desc: 'تشخيص خمول العضلات النطقية وأثره على وضوح الكلام — مع بروتوكول التمارين الثلاثية.' },
  { slug: 'taswiq-sawti',   title: 'التسويق الصوتي: كيف تبني جمهورًا وتحصل على عملاء',      desc: 'خطوات عملية لتسويق خدمات التعليق الصوتي — الديمو والمنصات والبراند والتسعير.' },
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

function write(dir, meta) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), injectMeta(template, meta));
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

// مقالات المدوّنة
for (const p of BLOG) {
  write(join(DIST, 'blog', p.slug), { title: `${p.title} | كاسيت`, desc: p.desc, url: `${BASE}/blog/${p.slug}` });
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
