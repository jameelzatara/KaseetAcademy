import { Router } from "express";
import { db, pool, ordersTable, holdsTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import { getUncachableStripeClient, getStripeSync } from "../lib/stripeClient.js";
import {
  CHARGE_CURRENCY,
  DEPOSIT_JOD,
  jodToChargeUSD,
  toMinorUSD,
  splitInstallments,
} from "../lib/currency.js";
import { getPricing, COURSE_NAMES } from "../lib/pricing.js";
import {
  createHold,
  setHoldSession,
  releaseHoldBySession,
  generateOrderId,
  orderExistsForSession,
  getCohortSeats,
  createOrderWithSeat,
} from "../lib/orderUtils.js";
import type { CustomerInfo, InstallmentRecord } from "@workspace/db";
import { logger } from "../lib/logger.js";
import { notifyOrderCompleted } from "../lib/whatsapp.js";

// Extend express-session with checkout-specific fields
declare module "express-session" {
  interface SessionData {
    stripeSessionIds?: string[]; // Stripe session IDs initiated by this browser session
  }
}

const router = Router();

const BASE_URL = process.env.BASE_URL ?? `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;

// ── POST /checkout/session ─────────────────────────────────
router.post("/checkout/session", async (req, res) => {
  try {
    const {
      cohortId,
      courseSlug,
      mode,
      plan = "deposit",
      // ⛔ cohortCapacity / cohortEnrolled are intentionally NOT accepted from
      // the browser — all capacity decisions come from cohort_seats in DB only.
      cohortStartAr,
      cohortDays,
      cohortTimeAr,
      cohortTrainer,
      cohortPlatform,
      customer,
    } = req.body as {
      cohortId: number;
      courseSlug: string;
      mode: "onsite" | "live";
      plan?: "full" | "deposit";
      cohortStartAr: string;
      cohortDays: string;
      cohortTimeAr: string;
      cohortTrainer: string;
      cohortPlatform: string;
      customer: CustomerInfo;
    };

    if (!cohortId || !courseSlug || !mode || !customer?.firstName || !customer?.phone) {
      res.status(400).json({ error: "بيانات غير مكتملة" });
      return;
    }

    const pricing = getPricing(courseSlug, mode);
    if (!pricing) {
      res.status(400).json({ error: "دورة أو وضع غير صالح" });
      return;
    }

    // ── Seat check from DB (no browser values trusted) ───────
    const seats = await getCohortSeats(cohortId);
    if (!seats.isOpen || seats.enrolled >= seats.capacity) {
      res.status(409).json({ error: "CAP_REACHED", message: "نفدت مقاعد هذه الدفعة" });
      return;
    }

    const courseName  = COURSE_NAMES[courseSlug] ?? courseSlug;
    const modeLabel   = mode === "onsite" ? "حضوري" : "مباشر تفاعلي (Online LIVE)";

    // ── Compute amounts ──────────────────────────────────────
    let totalJOD = 0, totalUSD = 0, chargeUSD = 0, paidJOD = 0, remainingJOD = 0;
    let installments: InstallmentRecord[] = [];
    let effectivePlan: "full" | "deposit" = plan;

    if (mode === "live") {
      effectivePlan = "full";
      totalUSD  = (pricing as { totalUSD: number }).totalUSD;
      chargeUSD = totalUSD;
      installments = [{ seq: 1, amountJOD: 0, method: "stripe", paidAt: null }];
    } else {
      totalJOD = (pricing as { totalJOD: number }).totalJOD;
      const [dep, inst2, inst3] = splitInstallments(totalJOD);
      if (effectivePlan === "full") {
        chargeUSD    = jodToChargeUSD(totalJOD);
        paidJOD      = totalJOD;
        installments = [{ seq: 1, amountJOD: totalJOD, method: "stripe", paidAt: null }];
      } else {
        chargeUSD    = jodToChargeUSD(DEPOSIT_JOD);
        paidJOD      = DEPOSIT_JOD;
        remainingJOD = totalJOD - DEPOSIT_JOD;
        installments = [
          { seq: 1, amountJOD: dep,   method: "stripe", paidAt: null },
          { seq: 2, amountJOD: inst2, method: "cash",   paidAt: null },
          { seq: 3, amountJOD: inst3, method: "cash",   paidAt: null },
        ];
      }
    }

    // ── Create hold ──────────────────────────────────────────
    const holdId  = await createHold(cohortId);
    const orderId = generateOrderId();
    const stripe  = await getUncachableStripeClient();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "auto",
      client_reference_id: orderId,
      customer_email: customer.email || undefined,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: CHARGE_CURRENCY,
          unit_amount: toMinorUSD(chargeUSD),
          product_data: {
            name: `${courseName} — ${modeLabel}`,
            description: `الدفعة #${cohortId} · تبدأ ${cohortStartAr} · ${cohortDays} · ${cohortTimeAr} · ${cohortTrainer}`,
          },
        },
      }],
      metadata: {
        holdId, orderId,
        cohortId:   String(cohortId),
        courseSlug, mode,
        plan:       effectivePlan,
        totalJOD:   String(totalJOD),
        totalUSD:   String(totalUSD),
        chargeUSD:  String(chargeUSD),
        firstName:  customer.firstName,
        lastName:   customer.lastName ?? "",
        email:      customer.email ?? "",
        phone:      customer.phone,
        country:    customer.country,
        city:       customer.city ?? "",
      },
      payment_intent_data: { description: `كاسيت أكاديمي — طلب ${orderId}` },
      success_url: `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${BASE_URL}/courses/${courseSlug}`,
      expires_at:  Math.floor(Date.now() / 1000) + 30 * 60,
    });

    await setHoldSession(holdId, session.id);

    // Record this Stripe session as belonging to the current browser session
    if (!req.session.stripeSessionIds) req.session.stripeSessionIds = [];
    req.session.stripeSessionIds.push(session.id);

    res.json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    logger.error({ err }, "checkout/session error");
    res.status(500).json({ error: "خطأ في إنشاء جلسة الدفع" });
  }
});

// ── GET /checkout/status ───────────────────────────────────
router.get("/checkout/status", async (req, res) => {
  const { session_id } = req.query as { session_id: string };
  if (!session_id) {
    res.status(400).json({ error: "session_id مطلوب" });
    return;
  }

  // Note: session_id is an unguessable Stripe ID (cs_xxx…). We removed the
  // cookie-based ownership check because Stripe's redirect can lose the cookie
  // in some browsers / cross-origin flows. Rate-limiting (task #100) will
  // protect this endpoint instead.
  try {
    // 1. Fast path: order already created (by webhook or a previous status check)
    // Search both columns: legacy sessionId and canonical stripeSessionId
    const [existingOrder] = await db
      .select()
      .from(ordersTable)
      .where(or(eq(ordersTable.sessionId, session_id), eq(ordersTable.stripeSessionId, session_id)))
      .limit(1);

    if (existingOrder) {
      res.json({ status: existingOrder.status, order: existingOrder });
      return;
    }

    // 2. Order not in DB yet — ask Stripe directly so we don't wait for webhook
    try {
      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status === "paid") {
        // Payment confirmed by Stripe: create the order now (idempotent)
        await onSessionCompleted(session);

        // Fetch the newly created order (check both session ID columns)
        const [newOrder] = await db
          .select()
          .from(ordersTable)
          .where(or(eq(ordersTable.sessionId, session_id), eq(ordersTable.stripeSessionId, session_id)))
          .limit(1);

        if (newOrder) {
          res.json({ status: newOrder.status, order: newOrder });
          return;
        }
      }
      // Payment not confirmed yet (still processing or unpaid)
    } catch (stripeErr) {
      // Non-fatal: fall through to pending so client can retry
      logger.warn({ stripeErr, session_id }, "Stripe session fetch failed in status check");
    }

    res.json({ status: "pending" });
  } catch (err) {
    logger.error({ err }, "checkout/status error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── POST /checkout/alert-team ─────────────────────────────
// Called by the success page when 20s pass with no confirmed order.
// Logs to DB so the admin panel can surface unresolved sessions.
router.post("/checkout/alert-team", async (req, res) => {
  const { sessionId } = req.body as { sessionId?: string };
  if (!sessionId) { res.status(400).json({ error: "sessionId مطلوب" }); return; }
  try {
    // Ensure table exists (idempotent DDL)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS missed_webhooks (
        session_id TEXT PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await pool.query(
      `INSERT INTO missed_webhooks (session_id) VALUES ($1) ON CONFLICT DO NOTHING`,
      [sessionId],
    );
    logger.warn({ sessionId }, "Team alert: no order after 20s — saved to missed_webhooks");
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "alert-team error");
    res.status(500).json({ error: "server error" });
  }
});

// ── Webhook verification + async dispatch ─────────────────
// Called from app.ts — must return the verified event so app can respond 200
// before we process business logic.
export async function verifyStripeWebhook(
  rawBody: Buffer,
  signature: string,
): Promise<import("stripe").Stripe.Event> {
  const stripeSync = await getStripeSync();
  await stripeSync.processWebhook(rawBody, signature); // verifies sig + syncs Stripe tables
  return JSON.parse(rawBody.toString()) as import("stripe").Stripe.Event;
}

// ── Business logic — runs AFTER 200 is sent to Stripe ─────
export async function processWebhookEvent(
  event: import("stripe").Stripe.Event,
): Promise<void> {
  try {
    if (event.type === "checkout.session.completed") {
      await onSessionCompleted(event.data.object as import("stripe").Stripe.Checkout.Session);
    } else if (event.type === "checkout.session.expired") {
      const s = event.data.object as import("stripe").Stripe.Checkout.Session;
      await releaseHoldBySession(s.id);
    } else if (event.type === "charge.refunded") {
      const charge = event.data.object as import("stripe").Stripe.Charge;
      const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
      if (pi) {
        await db
          .update(ordersTable)
          .set({ status: "refunded", updatedAt: new Date() })
          .where(eq(ordersTable.paymentIntent, pi));
      }
    } else if (event.type === "charge.dispute.created") {
      const dispute = event.data.object as import("stripe").Stripe.Dispute;
      logger.error({ dispute }, "⚠️ STRIPE DISPUTE CREATED — needs manual review");
    }
  } catch (err) {
    logger.error({ err, eventType: event.type, eventId: event.id }, "Webhook processing error");
  }
}

async function onSessionCompleted(s: import("stripe").Stripe.Checkout.Session) {
  // Idempotency guard (also inside createOrderWithSeat transaction)
  if (await orderExistsForSession(s.id)) return;

  const meta = s.metadata ?? {};
  const mode     = (meta.mode ?? "live") as "onsite" | "live";
  const plan     = (meta.plan ?? "full") as "full" | "deposit";
  const totalJOD = parseInt(meta.totalJOD ?? "0", 10);
  const totalUSD = parseInt(meta.totalUSD ?? "0", 10);
  const chargedUsd = parseFloat(meta.chargeUSD ?? String((s.amount_total ?? 0) / 100));

  let paidJOD = 0, remainingJOD = 0, status: string;
  if (mode === "live") {
    status = "paid_full";
  } else if (plan === "full") {
    status = "paid_full";
    paidJOD = totalJOD;
  } else {
    status = "deposit_paid";
    paidJOD = DEPOSIT_JOD;
    remainingJOD = totalJOD - DEPOSIT_JOD;
  }

  const [dep, inst2, inst3] =
    mode === "live" ? [0, 0, 0] :
    plan === "full" ? [totalJOD, 0, 0] :
    splitInstallments(totalJOD);

  const now = new Date().toISOString();
  let installments: InstallmentRecord[];
  if (mode === "live") {
    installments = [{ seq: 1, amountJOD: 0, method: "stripe", paidAt: now }];
  } else if (plan === "full") {
    installments = [{ seq: 1, amountJOD: dep, method: "stripe", paidAt: now }];
  } else {
    installments = [
      { seq: 1, amountJOD: dep,   method: "stripe", paidAt: now },
      { seq: 2, amountJOD: inst2, method: "cash",   paidAt: null },
      { seq: 3, amountJOD: inst3, method: "cash",   paidAt: null },
    ];
  }

  const orderId  = meta.orderId ?? generateOrderId();
  const cohortId = parseInt(meta.cohortId ?? "0", 10);

  const result = await createOrderWithSeat({
    orderId,
    sessionId:       s.id,
    paymentIntent:   typeof s.payment_intent === "string" ? s.payment_intent : null,
    chargedUsd,
    courseSlug:      meta.courseSlug ?? "",
    cohortId,
    mode,
    plan,
    totalJOD,
    totalUSD,
    paidJOD,
    remainingJOD,
    amountPaidMinor: s.amount_total ?? 0,
    status,
    installments,
    customer: {
      firstName: meta.firstName ?? "",
      lastName:  meta.lastName ?? "",
      email:     meta.email || undefined,
      phone:     meta.phone ?? "",
      country:   meta.country ?? "",
      city:      meta.city || undefined,
    },
    holdId: meta.holdId || undefined,
  });

  if (result === "overbooked") {
    // Cohort was full by the time webhook fired — create order with overbooked status
    logger.error(
      { orderId, cohortId },
      "⚠️ OVERBOOKED — seat sold to two buyers simultaneously, manual intervention needed",
    );
    // Still store the order so the team can refund/move the student
    await db.insert(ordersTable).values({
      id:              orderId,
      sessionId:       s.id,
      stripeSessionId: s.id,
      paymentIntent:   typeof s.payment_intent === "string" ? s.payment_intent : null,
      stripePaymentId: typeof s.payment_intent === "string" ? s.payment_intent : null,
      courseSlug:      meta.courseSlug ?? "",
      cohortId,
      mode,
      plan,
      customer: {
        firstName: meta.firstName ?? "", lastName: meta.lastName ?? "",
        email: meta.email, phone: meta.phone ?? "", country: meta.country ?? "",
        city: meta.city,
      },
      firstName: meta.firstName ?? "",
      lastName:  meta.lastName ?? "",
      phone:     meta.phone ?? "",
      email:     meta.email || null,
      country:   meta.country ?? "",
      city:      meta.city || null,
      totalJOD,  totalUSD, paidJOD, remainingJOD,
      amountPaidMinor: s.amount_total ?? 0,
      chargedUsd:      String(chargedUsd),
      status:    "overbooked",
      installments,
    }).onConflictDoNothing();
  } else if (result === "created") {
    logger.info({ orderId, cohortId, status }, "Order created");
    // Fire-and-forget: notify team via WhatsApp — must not block payment processing
    notifyOrderCompleted({
      orderId,
      courseName: COURSE_NAMES[meta.courseSlug ?? ""] ?? meta.courseSlug ?? "",
      firstName:  meta.firstName ?? "",
      lastName:   meta.lastName ?? "",
      phone:      meta.phone ?? "",
      plan,
      mode,
    }).catch((err) => logger.warn({ err }, "WhatsApp notification failed silently"));
  }
}

// ── Legacy export used by app.ts — kept for backward compat ──
export async function handleStripeWebhook(rawBody: Buffer, signature: string): Promise<void> {
  const event = await verifyStripeWebhook(rawBody, signature);
  // Fire-and-forget: app.ts already sends 200 after this returns from verification
  processWebhookEvent(event).catch((err) =>
    logger.error({ err }, "Async webhook processing failed"),
  );
}

export default router;
