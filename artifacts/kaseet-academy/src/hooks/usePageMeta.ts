/**
 * usePageMeta — updates <title>, canonical, and OG/Twitter meta tags dynamically.
 * Since this is a client-side SPA, social bots see the static index.html
 * tags (homepage values). This hook updates the live DOM so that Google's
 * JS-rendering crawler and browser tab titles stay accurate.
 */
import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description?: string;
  ogImage?: string; // absolute URL — defaults to https://kaseet.com/og-image.jpg
}

const SITE_NAME      = 'كاسيت أكاديمي';
const OG_BASE        = 'https://kaseet.com';
const OG_IMG_DEFAULT = `${OG_BASE}/og-image.jpg`;

function setMeta(selector: string, attr: string, value: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    const [attrName, attrValue] = selector.match(/\[([^=]+)="([^"]+)"\]/)
      ? selector.replace('[', '').replace(']', '').split('=').map(s => s.replace(/"/g, ''))
      : [attr, ''];
    el.setAttribute(attrName, attrValue || '');
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setCanonical(url: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

export function usePageMeta({ title, description, ogImage }: PageMeta) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const img       = ogImage ?? OG_IMG_DEFAULT;

    // Build canonical from OG_BASE + current pathname (strip hash/search)
    const canonical = `${OG_BASE}${window.location.pathname}`.replace(/\/$/, '') || OG_BASE + '/';
    const url       = canonical; // og:url matches canonical

    document.title = fullTitle;

    // Canonical link
    setCanonical(canonical);

    if (description) {
      setMeta('meta[name="description"]', 'content', description);
    }

    // OG tags
    setMeta('meta[property="og:title"]',       'content', fullTitle);
    setMeta('meta[property="og:url"]',          'content', url);
    if (description) setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:image"]',        'content', img);

    // Twitter
    setMeta('meta[name="twitter:title"]',       'content', fullTitle);
    if (description) setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]',       'content', img);

    // Restore homepage defaults when component unmounts
    return () => {
      document.title = `${SITE_NAME} | Kaseet Academy`;
      setMeta('meta[name="description"]',           'content', 'الأكاديمية الأولى في تدريب التعليق الصوتي، صناعة البودكاست، والإنتاج المرئي.');
      setMeta('meta[property="og:title"]',          'content', `${SITE_NAME} | Kaseet Academy`);
      setMeta('meta[property="og:description"]',    'content', 'الأكاديمية الأولى في تدريب التعليق الصوتي، صناعة البودكاست، والإنتاج المرئي.');
      setMeta('meta[property="og:image"]',          'content', OG_IMG_DEFAULT);
      setMeta('meta[property="og:url"]',            'content', OG_BASE);
      setMeta('meta[name="twitter:title"]',         'content', `${SITE_NAME} | Kaseet Academy`);
      setMeta('meta[name="twitter:description"]',   'content', 'الأكاديمية الأولى في تدريب التعليق الصوتي، صناعة البودكاست، والإنتاج المرئي.');
      setMeta('meta[name="twitter:image"]',         'content', OG_IMG_DEFAULT);
    };
  }, [title, description, ogImage]);
}
