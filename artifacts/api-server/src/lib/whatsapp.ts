/**
 * WhatsApp notifications via CallMeBot API.
 *
 * Setup (one-time per recipient):
 *  1. Save the number +34 644 59 78 31 in contacts as "CallMeBot".
 *  2. Send the WhatsApp message: "I allow callmebot to send me messages"
 *  3. You'll receive your personal apikey by WhatsApp within ~2 minutes.
 *
 * Environment variables:
 *  WHATSAPP_RECIPIENTS — comma-separated list of  phone:apikey  pairs
 *                         e.g. "962791234567:123456,962799876543:654321"
 *                         Phone must be in international format WITHOUT the leading +
 */

import { logger } from "./logger.js";

const CALLMEBOT_URL = "https://api.callmebot.com/whatsapp.php";

interface Recipient {
  phone: string;
  apikey: string;
}

function getRecipients(): Recipient[] {
  const raw = process.env.WHATSAPP_RECIPIENTS ?? "";
  if (!raw.trim()) return [];

  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const [phone, apikey] = pair.split(":").map((p) => p.trim());
      return { phone, apikey };
    })
    .filter((r) => r.phone && r.apikey);
}

export interface WhatsAppRecipientResult {
  phone: string;
  ok: boolean;
  error?: string;
}

/**
 * Send a WhatsApp message to all configured recipients.
 * Returns per-recipient results — failures are logged but never thrown so
 * payment processing is never blocked.
 * Returns an empty array when WHATSAPP_RECIPIENTS is not configured.
 */
export async function sendWhatsAppNotification(text: string): Promise<WhatsAppRecipientResult[]> {
  const recipients = getRecipients();
  if (recipients.length === 0) {
    logger.debug("WhatsApp notifications skipped — WHATSAPP_RECIPIENTS not configured");
    return [];
  }

  const settled = await Promise.allSettled(
    recipients.map(async ({ phone, apikey }) => {
      const url = new URL(CALLMEBOT_URL);
      url.searchParams.set("phone", phone);
      url.searchParams.set("apikey", apikey);
      url.searchParams.set("text", text);

      const res = await fetch(url.toString());
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        logger.warn({ phone, status: res.status, body }, "WhatsApp notification failed");
        throw new Error(`HTTP ${res.status}: ${body}`);
      }
      logger.info({ phone }, "WhatsApp notification sent");
    }),
  );

  return settled.map((result, i) => ({
    phone: recipients[i].phone,
    ok:    result.status === "fulfilled",
    error: result.status === "rejected" ? String((result as PromiseRejectedResult).reason) : undefined,
  }));
}

/**
 * Build and send the standard order-completed WhatsApp message.
 * Returns per-recipient results for observability (e.g. admin dry-run).
 * Failures are captured in the result array — never thrown.
 */
export async function notifyOrderCompleted(params: {
  orderId: string;
  courseName: string;
  firstName: string;
  lastName: string;
  phone: string;
  plan: "full" | "deposit";
  mode: "onsite" | "live";
}): Promise<WhatsAppRecipientResult[]> {
  const { orderId, courseName, firstName, lastName, phone, plan, mode } = params;

  const planLabel = plan === "full" ? "دفع كامل" : "عربون";
  const modeLabel = mode === "onsite" ? "حضوري" : "أونلاين LIVE";

  const text = [
    "✅ طلب دفع جديد — كاسيت أكاديمي",
    `📋 رقم الطلب: ${orderId}`,
    `🎓 الدورة: ${courseName} (${modeLabel})`,
    `👤 المتدرب: ${firstName} ${lastName}`.trim(),
    `📞 الهاتف: ${phone}`,
    `💳 نوع الدفع: ${planLabel}`,
  ].join("\n");

  return sendWhatsAppNotification(text);
}
