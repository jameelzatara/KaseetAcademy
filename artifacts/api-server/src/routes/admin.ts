import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, ordersTable } from "@workspace/db";
import { eq, desc, inArray } from "drizzle-orm";
import type { InstallmentRecord } from "@workspace/db";

const router = Router();

// Admin session key
declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
  }
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "kaseet-admin-2026";

// ── POST /admin/login ──────────────────────────────────────
router.post("/admin/login", async (req, res) => {
  const { password } = req.body as { password: string };
  if (!password) {
    res.status(400).json({ error: "كلمة المرور مطلوبة" });
    return;
  }

  // Compare with stored hash or plaintext env var
  const valid =
    ADMIN_PASSWORD.startsWith("$2")
      ? await bcrypt.compare(password, ADMIN_PASSWORD)
      : password === ADMIN_PASSWORD;

  if (!valid) {
    res.status(401).json({ error: "كلمة المرور غير صحيحة" });
    return;
  }

  req.session.isAdmin = true;
  res.json({ ok: true });
});

// ── Middleware: require admin ──────────────────────────────
function requireAdmin(req: any, res: any, next: any) {
  if (!req.session?.isAdmin) {
    res.status(401).json({ error: "غير مصرّح" });
    return;
  }
  next();
}

// ── GET /admin/orders ──────────────────────────────────────
router.get("/admin/orders", requireAdmin, async (req, res) => {
  try {
    const { status, cohortId } = req.query as {
      status?: string;
      cohortId?: string;
    };

    let query = db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));

    const orders = await query.limit(200);

    // Filter in memory (simple for now)
    let result = orders;
    if (status) {
      result = result.filter((o) => o.status === status);
    }
    if (cohortId) {
      result = result.filter((o) => o.cohortId === parseInt(cohortId, 10));
    }

    res.json({ orders: result });
  } catch (err) {
    console.error("admin/orders error", err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── GET /admin/orders/:id ─────────────────────────────────
router.get("/admin/orders/:id", requireAdmin, async (req, res) => {
  try {
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, req.params.id))
      .limit(1);

    if (!order) {
      res.status(404).json({ error: "الطلب غير موجود" });
      return;
    }
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── POST /admin/orders/:id/payment ────────────────────────
// Record a manual payment (cash / bank transfer)
router.post("/admin/orders/:id/payment", requireAdmin, async (req, res) => {
  try {
    const { seq, method, reference, recordedBy } = req.body as {
      seq: 1 | 2 | 3;
      method: "bank_transfer" | "cash";
      reference?: string;
      recordedBy?: string;
    };

    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, req.params.id))
      .limit(1);

    if (!order) {
      res.status(404).json({ error: "الطلب غير موجود" });
      return;
    }

    const installments = (order.installments as InstallmentRecord[]).map(
      (inst) => {
        if (inst.seq === seq) {
          return {
            ...inst,
            method,
            paidAt: new Date().toISOString(),
            reference: reference ?? inst.reference,
            recordedBy: recordedBy ?? inst.recordedBy,
          };
        }
        return inst;
      },
    );

    // Compute new remaining
    const paidInstallments = installments.filter((i) => i.paidAt !== null);
    const paidJOD = paidInstallments.reduce((sum, i) => sum + i.amountJOD, 0);
    const remainingJOD = order.totalJOD - paidJOD;
    const newStatus =
      remainingJOD <= 0
        ? "completed"
        : paidInstallments.length === 1
          ? "deposit_paid"
          : "partially_paid";

    await db
      .update(ordersTable)
      .set({ installments, paidJOD, remainingJOD, status: newStatus, updatedAt: new Date() })
      .where(eq(ordersTable.id, req.params.id));

    res.json({ ok: true, status: newStatus, remainingJOD });
  } catch (err) {
    console.error("admin/payment error", err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── POST /admin/logout ─────────────────────────────────────
router.post("/admin/logout", (req, res) => {
  req.session.isAdmin = false;
  res.json({ ok: true });
});

export default router;
