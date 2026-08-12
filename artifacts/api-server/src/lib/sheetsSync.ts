/**
 * ④ Google Sheets sync — 16 أعمدة (A–P) — DB → Sheet فقط
 * يعمل كل 15 دقيقة ويُدار من index.ts
 *
 * التبويبات:
 *   Tab 1  الطلبات          — كل الطلبات (أعمدة A–P)
 *   Tab 2  الدفعات المستحقّة — فلتر: remaining_jod > 0
 *
 * ⛔ أعمدة الهاتف تُسبق بـ (') حتى لا يُشوّهها Sheets.
 */
import { pool } from "@workspace/db";
import { logger } from "./logger.js";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

const TAB_ORDERS = "الطلبات";
const TAB_DUES   = "الدفعات المستحقّة";

// ── خريطة الدورات ──────────────────────────────────────────
const COURSE_NAMES: Record<string, string> = {
  voiceover:           "أساسيات التعليق والأداء الصوتي",
  "voiceover-basics":  "أساسيات التعليق والأداء الصوتي",
  "voiceover-live":    "أساسيات التعليق — أونلاين",
  presenter:           "المذيع المحترف",
  "public-speaking":   "فن الخطابة والتأثير",
  "arabic-language":   "اللغة العربية للمذيعين",
};

const MODE_LABEL: Record<string, string> = {
  onsite: "حضوري",
  live:   "مباشر تفاعلي (Online LIVE)",
};

const STATUS_LABEL: Record<string, string> = {
  confirmed:  "مؤكَّد",
  pending:    "قيد المراجعة",
  overbooked: "تجاوز الطاقة",
  cancelled:  "ملغى",
};

// ── ترويسة صف التحذير ─────────────────────────────────────
const WARNING_ROW = [
  "⚠️ لا تحذف هذا الجدول ولا تُعيد ترتيب الأعمدة — تتم المزامنة تلقائيًا كل 15 دقيقة عبر نظام كاسيت",
];

// ── أعمدة A–P ─────────────────────────────────────────────
const HEADERS_ORDERS = [
  "رقم الطلب",          // A
  "الدورة",             // B
  "رقم الدفعة (ID)",    // C
  "الاسم الكامل",       // D
  "رقم الهاتف",         // E  ← يُسبق بـ '
  "البريد الإلكتروني",  // F
  "الدولة",             // G
  "المدينة",            // H
  "نمط الحضور",         // I
  "حالة الطلب",         // J
  "الإجمالي (د.أ)",     // K
  "المقبوض (د.أ)",      // L
  "الدفعة 2",           // M
  "الدفعة 3",           // N
  "المتبقّي (د.أ)",     // O
  "تاريخ الطلب",        // P
];

const HEADERS_DUES = [
  "رقم الطلب",          // A
  "الاسم الكامل",       // B
  "رقم الهاتف",         // C  ← يُسبق بـ '
  "الدورة",             // D
  "النمط",              // E
  "المتبقّي (د.أ)",     // F
  "حالة الطلب",         // G
  "تاريخ الطلب",        // H
];

// ── Connector helper ───────────────────────────────────────
async function sheetsReq(
  method: string,
  path: string,
  body?: unknown,
): Promise<{ ok: boolean; status: number; json: () => Promise<any>; text: () => Promise<string> }> {
  const { ReplitConnectors } = await import("@replit/connectors-sdk");
  const connectors = new ReplitConnectors();
  const opts: any = { method };
  if (body !== undefined) {
    opts.body    = JSON.stringify(body);
    opts.headers = { "Content-Type": "application/json" };
  }
  return connectors.proxy("google-sheet", path, opts) as any;
}

// ── إنشاء التبويب إن لم يكن موجوداً ──────────────────────
async function ensureTab(existingTitles: Set<string>, title: string): Promise<void> {
  if (existingTitles.has(title)) return;
  logger.info({ title }, "Creating missing sheet tab");
  const resp = await sheetsReq("POST", `/v4/spreadsheets/${SHEET_ID}:batchUpdate`, {
    requests: [{ addSheet: { properties: { title } } }],
  });
  if (!resp.ok) {
    const text = await resp.text();
    if (!text.includes("already exists")) {
      throw new Error(`Failed to create tab "${title}" (${resp.status}): ${text}`);
    }
  }
  existingTitles.add(title);
}

// ── مسح التبويب ثم الكتابة من الصف الأول ─────────────────
async function writeTab(title: string, rows: string[][]): Promise<void> {
  const encodedRange = encodeURIComponent(`'${title}'`);

  const clearResp = await sheetsReq(
    "POST",
    `/v4/spreadsheets/${SHEET_ID}/values/${encodedRange}:clear`,
    {},
  );
  if (!clearResp.ok) {
    const text = await clearResp.text();
    throw new Error(`Clear failed for "${title}" (${clearResp.status}): ${text}`);
  }

  // USER_ENTERED ← يُفسّر Sheets القيم (بما فيها الـ ' لحماية الهاتف)
  const writeResp = await sheetsReq(
    "PUT",
    `/v4/spreadsheets/${SHEET_ID}/values/${encodedRange}?valueInputOption=USER_ENTERED`,
    { values: rows },
  );
  if (!writeResp.ok) {
    const text = await writeResp.text();
    throw new Error(`Write failed for "${title}" (${writeResp.status}): ${text}`);
  }
}

// ── تنسيق الهاتف: إضافة ' كي لا يُشوّهه Sheets ──────────
function safePhone(phone: string | null): string {
  const p = (phone ?? "").trim();
  if (!p) return "";
  // ' في USER_ENTERED وضع تجعل Sheets يعامل الخلية كنصّ
  return `'${p}`;
}

// ── استخراج بيانات الأقساط من JSONB ──────────────────────
function installmentCell(installments: any, index: number): string {
  if (!Array.isArray(installments) || !installments[index]) return "—";
  const inst = installments[index];
  const paid = inst.paidAt || inst.paid_at;
  if (paid) return `مدفوع ${new Date(paid).toLocaleDateString("ar-JO")}`;
  const due  = inst.dueDate || inst.due_date;
  if (due) return `مستحقّ ${new Date(due).toLocaleDateString("ar-JO")}`;
  return "لم تُدفع";
}

// ── الدالة الرئيسية ────────────────────────────────────────
export async function syncToSheet(): Promise<void> {
  if (!SHEET_ID) {
    logger.warn("GOOGLE_SHEET_ID not set — skipping sheet sync");
    return;
  }

  // 1. قائمة التبويبات الموجودة
  const metaResp = await sheetsReq(
    "GET",
    `/v4/spreadsheets/${SHEET_ID}?fields=sheets.properties.title`,
  );
  if (!metaResp.ok) {
    const text = await metaResp.text();
    throw new Error(`Cannot read spreadsheet (${metaResp.status}): ${text}`);
  }
  const meta = await metaResp.json();
  const existingTitles = new Set<string>(
    (meta.sheets ?? []).map((s: any) => s.properties?.title as string),
  );

  // 2. أنشئ التبويبات المفقودة
  await ensureTab(existingTitles, TAB_ORDERS);
  await ensureTab(existingTitles, TAB_DUES);

  // 3. جلب الطلبات من قاعدة البيانات
  const { rows: orders } = await pool.query<{
    id:            string;
    course_slug:   string;
    cohort_id:     number;
    first_name:    string | null;
    last_name:     string | null;
    phone:         string | null;
    email:         string | null;
    country:       string | null;
    city:          string | null;
    mode:          string | null;
    status:        string;
    total_jod:     string | null;
    paid_jod:      string | null;
    remaining_jod: string | null;
    installments:  any;
    created_at:    Date;
  }>(
    `SELECT id, course_slug, cohort_id,
            first_name, last_name, phone, email, country, city,
            mode, status, total_jod, paid_jod, remaining_jod,
            installments, created_at
     FROM orders
     ORDER BY created_at DESC
     LIMIT 5000`,
  );

  // 4. بناء صفوف Tab الطلبات (الصف 1 = تحذير، الصف 2 = رؤوس، الصف 3+ = بيانات)
  const ordersDataRows: string[][] = orders.map((o) => [
    o.id,                                                                   // A
    COURSE_NAMES[o.course_slug] ?? o.course_slug,                           // B
    String(o.cohort_id),                                                    // C
    `${o.first_name ?? ""} ${o.last_name ?? ""}`.trim(),                    // D
    safePhone(o.phone),                                                     // E ← '
    o.email    ?? "",                                                       // F
    o.country  ?? "",                                                       // G
    o.city     ?? "",                                                       // H
    MODE_LABEL[o.mode ?? ""] ?? (o.mode ?? ""),                            // I
    STATUS_LABEL[o.status] ?? o.status,                                     // J
    o.total_jod     != null ? String(o.total_jod)     : "",                 // K
    o.paid_jod      != null ? String(o.paid_jod)      : "",                 // L
    installmentCell(o.installments, 1),                                     // M
    installmentCell(o.installments, 2),                                     // N
    o.remaining_jod != null ? String(o.remaining_jod) : "",                 // O
    o.created_at ? new Date(o.created_at).toLocaleDateString("ar-JO") : "", // P
  ]);

  // 5. بناء صفوف Tab الدفعات المستحقّة
  const dueOrders = orders.filter((o) => parseFloat(o.remaining_jod ?? "0") > 0);
  const duesDataRows: string[][] = dueOrders.map((o) => [
    o.id,
    `${o.first_name ?? ""} ${o.last_name ?? ""}`.trim(),
    safePhone(o.phone),
    COURSE_NAMES[o.course_slug] ?? o.course_slug,
    MODE_LABEL[o.mode ?? ""] ?? (o.mode ?? ""),
    o.remaining_jod != null ? String(o.remaining_jod) : "",
    STATUS_LABEL[o.status] ?? o.status,
    o.created_at ? new Date(o.created_at).toLocaleDateString("ar-JO") : "",
  ]);

  // 6. اكتب التبويبين
  await writeTab(TAB_ORDERS, [WARNING_ROW, HEADERS_ORDERS, ...ordersDataRows]);
  logger.info({ count: orders.length }, `Sheet "${TAB_ORDERS}" synced (16 cols)`);

  await writeTab(TAB_DUES, [HEADERS_DUES, ...duesDataRows]);
  logger.info({ count: dueOrders.length }, `Sheet "${TAB_DUES}" synced`);
}
