/**
 * useCoursePricing — fetches live price data from the API for a given course slug.
 * Used by all 7 course/masterclass pages so admin edits in the dashboard
 * reflect on the public page immediately without a redeploy.
 */
import { useState, useEffect } from 'react';

export interface CoursePricingDB {
  slug: string;
  onsiteEnabled: boolean;
  onsitePriceJOD: number | null;
  liveEnabled: boolean;
  livePriceUSD: number | null;
}

export function useCoursePricing(slug: string) {
  const [pricing, setPricing] = useState<CoursePricingDB | null>(null);
  const [loading, setLoading] = useState(true);
  // notFound is only set on an explicit 404 (course archived or deleted) —
  // never on a network/server error, so a transient API hiccup fails open
  // (keeps the page's static fallback prices) instead of hiding the page.
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/courses/${slug}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.ok ? r.json() : null;
      })
      .then((data: CoursePricingDB | null) => {
        if (data) setPricing(data);
      })
      .catch(() => {/* API unavailable — fall back to static prices */})
      .finally(() => setLoading(false));
  }, [slug]);

  return { pricing, loading, notFound };
}
