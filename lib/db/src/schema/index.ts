import { pgTable, text, serial, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
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
// Represents a completed/pending Stripe payment + installment plan
export const ordersTable = pgTable("orders", {
  id:              text("id").primaryKey(),           // KS-ORD-2026-0142
  sessionId:       text("session_id").unique(),       // Stripe checkout session ID
  paymentIntent:   text("payment_intent"),
  courseSlug:      text("course_slug").notNull(),     // 'voiceover' | 'presenter' ...
  cohortId:        integer("cohort_id").notNull(),
  mode:            text("mode").notNull(),             // 'onsite' | 'live'
  plan:            text("plan").notNull(),             // 'full' | 'deposit'
  customer:        jsonb("customer").notNull(),        // { firstName, lastName, email?, phone, country, city? }
  totalJOD:        integer("total_jod").notNull(),     // display total in JOD
  totalUSD:        integer("total_usd"),               // display total in USD (for live courses)
  paidJOD:         integer("paid_jod").notNull(),      // JOD paid so far
  remainingJOD:    integer("remaining_jod").notNull(), // JOD remaining
  amountPaidMinor: integer("amount_paid_minor"),       // cents paid via Stripe
  currency:        text("currency").default("usd"),
  status:          text("status").notNull().default("pending"),
  // 'pending' | 'deposit_paid' | 'paid_full' | 'partially_paid' | 'completed' | 'refunded'
  installments:    jsonb("installments").notNull(),    // InstallmentRecord[]
  createdAt:       timestamp("created_at").defaultNow().notNull(),
  updatedAt:       timestamp("updated_at").defaultNow().notNull(),
});

export type Order = typeof ordersTable.$inferSelect;

export interface InstallmentRecord {
  seq: 1 | 2 | 3;
  amountJOD: number;
  method: "stripe" | "bank_transfer" | "cash";
  paidAt: string | null;
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

// ─── Holds ────────────────────────────────────────────────
// Temporary seat reservation during checkout (30-min TTL)
export const holdsTable = pgTable("holds", {
  id:          text("id").primaryKey(),               // KS-HLD-xxx
  cohortId:    integer("cohort_id").notNull(),
  orderId:     text("order_id"),                      // set when order is confirmed
  sessionId:   text("session_id"),                    // Stripe session ID (set after creation)
  expiresAt:   timestamp("expires_at").notNull(),
  releasedAt:  timestamp("released_at"),              // null = still active
  createdAt:   timestamp("created_at").defaultNow().notNull(),
});

export type Hold = typeof holdsTable.$inferSelect;
