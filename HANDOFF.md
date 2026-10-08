# Project Handoff

_Last updated: 2026-10-08_

## What this is

`darshmo` is a Next.js 14 (App Router) site for **MODE**, a 1-on-1 fitness coaching business run by Darsh. It does two jobs: convert visitors into booked discovery calls, and capture emails through `/recipes`, an interactive high-protein Indian recipe lead magnet that replaced an old, poorly-converting Instagram bio link.

Deployed on Vercel at darshmode.com (canonical host is `www.darshmode.com`; the bare domain 301s to it, preserving query strings). Auto-deploys from `origin/main` (`github.com/darshmode/darshmo`), roughly 60 seconds per deploy.

## Current state

**Everything described here is committed, pushed, and live.** Working tree is clean apart from two pre-existing untracked files (`.agents/`, `AGENTS.md`, see Open TODOs). `npx tsc --noEmit` and `npm run build` both pass.

### Routes

| Route | What it is | State |
| --- | --- | --- |
| `/` | Marketing homepage | Live |
| `/book` | Tally application form, routes to `/schedule` on submit | Live |
| `/schedule` | Calendly inline embed, routes to `/booked` on booking | Live, redirect not browser-tested |
| `/booked` | Post-booking page with a 9:16 video, `noindex` | Live |
| `/recipes` | Lead magnet, email-gated | Live, verified end to end |
| `/api/unlock`, `/api/unlock/resend`, `/api/unlock/verify` | Unlock flow | Live, verified end to end |

### Booking funnel

Two steps, deliberately: `/book` qualifies via a Tally application, then `/schedule` takes the booking via Calendly's official inline embed. Nothing anywhere on the site links out to calendly.com. All four CTA components (`CtaButton`, `Header`, `RecipesCta`, `RecipesHeader`) point at `/book`.

Calendly is on the **free plan**, which has no redirect-after-booking setting, so `/schedule` listens for the embed's `calendly.event_scheduled` `postMessage` and navigates to `/booked` itself. Guarded by an exact origin check and a one-shot ref.

Tracking params survive the whole funnel via `src/lib/tracking.ts`: `/book` forwards the query string to `/schedule`, `/schedule` forwards it to `/booked`, and `utm_*` values are additionally mapped onto Calendly's embed API so bookings are attributed inside Calendly. The pure helpers were unit tested ad hoc (11 cases, all passing); not committed as a suite because the repo has no test runner.

### Recipes lead magnet and email

Email-gated, no database. A token is the normalized email plus an HMAC keyed by `UNLOCK_SECRET`, so the same email always regenerates the same token and "send my link again" needs nothing stored. Both entry points (the `/recipes` `UnlockGate` and the homepage `LeadMagnetPopup`) share one path: `useUnlock().submitEmail` -> `/api/unlock` (or `/api/unlock/resend`) -> `issueAndSendAccess()` -> `sendAccessEmail()`.

`sendAccessEmail()` upserts the visitor as a Brevo contact on list 6 ("Recipe Lead Magnet") with their personal access link on the `ACCESS_LINK` attribute, in the same `createContact` call, then sends the welcome email. The welcome email copy is real and final (no longer placeholder), with replies routed to `darsh@darshmode.com`.

**Verified live on 2026-10-08:** a real signup through `https://www.darshmode.com/api/unlock` returned `emailSent: true`, the Brevo contact came back on list 6 with a populated `ACCESS_LINK`, and the exact link stored in that attribute validates against the live `/api/unlock/verify`. The `ACCESS_LINK` attribute exists in Brevo and is typed `text`.

### Analytics

`@vercel/analytics` is installed and `<Analytics />` is mounted in the root layout. **It is inert until Web Analytics is switched on in the Vercel dashboard,** and it never reports from localhost.

## Key decisions

- **`UNLOCK_SECRET` in Vercel is NOT the same value as the one in `.env.local`.** Verified 2026-10-08: a token generated with the local secret validates against a local `next start` server but is rejected by the live site. Production is internally consistent, so live signups and their emailed links work fine, but access links cannot be regenerated offline and a link issued in local dev will not open the live site. If this is ever reconciled, copy **Vercel's value into `.env.local`, never the reverse**: overwriting Vercel's secret would invalidate every access link already emailed to every subscriber.
- **The Calendly redirect listener lives on `/schedule`, not `/book`.** A brief asked for Calendly to be embedded inline on `/book`, but that premise was out of date: `/book` is the Tally application form and `/schedule` already had the official inline embed. Moving Calendly onto `/book` would have deleted the qualification step, so the listener went where Calendly actually is and the two-step funnel was left intact. Flagged to Darsh. One-step booking is a deliberate funnel change if he ever wants it, not a bug fix.
- **The whole query string is forwarded through the funnel, not an allowlist of keys.** Cheaper to reason about and it cannot silently drop a tracking param added later.
- **Brevo contact upsert runs before the email send, and its failure is non-fatal.** Order matters because `ACCESS_LINK` must exist at the moment of list join, otherwise the first automated email can go out with a blank link. Non-fatal because the access link email is what the visitor is waiting on: a contacts API hiccup should cost them the drip sequence, not their recipes. Failures are `console.error`'d, so check Vercel function logs if contacts stop appearing.
- **Reply-to is a separate address from the sender.** Sender is `darsh@mail.darshmode.com`, a Brevo sending subdomain and not a real inbox. The email copy explicitly asks people to hit reply, so replies go to `darsh@darshmode.com`.
- **The `/booked` video does not autoplay, by design.** Browsers only permit autoplay when muted, and the clip is meant to be heard. A poster frame plus an explicit play button makes the first play a real user gesture, so it starts with sound. Native `controls` stay on.
- **The post-booking video is CRF 27, preset slow, full 1080x1920, 18MB.** CRF 24 came out at 29MB, over the ~20MB budget. Resolution was kept at 1080 wide rather than downscaled so it stays crisp on high-DPI phones. The source was HEVC, which is Safari-only in browsers, hence the H.264 transcode.
- **`Header` takes an optional `showBookButton` prop (default `true`)** so `/booked` can suppress the CTA, and its in-page anchors resolve against the homepage (`/#results`) when `usePathname()` is not `/`, because those links were dead on any other page. Homepage behaviour is unchanged.
- **`CtaButton`'s default variant is amber, not white.** No call site wants the old white default. Still reachable via `variant="default"`, currently unused.
- **Mobile comparison table is a static PNG, not live markup** (`public/comparison-table.png`). Stacked cards lost the side-by-side comparison. Knowingly accepted as not selectable text and not screen-reader accessible in that view, with `alt` text standing in.
- **`ffmpeg` is not a project dependency.** Used ephemerally via the `ffmpeg-static` / `ffprobe-static` npm packages installed into a scratchpad directory outside the repo, purely as a one-off transcoding and frame-extraction tool.
- **`LeadMagnetPopup` deliberately does not duplicate unlock logic.** Same hook, same endpoint, same `mode_recipes_unlock` localStorage key as the `/recipes` gate, so unlocking via the popup and then navigating to `/recipes` shows everything already unlocked.
- **Chrome extension screenshot/CDP tooling hangs when the Hero's autoplay video is playing in the tab.** Confirmed an automation-environment quirk, not a site bug, via an A/B test against the original `hero.mp4`. Workaround: `document.querySelector('video').pause()` before screenshotting any page with the Hero mounted.

## Project structure

```
darshmo/
├── HANDOFF.md                       # this file
├── CLAUDE.md                        # hard rule: no em dashes, anywhere, ever
├── AGENTS.md                        # byte-identical copy of CLAUDE.md, untracked
├── .agents/skills/save/SKILL.md     # older variant of .claude/skills/save, untracked
├── .claude/
│   ├── skills/save/SKILL.md         # the /save skill that writes this file
│   ├── run-dev.sh                   # npm run dev with the nvm PATH already set
│   ├── launch.json
│   └── settings.local.json
├── .env.local                       # real BREVO_API_KEY + UNLOCK_SECRET, gitignored
├── .env.local.example
├── src/
│   ├── app/
│   │   ├── layout.tsx               # root layout, mounts <Analytics />
│   │   ├── page.tsx                 # homepage, component order below
│   │   ├── book/page.tsx            # Tally application form, forwards query to /schedule
│   │   ├── schedule/page.tsx        # Calendly inline embed, redirects to /booked on event_scheduled
│   │   ├── booked/page.tsx          # post-booking page, noindex, header without CTA
│   │   ├── recipes/
│   │   │   ├── page.tsx             # server component, SEO metadata only
│   │   │   └── RecipesPageClient.tsx
│   │   └── api/unlock/              # route.ts, resend/route.ts, verify/route.ts
│   ├── components/
│   │   ├── Header.tsx               # sticky nav, mobile bottom-sheet menu, showBookButton prop
│   │   ├── Hero.tsx                 # autoplay video, mute toggle, amber CTA
│   │   ├── Empathy.tsx              # "Athletic to Pathetic" copy
│   │   ├── WhoForNotFor.tsx
│   │   ├── Testimonials.tsx         # Riley + Francy featured videos
│   │   ├── PullUpProgression.tsx    # Francy + Cody pull-up videos, own CTA
│   │   ├── ComparisonTable.tsx      # desktop table (sm:block) + mobile static image (sm:hidden)
│   │   ├── WhatsAppTestimonials.tsx # reusable heading + screenshot grid, used twice
│   │   ├── YourStory.tsx            # "My Story", own CTA
│   │   ├── ResultsGallery.tsx       # reusable before/after grid, used twice
│   │   ├── Faq.tsx
│   │   ├── LeadMagnetPopup.tsx      # scroll-triggered homepage popup, reuses useUnlock()
│   │   ├── BookedVideo.tsx          # 9:16 player for /booked, poster + play button, no autoplay
│   │   ├── CtaButton.tsx            # default variant is amber, see Key decisions
│   │   ├── Section.tsx              # scroll-fade wrapper
│   │   ├── SocialProofShot.tsx      # single WhatsApp screenshot card
│   │   └── recipes/                 # RecipeCard, RecipeDetail, UnlockGate, RecipesHeader, etc.
│   └── lib/
│       ├── tracking.ts              # carries utm_*/gclid/fbclid through the booking funnel
│       ├── whatsappShots.ts         # whatsappShotsBatch1 / whatsappShotsBatch2 data
│       ├── recipes/                 # data.ts, scaling.ts, sharedComponents.ts, types.ts
│       └── unlock/
│           ├── email.ts             # the only Brevo-specific file: contact upsert + send
│           ├── emailTemplate.ts     # welcome email subject + copy, final
│           ├── issueAndSend.ts      # wraps token creation + send, swallows send errors
│           ├── token.ts             # stateless HMAC access tokens
│           └── useUnlock.ts         # shared by /recipes gate and LeadMagnetPopup
└── public/
    ├── videos/                      # hero-v3.mp4 (live hero), hero.mp4 (old, unused),
    │   │                            # post-sign-up-video.mp4 (18MB, /booked),
    │   │                            # testimonial + pull-up clips (riley is 49MB)
    │   └── posters/                 # extracted poster frames for every video
    ├── comparison-table.png         # static mobile comparison table image, see Key decisions
    ├── gallery/                     # 14 before/after photos, split into two grids
    ├── social-proof/                # 9 WhatsApp screenshots, split into two batches
    └── recipes/                     # 5 recipe photos
```

**Homepage component order (`src/app/page.tsx`), top to bottom:**
Header -> Hero -> Empathy -> WhoForNotFor -> Testimonials (Riley/Francy videos) -> PullUpProgression (own CTA) -> ComparisonTable -> WhatsAppTestimonials ("See what my students are saying", batch 1) -> YourStory (own CTA) -> ResultsGallery ("Real Results", grid A, `id="results"`) -> WhatsAppTestimonials ("More from my students", batch 2) -> ResultsGallery (grid B, no heading) -> CTA ("Book a Free Discovery Call") -> Faq -> TrustBadges/logo footer -> LeadMagnetPopup (fixed overlay, not in document flow).

## Open TODOs / known issues

**Darsh's, outside the codebase:**
- **Enable Web Analytics in the Vercel dashboard** (Project -> Analytics -> Enable). The component is deployed but inert until then.
- **Confirm `darsh@darshmode.com` actually receives mail.** The welcome email asks people to hit reply. If that mailbox does not exist, replies bounce silently. A verification signup on 2026-10-08 sent the real email to Darsh's Hotmail, so the copy and reply-to can be checked there.
- **Look at `/booked` on a real phone.** Markup and assets are verified, but the 9:16 framing has never been seen rendered.
- **Instagram bio link swap** to `/recipes` is still a manual action.

**In the code:**
- **The `calendly.event_scheduled` redirect has not been exercised by a real booking.** The code is deployed and confirmed present in the live JS chunk (`/_next/static/chunks/app/schedule/page-*.js`), and the pure helpers are unit tested, but the postMessage path was never driven in a real browser (no browser automation available in that session). Test by making a real booking and cancelling it, or from devtools on `/schedule` with:
  `window.dispatchEvent(new MessageEvent("message", { data: { event: "calendly.event_scheduled" }, origin: "https://calendly.com" }))`
  A plain `window.postMessage(...)` will NOT work as a test: it carries your own origin, which the handler correctly rejects. The `MessageEvent` constructor is what lets you set the origin. Failure mode if something is wrong is benign: no redirect, and people stay on Calendly's confirmation screen.
- **4 pre-existing list-6 contacts have a blank `ACCESS_LINK`, by decision.** Darsh chose on 2026-10-08 to skip the backfill rather than reconcile the secret or re-email them. Those 4 (including 2 who signed up on 7th and 8th October and are mid-automation) will get automation emails with a blank link unless they re-submit their email through the site, which regenerates everything correctly. The 5th, Darsh's own address, was populated by the verification signup. Everyone signing up from now on is unaffected. A local backfill is impossible until the Vercel secret is copied into `.env.local`, see Key decisions.
- `public/videos/hero.mp4` (old V2) is unused dead weight, kept deliberately as a rollback option. Safe to delete once V3 is confirmed good live.
- `public/comparison-table.png` goes stale if the table's data, styling or copy changes without regenerating the image. To regenerate: load the homepage at desktop width, pause the hero video, get the live `<table>` element's `getBoundingClientRect()`, then use the Chrome extension `zoom` action on that region with `save_to_disk: true`.
- The hero video has never been independently confirmed visually autoplaying in a real browser, only confirmed valid and correctly served.
- `AGENTS.md` is a byte-identical untracked copy of `CLAUDE.md`, and `.agents/skills/save/SKILL.md` is an older variant of `.claude/skills/save/SKILL.md`. Harmless, but they will drift if only one copy is ever edited.

**Environment gotchas:**
- Dev server: run via `.claude/run-dev.sh`, or put `/Users/darsh/.nvm/versions/node/v24.20.0/bin` first on `PATH`. Do not run `npm run build` against the same `.next` directory while `npm run dev` is up, it corrupts the shared cache (fix: `rm -rf .next` and restart).
- If a recipe image is ever swapped or recropped, clear `.next/cache/images` and restart the dev server, otherwise Next's server-side image optimizer keeps serving the old crop and a browser hard-refresh will not help.

## Useful references

- Brevo dashboard: SMTP & API > API Keys (for `BREVO_API_KEY`), Contacts (list ID 6 is "Recipe Lead Magnet", attribute `ACCESS_LINK` feeds a 10-day automation).
- Vercel dashboard: env vars (`BREVO_API_KEY`, `UNLOCK_SECRET`, `NEXT_PUBLIC_SITE_URL`) are set there directly by Darsh, not synced from `.env.local`. Secrets live only in `.env.local` (gitignored) and Vercel, never in this file or the repo.
- Booking stack: Tally form `81BMPo` at `/book` -> Calendly `calendly.com/darsh-jkyh/30min` inline at `/schedule` -> `/booked` on `calendly.event_scheduled`. Calendly is on the free plan, which is why the redirect is done in code.
- Post-booking video source: `~/Desktop/Desktop/COACHING BUSINESS/AI_ CLAUDE/WEBSITE_AI/VIDEOS/POST SIGN UP VIDEO_MODE.mp4`.
- Hero video sources: same `VIDEOS/` folder (`MODE_COACHING_V2.mp4`, `MODE_COACHING_V3.mp4`).
- Source recipe photos: `~/Desktop/Desktop/COACHING BUSINESS/AI_ CLAUDE/WEBSITE_AI/LEAD MAGNET/RECIPE PICTURES/`.
- Before/after photo originals: `~/Desktop/Desktop/COACHING BUSINESS/AI_ CLAUDE/WEBSITE_AI/Before and After Transformations - ready/`.
- Live site: darshmode.com. Instagram: @darshmode. Brand name in copy is "MODE", not "Darshmode".
- **No em dashes, ever**: hard rule from `CLAUDE.md`. Rewrite with a comma, period, colon, semicolon or parentheses instead.
- Node 24 via `nvm` (`~/.nvm`), no system Node, no Homebrew. No test runner in the repo.

## How to resume

Tell Claude: "Read HANDOFF.md and continue."
