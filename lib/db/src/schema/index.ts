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
  consultantId:    integer("consultant_id"),          // referring consultant (nullable)
  discountCode:    text("discount_code"),             // applied discount code (nullable)
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
// enrolled is the source of truth for seat count — cohorts holds schedule metadata
export const cohortSeatsTable = pgTable("cohort_seats", {
  cohortId:  integer("cohort_id").primaryKey(),
  capacity:  integer("capacity").notNull().default(10),
  enrolled:  integer("enrolled").notNull().default(0),
  isOpen:    boolean("is_open").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type CohortSeat = typeof cohortSeatsTable.$inferSelect;

// ─── Cohorts (schedule metadata) ────────────────────────────
// Source of truth for cohort scheduling — populated from the trainer's
// roster spreadsheet via lib/db/scripts/import-cohorts.ts. Capacity/enrolled
// live separately in cohortSeatsTable (real-time checkout counter).
export const cohortsTable = pgTable("cohorts", {
  id:           integer("id").primaryKey(),
  courseSlug:   text("course_slug").notNull(),
  level:        text("level").notNull().default("beginner"), // 'beginner' | 'advanced'
  mode:         text("mode").notNull(),                       // 'onsite' | 'live'
  trainerName:  text("trainer_name").notNull(),
  startDate:    date("start_date").notNull(),
  endDate:      date("end_date").notNull(),
  daysAr:       text("days_ar").notNull(),
  time24:       text("time_24"),
  timeAr:       text("time_ar"),
  platform:     text("platform").notNull(),
  createdAt:    timestamp("created_at").defaultNow(),
  updatedAt:    timestamp("updated_at").defaultNow(),
});

export type Cohort = typeof cohortsTable.$inferSelect;

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

export const exchangeRatesTable = pgTable("exchange_rates", {
  id:        serial("id").primaryKey(),
  base:      text("base").notNull().default("JOD"),
  rates:     jsonb("rates").notNull(),          // Record<CurrencyCode, number>
  source:    text("source").notNull(),          // e.g. 'open.er-api.com'
  fetchedAt: timestamp("fetched_at").defaultNow().notNull(),
});

// ─── Consultant Accounts ──────────────────────────────────
// Role-based admin access: 'admin' (owner, full access) | 'consultant' (limited)
export const consultantAccountsTable = pgTable("consultant_accounts", {
  id:           serial("id").primaryKey(),
  name:         text("name").notNull(),
  email:        text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role:         text("role").notNull().default("consultant"), // 'admin' | 'consultant'
  isActive:     boolean("is_active").notNull().default(true),
  lastLoginAt:  timestamp("last_login_at"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
});

export type ConsultantAccount = typeof consultantAccountsTable.$inferSelect;

// ─── Discount Codes ───────────────────────────────────────
export const discountCodesTable = pgTable("discount_codes", {
  id:          serial("id").primaryKey(),
  code:        text("code").notNull().unique(),           // stored uppercase
  type:        text("type").notNull(),                    // 'percent' | 'fixed'
  value:       numeric("value").notNull(),                // percent (0-100) or JOD amount
  appliesTo:   text("applies_to").notNull().default("all"), // 'all' | courseSlug
  maxUses:     integer("max_uses"),                       // NULL = unlimited
  usedCount:   integer("used_count").notNull().default(0),
  expiresAt:   timestamp("expires_at"),                   // NULL = never
  isActive:    boolean("is_active").notNull().default(true),
  createdById: integer("created_by_id"),                  // consultant_accounts.id, NULL = owner/admin
  createdBy:   text("created_by").notNull().default("admin"), // display name
  createdAt:   timestamp("created_at").defaultNow().notNull(),
  updatedAt:   timestamp("updated_at").defaultNow().notNull(),
});

export type DiscountCode = typeof discountCodesTable.$inferSelect;

// ─── Courses (DB source of truth for admin editing) ──────
export const coursesTable = pgTable("courses", {
  id:            serial("id").primaryKey(),
  slug:          text("slug").notNull().unique(),
  nameAr:        text("name_ar").notNull(),
  level:         text("level").notNull().default("beginner"), // 'beginner' | 'advanced'
  status:        text("status").notNull().default("draft"),   // 'active' | 'draft' | 'archived'
  // Onsite mode (nullable = mode not offered)
  onsiteEnabled:  boolean("onsite_enabled").notNull().default(false),
  onsitePriceJOD: integer("onsite_price_jod"),
  onsiteHours:    integer("onsite_hours"),
  onsiteSessions: integer("onsite_sessions"),
  onsiteCapacity: integer("onsite_capacity"),
  // Live mode
  liveEnabled:    boolean("live_enabled").notNull().default(false),
  livePriceUSD:   integer("live_price_usd"),
  liveHours:      integer("live_hours"),
  liveSessions:   integer("live_sessions"),
  liveCapacity:   integer("live_capacity"),
  /** When true, consultant staff may NOT change prices (admin-only override) */
  priceLocked:   boolean("price_locked").notNull().default(false),
  // ── Homepage marketing display ────────────────────────────
  imageUrl:         text("image_url"),                              // cover image shown on homepage cards
  shortDescription: text("short_description"),                      // marketing blurb for homepage cards
  displayOrder:     integer("display_order").notNull().default(0),  // lower shows first
  isFeatured:       boolean("is_featured").notNull().default(false),// shows in the "featured" spot
  createdAt:     timestamp("created_at").defaultNow().notNull(),
  updatedAt:     timestamp("updated_at").defaultNow().notNull(),
});

export type Course = typeof coursesTable.$inferSelect;

// ─── Voice Evaluations ("سمّعنا صوتك") ─────────────────────
export const voiceEvaluationsTable = pgTable("voice_evaluations", {
  id:            serial("id").primaryKey(),
  name:          text("name").notNull(),
  phone:         text("phone").notNull(),
  audioRef:      text("audio_ref"),                       // URL or file reference
  reviewer:      text("reviewer"),                        // assigned reviewer name
  status:        text("status").notNull().default("pending"), // pending | reviewed | accepted | rejected
  notes:         text("notes"),
  submittedAt:   timestamp("submitted_at").defaultNow().notNull(),
  updatedAt:     timestamp("updated_at").defaultNow().notNull(),
});

export type VoiceEvaluation = typeof voiceEvaluationsTable.$inferSelect;

// ─── Instagram Leads ──────────────────────────────────────
export const instagramLeadsTable = pgTable("instagram_leads", {
  id:              serial("id").primaryKey(),
  campaignName:    text("campaign_name").notNull(),
  carouselRef:     text("carousel_ref"),                  // carousel ID or link
  keywords:        text("keywords"),                      // comma-separated
  leadCount:       integer("lead_count").notNull().default(0),
  conversionCount: integer("conversion_count").notNull().default(0),
  notes:           text("notes"),
  campaignDate:    date("campaign_date"),
  createdAt:       timestamp("created_at").defaultNow().notNull(),
  updatedAt:       timestamp("updated_at").defaultNow().notNull(),
});

export type InstagramLead = typeof instagramLeadsTable.$inferSelect;

// ─── Discount Reservations ────────────────────────────────
// One row per checkout attempt that claimed a discount use.
// Keyed by order_id (present in Stripe metadata for both the Checkout
// Session and Payment Element flows) so claim/complete/release are
// idempotent per payment object, not just an aggregate counter.
export const discountReservationsTable = pgTable("discount_reservations", {
  id:        serial("id").primaryKey(),
  orderId:   text("order_id").notNull().unique(),
  code:      text("code").notNull(),
  status:    text("status").notNull().default("reserved"), // reserved | completed | released
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type DiscountReservation = typeof discountReservationsTable.$inferSelect;

export type ExchangeRate = typeof exchangeRatesTable.$inferSelect;
