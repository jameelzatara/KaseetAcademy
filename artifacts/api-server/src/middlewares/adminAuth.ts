/**
 * Shared role guards for the admin panel.
 *
 * Two identities can exist in a session:
 *  - Owner admin:    session.isAdmin = true, no consultantId (password login)
 *  - Consultant:     session.consultantId set (email+password login);
 *                    if their DB role is 'admin' they also get isAdmin.
 *
 * Consultant-backed sessions are re-checked against the DB on every request
 * so deactivating an account (or demoting its role) revokes access immediately.
 */
import type { Request, Response, NextFunction } from "express";
import { pool } from "@workspace/db";

async function loadConsultant(id: number): Promise<{ role: string; isActive: boolean; name: string } | null> {
  const { rows } = await pool.query(
    `SELECT role, is_active, name FROM consultant_accounts WHERE id = $1`,
    [id],
  );
  if (!rows.length) return null;
  return { role: rows[0].role, isActive: rows[0].is_active, name: rows[0].name };
}

function clearAuth(req: Request) {
  req.session.isAdmin = false;
  req.session.consultantId = undefined;
  req.session.consultantRole = undefined;
  req.session.consultantName = undefined;
}

/** Admin only. Consultant-backed admin sessions are re-verified in DB. */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.session?.consultantId) {
      const acct = await loadConsultant(req.session.consultantId);
      if (!acct || !acct.isActive) { clearAuth(req); res.status(401).json({ error: "غير مصرّح" }); return; }
      req.session.consultantRole = acct.role;
      req.session.isAdmin = acct.role === "admin";
    }
    if (!req.session?.isAdmin) { res.status(403).json({ error: "غير مصرّح — للمدير فقط" }); return; }
    next();
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
}

/** Admin OR active consultant. */
export async function requireStaff(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.session?.consultantId) {
      const acct = await loadConsultant(req.session.consultantId);
      if (!acct || !acct.isActive) { clearAuth(req); res.status(401).json({ error: "غير مصرّح" }); return; }
      req.session.consultantRole = acct.role;
      req.session.isAdmin = acct.role === "admin";
      next();
      return;
    }
    if (req.session?.isAdmin) { next(); return; }
    res.status(401).json({ error: "غير مصرّح" });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
}
