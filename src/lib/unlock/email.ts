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
/** Where replies land. The sender above is a Brevo sending subdomain, not a real inbox. */
const REPLY_TO_EMAIL = "darsh@darshmode.com";
const RECIPES_LIST_ID = 6;

/**
 * Adds/updates the recipient as a Brevo contact on the recipes lead magnet
 * list, with their personal access link stored on the ACCESS_LINK attribute.
 *
 * The attribute and the list membership go up in the SAME request on purpose.
 * The 10-day Brevo automation is triggered by joining list 6 and puts
 * ACCESS_LINK into its emails, so if the attribute were written in a later
 * call there is a window where the first automated email could go out with a
 * blank link. One call means the value is there the moment they join.
 *
 * updateEnabled: true is required, without it Brevo throws a
 * duplicate-contact error whenever someone re-enters an email they've
 * already used (e.g. "get my link again"), instead of updating them. It also
 * means a resend refreshes ACCESS_LINK rather than leaving a stale value.
 */
async function upsertBrevoContact(apiKey: string, email: string, accessLink: string): Promise<void> {
  const response = await fetch(BREVO_CONTACTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      email,
      attributes: { ACCESS_LINK: accessLink },
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

  // Contact upsert runs BEFORE the welcome email so ACCESS_LINK can never be
  // written after the automation has already started. A failure here is
  // logged but not fatal: the access link email is what the visitor is
  // actually waiting on, and a contacts API hiccup shouldn't cost them that.
  // Worst case they miss the drip sequence, not their recipes.
  try {
    await upsertBrevoContact(apiKey, email, link);
  } catch (err) {
    console.error("[unlock] Brevo contact upsert failed, sending access email anyway", err);
  }

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
      replyTo: { email: REPLY_TO_EMAIL, name: SENDER_NAME },
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
