import { UNLOCK_EMAIL_TEMPLATE } from "./emailTemplate";

/**
 * The only Brevo-specific file in the unlock system. Swapping providers
 * later means rewriting sendAccessEmail, nothing else in the unlock or
 * recipe code needs to change.
 */

const BREVO_SEND_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const SENDER_NAME = "Darsh from MODE";
const SENDER_EMAIL = "darsh@mail.darshmode.com";

export async function sendAccessEmail(email: string, token: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set. Add it to your environment before using the unlock flow.");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://darshmode.com";
  const link = `${siteUrl}/recipes?access=${token}`;

  const response = await fetch(BREVO_SEND_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email }],
      subject: UNLOCK_EMAIL_TEMPLATE.subject,
      htmlContent: UNLOCK_EMAIL_TEMPLATE.bodyHtml(link),
      textContent: UNLOCK_EMAIL_TEMPLATE.bodyText(link),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Brevo send failed (${response.status}): ${detail}`);
  }
}
