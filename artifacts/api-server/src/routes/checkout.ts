import { Router } from "express";
import { db, ordersTable, holdsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getUncachableStripeClient, getStripeCredentials } from "../lib/stripeClient.js";
import {
  CHARGE_CURRENCY,
  DEPOSIT_JOD,
  jodToChargeUSD,
  toMinorUSD,
  splitInstallments,
} from "../lib/currency.js";
import {
  getPricing,
  COURSE_NAMES,
} from "../lib/pricing.js";
import {
  createHold,
  setHoldSession,
  releaseHoldBySession,
  countActiveHolds,
  countConfirmedOrders,
  generateOrderId,
  orderExistsForSession,
  confirmHold,
} from "../lib/orderUtils.js";
import type { CustomerInfo, InstallmentRecord } from "@workspace/db";

const router = Router();

const BASE_URL = process.env.BASE_URL ?? `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;

// ── POST /checkout/session ─────────────────────────────────
// Creates a Stripe checkout session and holds a seat
router.post("/checkout/session", async (req, res) => {
  try {
    const {
      cohortId,
      courseSlug,
      mode,
      plan = "deposit",
      cohortCapacity,
      cohortEnrolled,
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
      cohortCapacity: number;
      cohortEnrolled: number;
      cohortStartAr: string;
      cohortDays: string;
      cohortTimeAr: string;
      cohortTrainer: string;
      cohortPlatform: string;
      customer: CustomerInfo;
    };

    // Validate inputs
    if (!cohortId || !courseSlug || !mode || !customer?.firstName || !customer?.phone) {
      res.status(400).json({ error: "بيانات غير مكتملة" });
      return;
    }

    const pricing = getPricing(courseSlug, mode);
    if (!pricing) {
      res.status(400).json({ error: "دورة أو وضع غير صالح" });
      return;
    }

    const courseName = COURSE_NAMES[courseSlug] ?? courseSlug;
    const modeLabel = mode === "onsite" ? "حضوري" : "مباشر تفاعلي (Online LIVE)";

    // ── Seat check ──────────────────────────────────────────
    const activeHolds = await countActiveHolds(cohortId);
    const confirmedOrders = await countConfirmedOrders(cohortId);
    const available = cohortCapacity - cohortEnrolled - activeHolds - confirmedOrders;

    if (available <= 0) {
      res.status(409).json({
        error: "CAP_REACHED",
        message: "نفدت مقاعد هذه الدفعة",
      });
      return;
    }

    // ── Compute amounts ──────────────────────────────────────
    let totalJOD = 0;
    let totalUSD = 0;
    let chargeUSD = 0; // what Stripe charges NOW
    let paidJOD = 0;
    let remainingJOD = 0;
    let installments: InstallmentRecord[] = [];
    let effectivePlan: "full" | "deposit" = plan;

    if (mode === "live") {
      // Online LIVE — always full payment, no installment option
      effectivePlan = "full";
      totalUSD = (pricing as { totalUSD: number }).totalUSD;
      chargeUSD = totalUSD;
      totalJOD = 0; // not shown in JOD for live
      paidJOD = 0;
      remainingJOD = 0;
      installments = [
        { seq: 1, amountJOD: 0, method: "stripe", paidAt: null },
      ];
    } else {
      // Onsite — deposit or full
      totalJOD = (pricing as { totalJOD: number }).totalJOD;
      const [dep, inst2, inst3] = splitInstallments(totalJOD);

      if (effectivePlan === "full") {
        chargeUSD = jodToChargeUSD(totalJOD);
        paidJOD = totalJOD;
        remainingJOD = 0;
        installments = [
          { seq: 1, amountJOD: totalJOD, method: "stripe", paidAt: null },
        ];
      } else {
        // deposit
        chargeUSD = jodToChargeUSD(DEPOSIT_JOD);
        paidJOD = DEPOSIT_JOD;
        remainingJOD = totalJOD - DEPOSIT_JOD;
        installments = [
          { seq: 1, amountJOD: dep, method: "stripe", paidAt: null },
          { seq: 2, amountJOD: inst2, method: "cash", paidAt: null },
          { seq: 3, amountJOD: inst3, method: "cash", paidAt: null },
        ];
      }
    }

    // ── Create hold ──────────────────────────────────────────
    const holdId = await createHold(cohortId);

    // ── Stripe checkout session ──────────────────────────────
    const orderId = generateOrderId();
    const stripe = await getUncachableStripeClient();

    const itemName = `${courseName} — ${modeLabel}`;
    const itemDesc = `الدفعة #${cohortId} · تبدأ ${cohortStartAr} · ${cohortDays} · ${cohortTimeAr} · ${cohortTrainer}`;

    const chargeMinor = toMinorUSD(chargeUSD);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "ar",
      client_reference_id: orderId,
      customer_email: customer.email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CHARGE_CURRENCY,
            unit_amount: chargeMinor,
            product_data: {
              name: itemName,
              description: itemDesc,
            },
          },
        },
      ],
      metadata: {
        holdId,
        orderId,
        cohortId: String(cohortId),
        courseSlug,
        mode,
        plan: effectivePlan,
        totalJOD: String(totalJOD),
        totalUSD: String(totalUSD),
        firstName: customer.firstName,
        lastName: customer.lastName ?? "",
        email: customer.email ?? "",
        phone: customer.phone,
        country: customer.country,
        city: customer.city ?? "",
      },
      payment_intent_data: {
        description: `كاسيت أكاديمي — طلب ${orderId}`,
      },
      success_url: `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/courses/${courseSlug}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    // Link hold → session
    await setHoldSession(holdId, session.id);

    res.json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error("checkout/session error", err);
    res.status(500).json({ error: "خطأ في إنشاء جلسة الدفع" });
  }
});

// ── GET /checkout/status ───────────────────────────────────
// Polls for order after Stripe redirect (success page polling)
router.get("/checkout/status", async (req, res) => {
  const { session_id } = req.query as { session_id: string };
  if (!session_id) {
    res.status(400).json({ error: "session_id مطلوب" });
    return;
  }

  try {
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.sessionId, session_id))
      .limit(1);

    if (!order) {
      res.json({ status: "pending" });
      return;
    }

    res.json({ status: order.status, order });
  } catch (err) {
    console.error("checkout/status error", err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ── POST /stripe/webhook ───────────────────────────────────
// Must be registered BEFORE express.json() in app.ts
// Raw body handler — see app.ts
export async function handleStripeWebhook(
  rawBody: Buffer,
  signature: string,
): Promise<void> {
  const { secretKey, webhookSecret } = await getStripeCredentials();
  if (!webhookSecret) throw new Error("STRIPE webhook secret missing");

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(secretKey, { apiVersion: "2025-06-30.basil" });

  let event: import("stripe").Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as import("stripe").Stripe.Checkout.Session;

    // Idempotency guard
    if (await orderExistsForSession(s.id)) return;

    const meta = s.metadata ?? {};
    const customer: CustomerInfo = {
      firstName: meta.firstName ?? "",
      lastName: meta.lastName ?? "",
      email: meta.email || undefined,
      phone: meta.phone ?? "",
      country: meta.country ?? "",
      city: meta.city || undefined,
    };

    const mode = (meta.mode ?? "live") as "onsite" | "live";
    const plan = (meta.plan ?? "full") as "full" | "deposit";
    const totalJOD = parseInt(meta.totalJOD ?? "0", 10);
    const totalUSD = parseInt(meta.totalUSD ?? "0", 10);

    let paidJOD = 0;
    let remainingJOD = 0;
    let status: string;

    if (mode === "live") {
      status = "paid_full";
      paidJOD = 0;
      remainingJOD = 0;
    } else if (plan === "full") {
      status = "paid_full";
      paidJOD = totalJOD;
      remainingJOD = 0;
    } else {
      status = "deposit_paid";
      paidJOD = 50;
      remainingJOD = totalJOD - 50;
    }

    // Load installments — mark first as paid
    const [dep, inst2, inst3] =
      mode === "live"
        ? [0, 0, 0]
        : plan === "full"
          ? [totalJOD, 0, 0]
          : splitInstallments(totalJOD);

    const now = new Date().toISOString();
    let installments: InstallmentRecord[];
    if (mode === "live") {
      installments = [
        { seq: 1, amountJOD: 0, method: "stripe", paidAt: now },
      ];
    } else if (plan === "full") {
      installments = [
        { seq: 1, amountJOD: dep, method: "stripe", paidAt: now },
      ];
    } else {
      installments = [
        { seq: 1, amountJOD: dep, method: "stripe", paidAt: now },
        { seq: 2, amountJOD: inst2, method: "cash", paidAt: null },
        { seq: 3, amountJOD: inst3, method: "cash", paidAt: null },
      ];
    }

    const orderId = meta.orderId ?? generateOrderId();
    const cohortId = parseInt(meta.cohortId ?? "0", 10);

    await db.insert(ordersTable).values({
      id: orderId,
      sessionId: s.id,
      paymentIntent: typeof s.payment_intent === "string" ? s.payment_intent : null,
      courseSlug: meta.courseSlug ?? "",
      cohortId,
      mode,
      plan,
      customer,
      totalJOD,
      totalUSD,
      paidJOD,
      remainingJOD,
      amountPaidMinor: s.amount_total ?? 0,
      currency: s.currency ?? "usd",
      status,
      installments,
    });

    // Confirm hold
    if (meta.holdId) await confirmHold(meta.holdId, orderId);
  }

  if (event.type === "checkout.session.expired") {
    const s = event.data.object as import("stripe").Stripe.Checkout.Session;
    await releaseHoldBySession(s.id);
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as import("stripe").Stripe.Charge;
    const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
    if (pi) {
      await db
        .update(ordersTable)
        .set({ status: "refunded", updatedAt: new Date() })
        .where(eq(ordersTable.paymentIntent, pi));
    }
  }

  if (event.type === "charge.dispute.created") {
    // Log for manual review — no automated action
    const dispute = event.data.object as import("stripe").Stripe.Dispute;
    console.error("⚠️ STRIPE DISPUTE CREATED", JSON.stringify(dispute));
  }
}

export default router;
