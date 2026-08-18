/**
 * @workspace/admin-types
 * Shared TypeScript interfaces for all /api/admin/* endpoints.
 * Imported by both the api-server (routes) and kaseet-academy (dashboard sections).
 *
 * Rule: when the API response shape changes, update this file first — the
 * TypeScript compiler will then flag every consumer that needs updating.
 */

// ── Auth ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  role: 'admin' | 'consultant';
  id: number | null;
  name: string;
  email: string | null;
}

// ── KPI (GET /admin/kpi) ─────────────────────────────────────────────────────

export interface KpiSeatRow {
  cohortId: number;
  available: number;
}

export interface KpiResponse {
  revenue: {
    thisMonth: number;
    lastMonth: number;
    delta: number | null;
  };
  dues: {
    total: number;
    count: number;
  };
  seats: KpiSeatRow[];
  newOrders: {
    last7: number;
    last14: number;
    delta: number | null;
  };
  completion: {
    pct: number | null;
    pctLast: number | null;
    delta: number | null;
  };
}

// ── Orders (GET /admin/orders, GET /admin/orders/:id) ─────────────────────────

export interface Installment {
  seq: 1 | 2 | 3;
  amountJOD: number;
  method: string;
  paidAt: string | null;
  reference?: string | null;
  recordedBy?: string | null;
  dueAt?: string | null;
}

export interface Order {
  id: string;
  cohortId: number;
  courseSlug: string;
  mode: string;
  plan: string;
  // Customer fields may be flat on newer rows or nested on legacy rows
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  email?: string | null;
  country?: string | null;
  customer?: {
    firstName: string;
    lastName: string;
    email?: string | null;
    phone: string;
    country: string;
  } | null;
  totalJOD: number;
  totalUSD: number;
  paidJOD: number;
  remainingJOD: number;
  chargedUsd?: string | null;
  status: string;
  installments: Installment[];
  discountCode?: string | null;
  consultantId?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface OrdersResponse {
  orders: Order[];
}

export interface OrderDetailResponse {
  order: Order;
  installments: Installment[];
}

// ── Dues (GET /admin/dues) ────────────────────────────────────────────────────

export interface DueRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  course_slug: string;
  cohort_id: number;
  total_jod: number;
  paid_jod: number;
  remaining_jod: number;
  status: string;
  created_at: string;
  next_due_at: string | null;
  installments?: Installment[] | null;
}

export interface DuesResponse {
  dues: DueRow[];
}

// ── Cohorts (GET /admin/cohorts) ──────────────────────────────────────────────

export interface CohortSeat {
  cohortId: number;
  capacity: number;
  enrolled: number;
  isOpen: boolean;
  updatedAt?: string | null;
}

export interface CohortsResponse {
  seats: CohortSeat[];
}

// ── Courses (GET /admin/courses) ──────────────────────────────────────────────

export type CourseLevel = 'beginner' | 'advanced';
export type CourseStatus = 'active' | 'draft' | 'archived';

export interface Course {
  id: number;
  slug: string;
  nameAr: string;
  level: CourseLevel;
  status: CourseStatus;
  onsiteEnabled: boolean;
  onsitePriceJOD: number | null;
  onsiteHours: number | null;
  onsiteSessions: number | null;
  onsiteCapacity: number | null;
  liveEnabled: boolean;
  livePriceUSD: number | null;
  liveHours: number | null;
  liveSessions: number | null;
  liveCapacity: number | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CoursesResponse {
  courses: Course[];
}

// ── Discount Codes (GET /admin/discount-codes) ────────────────────────────────

export type DiscountType = 'percent' | 'fixed';

export interface DiscountCode {
  id: number;
  code: string;
  type: DiscountType;
  /** Stored as a numeric string — parse with Number() on the frontend */
  value: string;
  appliesTo: string;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdById: number | null;
  createdBy: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface DiscountCodesResponse {
  codes: DiscountCode[];
}

// ── Subscribers (GET /admin/subscribers) ─────────────────────────────────────

export interface Subscriber {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  country: string | null;
  courses: string[];
  orderCount: number;
  totalPaidJOD: number;
  lastOrderAt: string;
}

export interface SubscribersResponse {
  subscribers: Subscriber[];
}

export interface SubscriberOrderRow {
  id: string;
  course_slug: string;
  mode: string;
  plan: string;
  total_jod: number;
  paid_jod: number;
  remaining_jod: number;
  status: string;
  created_at: string;
}

export interface SubscriberOrdersResponse {
  orders: SubscriberOrderRow[];
}

// ── Consultants (GET /admin/consultants/performance, GET /admin/consultants) ──

export interface ConsultantPerformance {
  id: number;
  name: string;
  isActive: boolean;
  ordersAll: number;
  orders30d: number;
  revenueJOD: number;
  conversionRate: number | null;
  topCourse: string | null;
}

export interface ConsultantAccount {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

export interface ConsultantPerformanceResponse {
  performance: ConsultantPerformance[];
}

export interface ConsultantAccountsResponse {
  consultants: ConsultantAccount[];
}

// ── Voice Evaluations (GET /admin/voice-evaluations) ─────────────────────────

export type VoiceEvalStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

export interface VoiceEvaluation {
  id: number;
  name: string;
  phone: string;
  audioRef: string | null;
  status: VoiceEvalStatus;
  reviewer: string | null;
  notes: string | null;
  /** Server returns submittedAt (not createdAt) */
  submittedAt: string;
  updatedAt?: string | null;
}

export interface VoiceEvaluationsResponse {
  evaluations: VoiceEvaluation[];
}

// ── Instagram Leads / Campaigns (GET /admin/instagram-leads) ─────────────────

export interface InstagramCampaign {
  id: number;
  campaignName: string;
  carouselRef: string | null;
  keywords: string | null;
  leadCount: number;
  conversionCount: number;
  notes: string | null;
  campaignDate: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface InstagramCampaignsResponse {
  leads: InstagramCampaign[];
}

// ── Email Log (GET /admin/email-log) ──────────────────────────────────────────

export interface EmailLogEntry {
  id: number;
  order_id: string | null;
  to_address: string;
  subject: string;
  tag: string | null;
  provider_id?: string | null;
  status: string;
  error: string | null;
  sent_at: string;
}

export interface EmailLogResponse {
  logs: EmailLogEntry[];
}

// ── Exchange Rates (GET /admin/rates) ─────────────────────────────────────────

export interface RatesResponse {
  rates: Record<string, number>;
  fetchedAt: string | null;
  stale: boolean;
}
