/**
 * Spine routine lead magnet: adds the visitor to Brevo list 7 ("Spine Lead
 * Magnet"). Joining that list is what triggers the Brevo automation
 * "Spine sequence (5 emails)", which sends email 1 (the video link)
 * straight away, so the site sends no email of its own here.
 *
 * updateEnabled: true means an existing contact (for example someone already
 * on the recipes list) is updated and added to list 7 instead of Brevo
 * rejecting them as a duplicate.
 */

const BREVO_CONTACTS_ENDPOINT = "https://api.brevo.com/v3/contacts";
export const SPINE_LIST_ID = 7;

export async function subscribeToSpineList(email: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set.");
  }

  const response = await fetch(BREVO_CONTACTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      listIds: [SPINE_LIST_ID],
      updateEnabled: true,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Brevo contact upsert failed (${response.status}): ${detail}`);
  }
}
