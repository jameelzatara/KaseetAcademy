import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, pool, ordersTable, installmentsTable, cohortSeatsTable } from "@workspace/db";
import { eq, desc, sql, and, gt, lt, gte } from "drizzle-orm";

const router = Router();

declare module "express-session" {
  interface SessionData { isAdmin?: boolean; }
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "kaseet-admin-2026";

// ── POST /admin/login ──────────────────────────────────────
router.post("/login", async (req, res) => {
  const { password } = req.body as { password: string };
  if (!password) { res.status(400).json({ error: "كلمة المرور مطلوبة" }); return; }

  const valid = ADMIN_PASSWORD.startsWith("$2")
    ? await bcrypt.compare(password, ADMIN_PASSWORD)
    : password === ADMIN_PASSWORD;

  if (!valid) { res.status(401).json({ error: "كلمة المرور غير صحيحة" }); return; }
  req.session.isAdmin = true;
  res.json({ ok: true });
});

// ── POST /admin/logout ─────────────────────────────────────
router.post("/logout", (req, res) => {
  req.session.isAdmin = false;
  res.json({ ok: true });
});

// ── Middleware ─────────────────────────────────────────────
function requireAdmin(req: any, res: any, next: any) {
  if (!req.session?.isAdmin) { res.status(401).json({ error: "غير مصرّح" }); return; }
  next();
}

// ── GET /admin/kpi ─────────────────────────────────────────
// 5 indicators per spec §09-1
router.get("/kpi", requireAdmin, async (req, res) => {
  try {
    // 1. Revenue collected this month (SUM of paid installments this month)
    const revThisMonth = await pool.query(`
      SELECT COALESCE(SUM(i.amount_jod), 0) AS total
      FROM installments i
      WHERE i.paid_at IS NOT NULL
        AND date_trunc('month', i.paid_at) = date_trunc('month', NOW())
    `);
    // Last month for delta
    const revLastMonth = await pool.query(`
      SELECT COALESCE(SUM(i.amount_jod), 0) AS total
      FROM installments i
      WHERE i.paid_at IS NOT NULL
        AND date_trunc('month', i.paid_at) = date_trunc('month', NOW() - INTERVAL '1 month')
    `);
    const revThis = parseFloat(revThisMonth.rows[0].total);
    const revLast = parseFloat(revLastMonth.rows[0].total);
    const revDelta = revLast > 0 ? Math.round(((revThis - revLast) / revLast) * 100) : null;

    // 2. Total outstanding dues (remaining_jod on active orders)
    const dues = await pool.query(`
      SELECT COALESCE(SUM(remaining_jod), 0) AS total, COUNT(*) AS count
      FROM orders
      WHERE status IN ('deposit_paid','partially_paid')
        AND remaining_jod > 0
    `);

    // 3. Seats available in cohorts starting within 14 days
    const upcomingSeats = await pool.query(`
      SELECT cs.cohort_id,
             cs.capacity - cs.enrolled AS available
      FROM cohort_seats cs
      WHERE cs.is_open = true
        AND cs.capacity > cs.enrolled
    `);
    // We'd need to cross-reference with cohorts.json for dates —
    // return raw seat rows and let frontend merge with static data
    const seatRows: { cohortId: number; available: number }[] =
      upcomingSeats.rows.map((r: any) => ({
        cohortId: Number(r.cohort_id),
        available: Number(r.available),
      }));

    // 4. New orders in last 7 days
    const newOrders7 = await pool.query(`
      SELECT COUNT(*) AS count FROM orders
      WHERE created_at >= NOW() - INTERVAL '7 days'
        AND status NOT IN ('pending','cancelled','refunded')
    `);
    const newOrders14 = await pool.query(`
      SELECT COUNT(*) AS count FROM orders
      WHERE created_at >= NOW() - INTERVAL '14 days'
        AND created_at < NOW() - INTERVAL '7 days'
        AND status NOT IN ('pending','cancelled','refunded')
    `);
    const orders7  = parseInt(newOrders7.rows[0].count, 10);
    const orders14 = parseInt(newOrders14.rows[0].count, 10);

    // 5. Installment completion rate (deposit payers who cleared remaining)
    const completion = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE plan = 'deposit') AS total_deposit,
        COUNT(*) FILTER (WHERE plan = 'deposit' AND status = 'completed') AS completed_deposit
      FROM orders
      WHERE status NOT IN ('pending','cancelled','refunded')
    `);
    const totalDep     = parseInt(completion.rows[0].total_deposit, 10);
    const completedDep = parseInt(completion.rows[0].completed_deposit, 10);
    const completionPct = totalDep > 0 ? Math.round((completedDep / totalDep) * 100) : null;

    // Last period completion for delta
    const compLast = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE plan = 'deposit' AND created_at < NOW() - INTERVAL '30 days') AS total,
        COUNT(*) FILTER (WHERE plan = 'deposit' AND status = 'completed'
          AND created_at < NOW() - INTERVAL '30 days') AS completed
      FROM orders
      WHERE status NOT IN ('pending','cancelled','refunded')
    `);
    const totalL = parseInt(compLast.rows[0].total, 10);
    const compL  = parseInt(compLast.rows[0].completed, 10);
    const completionPctLast = totalL > 0 ? Math.round((compL / totalL) * 100) : null;

    res.json({
      revenue: {
        thisMonth: revThis,
        lastMonth: revLast,
        delta:     revDelta,          // % change, null if no prior data
      },
      dues: {
        total:   parseFloat(dues.rows[0].total),
        count:   parseInt(dues.rows[0].count, 10),
      },
      seats: seatRows,                // merge with cohorts.json on frontend
      newOrders: {
        last7:    orders7,
        last14:   orders14,
        delta:    orders14 > 0 ? orders7 - orders14 : null, // absolute change
      },
      completion: {
        pct:      completionPct,
        pctLast:  completionPctLast,
        delta:    completionPct != null && completionPctLast != null
                    ? completionPct - completionPctLast
                    : null,
      },
    });
  } catch (err) {
    console.error("admin/kpi error", err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── GET /admin/orders ──────────────────────────────────────
router.get("/orders", requireAdmin, async (req, res) => {
  try {
    const { status, cohortId, hasDues } = req.query as {
      status?: string;
      cohortId?: string;
      hasDues?: string;
    };

    let orders = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt))
      .limit(200);

    if (status)    orders = orders.filter((o) => o.status === status);
    if (cohortId)  orders = orders.filter((o) => o.cohortId === parseInt(cohortId, 10));
    if (hasDues === "1") orders = orders.filter((o) => (o.remainingJOD ?? 0) > 0);

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── GET /admin/orders/:id ─────────────────────────────────
router.get("/orders/:id", requireAdmin, async (req, res) => {
  try {
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, req.params.id))
      .limit(1);

    if (!order) { res.status(404).json({ error: "الطلب غير موجود" }); return; }

    // Also fetch relational installments
    const insts = await db
      .select()
      .from(installmentsTable)
      .where(eq(installmentsTable.orderId, req.params.id))
      .orderBy(installmentsTable.seq);

    res.json({ order, installments: insts });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── POST /admin/orders/:id/payment ────────────────────────
// Records a manual installment payment.
// Updates both: relational installments table + orders JSONB (for backward compat).
router.post("/orders/:id/payment", requireAdmin, async (req, res) => {
  try {
    const { seq, method, reference } = req.body as {
      seq: 1 | 2 | 3;
      method: "bank_transfer" | "cash";
      reference?: string;
    };

    const recordedBy = (req.session as any)?.adminUser ?? "admin";
    const now        = new Date();

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Fetch order
      const { rows: orderRows } = await client.query(
        "SELECT * FROM orders WHERE id = $1 FOR UPDATE",
        [req.params.id],
      );
      if (!orderRows.length) {
        await client.query("ROLLBACK");
        res.status(404).json({ error: "الطلب غير موجود" });
        return;
      }
      const order = orderRows[0];
      if (order.remaining_jod <= 0) {
        await client.query("ROLLBACK");
        res.status(400).json({ error: "الطلب مسدّد بالكامل" });
        return;
      }

      // Update relational installments
      await client.query(`
        UPDATE installments
        SET paid_at = $1, method = $2, reference = $3, recorded_by = $4
        WHERE order_id = $5 AND seq = $6 AND paid_at IS NULL
      `, [now, method, reference ?? null, recordedBy, req.params.id, seq]);

      // Recompute paid/remaining from relational table (spec: derived, not manual)
      const { rows: instRows } = await client.query(
        "SELECT amount_jod, paid_at FROM installments WHERE order_id = $1",
        [req.params.id],
      );
      const paidJOD = instRows
        .filter((i: any) => i.paid_at !== null)
        .reduce((s: number, i: any) => s + parseFloat(i.amount_jod), 0);
      const remainingJOD = order.total_jod - paidJOD;

      const paidCount = instRows.filter((i: any) => i.paid_at !== null).length;
      const newStatus =
        remainingJOD <= 0     ? "completed" :
        paidCount === 1       ? "deposit_paid" :
                                "partially_paid";

      // Update order
      await client.query(`
        UPDATE orders
        SET paid_jod = $1, remaining_jod = $2, status = $3, updated_at = $4
        WHERE id = $5
      `, [paidJOD, remainingJOD, newStatus, now, req.params.id]);

      // Also update JSONB installments for backward compat
      const { rows: allInsts } = await client.query(
        "SELECT seq, amount_jod, method, paid_at, reference, recorded_by FROM installments WHERE order_id = $1 ORDER BY seq",
        [req.params.id],
      );
      const jsonbInsts = allInsts.map((i: any) => ({
        seq:        i.seq,
        amountJOD:  parseFloat(i.amount_jod),
        method:     i.method,
        paidAt:     i.paid_at ? new Date(i.paid_at).toISOString() : null,
        reference:  i.reference,
        recordedBy: i.recorded_by,
      }));
      await client.query(
        "UPDATE orders SET installments = $1::jsonb WHERE id = $2",
        [JSON.stringify(jsonbInsts), req.params.id],
      );

      await client.query("COMMIT");
      res.json({ ok: true, status: newStatus, paidJOD, remainingJOD });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("admin/payment error", err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── POST /admin/orders/:id/status ─────────────────────────
// Cancel/update order status — no DELETE ever
router.post("/orders/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body as { status: string; notes?: string };
    const allowed = ["cancelled", "refunded", "completed", "partially_paid", "deposit_paid"];
    if (!allowed.includes(status)) {
      res.status(400).json({ error: "حالة غير صالحة" });
      return;
    }
    await db
      .update(ordersTable)
      .set({ status, notes: notes ?? undefined, updatedAt: new Date() })
      .where(eq(ordersTable.id, req.params.id));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── GET /admin/cohorts ─────────────────────────────────────
router.get("/cohorts", requireAdmin, async (req, res) => {
  try {
    const seats = await db.select().from(cohortSeatsTable);
    res.json({ seats });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── POST /admin/cohorts/:id/seats ─────────────────────────
// Manual seat adjustment (walk-in registrations etc.)
router.post("/cohorts/:id/seats", requireAdmin, async (req, res) => {
  try {
    const { enrolled, capacity, isOpen } = req.body as {
      enrolled?: number; capacity?: number; isOpen?: boolean;
    };
    const updates: Record<string, any> = { updatedAt: new Date() };
    if (enrolled  != null) updates.enrolled  = enrolled;
    if (capacity  != null) updates.capacity  = capacity;
    if (isOpen    != null) updates.isOpen    = isOpen;

    await db
      .update(cohortSeatsTable)
      .set(updates)
      .where(eq(cohortSeatsTable.cohortId, parseInt(req.params.id, 10)));

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
