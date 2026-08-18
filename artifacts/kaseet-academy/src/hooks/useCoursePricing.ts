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

  useEffect(() => {
    fetch(`/api/courses/${slug}`)
      .then(r => (r.ok ? r.json() : null))
      .then((data: CoursePricingDB | null) => {
        if (data) setPricing(data);
      })
      .catch(() => {/* API unavailable — fall back to static prices */})
      .finally(() => setLoading(false));
  }, [slug]);

  return { pricing, loading };
}
