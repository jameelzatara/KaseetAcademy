import {
  pgTable, text, serial, timestamp, integer, jsonb, boolean, numeric, date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ─── Users ────────────────────────────────────────────────
export const usersTable = pgTable("users", {
  id:           serial("id").primaryKey(),
  email:        text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  firstName:    text("first_name").notNull(),
  lastName:     text("last_name").default(""),
  phone:        text("phone").default(""),
  provider:     text("provider").notNull().default("email"), // 'email' | 'google'
  googleId:     text("google_id").unique(),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

// ─── Orders ───────────────────────────────────────────────
export const ordersTable = pgTable("orders", {
  id:              text("id").primaryKey(),            // KS-ORD-2026-0142
  sessionId:       text("session_id").unique(),        // Stripe checkout session ID (kept for compat)
  stripeSessionId: text("stripe_session_id").unique(), // canonical name per spec
  paymentIntent:   text("payment_intent"),
  stripePaymentId: text("stripe_payment_id"),          // pi_xxx
  courseSlug:      text("course_slug").notNull(),
  cohortId:        integer("cohort_id").notNull(),
  mode:            text("mode").notNull(),              // 'onsite' | 'live'
  plan:            text("plan").notNull(),              // 'full' | 'deposit'
  customer:        jsonb("customer").notNull(),         // legacy JSONB – still written
  // Flat customer fields (spec §2 — written alongside JSONB for queries)
  firstName:       text("first_name"),
  lastName:        text("last_name"),
  phone:           text("phone"),
  email:           text("email"),
  country:         text("country"),
  city:            text("city"),
  totalJOD:        integer("total_jod").notNull(),
  totalUSD:        integer("total_usd"),
  paidJOD:         integer("paid_jod").notNull(),
  remainingJOD:    integer("remaining_jod").notNull(),
  amountPaidMinor: integer("amount_paid_minor"),        // cents charged via Stripe (legacy)
  chargedUsd:      numeric("charged_usd"),              // what Stripe charged NOW in USD
  currency:        text("currency").default("usd"),
  status:          text("status").notNull().default("pending"),
  // 'pending'|'deposit_paid'|'paid_full'|'partially_paid'|'completed'|'refunded'|'cancelled'
  installments:    jsonb("installments").notNull(),     // legacy JSONB
  notes:           text("notes"),
  createdAt:       timestamp("created_at").defaultNow().notNull(),
  updatedAt:       timestamp("updated_at").defaultNow().notNull(),
});

export type Order = typeof ordersTable.$inferSelect;

export interface InstallmentRecord {
  seq: 1 | 2 | 3;
  amountJOD: number;
  method: "stripe" | "bank_transfer" | "cash";
  paidAt: string | null;
  dueAt?: string | null;
  reference?: string;
  recordedBy?: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  country: string;
  city?: string;
}

// ─── Installments (relational) ────────────────────────────
// Source of truth for revenue = SUM(amount_jod WHERE paid_at IS NOT NULL)
export const installmentsTable = pgTable("installments", {
  id:         serial("id").primaryKey(),
  orderId:    text("order_id").references(() => ordersTable.id),
  seq:        integer("seq").notNull(),           // 1 | 2 | 3
  amountJod:  numeric("amount_jod").notNull(),
  method:     text("method"),                    // stripe | bank_transfer | cash
  paidAt:     timestamp("paid_at"),              // NULL = unpaid
  dueAt:      date("due_at"),
  reference:  text("reference"),
  recordedBy: text("recorded_by"),
});

export type Installment = typeof installmentsTable.$inferSelect;

// ─── Cohort Seats ─────────────────────────────────────────
// enrolled is the source of truth for seat count — cohorts.json holds static metadata
export const cohortSeatsTable = pgTable("cohort_seats", {
  cohortId:  integer("cohort_id").primaryKey(),
  capacity:  integer("capacity").notNull().default(10),
  enrolled:  integer("enrolled").notNull().default(0),
  isOpen:    boolean("is_open").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type CohortSeat = typeof cohortSeatsTable.$inferSelect;

// ─── Holds ────────────────────────────────────────────────
export const holdsTable = pgTable("holds", {
  id:         text("id").primaryKey(),               // KS-HLD-xxx
  cohortId:   integer("cohort_id").notNull(),
  orderId:    text("order_id"),
  sessionId:  text("session_id"),
  expiresAt:  timestamp("expires_at").notNull(),
  releasedAt: timestamp("released_at"),
  status:     text("status").notNull().default("active"), // active | confirmed | released
  createdAt:  timestamp("created_at").defaultNow().notNull(),
});

export type Hold = typeof holdsTable.$inferSelect;
