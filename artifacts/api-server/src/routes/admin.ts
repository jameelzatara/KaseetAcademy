import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, pool, ordersTable, installmentsTable, cohortSeatsTable } from "@workspace/db";
import { eq, desc, sql, and, gt, lt, gte } from "drizzle-orm";
import { notifyOrderCompleted } from "../lib/whatsapp.js";
import { sendOrderConfirmation } from "../lib/email.js";
import { requireAdmin, requireStaff } from "../middlewares/adminAuth.js";

const router = Router();

declare module "express-session" {
  interface SessionData { isAdmin?: boolean; }
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  throw new Error("ADMIN_PASSWORD environment variable is required — set it in Replit Secrets.");
}

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

// ── Middleware (shared with adminSections) ─────────────────
// requireStaff scopes consultants to their own referrals in the routes below.

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
router.get("/orders", requireStaff, async (req, res) => {
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

    // Consultants see only orders they referred
    if (!req.session?.isAdmin && req.session?.consultantId) {
      orders = orders.filter((o) => o.consultantId === req.session!.consultantId);
    }

    if (status)    orders = orders.filter((o) => o.status === status);
    if (cohortId)  orders = orders.filter((o) => o.cohortId === parseInt(cohortId, 10));
    if (hasDues === "1") orders = orders.filter((o) => (o.remainingJOD ?? 0) > 0);

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── GET /admin/orders/:id ─────────────────────────────────
router.get("/orders/:id", requireStaff, async (req, res) => {
  try {
    const orderIdParam = String(req.params.id);
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, orderIdParam))
      .limit(1);

    if (!order) { res.status(404).json({ error: "الطلب غير موجود" }); return; }

    // Consultants may only open orders they referred
    if (!req.session?.isAdmin && req.session?.consultantId
        && order.consultantId !== req.session.consultantId) {
      res.status(403).json({ error: "غير مصرّح" }); return;
    }

    // Also fetch relational installments
    const insts = await db
      .select()
      .from(installmentsTable)
      .where(eq(installmentsTable.orderId, orderIdParam))
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

// ── POST /admin/orders/:id/resend-email ───────────────────
// يُعيد إرسال بريد التأكيد لطلب موجود يدوياً من لوحة التحكم
router.post("/orders/:id/resend-email", requireAdmin, async (req, res) => {
  try {
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, String(req.params.id)))
      .limit(1);

    if (!order) { res.status(404).json({ error: "الطلب غير موجود" }); return; }

    const COURSE_NAMES: Record<string, string> = {
      "voiceover":           "أساسيات التعليق والأداء الصوتي",
      "voiceover-basics":    "أساسيات التعليق والأداء الصوتي",
      "public-speaking":     "فن الخطابة والتأثير",
      "presenter":           "المذيع المحترف",
      "arabic-language":     "اللغة العربية للمذيعين",
      "masar-soti":          "المسار الصوتي المتكامل",
      "masterclass-elam":    "ماستركلاس الإعلام",
      "masterclass-voice":   "ماستركلاس التعليق والأداء الصوتي",
      "masterclass-khataba": "ماستركلاس الخطابة والتواصل القيادي",
    };

    const result = await sendOrderConfirmation({
      orderId:      order.id,
      firstName:    order.firstName ?? "",
      lastName:     order.lastName  ?? "",
      courseName:   COURSE_NAMES[order.courseSlug ?? ""] ?? order.courseSlug ?? "",
      cohortDate:   "",
      cohortDays:   "",
      cohortTime:   "",
      trainerName:  "",
      mode:         (order.mode as "onsite" | "live") ?? "onsite",
      platform:     order.mode === "live" ? "Google Meet" : "استوديو كاسيت",
      totalJOD:     order.totalJOD ?? 0,
      paidJOD:      order.paidJOD  ?? 0,
      remainingJOD: order.remainingJOD ?? 0,
      plan:         (order.plan as "full" | "deposit") ?? "deposit",
      chargedUSD:   parseFloat(order.chargedUsd ?? "0"),
      customerEmail: order.email ?? null,
    });

    if (result.ok) {
      res.json({ ok: true, messageId: result.id });
    } else if (result.skipped) {
      res.status(400).json({ error: "لا يوجد بريد إلكتروني لهذا الطلب" });
    } else {
      res.status(500).json({ error: result.error ?? "فشل الإرسال" });
    }
  } catch (err) {
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
      .where(eq(ordersTable.id, String(req.params.id)));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── GET /admin/cohorts ─────────────────────────────────────
// Staff-viewable (consultants can see seats; toggling is admin-only below)
router.get("/cohorts", requireStaff, async (req, res) => {
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
      .where(eq(cohortSeatsTable.cohortId, parseInt(String(req.params.id), 10)));

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── POST /admin/notify-dryrun ──────────────────────────────
// Fires a real WhatsApp + email notification with synthetic order data.
// Use to smoke-test both channels without creating a real payment.
// Body (all optional, sensible defaults are provided):
//   { email?: string, phone?: string, courseSlug?: string, plan?: "full"|"deposit" }
router.post("/notify-dryrun", requireAdmin, async (req, res) => {
  const {
    email     = null,
    phone     = "0000000000",
    courseSlug = "voiceover",
    plan      = "full",
  } = req.body as {
    email?:      string | null;
    phone?:      string;
    courseSlug?: string;
    plan?:       "full" | "deposit";
  };

  const orderId    = `KA-DRYRUN-${Date.now()}`;
  const courseName = ({ voiceover: "أساسيات التعليق", masar_soti: "مسار صوتي", casting: "الكاستينغ", podcast: "البودكاست" } as Record<string, string>)[courseSlug] ?? courseSlug;

  const results: Record<string, unknown> = {};

  // ① WhatsApp — surface per-recipient outcomes so misconfigurations are visible
  try {
    const waResults = await notifyOrderCompleted({ orderId, courseName, firstName: "اختبار", lastName: "إدمن", phone, plan, mode: "onsite" });
    if (waResults.length === 0) {
      results.whatsapp = { ok: false, configured: false, message: "WHATSAPP_RECIPIENTS not set — no recipients configured" };
    } else {
      results.whatsapp = {
        ok: waResults.every((r) => r.ok),
        configured: true,
        recipients: waResults,
      };
    }
  } catch (err) {
    results.whatsapp = { ok: false, error: String(err) };
  }

  // ② Email
  try {
    const emailResult = await sendOrderConfirmation({
      orderId,
      firstName:    "اختبار",
      lastName:     "إدمن",
      courseName,
      cohortDate:   "اختبار",
      cohortDays:   "اختبار",
      cohortTime:   "اختبار",
      trainerName:  "اختبار",
      mode:         "onsite",
      platform:     "استوديو كاسيت",
      totalJOD:     218,
      paidJOD:      plan === "full" ? 218 : 50,
      remainingJOD: plan === "full" ? 0 : 168,
      plan,
      chargedUSD:   307,
      customerEmail: email || null,
    });
    results.email = emailResult;
  } catch (err) {
    results.email = { ok: false, error: String(err) };
  }

  res.json({ orderId, results });
});

// ── GET /admin/email-log ───────────────────────────────────
// Returns the last 100 email log rows (newest first)
router.get("/email-log", requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, order_id, to_address, subject, tag, provider_id, status, error, sent_at
      FROM email_log
      ORDER BY sent_at DESC
      LIMIT 100
    `);
    res.json({ logs: rows });
  } catch (err) {
    console.error("admin/email-log error", err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── POST /admin/email-log/:logId/resend ────────────────────
// يُعيد إرسال البريد من سجل البريد مباشرةً — بدون الحاجة للبحث عن الطلب
router.post("/email-log/:logId/resend", requireAdmin, async (req, res) => {
  try {
    const logId = parseInt(String(req.params.logId), 10);
    if (isNaN(logId)) { res.status(400).json({ error: "معرّف السجل غير صالح" }); return; }

    // جلب سجل البريد
    const { rows: logRows } = await pool.query(
      `SELECT id, order_id, to_address, subject, tag FROM email_log WHERE id = $1`,
      [logId],
    );
    if (!logRows.length) { res.status(404).json({ error: "السجل غير موجود" }); return; }

    const logRow = logRows[0];
    const orderId: string | null = logRow.order_id ?? null;

    // إذا وُجد order_id → أعد الإرسال عبر sendOrderConfirmation (تضمن القالب الكامل)
    if (orderId) {
      const [order] = await db
        .select()
        .from(ordersTable)
        .where(eq(ordersTable.id, orderId))
        .limit(1);

      if (!order) { res.status(404).json({ error: "الطلب المرتبط غير موجود" }); return; }

      const COURSE_NAMES_MAP: Record<string, string> = {
        "voiceover":           "أساسيات التعليق والأداء الصوتي",
        "voiceover-basics":    "أساسيات التعليق والأداء الصوتي",
        "public-speaking":     "فن الخطابة والتأثير",
        "presenter":           "المذيع المحترف",
        "arabic-language":     "اللغة العربية للمذيعين",
        "masar-soti":          "المسار الصوتي المتكامل",
        "masar-elami":         "ماستركلاس الإعلام المتكامل",
        "masterclass-elam":    "ماستركلاس الإعلام",
        "masterclass-voice":   "ماستركلاس التعليق والأداء الصوتي",
        "masterclass-khataba": "ماستركلاس الخطابة والتواصل القيادي",
      };

      const result = await sendOrderConfirmation({
        orderId:       order.id,
        firstName:     order.firstName ?? "",
        lastName:      order.lastName  ?? "",
        courseName:    COURSE_NAMES_MAP[order.courseSlug ?? ""] ?? order.courseSlug ?? "",
        cohortDate:    "",
        cohortDays:    "",
        cohortTime:    "",
        trainerName:   "",
        mode:          (order.mode as "onsite" | "live") ?? "onsite",
        platform:      order.mode === "live" ? "Google Meet" : "استوديو كاسيت",
        totalJOD:      order.totalJOD ?? 0,
        paidJOD:       order.paidJOD  ?? 0,
        remainingJOD:  order.remainingJOD ?? 0,
        plan:          (order.plan as "full" | "deposit") ?? "deposit",
        chargedUSD:    parseFloat(order.chargedUsd ?? "0"),
        customerEmail: order.email ?? null,
      });

      if (result.ok)        return void res.json({ ok: true, messageId: result.id });
      if (result.skipped)   return void res.status(400).json({ error: "لا يوجد بريد إلكتروني لهذا الطلب" });
      return void res.status(500).json({ error: result.error ?? "فشل الإرسال" });
    }

    // لا order_id → أعد الإرسال بشكل مباشر إلى نفس العنوان بنفس الموضوع (resend بسيط)
    const { sendEmail } = await import("../lib/email.js");
    const simpleResult = await sendEmail({
      to:      logRow.to_address,
      subject: logRow.subject,
      html:    `<p>إعادة إرسال — يرجى مراجعة البريد الأصلي.</p>`,
      text:    "إعادة إرسال — يرجى مراجعة البريد الأصلي.",
      tag:     logRow.tag ?? "resend",
    });

    if (simpleResult.ok) return void res.json({ ok: true, messageId: simpleResult.id });
    return void res.status(500).json({ error: simpleResult.error ?? "فشل الإرسال" });

  } catch (err) {
    console.error("email-log resend error", err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
