import { randomBytes } from "crypto";
import { db, ordersTable, holdsTable } from "@workspace/db";
import { eq, and, isNull, gt, inArray } from "drizzle-orm";
import { sql } from "drizzle-orm";

// ── ID Generation ──────────────────────────────────────────

const orderCounter = { value: 100 };

export function generateOrderId(): string {
  orderCounter.value += 1;
  const year = new Date().getFullYear();
  const seq = String(orderCounter.value).padStart(4, "0");
  return `KS-ORD-${year}-${seq}`;
}

export function generateHoldId(): string {
  return `KS-HLD-${randomBytes(6).toString("hex").toUpperCase()}`;
}

// ── Holds ─────────────────────────────────────────────────

export async function createHold(cohortId: number): Promise<string> {
  const id = generateHoldId();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min
  await db.insert(holdsTable).values({ id, cohortId, expiresAt });
  return id;
}

export async function setHoldSession(
  holdId: string,
  sessionId: string,
): Promise<void> {
  await db
    .update(holdsTable)
    .set({ sessionId })
    .where(eq(holdsTable.id, holdId));
}

export async function releaseHold(holdId: string): Promise<void> {
  await db
    .update(holdsTable)
    .set({ releasedAt: new Date() })
    .where(eq(holdsTable.id, holdId));
}

export async function releaseHoldBySession(sessionId: string): Promise<void> {
  await db
    .update(holdsTable)
    .set({ releasedAt: new Date() })
    .where(
      and(eq(holdsTable.sessionId, sessionId), isNull(holdsTable.releasedAt)),
    );
}

export async function confirmHold(
  holdId: string,
  orderId: string,
): Promise<void> {
  await db
    .update(holdsTable)
    .set({ orderId, releasedAt: new Date() })
    .where(eq(holdsTable.id, holdId));
}

/** Releases all expired holds */
export async function sweepExpiredHolds(): Promise<void> {
  await db
    .update(holdsTable)
    .set({ releasedAt: new Date() })
    .where(
      and(
        isNull(holdsTable.releasedAt),
        sql`${holdsTable.expiresAt} < NOW()`,
      ),
    );
}

/** Count active holds for a cohort (not expired, not released) */
export async function countActiveHolds(cohortId: number): Promise<number> {
  await sweepExpiredHolds(); // clean up first
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
  "deposit_paid",
  "paid_full",
  "partially_paid",
  "completed",
];

/** Count confirmed orders for a cohort */
export async function countConfirmedOrders(cohortId: number): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(
      and(
        eq(ordersTable.cohortId, cohortId),
        inArray(ordersTable.status, CONFIRMED_STATUSES),
      ),
    );
  return result[0]?.count ?? 0;
}

/** Check if an order already exists for this session (idempotency) */
export async function orderExistsForSession(
  sessionId: string,
): Promise<boolean> {
  const [row] = await db
    .select({ id: ordersTable.id })
    .from(ordersTable)
    .where(eq(ordersTable.sessionId, sessionId))
    .limit(1);
  return !!row;
}
