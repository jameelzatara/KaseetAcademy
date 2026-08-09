/**
 * usePageMeta — updates <title> and OG/Twitter meta tags dynamically.
 * Since this is a client-side SPA, social bots see the static index.html
 * tags (homepage values). This hook updates the live DOM so that Google's
 * JS-rendering crawler and browser tab titles stay accurate.
 */
import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description?: string;
  ogImage?: string; // absolute URL — defaults to /og-image.jpg
}

const SITE_NAME = 'كاسيت أكاديمي';
const OG_BASE   = 'https://kaseet.com';
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

export function usePageMeta({ title, description, ogImage }: PageMeta) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const img       = ogImage ?? OG_IMG_DEFAULT;
    const url       = window.location.href;

    document.title = fullTitle;

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
    };
  }, [title, description, ogImage]);
}
