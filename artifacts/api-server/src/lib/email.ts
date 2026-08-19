/**
 * طبقة البريد الموحّدة — Brevo Transactional Email API
 * ⛔ كلّ إرسال يمرّ من هنا — لا استدعاء مباشر في أيّ مسار
 * ⛔ فشل البريد لا يُسقط طلباً مدفوعاً
 * ⛔ replyTo ثابت على info@kaseet.com
 *
 * متغيّرات البيئة المطلوبة:
 *   BREVO_API_KEY — مفتاح API v3 من Brevo (يبدأ بـ xkeysib-)
 *   SENDER_EMAIL  — عنوان المُرسِل (notify@kaseet.com أو info@kaseet.com)
 */
import { logger } from "./logger.js";
import { pool } from "@workspace/db";
import { sendWhatsAppNotification } from "./whatsapp.js";
import { getUncachableStripeClient } from "./stripeClient.js";
import { COURSE_NAMES } from "./pricing.js";
import PDFDocument from "pdfkit";
import { existsSync } from "node:fs";
import bidiFactory from "bidi-js";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// أنشئ جدول email_log تلقائيًا عند أول تشغيل
pool.query(`
  CREATE TABLE IF NOT EXISTS email_log (
    id          SERIAL PRIMARY KEY,
    order_id    TEXT,
    to_address  TEXT NOT NULL,
    subject     TEXT NOT NULL,
    tag         TEXT,
    provider_id TEXT,
    status      TEXT NOT NULL,
    error       TEXT,
    sent_at     TIMESTAMPTZ DEFAULT NOW()
  )
`).catch(() => { /* non-fatal */ });

// أضف order_id للجداول القديمة التي تفتقره
pool.query(`
  ALTER TABLE email_log ADD COLUMN IF NOT EXISTS order_id TEXT
`).catch(() => { /* non-fatal — column may already exist */ });

function senderEmail(): string {
  return process.env.SENDER_EMAIL ?? "notify@kaseet.com";
}

const SITE_URL = (process.env.PUBLIC_SITE_URL ?? "https://kaseet.com").replace(/\/$/, "");
// Can be overridden without a code change if the academy refreshes its logo.
const EMAIL_LOGO_URL = process.env.EMAIL_LOGO_URL
  ?? `${SITE_URL}/assets/logo_1785422080938-BIc1yBMc.png`;
const bidi = bidiFactory();

// ── تسجيل داخلي (لا يُسقط الإرسال عند فشله) ──
async function logEmail(row: {
  to: string;
  subject: string;
  tag?: string;
  providerId?: string;
  orderId?: string;
  status: "sent" | "failed" | "skipped";
  error?: string;
}) {
  try {
    await pool.query(
      `INSERT INTO email_log (order_id, to_address, subject, tag, provider_id, status, error, sent_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [row.orderId ?? null, row.to, row.subject, row.tag ?? null, row.providerId ?? null, row.status, row.error ?? null],
    );
  } catch {
    // سجلّ البريد غير حرج — لا نوقف الإرسال
  }

  // ── تنبيه فوري عند فشل إرسال البريد ──
  if (row.status === "failed") {
    const alertText = [
      "⚠️ فشل إرسال بريد إلكتروني — كاسيت أكاديمي",
      `📧 المستلم: ${row.to}`,
      `📌 الموضوع: ${row.subject}`,
      row.tag ? `🏷️ النوع: ${row.tag}` : null,
      `❌ الخطأ: ${row.error ?? "غير معروف"}`,
    ]
      .filter(Boolean)
      .join("\n");

    // fire-and-forget — لا نوقف أيّ عملية بسبب فشل التنبيه
    sendWhatsAppNotification(alertText).catch((err) => {
      logger.error({ err }, "Failed to send WhatsApp alert for email failure");
    });
  }
}

export interface SendEmailInput {
  to: string | undefined | null;
  subject: string;
  html: string;
  text: string;   // ⛔ إلزامي مع html — غيابه يرفع احتمال Spam
  tag?: string;   // نوع الرسالة: order_confirm | payment_received | …
  orderId?: string; // للربط في email_log
  attachments?: Array<{ filename: string; content: string | Buffer; encoding?: string }>;
}

export async function sendEmail(
  input: SendEmailInput,
): Promise<{ ok: boolean; id?: string; skipped?: string; error?: string }> {
  const { to, subject, html, text, tag, orderId } = input;

  // ① لا بريد = لا إرسال، بلا خطأ
  if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    logger.info({ to, subject }, "Email skipped: no valid address");
    await logEmail({ to: to ?? "(none)", subject, tag, orderId, status: "skipped" });
    return { ok: false, skipped: "no_email" };
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    const msg = "BREVO_API_KEY غير مضبوط";
    logger.error({ to, subject }, msg);
    await logEmail({ to, subject, tag, orderId, status: "failed", error: msg });
    return { ok: false, error: msg };
  }

  try {
    // بناء جسم الطلب لـ Brevo API
    const body: Record<string, unknown> = {
      sender:      { name: "كاسيت أكاديمي | Kaseet Academy", email: senderEmail() },
      to:          [{ email: to }],
      replyTo:     { name: "فريق كاسيت", email: "info@kaseet.com" },
      subject,
      htmlContent: html,
      textContent: text,
    };

    // مرفقات PDF إن وجدت
    if (input.attachments?.length) {
      body.attachment = input.attachments.map(a => ({
        name:    a.filename,
        content: typeof a.content === "string" ? a.content : a.content.toString("base64"),
      }));
    }

    const res = await fetch(BREVO_API_URL, {
      method:  "POST",
      headers: {
        "api-key":      apiKey,
        "content-type": "application/json",
        "accept":       "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      throw new Error(`Brevo ${res.status}: ${errText}`);
    }

    const data = await res.json() as { messageId?: string };
    const msgId = data.messageId ?? "";
    logger.info({ to, subject, tag, msgId }, "Email sent via Brevo API");
    await logEmail({ to, subject, tag, orderId, providerId: msgId, status: "sent" });
    return { ok: true, id: msgId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error({ to, subject, tag, err }, "Email send failed");
    await logEmail({ to, subject, tag, orderId, status: "failed", error: msg });
    return { ok: false, error: msg };  // ⛔ لا يُسقط الطلب
  }
}

// ── قوالب الرسائل ────────────────────────────────────────────

export interface OrderEmailData {
  orderId: string;
  firstName: string;
  lastName: string;
  courseName: string;
  cohortDate: string;
  cohortDays: string;
  cohortTime: string;
  trainerName: string;
  mode: "onsite" | "live";
  platform: string;
  totalJOD: number;
  totalUSD?: number;
  paidJOD: number;
  remainingJOD: number;
  plan: "full" | "deposit";
  chargedUSD: number;
  customerEmail?: string | null;
}

function modeLabel(mode: "onsite" | "live"): string {
  return mode === "onsite" ? "حضوري — استوديو كاسيت" : "مباشر تفاعلي (Online LIVE)";
}

type DetailRow = { label: string; value: string; ltr?: boolean };

function escapeHtml(value: string | number | null | undefined): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[char] as string));
}

function numberText(amount: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(amount);
}

function jodText(amount: number): string {
  return `${numberText(amount)} دينار أردني`;
}

function usdText(amount: number): string {
  return `$${numberText(amount)} USD`;
}

function present(value: string | null | undefined, fallback: string): string {
  return value?.trim() || fallback;
}

function paymentDetails(data: OrderEmailData): {
  rows: DetailRow[];
  status: string;
  note: string;
} {
  if (data.mode === "live") {
    const total = data.totalUSD || data.chargedUSD;
    const remaining = Math.max(total - data.chargedUSD, 0);
    const isInstallment = data.plan === "deposit" && remaining > 0;
    return {
      rows: [
        { label: "إجمالي البرنامج", value: usdText(total), ltr: true },
        { label: "الدفعة المحصّلة الآن", value: usdText(data.chargedUSD), ltr: true },
        ...(isInstallment ? [{ label: "المتبقي", value: usdText(remaining), ltr: true }] : []),
      ],
      status: isInstallment ? "تم تثبيت مقعدك بالدفعة الأولى" : "تم سداد البرنامج كاملاً",
      note: isInstallment
        ? "هذه هي الدفعة الأولى ضمن خطة من ثلاث دفعات. ستتواصل معك مستشارتك لتنظيم الدفعات المتبقية خلال فترة البرنامج."
        : "تم تأكيد سداد البرنامج كاملاً. نترقب انضمامك إلى الدفعة.",
    };
  }

  const hasRemaining = data.remainingJOD > 0;
  return {
    rows: [
      { label: "إجمالي البرنامج", value: jodText(data.totalJOD), ltr: true },
      { label: "المدفوع الآن", value: jodText(data.paidJOD), ltr: true },
      ...(hasRemaining ? [{ label: "المتبقي", value: jodText(data.remainingJOD), ltr: true }] : []),
    ],
    status: hasRemaining ? "تم تثبيت مقعدك بالدفعة الأولى" : "تم سداد البرنامج كاملاً",
    note: hasRemaining
      ? "هذه هي الدفعة الأولى ضمن خطة من ثلاث دفعات. ستتواصل معك مستشارتك لتنظيم الدفعات المتبقية خلال فترة البرنامج."
      : "تم تأكيد سداد البرنامج كاملاً. نترقب انضمامك إلى الدفعة.",
  };
}

function scheduleDetails(data: OrderEmailData): DetailRow[] {
  return [
    { label: "موعد بداية الدفعة", value: present(data.cohortDate, "سيتم تأكيد الموعد معك عبر واتساب") },
    { label: "الأيام", value: present(data.cohortDays, "سيتم إرسال الجدول الأسبوعي معك") },
    { label: "الوقت", value: present(data.cohortTime, "سيتم تأكيد الوقت قبل بداية الدفعة") },
    { label: "المدرّب/ة", value: present(data.trainerName, "سيتم إرسال اسم المدرب/ة ضمن تفاصيل الدفعة") },
    { label: "طريقة الحضور", value: modeLabel(data.mode) },
    { label: "المكان / المنصة", value: present(data.platform, data.mode === "onsite" ? "استوديو كاسيت" : "Google Meet") },
    ...(data.customerEmail ? [{ label: "البريد الإلكتروني المسجّل", value: data.customerEmail, ltr: true }] : []),
  ];
}

function htmlRows(rows: DetailRow[]): string {
  return rows.map((row) => `
    <tr>
      <td dir="rtl" align="right" style="padding:12px 0;border-bottom:1px solid #e8e5df;color:#74716d;font-size:13px;width:42%;text-align:right;direction:rtl">${escapeHtml(row.label)}</td>
      <td ${row.ltr ? 'dir="ltr"' : 'dir="rtl"'} align="right" style="padding:12px 0;border-bottom:1px solid #e8e5df;color:#1d2939;font-size:14px;font-weight:700;text-align:right;direction:${row.ltr ? "ltr" : "rtl"}">${escapeHtml(row.value)}</td>
    </tr>`).join("");
}

function plainRows(rows: DetailRow[]): string {
  return rows.map((row) => `${row.label}: ${row.value}`).join("\n");
}

function emailHtml(data: OrderEmailData, payment: ReturnType<typeof paymentDetails>): string {
  const student = present(`${data.firstName} ${data.lastName}`.trim(), "متدرّبنا العزيز");
  const fxNotice = data.mode === "onsite"
    ? `<p dir="rtl" style="margin:16px 0 0;color:#746f69;font-size:12px;line-height:1.8;text-align:right;direction:rtl">
        يتم تحصيل الدفعة بالدولار الأمريكي بما يعادل <span dir="ltr" style="white-space:nowrap">${escapeHtml(usdText(data.chargedUSD))}</span>.
        قد يضيف البنك المُصدر للبطاقة رسوماً للتحويل أو المعالجة.
      </p>`
    : "";

  return `<!doctype html>
<html dir="rtl" lang="ar">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>تأكيد تسجيلك في كاسيت أكاديمي</title>
  </head>
  <body dir="rtl" style="margin:0;padding:0;background:#f2f0ec;direction:rtl;text-align:right;font-family:Tahoma,Arial,sans-serif">
    <div dir="rtl" style="display:none;max-height:0;overflow:hidden;color:transparent;opacity:0">تم تثبيت مقعدك في ${escapeHtml(data.courseName)} — احتفظ بملخص التسجيل المرفق.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" dir="rtl" style="width:100%;background:#f2f0ec;direction:rtl">
      <tr><td align="center" style="padding:28px 12px">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" dir="rtl" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;direction:rtl">
          <tr><td align="center" style="padding:30px 36px 26px;background:#0d0b14;text-align:center">
            <img src="${escapeHtml(EMAIL_LOGO_URL)}" width="142" alt="كاسيت أكاديمي" style="display:block;width:142px;max-width:142px;height:auto;margin:0 auto 14px;border:0;outline:none;text-decoration:none">
            <div dir="rtl" style="color:#ffffff;font-size:14px;font-weight:700;letter-spacing:.2px;text-align:center">كاسيت أكاديمي</div>
            <div dir="rtl" style="color:#ffc107;font-size:24px;font-weight:700;line-height:1.45;margin:18px 0 0;text-align:center">تم تثبيت مقعدك</div>
            <div dir="ltr" style="color:#d5cfbf;font-size:12px;line-height:1.5;margin-top:8px;text-align:center">${escapeHtml(data.orderId)}</div>
          </td></tr>
          <tr><td dir="rtl" style="padding:32px 34px 12px;text-align:right;direction:rtl">
            <p dir="rtl" style="margin:0 0 10px;color:#1d2939;font-size:16px;line-height:1.9;text-align:right;direction:rtl">مرحباً <strong>${escapeHtml(student)}</strong>،</p>
            <p dir="rtl" style="margin:0;color:#4b5563;font-size:15px;line-height:1.9;text-align:right;direction:rtl">يسعدنا تأكيد تسجيلك في <strong style="color:#111827">${escapeHtml(data.courseName)}</strong>. أرفقنا لك ملخص التسجيل للاحتفاظ به.</p>
          </td></tr>
          <tr><td dir="rtl" style="padding:18px 34px 0;text-align:right;direction:rtl">
            <div dir="rtl" style="display:inline-block;background:#fff5cf;border:1px solid #f3d469;border-radius:999px;padding:7px 13px;color:#6e5100;font-size:12px;font-weight:700;direction:rtl;text-align:right">${escapeHtml(modeLabel(data.mode))}</div>
          </td></tr>
          <tr><td dir="rtl" style="padding:24px 34px 0;text-align:right;direction:rtl">
            <div dir="rtl" style="color:#0d0b14;font-size:16px;font-weight:700;padding-bottom:10px;border-bottom:2px solid #ffc107;text-align:right;direction:rtl">تفاصيل الدفعة</div>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" dir="rtl" style="width:100%;border-collapse:collapse;direction:rtl">${htmlRows(scheduleDetails(data))}</table>
          </td></tr>
          <tr><td dir="rtl" style="padding:28px 34px 0;text-align:right;direction:rtl">
            <div dir="rtl" style="background:#f8f6f1;border:1px solid #e7e1d6;border-right:4px solid #ffc107;border-radius:10px;padding:18px;text-align:right;direction:rtl">
              <div dir="rtl" style="color:#0d0b14;font-size:15px;font-weight:700;margin-bottom:10px;text-align:right;direction:rtl">${escapeHtml(payment.status)}</div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" dir="rtl" style="width:100%;border-collapse:collapse;direction:rtl">${htmlRows(payment.rows)}</table>
              <p dir="rtl" style="margin:13px 0 0;color:#615d56;font-size:13px;line-height:1.8;text-align:right;direction:rtl">${escapeHtml(payment.note)}</p>
            </div>
            ${fxNotice}
          </td></tr>
          <tr><td dir="rtl" style="padding:28px 34px 34px;text-align:right;direction:rtl">
            <p dir="rtl" style="margin:0 0 12px;color:#394150;font-size:14px;line-height:1.8;text-align:right;direction:rtl">لأي استفسار بخصوص تسجيلك، فريقنا جاهز لمساعدتك.</p>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" dir="rtl" style="direction:rtl">
              <tr><td bgcolor="#ffc107" style="border-radius:8px">
                <a href="https://wa.me/962790234483" dir="rtl" style="display:inline-block;padding:12px 18px;color:#0d0b14;font-size:14px;font-weight:700;text-decoration:none;direction:rtl">تواصل معنا عبر واتساب</a>
              </td></tr>
            </table>
            <p dir="rtl" style="margin:17px 0 0;font-size:12px;line-height:1.8;text-align:right;direction:rtl"><a href="${SITE_URL}/refund-policy" style="color:#74716d;text-decoration:underline">سياسة الإلغاء والاسترداد</a></p>
          </td></tr>
          <tr><td align="center" style="padding:22px 28px;background:#0d0b14;text-align:center">
            <div dir="rtl" style="color:#e7e1d6;font-size:12px;line-height:1.9;text-align:center;direction:rtl">كاسيت أكاديمي · عمّان، الأردن</div>
            <a href="${SITE_URL}" dir="ltr" style="display:inline-block;color:#ffc107;font-size:12px;text-decoration:none;margin-top:3px;direction:ltr">kaseet.com</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function pdfFontPath(): string | null {
  const candidates = [
    process.env.EMAIL_PDF_FONT_PATH,
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
  ].filter((path): path is string => Boolean(path));
  return candidates.find((path) => existsSync(path)) ?? null;
}

function pdfBoldFontPath(fallback: string): string {
  const candidates = [
    process.env.EMAIL_PDF_BOLD_FONT_PATH,
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    fallback,
  ].filter((path): path is string => Boolean(path));
  return candidates.find((path) => existsSync(path)) ?? fallback;
}

/**
 * PDFKit/fontkit performs Arabic glyph shaping when it receives logical-order
 * Unicode. These embedding marks provide its text engine an explicit paragraph
 * direction for mixed Arabic, Latin, and numeric runs without reversing the
 * Arabic characters before shaping.
 */
export function preparePdfText(value: string, direction: "rtl" | "ltr" = "rtl"): string {
  const text = String(value ?? "");
  if (!text) return "";
  const levels = bidi.getEmbeddingLevels(text, direction);
  const paragraphLevel = levels.paragraphs[0]?.level ?? (direction === "rtl" ? 1 : 0);
  const embedding = paragraphLevel % 2 === 1 ? "\u202B" : "\u202A";
  return `${embedding}${text}\u202C`;
}

async function registrationSummaryPdf(data: OrderEmailData, payment: ReturnType<typeof paymentDetails>): Promise<Buffer> {
  const font = pdfFontPath();
  if (!font) throw new Error("Arabic PDF font is not available");
  const boldFont = pdfBoldFontPath(font);

  const doc = new PDFDocument({ size: "A4", margin: 0, info: { Title: `ملخص تسجيل ${data.orderId}`, Author: "كاسيت أكاديمي" } });
  const chunks: Buffer[] = [];
  const result = new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  const pageWidth = 595.28;
  const side = 48;
  const contentWidth = pageWidth - side * 2;
  const student = present(`${data.firstName} ${data.lastName}`.trim(), "متدرّبنا العزيز");
  const writeRight = (
    text: string,
    y: number,
    size = 12,
    color = "#1D2939",
    weight = false,
    direction: "rtl" | "ltr" = "rtl",
  ) => {
    doc.font(weight ? boldFont : font)
      .fontSize(size)
      .fillColor(color)
      .text(preparePdfText(text, direction), side, y, { width: contentWidth, align: "right", lineGap: 3 });
  };
  const drawRows = (rows: DetailRow[], startY: number) => {
    let y = startY;
    for (const row of rows) {
      doc.roundedRect(side, y, contentWidth, 26, 5).fill("#FFFFFF");
      writeRight(row.value, y + 7, 9.5, "#1D2939", true, row.ltr ? "ltr" : "rtl");
      doc.font(font).fontSize(8.5).fillColor("#6B7280").text(row.label, side + 18, y + 8, { width: 180, align: "right" });
      y += 30;
    }
    return y;
  };

  doc.rect(0, 0, pageWidth, 841.89).fill("#F5F4F0");
  doc.rect(0, 0, pageWidth, 178).fill("#0D0B14");
  doc.circle(pageWidth - 68, 58, 21).fill("#FFC107");
  doc.font(boldFont).fontSize(17).fillColor("#0D0B14").text("ك", pageWidth - 79, 47, { width: 22, align: "center" });
  writeRight("كاسيت أكاديمي", 41, 18, "#FFFFFF", true);
  writeRight("ملخص تسجيلك", 78, 25, "#FFC107", true);
  doc.font(font).fontSize(10).fillColor("#D5CFBF").text(preparePdfText(data.orderId, "ltr"), side, 124, { width: contentWidth, align: "right" });

  let y = 210;
  writeRight(`مرحباً ${student}،`, y, 15, "#1D2939", true);
  y += 30;
  writeRight(data.courseName, y, 17, "#0D0B14", true);
  y += 44;
  doc.roundedRect(side, y, contentWidth, 34, 8).fill("#FFF5CF");
  writeRight(modeLabel(data.mode), y + 10, 11, "#6E5100", true);
  y += 58;

  writeRight("تفاصيل الدفعة", y, 14, "#0D0B14", true);
  y += 26;
  y = drawRows(scheduleDetails(data), y);
  y += 12;
  writeRight("ملخص الدفع", y, 14, "#0D0B14", true);
  y += 26;
  y = drawRows(payment.rows, y);
  y += 8;
  doc.roundedRect(side, y, contentWidth, 52, 7).fill("#0D0B14");
  writeRight(payment.status, y + 12, 11, "#FFC107", true);
  writeRight(payment.note, y + 29, 9.5, "#F3EEE3");

  doc.font(font).fontSize(9).fillColor("#6B7280").text(
    preparePdfText("للاستفسار: +962 79 023 4483  |  kaseet.com"),
    side, 788, { width: contentWidth, align: "center" },
  );
  doc.end();
  return result;
}

export async function buildOrderConfirmationMessage(data: OrderEmailData): Promise<{
  subject: string;
  html: string;
  text: string;
  attachments?: SendEmailInput["attachments"];
}> {
  const subject = `تأكيد تسجيلك في ${data.courseName} | كاسيت أكاديمي`;
  const payment = paymentDetails(data);
  let attachments: SendEmailInput["attachments"] | undefined;
  try {
    const pdf = await registrationSummaryPdf(data, payment);
    attachments = [{ filename: `ملخص-التسجيل-${data.orderId}.pdf`, content: pdf }];
  } catch (err) {
    logger.warn({ err, orderId: data.orderId }, "Registration PDF could not be created; sending email without attachment");
  }

  const text = `كاسيت أكاديمي — تأكيد تسجيلك

مرحباً ${present(`${data.firstName} ${data.lastName}`.trim(), "متدرّبنا العزيز")}،
تم تثبيت مقعدك في ${data.courseName}.
رقم الطلب: ${data.orderId}

تفاصيل الدفعة
${plainRows(scheduleDetails(data))}

${payment.status}
${plainRows(payment.rows)}
${payment.note}

للمساعدة عبر واتساب: +962 79 023 4483
سياسة الإلغاء والاسترداد: ${SITE_URL}/refund-policy`;

  return { subject, html: emailHtml(data, payment), text, attachments };
}

// ① بريد تأكيد الطلب
export async function sendOrderConfirmation(data: OrderEmailData) {
  const message = await buildOrderConfirmationMessage(data);
  return sendEmail({
    to: data.customerEmail,
    subject: message.subject,
    html: message.html,
    text: message.text,
    attachments: message.attachments,
    tag: "order_confirm",
    orderId: data.orderId,
  });
}

type StoredOrderForEmail = {
  id: string;
  sessionId?: string | null;
  stripeSessionId?: string | null;
  paymentIntent?: string | null;
  stripePaymentId?: string | null;
  courseSlug?: string | null;
  mode?: string | null;
  plan?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  totalJOD?: number | null;
  totalUSD?: number | null;
  paidJOD?: number | null;
  remainingJOD?: number | null;
  chargedUsd?: string | number | null;
};

async function storedCheckoutMetadata(order: StoredOrderForEmail): Promise<Record<string, string>> {
  const ids = [order.stripeSessionId, order.sessionId, order.paymentIntent, order.stripePaymentId]
    .filter((id): id is string => Boolean(id));
  try {
    const stripe = await getUncachableStripeClient();
    for (const id of ids) {
      if (id.startsWith("cs_")) {
        const session = await stripe.checkout.sessions.retrieve(id);
        if (session.metadata && Object.keys(session.metadata).length) return session.metadata;
      }
      if (id.startsWith("pi_")) {
        const paymentIntent = await stripe.paymentIntents.retrieve(id);
        if (paymentIntent.metadata && Object.keys(paymentIntent.metadata).length) return paymentIntent.metadata;
      }
    }
  } catch (err) {
    logger.warn({ err, orderId: order.id }, "Could not restore checkout metadata for email resend");
  }
  return {};
}

function numeric(value: number | string | null | undefined): number {
  const parsed = typeof value === "number" ? value : Number.parseFloat(value ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function sendOrderConfirmationForStoredOrder(order: StoredOrderForEmail) {
  const metadata = await storedCheckoutMetadata(order);
  const mode = ((metadata.mode ?? order.mode) === "live" ? "live" : "onsite") as "onsite" | "live";
  const plan = ((metadata.plan ?? order.plan) === "full" ? "full" : "deposit") as "full" | "deposit";
  const courseSlug = metadata.courseSlug ?? order.courseSlug ?? "";
  return sendOrderConfirmation({
    orderId: order.id,
    firstName: metadata.firstName ?? order.firstName ?? "",
    lastName: metadata.lastName ?? order.lastName ?? "",
    courseName: metadata.courseName ?? COURSE_NAMES[courseSlug] ?? courseSlug ?? "برنامج كاسيت",
    cohortDate: metadata.cohortStartAr ?? "",
    cohortDays: metadata.cohortDays ?? "",
    cohortTime: metadata.cohortTimeAr ?? "",
    trainerName: metadata.cohortTrainer ?? "",
    mode,
    platform: metadata.cohortPlatform || (mode === "onsite" ? "استوديو كاسيت" : "Google Meet"),
    totalJOD: numeric(metadata.totalJOD ?? order.totalJOD),
    totalUSD: numeric(metadata.totalUSD ?? order.totalUSD),
    paidJOD: numeric(metadata.paidJOD ?? order.paidJOD),
    remainingJOD: numeric(metadata.remainingJOD ?? order.remainingJOD),
    plan,
    chargedUSD: numeric(metadata.chargeUSD ?? order.chargedUsd),
    customerEmail: metadata.email ?? order.email ?? null,
  });
}
