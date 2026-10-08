/**
 * Wording for the welcome email sent straight after sign up.
 *
 * This is the only file that needs editing to change the copy. The access
 * link is passed in, so keep using the `link` argument wherever the reader
 * should be sent back to their recipes.
 */

const BOOK_URL = "https://www.darshmode.com/book";
const PREVIEW_TEXT = "Plus why I bothered making them";

const PARAGRAPH = "margin:0 0 16px;";

function p(content: string): string {
  return `<p style="${PARAGRAPH}">${content}</p>`;
}

export const UNLOCK_EMAIL_TEMPLATE = {
  subject: "Your recipes are in",

  bodyHtml: (link: string) => `
<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${PREVIEW_TEXT}</div>
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:#222222;max-width:560px;">
${p("Hey,")}
${p(`Here are your 5 recipes: <a href="${link}" style="color:#C2651A;">Open my recipes</a>`)}
${p("Save that link. It works on any device and it's yours for good, so next time you're stood in the kitchen with no idea what to make, it's there.")}
${p("Quick bit on why I made these.")}
${p("I get asked a lot how I stay lean when half my stories are curries and juicy kebabs.")}
${p("Honestly, it's because I eat food I actually look forward to.")}
${p("If dinner was dry chicken and plain rice and broccoli every night, I'd last 2 days at a push.")}
${p("So these are the meals I actually cook.")}
${p("Packed with flavour and a ton of protein.")}
${p("Start with the chicken curry.")}
${p("It's my own recipe, and if you only make one this week, make that.")}
${p("Don't just make it for one day. Plan ahead and make more so you can quickly warm it up on those crazy days where everything goes to sh*t.")}
${p("Over the next week or so I'll send you a handful of short emails.")}
${p("How to eat well without it being boring, what I eat in a normal day, and why most diets fall apart after a few weeks.")}
${p("One favour.")}
${p("Hit reply and tell me what makes eating well hardest for you right now.")}
${p("Is it time? Cravings? Eating out? Family meals? Whatever it is, I read every reply myself.")}
${p("Darsh")}
${p(`P.S. If you'd rather someone just built all of this around your life for you, I coach people 1:1. <a href="${BOOK_URL}" style="color:#C2651A;">Book a free call</a>`)}
</div>
`.trim(),

  bodyText: (link: string) =>
    [
      "Hey,",
      `Here are your 5 recipes: ${link}`,
      "Save that link. It works on any device and it's yours for good, so next time you're stood in the kitchen with no idea what to make, it's there.",
      "Quick bit on why I made these.",
      "I get asked a lot how I stay lean when half my stories are curries and juicy kebabs.",
      "Honestly, it's because I eat food I actually look forward to.",
      "If dinner was dry chicken and plain rice and broccoli every night, I'd last 2 days at a push.",
      "So these are the meals I actually cook.",
      "Packed with flavour and a ton of protein.",
      "Start with the chicken curry.",
      "It's my own recipe, and if you only make one this week, make that.",
      "Don't just make it for one day. Plan ahead and make more so you can quickly warm it up on those crazy days where everything goes to sh*t.",
      "Over the next week or so I'll send you a handful of short emails.",
      "How to eat well without it being boring, what I eat in a normal day, and why most diets fall apart after a few weeks.",
      "One favour.",
      "Hit reply and tell me what makes eating well hardest for you right now.",
      "Is it time? Cravings? Eating out? Family meals? Whatever it is, I read every reply myself.",
      "Darsh",
      `P.S. If you'd rather someone just built all of this around your life for you, I coach people 1:1. Book a free call: ${BOOK_URL}`,
    ].join("\n\n"),
};
