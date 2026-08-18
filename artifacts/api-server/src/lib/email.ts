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
      sender:      { name: "أكاديمية كاسيت", email: senderEmail() },
      to:          [{ email: to }],
      replyTo:     { email: "info@kaseet.com" },
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
  paidJOD: number;
  remainingJOD: number;
  plan: "full" | "deposit";
  chargedUSD: number;
  customerEmail?: string | null;
}

function modeLabel(mode: "onsite" | "live"): string {
  return mode === "onsite" ? "حضوري — استوديو كاسيت" : "مباشر تفاعلي (Online LIVE)";
}

// ① بريد تأكيد الطلب
export async function sendOrderConfirmation(data: OrderEmailData) {
  const subject = `تأكيد تسجيلك — ${data.courseName} (${data.orderId})`;
  const fxNotice = data.mode === "onsite"
    ? `<p style="font-size:13px;color:#555;margin:8px 0 0">
         سعر البرنامج: ${data.totalJOD} ديناراً أردنياً —
         يُحصَّل ما يعادل <strong>$${data.chargedUSD}</strong> بالدولار الأمريكي.
         قد يضيف بنكك عمولة تحويل عملة تتراوح بين 2% و3%.
       </p>`
    : "";

  const html = `
<!DOCTYPE html><html dir="rtl" lang="ar">
<head><meta charset="utf-8"><meta name="viewport" content="width=600">
<style>
  body{font-family:Tahoma,Arial,sans-serif;background:#f5f4f0;margin:0;padding:20px}
  .wrap{background:#fff;max-width:600px;margin:auto;border-radius:12px;overflow:hidden}
  .header{background:#0D0B14;padding:32px;text-align:center}
  .header h1{color:#FFC107;margin:0;font-size:22px}
  .body{padding:32px}
  .badge{background:#FFC107;color:#0D0B14;border-radius:20px;padding:4px 14px;font-size:12px;font-weight:bold;display:inline-block;margin-bottom:20px}
  .remaining{background:#fff3cd;border:1px solid #FFC107;border-radius:8px;padding:14px;margin:20px 0;font-size:14px}
  .footer{background:#0D0B14;color:#aaa;text-align:center;padding:20px;font-size:12px}
  .footer a{color:#FFC107;text-decoration:none}
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <h1>✅ تمّ تثبيت مقعدك</h1>
    <p style="color:#ccc;margin:8px 0 0;font-size:14px">${data.orderId}</p>
  </div>
  <div class="body">
    <p>مرحباً <strong>${data.firstName} ${data.lastName}</strong>،</p>
    <p>يسعدنا تأكيد تسجيلك في <strong>${data.courseName}</strong>.</p>

    <div class="badge">${modeLabel(data.mode)}</div>

    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:10px 0;color:#888;border-bottom:1px solid #eee">الدفعة</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:left">${data.cohortDate}</td></tr>
      <tr><td style="padding:10px 0;color:#888;border-bottom:1px solid #eee">الأيام</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:left">${data.cohortDays}</td></tr>
      <tr><td style="padding:10px 0;color:#888;border-bottom:1px solid #eee">الوقت</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:left">${data.cohortTime}</td></tr>
      <tr><td style="padding:10px 0;color:#888;border-bottom:1px solid #eee">المدرّب/ة</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:left">${data.trainerName}</td></tr>
      <tr><td style="padding:10px 0;color:#888;border-bottom:1px solid #eee">المكان/المنصة</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:left">${data.platform}</td></tr>
    </table>

    ${data.remainingJOD > 0 ? `
    <div class="remaining">
      💳 المدفوع: <strong>${data.paidJOD} ديناراً</strong> &nbsp;·&nbsp;
      المتبقّي: <strong>${data.remainingJOD} ديناراً</strong><br>
      <small style="color:#666">ستتواصل معك مستشارتك لترتيب الدفعات الباقية.</small>
    </div>
    ` : `<p style="color:#27ae60;font-weight:bold">✅ تمّ سداد المبلغ كاملاً — ${data.totalJOD} ديناراً</p>`}

    ${fxNotice}

    <p style="margin-top:24px">إن كان لديك أيّ استفسار، تواصل معنا على واتساب:
      <a href="https://wa.me/962790234483" style="color:#FFC107">+962 79 023 4483</a>
    </p>
    <p><a href="https://kaseet.com/refund-policy" style="color:#888;font-size:13px">سياسة الإلغاء والاسترداد</a></p>
  </div>
  <div class="footer">
    كاسيت أكاديمي · <a href="https://kaseet.com">kaseet.com</a><br>
    شارع باريس، مجمّع حجازي البيّر، عمّان
  </div>
</div>
</body></html>`;

  const text = `تأكيد التسجيل — ${data.courseName}
رقم الطلب: ${data.orderId}
الدفعة: ${data.cohortDate} · ${data.cohortDays} · ${data.cohortTime}
المدرّب/ة: ${data.trainerName}
المكان: ${data.platform}
المدفوع: ${data.paidJOD} ديناراً · المتبقّي: ${data.remainingJOD} ديناراً
سياسة الاسترداد: https://kaseet.com/refund-policy
`;

  return sendEmail({ to: data.customerEmail, subject, html, text, tag: "order_confirm", orderId: data.orderId });
}
