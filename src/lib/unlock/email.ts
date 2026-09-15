import { UNLOCK_EMAIL_TEMPLATE } from "./emailTemplate";

/**
 * The only Brevo-specific file in the unlock system. Swapping providers
 * later means rewriting sendAccessEmail, nothing else in the unlock or
 * recipe code needs to change.
 */

const BREVO_SEND_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const BREVO_CONTACTS_ENDPOINT = "https://api.brevo.com/v3/contacts";
const SENDER_NAME = "Darsh from MODE";
const SENDER_EMAIL = "darsh@mail.darshmode.com";
const RECIPES_LIST_ID = 6;

/**
 * Adds/updates the recipient as a Brevo contact on the recipes lead magnet
 * list. updateEnabled: true is required, without it Brevo throws a
 * duplicate-contact error whenever someone re-enters an email they've
 * already used (e.g. "get my link again"), instead of updating them.
 */
async function upsertBrevoContact(apiKey: string, email: string): Promise<void> {
  const response = await fetch(BREVO_CONTACTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      email,
      listIds: [RECIPES_LIST_ID],
      updateEnabled: true,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Brevo contact upsert failed (${response.status}): ${detail}`);
  }
}

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

  await upsertBrevoContact(apiKey, email);
}
