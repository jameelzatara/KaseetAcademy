/**
 * Google Sheets sync — DB → Sheet only (write-once, full overwrite)
 * Runs every 15 minutes as a background job.
 *
 * Tab 1  الطلبات          — all orders
 * Tab 2  الدفعات المستحقّة — orders with remaining_jod > 0
 *
 * Both tabs are created automatically on first run if they don't exist.
 */
import { pool } from "@workspace/db";
import { logger } from "./logger.js";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

const TAB_ORDERS = "الطلبات";
const TAB_DUES   = "الدفعات المستحقّة";

const HEADERS_ORDERS = [
  "رقم الطلب", "الدورة", "رقم الدفعة", "الاسم الكامل",
  "الهاتف", "البريد الإلكتروني", "الدولة", "المدينة",
  "الحالة", "الإجمالي (د.أ)", "المدفوع (د.أ)", "المتبقّي (د.أ)", "تاريخ الطلب",
];

const HEADERS_DUES = [
  "رقم الطلب", "الاسم الكامل", "الهاتف",
  "المتبقّي (د.أ)", "الحالة", "تاريخ الطلب",
];

const COURSE_NAMES: Record<string, string> = {
  voiceover:          "أساسيات التعليق",
  "voiceover-basics": "أساسيات التعليق",
  presenter:          "المذيع المحترف",
  "public-speaking":  "فن الخطابة",
  "arabic-language":  "اللغة العربية",
};

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

// ── Ensure tab exists; create if missing ───────────────────
async function ensureTab(existingTitles: Set<string>, title: string): Promise<void> {
  if (existingTitles.has(title)) return;

  logger.info({ title }, "Creating missing sheet tab");
  const resp = await sheetsReq("POST", `/v4/spreadsheets/${SHEET_ID}:batchUpdate`, {
    requests: [{ addSheet: { properties: { title } } }],
  });
  if (!resp.ok) {
    const text = await resp.text();
    // Ignore "already exists" error (race condition)
    if (!text.includes("already exists")) {
      throw new Error(`Failed to create tab "${title}" (${resp.status}): ${text}`);
    }
  }
  existingTitles.add(title);
}

// ── Full-overwrite a tab: clear then write ─────────────────
async function writeTab(title: string, rows: string[][]): Promise<void> {
  // A1 notation for the whole sheet: 'Tab Name'
  // Sheet names with non-ASCII chars need single-quote wrapping in A1 notation
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

// ── Main export ────────────────────────────────────────────
export async function syncToSheet(): Promise<void> {
  if (!SHEET_ID) {
    logger.warn("GOOGLE_SHEET_ID not set — skipping sheet sync");
    return;
  }

  // 1. Get existing tabs
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

  // 2. Create missing tabs
  await ensureTab(existingTitles, TAB_ORDERS);
  await ensureTab(existingTitles, TAB_DUES);

  // 3. Fetch all orders
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
    status:        string;
    total_jod:     string | null;
    paid_jod:      string | null;
    remaining_jod: string | null;
    created_at:    Date;
  }>(
    `SELECT id, course_slug, cohort_id,
            first_name, last_name, phone, email, country, city,
            status, total_jod, paid_jod, remaining_jod, created_at
     FROM orders
     ORDER BY created_at DESC
     LIMIT 5000`,
  );

  // 4. Build row arrays
  const ordersRows: string[][] = orders.map((o) => [
    o.id,
    COURSE_NAMES[o.course_slug] ?? o.course_slug,
    String(o.cohort_id),
    `${o.first_name ?? ""} ${o.last_name ?? ""}`.trim(),
    o.phone    ?? "",
    o.email    ?? "",
    o.country  ?? "",
    o.city     ?? "",
    o.status,
    o.total_jod     != null ? String(o.total_jod)     : "",
    o.paid_jod      != null ? String(o.paid_jod)      : "",
    o.remaining_jod != null ? String(o.remaining_jod) : "",
    o.created_at ? new Date(o.created_at).toLocaleDateString("ar-JO") : "",
  ]);

  const dueOrders = orders.filter((o) => parseFloat(o.remaining_jod ?? "0") > 0);
  const duesRows: string[][] = dueOrders.map((o) => [
    o.id,
    `${o.first_name ?? ""} ${o.last_name ?? ""}`.trim(),
    o.phone ?? "",
    o.remaining_jod != null ? String(o.remaining_jod) : "",
    o.status,
    o.created_at ? new Date(o.created_at).toLocaleDateString("ar-JO") : "",
  ]);

  // 5. Write tabs
  await writeTab(TAB_ORDERS, [HEADERS_ORDERS, ...ordersRows]);
  logger.info({ count: orders.length }, `Sheet "${TAB_ORDERS}" synced`);

  await writeTab(TAB_DUES, [HEADERS_DUES, ...duesRows]);
  logger.info({ count: dueOrders.length }, `Sheet "${TAB_DUES}" synced`);
}
