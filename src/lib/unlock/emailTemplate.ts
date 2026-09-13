/**
 * PLACEHOLDER COPY, swap this before launch.
 *
 * This is the only file that needs editing to change the wording of the
 * unlock email. Keep {{link}} wherever the access link should be inserted.
 */
export const UNLOCK_EMAIL_TEMPLATE = {
  subject: "Your 5 high-protein Indian recipes",
  bodyHtml: (link: string) => `
    <p>Here are your 5 recipes: <a href="${link}">${link}</a></p>
    <p>This link is your permanent way back in, on any device, whenever you want it.</p>
    <p>Darsh from MODE</p>
  `,
  bodyText: (link: string) => `Here are your 5 recipes: ${link}\n\nThis link is your permanent way back in, on any device, whenever you want it.\n\nDarsh from MODE`,
};
