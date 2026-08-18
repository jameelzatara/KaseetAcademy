/**
 * useExchangeRates — fetches live FX rates from the API server.
 *
 * Strategy:
 * 1. Return hardcoded rates immediately (no flash of wrong data).
 * 2. Check localStorage cache — if fresh (<24h), apply and stop.
 * 3. Fetch /api/rates in the background; cache result in localStorage.
 *    The component re-renders once with live rates.
 *
 * Falls back silently to hardcoded rates on any error.
 */
import { useState, useEffect } from 'react';
import { CURRENCY_RATES, type CurrencyCode } from '../data/currency';

export interface RatesState {
  rates: Record<CurrencyCode, number>;
  fetchedAt: Date | null;
  stale: boolean;
  loading: boolean;
}

const CACHE_KEY = 'kaseet_fx_rates_v1';
const CACHE_MAX_MS = 24 * 60 * 60 * 1000; // 24 hours client-side cache

interface CacheEntry {
  rates: Record<string, number>;
  fetchedAt: string;  // ISO
  stale: boolean;
  cachedAt: number;   // Date.now()
}

function readCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.cachedAt > CACHE_MAX_MS) return null; // expired
    return entry;
  } catch {
    return null;
  }
}

function writeCache(entry: Omit<CacheEntry, 'cachedAt'>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...entry, cachedAt: Date.now() }));
  } catch {
    // localStorage unavailable — silent
  }
}

const DEFAULT_STATE: RatesState = {
  rates: CURRENCY_RATES as Record<CurrencyCode, number>,
  fetchedAt: null,
  stale: true,
  loading: true,
};

export function useExchangeRates(): RatesState {
  const [state, setState] = useState<RatesState>(DEFAULT_STATE);

  useEffect(() => {
    // 1. Check localStorage first
    const cached = readCache();
    if (cached) {
      setState({
        rates: cached.rates as Record<CurrencyCode, number>,
        fetchedAt: new Date(cached.fetchedAt),
        stale: cached.stale,
        loading: false,
      });
      // If server says rates are fresh, no need to re-fetch
      if (!cached.stale) return;
    }

    // 2. Fetch from API (background, non-blocking)
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/rates');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json() as {
          rates: Record<string, number>;
          fetchedAt: string | null;
          stale: boolean;
        };
        if (cancelled) return;

        const rates = { ...CURRENCY_RATES, ...data.rates } as Record<CurrencyCode, number>;
        const fetchedAt = data.fetchedAt ? new Date(data.fetchedAt) : new Date();

        writeCache({ rates: data.rates, fetchedAt: fetchedAt.toISOString(), stale: data.stale });

        setState({ rates, fetchedAt, stale: data.stale, loading: false });
      } catch {
        // Silently fall back to hardcoded rates
        if (!cancelled) {
          setState(s => ({ ...s, loading: false }));
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return state;
}
