/** Section 1 — لوحة رئيسية (KPI). Admin only. */
import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { api } from '../api';
import { KpiCard } from '../components';
import { currentCohorts } from '@/data/currentCohorts';
import type { KpiResponse, DueRow } from '@workspace/admin-types';

const ALL_COHORTS = currentCohorts as { id: number }[];

export default function Overview({ goTo }: { goTo: (section: string) => void }) {
  const [kpi, setKpi] = useState<KpiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [overdue30, setOverdue30] = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api<KpiResponse>('/admin/kpi').then(setKpi),
      api<{ dues: DueRow[] }>('/admin/dues').then(d => {
        const cutoff = Date.now() - 30 * 24 * 3600 * 1000;
        setOverdue30(d.dues.filter(r => {
          const ref = r.next_due_at ?? r.created_at;
          return ref && new Date(ref).getTime() < cutoff;
        }).length);
      }),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const knownCohortIds = new Set(ALL_COHORTS.map(c => c.id));
  const seatRows = kpi?.seats.filter(s => knownCohortIds.has(s.cohortId)) ?? [];
  const totalAvailable = seatRows.reduce((s, c) => s + c.available, 0);

  return (
    <>
      {overdue30 > 0 && (
        <div className="ka-alert">
          <AlertTriangle size={17} />
          <span><b className="num">{overdue30}</b> طلب لديه مستحقّات متأخّرة أكثر من 30 يوماً</span>
          <button className="ka-btn ka-btn--danger ka-btn--sm" onClick={() => goTo('dues')}>عرض المستحقّات</button>
        </div>
      )}
      <div className="ka-kpis">
        <KpiCard label="إجمالي الإيرادات هذا الشهر"
          value={kpi ? `${kpi.revenue.thisMonth.toLocaleString('ar-JO')} د.أ` : '—'}
          delta={kpi?.revenue.delta ?? null} deltaUnit="%" loading={loading} />
        <KpiCard label="المستحقّات غير المسدَّدة" gold
          value={kpi ? `${kpi.dues.total.toLocaleString('ar-JO')} د.أ` : '—'}
          sub={kpi ? `من ${kpi.dues.count} طلب` : undefined} loading={loading} />
        <KpiCard label="المقاعد المتاحة (14 يوماً)"
          value={loading ? '—' : String(totalAvailable)}
          sub={seatRows.length ? `${seatRows.length} دفعة مفتوحة` : undefined} loading={loading} />
        <KpiCard label="طلبات جديدة (7 أيام)"
          value={kpi ? String(kpi.newOrders.last7) : '—'}
          delta={kpi?.newOrders.delta ?? null} deltaUnit=" طلب" loading={loading} />
        <KpiCard label="معدّل إتمام الدفع"
          value={kpi?.completion.pct != null ? `${kpi.completion.pct}%` : '—'}
          delta={kpi?.completion.delta ?? null} deltaUnit=" نقطة" loading={loading} />
      </div>
    </>
  );
}
