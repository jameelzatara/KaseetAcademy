/**
 * ⑨ Umami Analytics — بلا كوكيز · بلا بيانات شخصية
 * يُحقن في الإنتاج فقط إذا كان VITE_UMAMI_WEBSITE_ID موجودًا
 * أضف المتغيّر في Replit Secrets: VITE_UMAMI_WEBSITE_ID = <id>
 */
import { useEffect } from 'react';

const WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID as string | undefined;

export default function Analytics() {
  useEffect(() => {
    if (!import.meta.env.PROD) return;              // لا تحليلات في التطوير
    if (!WEBSITE_ID) return;                       // لا WEBSITE_ID → لا تحميل
    if (document.getElementById('umami-script')) return; // لا تكرار

    const script = document.createElement('script');
    script.id     = 'umami-script';
    script.defer  = true;
    script.src    = 'https://cloud.umami.is/script.js';
    script.setAttribute('data-website-id', WEBSITE_ID);
    document.head.appendChild(script);
  }, []);

  return null;
}
