/**
 * Admin sections API — consultant auth, discount codes, courses,
 * voice evaluations, instagram leads, subscribers, dues, performance.
 *
 * Role model:
 *  - Admin (owner)      → session.isAdmin = true (password login in admin.ts)
 *  - Consultant         → session.consultantId set via /consultants/login
 * Guards:
 *  - requireAdmin       → admin only
 *  - requireStaff       → admin OR active consultant
 */
import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, pool, consultantAccountsTable, discountCodesTable, coursesTable, voiceEvaluationsTable, instagramLeadsTable } from "@workspace/db";
import { eq, desc, asc } from "drizzle-orm";
import { logger } from "../lib/logger.js";
import { requireAdmin, requireStaff } from "../middlewares/adminAuth.js";

const router = Router();

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
    consultantId?: number;
    consultantRole?: string;
    consultantName?: string;
  }
}

const isAdmin = (req: any) => !!req.session?.isAdmin;

// ══════════════════════════════════════════════════════════
// Consultant auth
// ══════════════════════════════════════════════════════════

// ── POST /admin/consultants/login ──────────────────────────
router.post("/consultants/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) { res.status(400).json({ error: "البريد وكلمة المرور مطلوبان" }); return; }

    const [acct] = await db.select().from(consultantAccountsTable)
      .where(eq(consultantAccountsTable.email, email.trim().toLowerCase())).limit(1);

    if (!acct || !acct.isActive) { res.status(401).json({ error: "بيانات الدخول غير صحيحة" }); return; }
    const ok = await bcrypt.compare(password, acct.passwordHash);
    if (!ok) { res.status(401).json({ error: "بيانات الدخول غير صحيحة" }); return; }

    // Regenerate the session: drops any prior identity (e.g. a lingering
    // owner-admin session) and prevents session fixation.
    await new Promise<void>((resolve, reject) =>
      req.session.regenerate((err) => (err ? reject(err) : resolve())));

    req.session.consultantId = acct.id;
    req.session.consultantRole = acct.role;
    req.session.consultantName = acct.name;
    req.session.isAdmin = acct.role === "admin";

    await db.update(consultantAccountsTable)
      .set({ lastLoginAt: new Date() })
      .where(eq(consultantAccountsTable.id, acct.id));

    res.json({ ok: true, consultant: { id: acct.id, name: acct.name, email: acct.email, role: acct.role } });
  } catch (err) {
    logger.error({ err }, "consultants/login error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── POST /admin/consultants/logout ─────────────────────────
router.post("/consultants/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("kaseet.sid");
    res.json({ ok: true });
  });
});

// ── GET /admin/consultants/me ──────────────────────────────
router.get("/consultants/me", requireStaff, async (req, res) => {
  if (req.session.consultantId) {
    const [acct] = await db.select().from(consultantAccountsTable)
      .where(eq(consultantAccountsTable.id, req.session.consultantId)).limit(1);
    if (!acct) { res.status(404).json({ error: "الحساب غير موجود" }); return; }
    res.json({ role: acct.role, id: acct.id, name: acct.name, email: acct.email });
    return;
  }
  res.json({ role: "admin", id: null, name: "المدير", email: null });
});

// ── GET /admin/consultants/performance ─────────────────────
// Admin sees all consultants; a consultant sees only their own row.
router.get("/consultants/performance", requireStaff, async (req, res) => {
  try {
    const onlyId = isAdmin(req) ? null : req.session.consultantId;
    const { rows } = await pool.query(
      `
      SELECT ca.id, ca.name, ca.is_active,
        COUNT(o.id) FILTER (WHERE o.status NOT IN ('pending','cancelled','refunded')) AS orders_all,
        COUNT(o.id) FILTER (WHERE o.status NOT IN ('pending','cancelled','refunded')
                            AND o.created_at >= NOW() - INTERVAL '30 days') AS orders_30d,
        COUNT(o.id) AS attempts_all,
        COALESCE(SUM(o.paid_jod) FILTER (WHERE o.status NOT IN ('pending','cancelled','refunded')), 0) AS revenue_jod,
        MODE() WITHIN GROUP (ORDER BY o.course_slug) AS top_course
      FROM consultant_accounts ca
      LEFT JOIN orders o ON o.consultant_id = ca.id
      WHERE ($1::int IS NULL OR ca.id = $1)
      GROUP BY ca.id, ca.name, ca.is_active
      ORDER BY orders_all DESC
      `,
      [onlyId],
    );
    const performance = rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      isActive: r.is_active,
      ordersAll: Number(r.orders_all),
      orders30d: Number(r.orders_30d),
      revenueJOD: parseFloat(r.revenue_jod),
      conversionRate: Number(r.attempts_all) > 0
        ? Math.round((Number(r.orders_all) / Number(r.attempts_all)) * 100)
        : null,
      topCourse: r.top_course,
    }));
    res.json({ performance });
  } catch (err) {
    logger.error({ err }, "consultants/performance error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── Consultant CRUD (admin only) ───────────────────────────
router.get("/consultants", requireAdmin, async (_req, res) => {
  try {
    const list = await db.select({
      id: consultantAccountsTable.id,
      name: consultantAccountsTable.name,
      email: consultantAccountsTable.email,
      role: consultantAccountsTable.role,
      isActive: consultantAccountsTable.isActive,
      lastLoginAt: consultantAccountsTable.lastLoginAt,
      createdAt: consultantAccountsTable.createdAt,
    }).from(consultantAccountsTable).orderBy(asc(consultantAccountsTable.id));
    res.json({ consultants: list });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/consultants", requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role = "consultant" } = req.body as {
      name?: string; email?: string; password?: string; role?: string;
    };
    if (!name || !email || !password) { res.status(400).json({ error: "الاسم والبريد وكلمة المرور مطلوبة" }); return; }
    if (password.length < 8) { res.status(400).json({ error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }); return; }
    if (!["admin", "consultant"].includes(role)) { res.status(400).json({ error: "دور غير صالح" }); return; }

    const passwordHash = await bcrypt.hash(password, 10);
    const [created] = await db.insert(consultantAccountsTable).values({
      name, email: email.trim().toLowerCase(), passwordHash, role,
    }).returning({ id: consultantAccountsTable.id });
    res.json({ ok: true, id: created.id });
  } catch (err: any) {
    if (err?.code === "23505") { res.status(409).json({ error: "البريد الإلكتروني مستخدم مسبقاً" }); return; }
    logger.error({ err }, "consultants create error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.put("/consultants/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { name, email, password, role, isActive } = req.body as {
      name?: string; email?: string; password?: string; role?: string; isActive?: boolean;
    };
    const updates: Record<string, any> = { updatedAt: new Date() };
    if (name != null) updates.name = name;
    if (email != null) updates.email = email.trim().toLowerCase();
    if (role != null) {
      if (!["admin", "consultant"].includes(role)) { res.status(400).json({ error: "دور غير صالح" }); return; }
      updates.role = role;
    }
    if (isActive != null) updates.isActive = isActive;
    if (password) {
      if (password.length < 8) { res.status(400).json({ error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }); return; }
      updates.passwordHash = await bcrypt.hash(password, 10);
    }
    await db.update(consultantAccountsTable).set(updates).where(eq(consultantAccountsTable.id, id));
    res.json({ ok: true });
  } catch (err: any) {
    if (err?.code === "23505") { res.status(409).json({ error: "البريد الإلكتروني مستخدم مسبقاً" }); return; }
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.delete("/consultants/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    // Keep referral history intact: block delete if orders reference this consultant
    const { rows } = await pool.query(`SELECT COUNT(*) AS c FROM orders WHERE consultant_id = $1`, [id]);
    if (Number(rows[0].c) > 0) {
      res.status(409).json({ error: "لا يمكن حذف مستشارة لديها طلبات مسجّلة — عطّلي الحساب بدلاً من ذلك" });
      return;
    }
    await db.delete(consultantAccountsTable).where(eq(consultantAccountsTable.id, id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ══════════════════════════════════════════════════════════
// Discount codes
// ══════════════════════════════════════════════════════════

router.get("/discount-codes", requireStaff, async (_req, res) => {
  try {
    const codes = await db.select().from(discountCodesTable).orderBy(desc(discountCodesTable.createdAt));
    res.json({ codes: codes.map((c) => ({ ...c, passwordHash: undefined })) });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/discount-codes", requireStaff, async (req, res) => {
  try {
    const { code, type, value, appliesTo = "all", maxUses, expiresAt } = req.body as {
      code?: string; type?: string; value?: number; appliesTo?: string;
      maxUses?: number | null; expiresAt?: string | null;
    };
    if (!code || !type || value == null) { res.status(400).json({ error: "الكود والنوع والقيمة مطلوبة" }); return; }
    if (!["percent", "fixed"].includes(type)) { res.status(400).json({ error: "نوع غير صالح" }); return; }
    const numValue = Number(value);
    if (!Number.isFinite(numValue) || numValue <= 0 || (type === "percent" && numValue > 100)) {
      res.status(400).json({ error: "قيمة غير صالحة" }); return;
    }
    if (maxUses != null && (!Number.isInteger(Number(maxUses)) || Number(maxUses) <= 0)) {
      res.status(400).json({ error: "عدد الاستخدامات غير صالح" }); return;
    }

    // ── Consultant policy: bounded codes only ────────────────
    // Consultants (non-admin) may only create percent codes ≤ 20%,
    // with a required usage cap ≤ 100. Value/type beyond that is admin-only.
    if (!isAdmin(req)) {
      if (type !== "percent" || numValue > 20) {
        res.status(403).json({ error: "المستشار يمكنه إنشاء خصم نسبة مئوية حتى 20% فقط" }); return;
      }
      if (maxUses == null || Number(maxUses) > 100) {
        res.status(403).json({ error: "يجب تحديد عدد استخدامات (حتى 100) لكود المستشار" }); return;
      }
    }

    const createdById = req.session.consultantId ?? null;
    const createdBy = req.session.consultantName ?? "admin";

    const [created] = await db.insert(discountCodesTable).values({
      code: code.trim().toUpperCase(),
      type,
      value: String(numValue),
      appliesTo,
      maxUses: maxUses ?? null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdById,
      createdBy,
    }).returning({ id: discountCodesTable.id });
    res.json({ ok: true, id: created.id });
  } catch (err: any) {
    if (err?.code === "23505") { res.status(409).json({ error: "هذا الكود موجود مسبقاً" }); return; }
    logger.error({ err }, "discount-codes create error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// Update / toggle. Consultants may only toggle codes they created; admin can edit all.
router.put("/discount-codes/:id", requireStaff, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const [existing] = await db.select().from(discountCodesTable).where(eq(discountCodesTable.id, id)).limit(1);
    if (!existing) { res.status(404).json({ error: "الكود غير موجود" }); return; }

    if (!isAdmin(req) && existing.createdById !== req.session.consultantId) {
      res.status(403).json({ error: "لا يمكنك تعديل كود لم تنشئيه" }); return;
    }

    const { isActive, maxUses, expiresAt, value, type, appliesTo } = req.body as {
      isActive?: boolean; maxUses?: number | null; expiresAt?: string | null;
      value?: number; type?: string; appliesTo?: string;
    };
    const updates: Record<string, any> = { updatedAt: new Date() };
    if (isActive != null) updates.isActive = isActive;
    if (maxUses !== undefined) {
      if (!isAdmin(req) && (maxUses == null || Number(maxUses) > 100)) {
        res.status(403).json({ error: "يجب أن يبقى عدد الاستخدامات محدوداً (حتى 100)" }); return;
      }
      updates.maxUses = maxUses;
    }
    if (expiresAt !== undefined) updates.expiresAt = expiresAt ? new Date(expiresAt) : null;
    // Value/type/appliesTo edits are admin-only (base pricing control)
    if (value !== undefined || type !== undefined || appliesTo !== undefined) {
      if (!isAdmin(req)) { res.status(403).json({ error: "تعديل قيمة الكود للمدير فقط" }); return; }
      if (value !== undefined) {
        const numValue = Number(value);
        const effType = type ?? existing.type;
        if (!Number.isFinite(numValue) || numValue <= 0 || (effType === "percent" && numValue > 100)) {
          res.status(400).json({ error: "قيمة غير صالحة" }); return;
        }
        updates.value = String(numValue);
      }
      if (type !== undefined) {
        if (!["percent", "fixed"].includes(type)) { res.status(400).json({ error: "نوع غير صالح" }); return; }
        updates.type = type;
      }
      if (appliesTo !== undefined) updates.appliesTo = appliesTo;
    }
    await db.update(discountCodesTable).set(updates).where(eq(discountCodesTable.id, id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// Delete — admin only, and only unused codes
router.delete("/discount-codes/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const [existing] = await db.select().from(discountCodesTable).where(eq(discountCodesTable.id, id)).limit(1);
    if (!existing) { res.status(404).json({ error: "الكود غير موجود" }); return; }
    if (existing.usedCount > 0) {
      res.status(409).json({ error: "لا يمكن حذف كود مستخدَم — عطّليه بدلاً من ذلك" }); return;
    }
    await db.delete(discountCodesTable).where(eq(discountCodesTable.id, id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ══════════════════════════════════════════════════════════
// Courses
// ══════════════════════════════════════════════════════════

router.get("/courses", requireStaff, async (_req, res) => {
  try {
    const courses = await db.select().from(coursesTable).orderBy(asc(coursesTable.id));
    res.json({ courses });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

function courseUpdatesFromBody(body: any, adminOnly = false): Record<string, any> {
  const updates: Record<string, any> = {};
  const fields = [
    "nameAr", "level", "status",
    "onsiteEnabled", "onsitePriceJOD", "onsiteHours", "onsiteSessions", "onsiteCapacity",
    "liveEnabled", "livePriceUSD", "liveHours", "liveSessions", "liveCapacity",
  ] as const;
  for (const f of fields) if (body[f] !== undefined) updates[f] = body[f];
  // priceLocked toggle is admin-only
  if (adminOnly && body.priceLocked !== undefined) updates.priceLocked = body.priceLocked;
  return updates;
}

router.post("/courses", requireStaff, async (req, res) => {
  try {
    const { slug, nameAr } = req.body as { slug?: string; nameAr?: string };
    if (!slug || !nameAr) { res.status(400).json({ error: "المعرّف والاسم مطلوبان" }); return; }
    if (!/^[a-z0-9-]+$/.test(slug)) { res.status(400).json({ error: "المعرّف يجب أن يكون أحرفاً إنجليزية صغيرة وأرقاماً وشرطات فقط" }); return; }

    const updates = courseUpdatesFromBody(req.body, isAdmin(req));
    // priceLocked defaults to false for new courses; admin can override on create
    const [created] = await db.insert(coursesTable).values({
      slug, nameAr,
      ...updates,
    }).returning({ id: coursesTable.id });
    res.json({ ok: true, id: created.id });
  } catch (err: any) {
    if (err?.code === "23505") { res.status(409).json({ error: "دورة بهذا المعرّف موجودة مسبقاً" }); return; }
    logger.error({ err }, "courses create error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.put("/courses/:slug", requireStaff, async (req, res) => {
  try {
    const [existing] = await db.select().from(coursesTable).where(eq(coursesTable.slug, String(req.params.slug))).limit(1);
    if (!existing) { res.status(404).json({ error: "الدورة غير موجودة" }); return; }

    const updates = courseUpdatesFromBody(req.body, isAdmin(req));
    // Price edits blocked for consultants on courses with priceLocked=true
    const priceEdit = updates.onsitePriceJOD !== undefined || updates.livePriceUSD !== undefined;
    if (!isAdmin(req) && priceEdit && existing.priceLocked) {
      res.status(403).json({ error: "سعر هذه الدورة مقفل — تعديل السعر للمدير فقط" }); return;
    }
    updates.updatedAt = new Date();
    await db.update(coursesTable).set(updates).where(eq(coursesTable.slug, String(req.params.slug)));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.delete("/courses/:slug", requireAdmin, async (req, res) => {
  try {
    await db.delete(coursesTable).where(eq(coursesTable.slug, String(req.params.slug)));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ══════════════════════════════════════════════════════════
// Voice evaluations ("سمّعنا صوتك")
// ══════════════════════════════════════════════════════════

router.get("/voice-evaluations", requireStaff, async (_req, res) => {
  try {
    const evals = await db.select().from(voiceEvaluationsTable).orderBy(desc(voiceEvaluationsTable.submittedAt));
    res.json({ evaluations: evals });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/voice-evaluations", requireStaff, async (req, res) => {
  try {
    const { name, phone, audioRef, reviewer, notes } = req.body as {
      name?: string; phone?: string; audioRef?: string; reviewer?: string; notes?: string;
    };
    if (!name || !phone) { res.status(400).json({ error: "الاسم ورقم الهاتف مطلوبان" }); return; }
    const [created] = await db.insert(voiceEvaluationsTable).values({
      name, phone, audioRef: audioRef ?? null, reviewer: reviewer ?? null, notes: notes ?? null,
    }).returning({ id: voiceEvaluationsTable.id });
    res.json({ ok: true, id: created.id });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.put("/voice-evaluations/:id", requireStaff, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { status, reviewer, notes, audioRef } = req.body as {
      status?: string; reviewer?: string; notes?: string; audioRef?: string;
    };
    const updates: Record<string, any> = { updatedAt: new Date() };
    if (status != null) {
      if (!["pending", "reviewed", "accepted", "rejected"].includes(status)) {
        res.status(400).json({ error: "حالة غير صالحة" }); return;
      }
      updates.status = status;
    }
    if (reviewer !== undefined) updates.reviewer = reviewer;
    if (notes !== undefined) updates.notes = notes;
    if (audioRef !== undefined) updates.audioRef = audioRef;
    await db.update(voiceEvaluationsTable).set(updates).where(eq(voiceEvaluationsTable.id, id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ══════════════════════════════════════════════════════════
// Instagram leads (admin only)
// ══════════════════════════════════════════════════════════

router.get("/instagram-leads", requireAdmin, async (_req, res) => {
  try {
    const leads = await db.select().from(instagramLeadsTable).orderBy(desc(instagramLeadsTable.createdAt));
    res.json({ leads });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/instagram-leads", requireAdmin, async (req, res) => {
  try {
    const { campaignName, carouselRef, keywords, leadCount, conversionCount, notes, campaignDate } = req.body as {
      campaignName?: string; carouselRef?: string; keywords?: string;
      leadCount?: number; conversionCount?: number; notes?: string; campaignDate?: string;
    };
    if (!campaignName) { res.status(400).json({ error: "اسم الحملة مطلوب" }); return; }
    const [created] = await db.insert(instagramLeadsTable).values({
      campaignName,
      carouselRef: carouselRef ?? null,
      keywords: keywords ?? null,
      leadCount: leadCount ?? 0,
      conversionCount: conversionCount ?? 0,
      notes: notes ?? null,
      campaignDate: campaignDate ?? null,
    }).returning({ id: instagramLeadsTable.id });
    res.json({ ok: true, id: created.id });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.put("/instagram-leads/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { campaignName, carouselRef, keywords, leadCount, conversionCount, notes, campaignDate } = req.body as Record<string, any>;
    const updates: Record<string, any> = { updatedAt: new Date() };
    if (campaignName !== undefined) updates.campaignName = campaignName;
    if (carouselRef !== undefined) updates.carouselRef = carouselRef;
    if (keywords !== undefined) updates.keywords = keywords;
    if (leadCount !== undefined) updates.leadCount = leadCount;
    if (conversionCount !== undefined) updates.conversionCount = conversionCount;
    if (notes !== undefined) updates.notes = notes;
    if (campaignDate !== undefined) updates.campaignDate = campaignDate;
    await db.update(instagramLeadsTable).set(updates).where(eq(instagramLeadsTable.id, id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ══════════════════════════════════════════════════════════
// Subscribers (distinct persons derived from orders) — admin only
// ══════════════════════════════════════════════════════════

router.get("/subscribers", requireAdmin, async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COALESCE(NULLIF(email, ''), 'بدون بريد — ' || phone) AS person_key,
        MAX(email)      AS email,
        MAX(first_name) AS first_name,
        MAX(last_name)  AS last_name,
        MAX(phone)      AS phone,
        MAX(country)    AS country,
        ARRAY_AGG(DISTINCT course_slug) AS courses,
        COUNT(*)        AS order_count,
        COALESCE(SUM(paid_jod), 0) AS total_paid_jod,
        MAX(created_at) AS last_order_at
      FROM orders
      WHERE status NOT IN ('pending','cancelled')
      GROUP BY person_key
      ORDER BY last_order_at DESC
    `);
    res.json({
      subscribers: rows.map((r: any) => ({
        email:        r.email,
        firstName:    r.first_name,
        lastName:     r.last_name,
        phone:        r.phone,
        country:      r.country,
        courses:      r.courses,
        orderCount:   Number(r.order_count),
        totalPaidJOD: parseFloat(r.total_paid_jod),
        lastOrderAt:  r.last_order_at,
      })),
    });
  } catch (err) {
    logger.error({ err }, "subscribers error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── GET /admin/subscribers/orders?email=… — order history for one person ──
router.get("/subscribers/orders", requireAdmin, async (req, res) => {
  try {
    const { email, phone } = req.query as { email?: string; phone?: string };
    if (!email && !phone) { res.status(400).json({ error: "email أو phone مطلوب" }); return; }
    const { rows } = await pool.query(
      `SELECT id, course_slug, mode, plan, total_jod, paid_jod, remaining_jod, status, created_at
       FROM orders
       WHERE ($1::text IS NOT NULL AND email = $1) OR ($2::text IS NOT NULL AND phone = $2)
       ORDER BY created_at DESC`,
      [email ?? null, phone ?? null],
    );
    res.json({ orders: rows });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ══════════════════════════════════════════════════════════
// Dues — admin only
// ══════════════════════════════════════════════════════════

router.get("/dues", requireAdmin, async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT o.id, o.first_name, o.last_name, o.phone, o.email, o.course_slug, o.cohort_id,
             o.total_jod, o.paid_jod, o.remaining_jod, o.status, o.created_at,
             (SELECT MIN(i.due_at) FROM installments i
               WHERE i.order_id = o.id AND i.paid_at IS NULL) AS next_due_at,
             (SELECT json_agg(json_build_object(
                 'seq', i.seq, 'amountJod', i.amount_jod, 'method', i.method,
                 'paidAt', i.paid_at, 'dueAt', i.due_at
               ) ORDER BY i.seq)
              FROM installments i WHERE i.order_id = o.id) AS installments
      FROM orders o
      WHERE o.remaining_jod > 0
        AND o.status IN ('deposit_paid','partially_paid')
      ORDER BY next_due_at ASC NULLS LAST, o.created_at ASC
    `);
    res.json({ dues: rows });
  } catch (err) {
    logger.error({ err }, "dues error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
