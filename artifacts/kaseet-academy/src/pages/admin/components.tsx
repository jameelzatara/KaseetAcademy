/** Shared building blocks for the admin dashboard (dark theme, RTL). */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { X, TrendingUp, TrendingDown, Minus, Check, AlertTriangle } from 'lucide-react';

// ── Toast ──────────────────────────────────────────────────
interface ToastState { text: string; kind: 'ok' | 'err' }
const ToastCtx = createContext<(text: string, kind?: 'ok' | 'err') => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const show = useCallback((text: string, kind: 'ok' | 'err' = 'ok') => {
    setToast({ text, kind });
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {toast && (
        <div className={`ka-toast${toast.kind === 'err' ? ' err' : ''}`}>
          {toast.kind === 'err'
            ? <AlertTriangle size={15} style={{ color: '#F0918A' }} />
            : <Check size={15} style={{ color: '#6FD79B' }} />}
          {toast.text}
        </div>
      )}
    </ToastCtx.Provider>
  );
}

// ── Modal ──────────────────────────────────────────────────
export function Modal({ title, sub, onClose, children, width }: {
  title: string; sub?: string; onClose: () => void; children: ReactNode; width?: number;
}) {
  return (
    <div className="ka-modal-bg" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ka-modal" style={width ? { width: `min(${width}px,100%)` } : undefined}>
        <div className="ka-modal-head">
          <h3>{title}</h3>
          <button onClick={onClose} aria-label="إغلاق"><X size={20} /></button>
        </div>
        {sub && <div className="ka-modal-sub">{sub}</div>}
        {children}
      </div>
    </div>
  );
}

// ── ConfirmDialog ──────────────────────────────────────────
export function ConfirmDialog({ title, message, confirmLabel = 'تأكيد', danger, onConfirm, onCancel }: {
  title: string; message: string; confirmLabel?: string; danger?: boolean;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel} width={400}>
      <p style={{ fontSize: 13.5, color: 'var(--t3)', lineHeight: 1.8, margin: '0 0 20px' }}>{message}</p>
      <div className="ka-form-actions">
        <button className={`ka-btn ${danger ? 'ka-btn--danger' : 'ka-btn--violet'}`} style={{ flex: 1, justifyContent: 'center' }} onClick={onConfirm}>
          {confirmLabel}
        </button>
        <button className="ka-btn ka-btn--ghost" onClick={onCancel}>إلغاء</button>
      </div>
    </Modal>
  );
}

// ── Field ──────────────────────────────────────────────────
export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div className="ka-field">
      <label>{label}</label>
      {children}
      {hint && <small style={{ display: 'block', marginTop: 5, fontSize: 11.5, color: 'var(--t4)' }}>{hint}</small>}
    </div>
  );
}

// ── StatusBadge ────────────────────────────────────────────
export function StatusBadge({ tone, children }: { tone: 'green' | 'gold' | 'violet' | 'red' | 'gray' | 'blue'; children: ReactNode }) {
  return <span className={`ka-badge ka-badge--${tone}`}>{children}</span>;
}

// ── UsageBar ───────────────────────────────────────────────
export function UsageBar({ used, max }: { used: number; max: number | null }) {
  if (max == null) return <span style={{ fontSize: 12, color: 'var(--t4)' }}><span className="num">{used}</span> / ∞</span>;
  const pct = Math.min(100, Math.round((used / Math.max(max, 1)) * 100));
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span className="ka-usage-bar"><i style={{ width: `${pct}%` }} /></span>
      <span className="num" style={{ fontSize: 12 }}>{used}/{max}</span>
    </span>
  );
}

// ── KpiCard ────────────────────────────────────────────────
export function KpiCard({ label, value, sub, delta, deltaUnit, loading, gold }: {
  label: string; value: string; sub?: string;
  delta?: number | null; deltaUnit?: string; loading?: boolean; gold?: boolean;
}) {
  return (
    <div className={`ka-kpi${gold ? ' ka-kpi--gold' : ''}`}>
      <div className="lbl">{label}</div>
      <div className="val num" style={gold ? { color: 'var(--gold)' } : undefined}>
        {loading ? <span style={{ opacity: .35 }}>—</span> : value}
      </div>
      {sub && <div className="sub">{sub}</div>}
      {delta != null && !loading && (
        <div className="delta" style={{ color: delta > 0 ? '#6FD79B' : delta < 0 ? '#F0918A' : 'var(--t4)' }}>
          {delta > 0 ? <TrendingUp size={12} /> : delta < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          {delta > 0 ? '+' : ''}{delta}{deltaUnit} عن الفترة السابقة
        </div>
      )}
    </div>
  );
}

// ── DataTable (lightweight: search + sort + pagination handled by callers where needed) ──
export function TableCard({ title, actions, children, empty, loading }: {
  title?: ReactNode; actions?: ReactNode; children: ReactNode; empty?: string | false; loading?: boolean;
}) {
  return (
    <div className="ka-table-card">
      {(title || actions) && (
        <div className="ka-table-head">
          <div style={{ fontSize: 15, fontWeight: 800 }}>{title}</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>{actions}</div>
        </div>
      )}
      {loading
        ? <div className="ka-empty">جارٍ التحميل…</div>
        : empty
        ? <div className="ka-empty">{empty}</div>
        : <div className="ka-table-wrap">{children}</div>}
    </div>
  );
}
