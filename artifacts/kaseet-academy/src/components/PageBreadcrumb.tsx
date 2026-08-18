/**
 * PageBreadcrumb — مسار التنقل الموحّد
 * يُستخدم في كل صفحات الموقع (دورات · ماستركلاسات · مدونة · تقديم · قانونية)
 */
import { Home } from 'lucide-react';

export interface Crumb { label: string; href?: string; }

/**
 * @param crumbs  - مصفوفة العناصر: الأول دائماً "الرئيسية" والأخير اسم الصفحة الحالية
 * @param theme   - dark = نص فاتح على خلفية داكنة · light = نص داكن على خلفية فاتحة
 */
export default function PageBreadcrumb({
  crumbs,
  theme = 'dark',
}: {
  crumbs: Crumb[];
  theme?: 'dark' | 'light';
}) {
  const F    = "'Tajawal', sans-serif";
  const text = theme === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(26,37,51,0.48)';
  const sep  = theme === 'dark' ? 'rgba(255,255,255,0.20)' : 'rgba(26,37,51,0.20)';
  const last = theme === 'dark' ? '#FFC107' : '#56617A';

  return (
    <nav
      aria-label="مسار التنقل"
      style={{
        display: 'flex', alignItems: 'center', gap: 0,
        flexWrap: 'nowrap', overflow: 'hidden', direction: 'rtl',
      }}
    >
      {crumbs.map((crumb, i) => {
        const isLast  = i === crumbs.length - 1;
        const isFirst = i === 0;
        return (
          <span
            key={i}
            style={{
              display: 'inline-flex', alignItems: 'center',
              flexShrink: isLast ? 1 : 0, minWidth: 0,
            }}
          >
            {i > 0 && (
              <span style={{ color: sep, fontSize: 11, margin: '0 6px', flexShrink: 0 }}>/</span>
            )}
            {isLast ? (
              <span style={{
                fontFamily: F, fontSize: 12.5, color: last,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {crumb.label}
              </span>
            ) : (
              <a
                href={crumb.href ?? '/'}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontFamily: F, fontSize: 12.5, color: text, textDecoration: 'none',
                }}
              >
                {isFirst && <Home size={12} strokeWidth={2} />}
                {crumb.label}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}
