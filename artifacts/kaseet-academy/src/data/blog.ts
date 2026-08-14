/**
 * بيانات المدوّنة — تُحمَّل من ملفّات Markdown في /content/blog/
 * محلّل frontmatter خفيف يعمل في المتصفّح (بدون Buffer/Node)
 * marked لتحويل Markdown → HTML
 */
import { marked } from 'marked';

/* ── تحميل الملفّات المصدرية ────────────────────────────── */
const RAW_FILES = import.meta.glob('/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export interface BlogPost {
  slug:           string;
  title:          string;
  description:    string;
  category:       string;
  tags:           string[];
  publishedAt:    string;
  readingMinutes: number;
  author:         string;
  featured?:      boolean;
  cover?:         string;
  body:           string;   // HTML جاهز للعرض
}

/* ── محلّل frontmatter بسيط ────────────────────────────── */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const data: Record<string, unknown> = {};
  if (!raw.startsWith('---')) return { data, content: raw };

  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { data, content: raw };

  const fm      = raw.slice(4, end);          // بين علامتَي ---
  const content = raw.slice(end + 4).trimStart();

  for (const line of fm.split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim();

    if (!key) continue;

    // مصفوفة بسيطة: [a, b, c]
    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
    } else if (val === 'true') {
      data[key] = true;
    } else if (val === 'false') {
      data[key] = false;
    } else if (/^\d+$/.test(val)) {
      data[key] = Number(val);
    } else {
      data[key] = val;
    }
  }

  return { data, content };
}

function parseFile(raw: string): BlogPost {
  const { data, content } = parseFrontmatter(raw);
  return {
    slug:           String(data.slug           ?? ''),
    title:          String(data.title          ?? ''),
    description:    String(data.description    ?? ''),
    category:       String(data.category       ?? ''),
    tags:           Array.isArray(data.tags) ? (data.tags as string[]) : [],
    publishedAt:    String(data.publishedAt    ?? ''),
    readingMinutes: Number(data.readingMinutes ?? 5),
    author:         String(data.author         ?? 'كاسيت أكاديمي'),
    featured:       Boolean(data.featured),
    cover:          data.cover ? String(data.cover) : undefined,
    body:           marked(content) as string,
  };
}

export const BLOG_POSTS: BlogPost[] = Object.values(RAW_FILES)
  .map(parseFile)
  .sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.publishedAt.localeCompare(a.publishedAt);
  });

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  const post  = getBlogPost(slug);
  if (!post) return BLOG_POSTS.slice(0, count);
  const same  = BLOG_POSTS.filter(p => p.slug !== slug && p.category === post.category);
  const other = BLOG_POSTS.filter(p => p.slug !== slug && p.category !== post.category);
  return [...same, ...other].slice(0, count);
}
