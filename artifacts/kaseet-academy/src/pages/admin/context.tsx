/** Admin auth context — dual-role: owner admin (password) / consultant (email+password). */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, ApiError } from './api';

export interface AdminUser {
  role: 'admin' | 'consultant';
  id: number | null;
  name: string;
  email: string | null;
}

interface AuthState {
  user: AdminUser | null;
  checking: boolean;
  loginAdmin: (password: string) => Promise<void>;
  loginConsultant: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthState>(null as any);
export const useAdminAuth = () => useContext(Ctx);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);

  // Restore an existing session on load
  useEffect(() => {
    api<AdminUser>('/admin/consultants/me')
      .then(me => setUser({ role: me.role === 'admin' ? 'admin' : 'consultant', id: me.id, name: me.name, email: me.email }))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  const loginAdmin = useCallback(async (password: string) => {
    await api('/admin/login', { method: 'POST', body: { password } });
    setUser({ role: 'admin', id: null, name: 'المدير', email: null });
  }, []);

  const loginConsultant = useCallback(async (email: string, password: string) => {
    const d = await api<{ consultant: { id: number; name: string; email: string; role: string } }>(
      '/admin/consultants/login', { method: 'POST', body: { email, password } });
    setUser({
      role: d.consultant.role === 'admin' ? 'admin' : 'consultant',
      id: d.consultant.id, name: d.consultant.name, email: d.consultant.email,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      if (user?.id != null) await api('/admin/consultants/logout', { method: 'POST' });
      else await api('/admin/logout', { method: 'POST' });
    } catch { /* session may already be gone */ }
    setUser(null);
  }, [user]);

  return <Ctx.Provider value={{ user, checking, loginAdmin, loginConsultant, logout }}>{children}</Ctx.Provider>;
}

export { ApiError };
