/** Admin dashboard root — login (dual role), sidebar shell, section routing. */
import { useState, type ComponentType } from 'react';
import {
  LayoutDashboard, ShoppingCart, Wallet, Layers, BookOpen, Ticket,
  Users, Handshake, Mic, Instagram, Settings as SettingsIcon, LogOut, Lock,
} from 'lucide-react';
import './admin.css';
import { AdminAuthProvider, useAdminAuth } from './context';
import { ToastProvider } from './components';
import Overview from './sections/Overview';
import Orders from './sections/Orders';
import Dues from './sections/Dues';
import Cohorts from './sections/Cohorts';
import Courses from './sections/Courses';
import Discounts from './sections/Discounts';
import Subscribers from './sections/Subscribers';
import Consultants from './sections/Consultants';
import VoiceEvals from './sections/VoiceEvals';
import InstagramLeads from './sections/InstagramLeads';
import Settings from './sections/Settings';

interface Section {
  key: string; label: string; sub?: string; icon: ComponentType<{ size?: number }>;
  adminOnly?: boolean; component: ComponentType<any>;
}

const SECTIONS: Section[] = [
  { key: 'overview',    label: 'لوحة رئيسية',      sub: 'نظرة سريعة على الأداء',            icon: LayoutDashboard, adminOnly: true,  component: Overview },
  { key: 'orders',      label: 'الطلبات',           sub: 'إدارة الطلبات والدفعات',           icon: ShoppingCart,                       component: Orders },
  { key: 'dues',        label: 'المستحقّات',        sub: 'المبالغ المتبقّية على الطلاب',     icon: Wallet,          adminOnly: true,  component: Dues },
  { key: 'cohorts',     label: 'الدفعات والمقاعد', sub: 'سعة الدفعات وحالة التسجيل',        icon: Layers,                             component: Cohorts },
  { key: 'courses',     label: 'إدارة الدورات',     sub: 'إضافة الدورات وتعديلها',           icon: BookOpen,                           component: Courses },
  { key: 'discounts',   label: 'أكواد الخصم',       sub: 'إنشاء الأكواد ومتابعة استخدامها',  icon: Ticket,                             component: Discounts },
  { key: 'subscribers', label: 'المشتركون',         sub: 'قاعدة بيانات الطلاب',              icon: Users,           adminOnly: true,  component: Subscribers },
  { key: 'consultants', label: 'المستشارون',        sub: 'الأداء والإحالات',                 icon: Handshake,                          component: Consultants },
  { key: 'voice',       label: 'التقييمات الصوتية', sub: 'طلبات «سمّعنا صوتك»',              icon: Mic,                                component: VoiceEvals },
  { key: 'instagram',   label: 'عملاء إنستغرام',    sub: 'متابعة العملاء المحتملين',         icon: Instagram,       adminOnly: true,  component: InstagramLeads },
  { key: 'settings',    label: 'الإعدادات',          sub: 'الحسابات وسجلّ البريد',            icon: SettingsIcon,    adminOnly: true,  component: Settings },
];

// ── Login screen ───────────────────────────────────────────
function Login() {
  const { loginAdmin, loginConsultant } = useAdminAuth();
  const [tab, setTab] = useState<'admin' | 'consultant'>('admin');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      if (tab === 'admin') await loginAdmin(password);
      else await loginConsultant(email, password);
    } catch (ex: any) {
      setErr(ex?.message ?? 'فشل تسجيل الدخول');
    } finally { setBusy(false); }
  }

  return (
    <div className="ka-login">
      <form className="ka-login-card" onSubmit={submit}>
        <div className="ka-login-mark"><Lock size={24} /></div>
        <h1 style={{ fontSize: 19, fontWeight: 800, margin: '0 0 4px' }}>لوحة إدارة قصيت</h1>
        <p style={{ fontSize: 12.5, color: '#8893A7', margin: '0 0 22px' }}>دخول الفريق فقط</p>
        <div className="ka-login-tabs">
          <button type="button" className={tab === 'admin' ? 'on' : ''} onClick={() => { setTab('admin'); setErr(''); }}>المدير</button>
          <button type="button" className={tab === 'consultant' ? 'on' : ''} onClick={() => { setTab('consultant'); setErr(''); }}>مستشارة</button>
        </div>
        {err && <div className="ka-form-err">{err}</div>}
        {tab === 'consultant' && (
          <div className="ka-field">
            <label>البريد الإلكتروني</label>
            <input type="email" dir="ltr" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" required />
          </div>
        )}
        <div className="ka-field">
          <label>كلمة المرور</label>
          <input type="password" dir="ltr" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
        </div>
        <button className="ka-btn ka-btn--violet" style={{ width: '100%', justifyContent: 'center' }} disabled={busy}>
          {busy ? 'جارٍ الدخول…' : 'دخول'}
        </button>
      </form>
    </div>
  );
}

// ── Shell ──────────────────────────────────────────────────
function Shell() {
  const { user, logout } = useAdminAuth();
  const visible = SECTIONS.filter(s => !s.adminOnly || user?.role === 'admin');
  const [active, setActive] = useState(() => (user?.role === 'admin' ? 'overview' : 'orders'));
  const current = visible.find(s => s.key === active) ?? visible[0];
  const Active = current.component;

  return (
    <div className="ka-shell">
      <aside className="ka-side">
        <div className="ka-side-brand">
          <div>
            <b>أكاديمية قصيت</b>
            <small>لوحة الإدارة</small>
          </div>
        </div>
        {user?.role === 'consultant' && <div className="ka-side-badge">حساب مستشارة — {user.name}</div>}
        <nav className="ka-nav">
          {visible.map(s => {
            const Icon = s.icon;
            return (
              <button key={s.key} className={`ka-nav-item${s.key === current.key ? ' on' : ''}`} onClick={() => setActive(s.key)}>
                <Icon size={16} />
                <span>{s.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="ka-side-foot">
          <button className="ka-logout" onClick={logout}>
            <LogOut size={15} />
            <span>خروج — {user?.name}</span>
          </button>
        </div>
      </aside>
      <main className="ka-main">
        <header className="ka-topbar">
          <div>
            <h1>{current.label}</h1>
            {current.sub && <div className="sub">{current.sub}</div>}
          </div>
        </header>
        <div className="ka-content">
          <Active goTo={(key: string) => setActive(key)} />
        </div>
      </main>
    </div>
  );
}

function Gate() {
  const { user, checking } = useAdminAuth();
  if (checking) return <div className="ka-login"><div style={{ color: '#8893A7' }}>جارٍ التحقق…</div></div>;
  if (!user) return <Login />;
  return <Shell />;
}

export default function AdminDashboard() {
  return (
    <div className="ka-admin">
      <AdminAuthProvider>
        <ToastProvider>
          <Gate />
        </ToastProvider>
      </AdminAuthProvider>
    </div>
  );
}
