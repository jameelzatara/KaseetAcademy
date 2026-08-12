/**
 * ③ Resend — طبقة البريد الموحّدة
 * ⛔ كلّ إرسال يمرّ من هنا — لا استدعاء مباشر في أيّ مسار
 * ⛔ فشل البريد لا يُسقط طلباً مدفوعاً
 * ⛔ replyTo ثابت على info@kaseet.com حتى مع المرسل المؤقّت
 */
import { Resend } from "resend";
import { logger } from "./logger.js";
import { pool } from "@workspace/db";

// أنشئ جدول email_log تلقائيًا عند أول تشغيل
pool.query(`
  CREATE TABLE IF NOT EXISTS email_log (
    id          SERIAL PRIMARY KEY,
    to_address  TEXT NOT NULL,
    subject     TEXT NOT NULL,
    tag         TEXT,
    provider_id TEXT,
    status      TEXT NOT NULL,
    error       TEXT,
    sent_at     TIMESTAMPTZ DEFAULT NOW()
  )
`).catch(() => { /* non-fatal */ });

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY not set");
    _resend = new Resend(key);
  }
  return _resend;
}

// مرسل ديناميكي: يتبدّل بمتغيّر بيئة واحد بعد توثيق DNS
function fromAddress(): string {
  const verified = process.env.RESEND_DOMAIN_VERIFIED === "true";
  return verified
    ? "أكاديمية كاسيت <info@kaseet.com>"
    : "أكاديمية كاسيت <onboarding@resend.dev>";
}

// تسجيل داخلي في قاعدة البيانات (لا يُسقط الإرسال عند فشله)
async function logEmail(row: {
  to: string;
  subject: string;
  tag?: string;
  providerId?: string;
  status: "sent" | "failed" | "skipped";
  error?: string;
}) {
  try {
    await pool.query(
      `INSERT INTO email_log (to_address, subject, tag, provider_id, status, error, sent_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT DO NOTHING`,
      [row.to, row.subject, row.tag ?? null, row.providerId ?? null, row.status, row.error ?? null],
    );
  } catch {
    // سجلّ البريد غير حرج — لا نوقف الإرسال
  }
}

export interface SendEmailInput {
  to: string | undefined | null;
  subject: string;
  html: string;
  text: string;          // ⛔ إلزامي مع html — غيابه يرفع احتمال Spam
  tag?: string;          // نوع الرسالة: order_confirm | payment_received | …
}

export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean; id?: string; skipped?: string; error?: string }> {
  const { to, subject, html, text, tag } = input;

  // ① لا بريد = لا إرسال، بلا خطأ
  if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    logger.info({ to, subject }, "Email skipped: no valid address");
    await logEmail({ to: to ?? "(none)", subject, tag, status: "skipped" });
    return { ok: false, skipped: "no_email" };
  }

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from:    fromAddress(),
      to,
      subject,
      html,
      text,
      replyTo: "info@kaseet.com",   // ثابت حتى مع المرسل المؤقّت
      tags: tag ? [{ name: "type", value: tag }] : undefined,
    });

    if (error) throw error;

    logger.info({ to, subject, tag, id: data?.id }, "Email sent");
    await logEmail({ to, subject, tag, providerId: data?.id, status: "sent" });
    return { ok: true, id: data?.id };
  } catch (err) {
    const msg = String(err);
    logger.error({ to, subject, tag, err }, "Email send failed");
    await logEmail({ to, subject, tag, status: "failed", error: msg });
    return { ok: false, error: msg };   // ⛔ لا يُسقط الطلب
  }
}

// ── قوالب الرسائل الأربع ─────────────────────────────────

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
  .row{display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:10px 0;font-size:14px}
  .label{color:#888}
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

  return sendEmail({ to: data.customerEmail, subject, html, text, tag: "order_confirm" });
}
