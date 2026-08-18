import React, { createContext, useContext, useState, useCallback } from 'react';
import { CURRENCY_LIST, type CurrencyCode } from '../data/currency';

const LS_KEY = 'kaseet-currency';

function readStored(): CurrencyCode {
  try {
    const v = localStorage.getItem(LS_KEY);
    if (v && (CURRENCY_LIST as string[]).includes(v)) return v as CurrencyCode;
  } catch { /* SSR / private-browsing — ignore */ }
  return 'USD';
}

interface CurrencyCtx {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyCtx>({
  currency: 'USD',
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(readStored);

  const setCurrency = useCallback((c: CurrencyCode) => {
    try { localStorage.setItem(LS_KEY, c); } catch { /* ignore */ }
    setCurrencyState(c);
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
