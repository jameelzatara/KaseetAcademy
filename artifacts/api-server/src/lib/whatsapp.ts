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

/**
 * Send a WhatsApp message to all configured recipients.
 * Failures are logged but never thrown — notifications must not block payment processing.
 */
export async function sendWhatsAppNotification(text: string): Promise<void> {
  const recipients = getRecipients();
  if (recipients.length === 0) {
    logger.debug("WhatsApp notifications skipped — WHATSAPP_RECIPIENTS not configured");
    return;
  }

  await Promise.allSettled(
    recipients.map(async ({ phone, apikey }) => {
      try {
        const url = new URL(CALLMEBOT_URL);
        url.searchParams.set("phone", phone);
        url.searchParams.set("apikey", apikey);
        url.searchParams.set("text", text);

        const res = await fetch(url.toString());
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          logger.warn({ phone, status: res.status, body }, "WhatsApp notification failed");
        } else {
          logger.info({ phone }, "WhatsApp notification sent");
        }
      } catch (err) {
        logger.warn({ err, phone }, "WhatsApp notification error");
      }
    }),
  );
}

/**
 * Build and send the standard order-completed WhatsApp message.
 */
export async function notifyOrderCompleted(params: {
  orderId: string;
  courseName: string;
  firstName: string;
  lastName: string;
  phone: string;
  plan: "full" | "deposit";
  mode: "onsite" | "live";
}): Promise<void> {
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

  await sendWhatsAppNotification(text);
}
