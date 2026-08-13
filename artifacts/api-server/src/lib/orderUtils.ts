import { randomBytes } from "crypto";
import { db, pool, ordersTable, holdsTable, cohortSeatsTable, installmentsTable } from "@workspace/db";
import { eq, and, isNull, gt, inArray, sql } from "drizzle-orm";
import type { InstallmentRecord } from "@workspace/db";

// ── ID Generation ──────────────────────────────────────────
// يستخدم DB sequence ليضمن تفرّد الأرقام حتى بعد إعادة تشغيل الخادم

let _seqReady = false;

async function ensureOrderSeq(): Promise<void> {
  if (_seqReady) return;
  const year = new Date().getFullYear();
  // احسب القيمة البداية من أكبر طلب موجود
  const res = await pool.query<{ n: string }>(
    `SELECT COALESCE(MAX(CAST(SPLIT_PART(id,'-',4) AS INT)), 100) + 1 AS n
     FROM orders WHERE id LIKE $1`,
    [`KS-ORD-${year}-%`],
  );
  const start = parseInt(res.rows[0]?.n ?? "101", 10);
  // PostgreSQL لا يقبل $1 في DDL — نستخدم string interpolation (start دائماً integer)
  await pool.query(
    `CREATE SEQUENCE IF NOT EXISTS kaseet_order_seq START WITH ${start} OWNED BY NONE`,
  );
  // إذا كانت السيكوينس موجودة بقيمة أقل، نرفعها
  await pool.query(
    `SELECT setval('kaseet_order_seq', GREATEST(last_value, ${start} - 1)) FROM kaseet_order_seq`,
  );
  _seqReady = true;
}

export async function generateOrderId(): Promise<string> {
  await ensureOrderSeq();
  const year = new Date().getFullYear();
  const res  = await pool.query<{ n: string }>("SELECT NEXTVAL('kaseet_order_seq') AS n");
  const seq  = String(parseInt(res.rows[0].n, 10)).padStart(4, "0");
  return `KS-ORD-${year}-${seq}`;
}

export function generateHoldId(): string {
  return `KS-HLD-${randomBytes(6).toString("hex").toUpperCase()}`;
}

// ── Cohort Seats ──────────────────────────────────────────

/**
 * Returns seat info from DB. Falls back to provided defaults if the cohort
 * hasn't been seeded yet (e.g. new cohorts added after migration).
 */
export async function getCohortSeats(
  cohortId: number,
  fallbackCapacity = 10,
  fallbackEnrolled = 0,
): Promise<{ capacity: number; enrolled: number; isOpen: boolean }> {
  const [row] = await db
    .select()
    .from(cohortSeatsTable)
    .where(eq(cohortSeatsTable.cohortId, cohortId))
    .limit(1);

  if (!row) {
    // Auto-seed if missing
    await db
      .insert(cohortSeatsTable)
      .values({ cohortId, capacity: fallbackCapacity, enrolled: fallbackEnrolled })
      .onConflictDoNothing();
    return { capacity: fallbackCapacity, enrolled: fallbackEnrolled, isOpen: true };
  }
  return { capacity: row.capacity, enrolled: row.enrolled, isOpen: row.isOpen };
}

// ── Holds ─────────────────────────────────────────────────

export async function createHold(cohortId: number): Promise<string> {
  const id        = generateHoldId();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min
  await db.insert(holdsTable).values({ id, cohortId, expiresAt, status: "active" });
  return id;
}

export async function setHoldSession(holdId: string, sessionId: string): Promise<void> {
  await db
    .update(holdsTable)
    .set({ sessionId })
    .where(eq(holdsTable.id, holdId));
}

export async function releaseHold(holdId: string): Promise<void> {
  await db
    .update(holdsTable)
    .set({ releasedAt: new Date(), status: "released" })
    .where(eq(holdsTable.id, holdId));
}

export async function releaseHoldBySession(sessionId: string): Promise<void> {
  await db
    .update(holdsTable)
    .set({ releasedAt: new Date(), status: "released" })
    .where(and(eq(holdsTable.sessionId, sessionId), isNull(holdsTable.releasedAt)));
}

export async function confirmHold(holdId: string, orderId: string): Promise<void> {
  await db
    .update(holdsTable)
    .set({ orderId, releasedAt: new Date(), status: "confirmed" })
    .where(eq(holdsTable.id, holdId));
}

/** Releases all expired active holds */
export async function sweepExpiredHolds(): Promise<void> {
  await db
    .update(holdsTable)
    .set({ releasedAt: new Date(), status: "released" })
    .where(and(isNull(holdsTable.releasedAt), sql`${holdsTable.expiresAt} < NOW()`));
}

/** Count active (non-expired, non-released) holds for a cohort */
export async function countActiveHolds(cohortId: number): Promise<number> {
  await sweepExpiredHolds();
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(holdsTable)
    .where(
      and(
        eq(holdsTable.cohortId, cohortId),
        isNull(holdsTable.releasedAt),
        gt(holdsTable.expiresAt, new Date()),
      ),
    );
  return result[0]?.count ?? 0;
}

// ── Orders ────────────────────────────────────────────────

const CONFIRMED_STATUSES = [
  "deposit_paid", "paid_full", "partially_paid", "completed",
];

export async function countConfirmedOrders(cohortId: number): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(and(eq(ordersTable.cohortId, cohortId), inArray(ordersTable.status, CONFIRMED_STATUSES)));
  return result[0]?.count ?? 0;
}

export async function orderExistsForSession(sessionId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: ordersTable.id })
    .from(ordersTable)
    .where(eq(ordersTable.sessionId, sessionId))
    .limit(1);
  return !!row;
}

// ── Atomic seat + order creation ──────────────────────────
/**
 * Called inside webhook for checkout.session.completed.
 * Uses a raw DB transaction with SELECT … FOR UPDATE on cohort_seats
 * to guarantee atomicity — the last seat can only go to one buyer.
 *
 * Returns: 'created' | 'duplicate' | 'overbooked'
 */
export async function createOrderWithSeat(params: {
  orderId:        string;
  sessionId:      string;
  paymentIntent:  string | null;
  chargedUsd:     number;
  courseSlug:     string;
  cohortId:       number;
  mode:           "onsite" | "live";
  plan:           "full" | "deposit";
  totalJOD:       number;
  totalUSD:       number;
  paidJOD:        number;
  remainingJOD:   number;
  amountPaidMinor: number;
  status:         string;
  installments:   InstallmentRecord[];
  customer: {
    firstName: string;
    lastName:  string;
    email?:    string;
    phone:     string;
    country:   string;
    city?:     string;
  };
  holdId?: string;
}): Promise<"created" | "duplicate" | "overbooked"> {
  // Use the shared pool for a raw transaction with FOR UPDATE
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Idempotency check inside transaction — by session_id OR orderId
    const dup = await client.query(
      "SELECT id FROM orders WHERE session_id = $1 OR id = $2 LIMIT 1",
      [params.sessionId, params.orderId],
    );
    if (dup.rowCount && dup.rowCount > 0) {
      await client.query("ROLLBACK");
      return "duplicate";
    }

    // Lock the cohort seat row
    const seatRow = await client.query(
      "SELECT capacity, enrolled FROM cohort_seats WHERE cohort_id = $1 FOR UPDATE",
      [params.cohortId],
    );

    const capacity = seatRow.rows[0]?.capacity ?? 10;
    const enrolled = seatRow.rows[0]?.enrolled ?? 0;

    if (enrolled >= capacity) {
      await client.query("ROLLBACK");
      return "overbooked";
    }

    // Increment enrolled
    await client.query(
      "UPDATE cohort_seats SET enrolled = enrolled + 1, updated_at = NOW() WHERE cohort_id = $1",
      [params.cohortId],
    );

    // Insert order with flat columns
    const now = new Date();
    await client.query(
      `INSERT INTO orders (
        id, session_id, stripe_session_id, payment_intent, stripe_payment_id,
        course_slug, cohort_id, mode, plan,
        customer,
        first_name, last_name, phone, email, country, city,
        total_jod, total_usd, paid_jod, remaining_jod,
        amount_paid_minor, charged_usd, currency, status,
        installments, created_at, updated_at
      ) VALUES (
        $1,$2,$2,$3,$3,
        $4,$5,$6,$7,
        $8::jsonb,
        $9,$10,$11,$12,$13,$14,
        $15,$16,$17,$18,
        $19,$20,'usd',$21,
        $22::jsonb,$23,$23
      )`,
      [
        params.orderId,
        params.sessionId,
        params.paymentIntent,
        params.courseSlug,
        params.cohortId,
        params.mode,
        params.plan,
        JSON.stringify({
          firstName: params.customer.firstName,
          lastName:  params.customer.lastName,
          email:     params.customer.email,
          phone:     params.customer.phone,
          country:   params.customer.country,
          city:      params.customer.city,
        }),
        params.customer.firstName,
        params.customer.lastName,
        params.customer.phone,
        params.customer.email ?? null,
        params.customer.country,
        params.customer.city ?? null,
        params.totalJOD,
        params.totalUSD,
        params.paidJOD,
        params.remainingJOD,
        params.amountPaidMinor,
        params.chargedUsd,
        params.status,
        JSON.stringify(params.installments),
        now,
      ],
    );

    // Insert relational installments
    for (const inst of params.installments) {
      await client.query(
        `INSERT INTO installments (order_id, seq, amount_jod, method, paid_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          params.orderId,
          inst.seq,
          inst.amountJOD,
          inst.method,
          inst.paidAt ? new Date(inst.paidAt) : null,
        ],
      );
    }

    // Confirm hold
    if (params.holdId) {
      await client.query(
        "UPDATE holds SET order_id=$1, released_at=NOW(), status='confirmed' WHERE id=$2",
        [params.orderId, params.holdId],
      );
    }

    await client.query("COMMIT");
    return "created";
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
