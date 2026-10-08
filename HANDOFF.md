# Project Handoff

_Last updated: 2026-10-08_

## What this is

`darshmo` is a Next.js 14 (App Router) site for **MODE**, a 1-on-1 fitness coaching business run by Darsh. It has the main marketing homepage (`src/app/page.tsx`), a booking flow (`/book` application form, `/schedule` Calendly picker, `/booked` post-booking confirmation), and `/recipes`: an interactive recipe lead magnet that replaced an old, poorly-converting Instagram bio link.

Deployed on Vercel (darshmode.com), auto-deploys from `origin/main` (`github.com/darshmode/darshmo`).

## Current state

**The homepage and `/recipes` are live and have been for a while.** Everything from earlier sessions is committed and pushed.

**This session's work (4 changes) is complete, builds clean, and is committed and pushed to `main`.** `npx tsc --noEmit` and `npm run build` both pass, and all routes were smoke-tested against a real production server (`next start`). See "Open TODOs" for what Darsh still has to do outside the codebase.

### 1. Vercel Web Analytics (new)
`@vercel/analytics@2.0.1` added as a dependency, `<Analytics />` imported from `@vercel/analytics/next` and mounted in `<body>` in `src/app/layout.tsx`. Code side is done; Web Analytics still has to be switched on in the Vercel dashboard before any data flows.

### 2. Brevo `ACCESS_LINK` attribute (fixed)
`src/lib/unlock/email.ts` now writes each signup's personal access link to the Brevo contact attribute `ACCESS_LINK` (text), in the same `createContact` call that adds them to list 6 ("Recipe Lead Magnet"), with `updateEnabled: true`.

Two genuine bugs were found and fixed here:
- The contact upsert previously sent **no attributes at all**, so `ACCESS_LINK` was never populated. Brevo's 10-day automation needs it.
- The upsert previously ran **after** the transactional email send. It now runs first, so the attribute can never be written after the automation has already been triggered by the list join.

Both signup entry points (the `/recipes` `UnlockGate` and the homepage `LeadMagnetPopup`) share one code path, verified: `useUnlock().submitEmail` -> `/api/unlock` (or `/api/unlock/resend`) -> `issueAndSendAccess()` -> `sendAccessEmail()`. Fixing `email.ts` covers both.

### 3. Welcome email copy (replaced)
`src/lib/unlock/emailTemplate.ts` no longer holds placeholder copy. It now has Darsh's real wording: subject "Your recipes are in", hidden preheader "Plus why I bothered making them", short plain paragraphs, "Open my recipes" linking to the recipient's access link, and a P.S. with "Book a free call" linking to `https://www.darshmode.com/book`. Both `bodyHtml` and `bodyText` are kept in sync.

Reply-to is now set explicitly to `darsh@darshmode.com` (see Key decisions). Trigger, sender and access-link logic are unchanged.

### 4. `/booked` page (new)
Post-booking confirmation page at `src/app/booked/page.tsx` with a 9:16 video player. Headline "You're booked in.", subline "Watch this quick video before our call.", video, then "Need to change the time? Use the reschedule link in your confirmation email." Site header is present but its "Book a Call" button is suppressed. Page is `noindex, nofollow` (verified in the built HTML).

Source video was `POST SIGN UP VIDEO_MODE.mp4`, HEVC 1080x1920 30fps, 76MB. Transcoded to H.264 and published at `public/videos/post-sign-up-video.mp4`, **18MB**, still full 1080x1920, with `+faststart`. First frame extracted to `public/videos/posters/post-sign-up-video.jpg` as the poster. Original source file untouched.

## Key decisions

- **Brevo contact upsert runs before the email send, and its failure is non-fatal.** Order matters because the attribute must exist at the moment of list join. Non-fatal because the access link email is what the visitor is actually waiting on: a contacts API hiccup should cost them the drip sequence, not their recipes. Failures are `console.error`'d, so check Vercel function logs if contacts stop appearing.
- **Reply-to is a separate address from the sender.** Sender stays `darsh@mail.darshmode.com` (a Brevo sending subdomain, not a real inbox). The new email copy explicitly asks people to hit reply, so replies are routed to `darsh@darshmode.com`. Darsh picked this address when asked.
- **`Header` gained an optional `showBookButton` prop (default `true`).** `/booked` passes `false`. Default keeps every existing call site (only the homepage) unchanged.
- **`Header`'s in-page anchors are now path-aware.** `#testimonials` etc. resolve to `/#testimonials` when `usePathname()` is not `/`, because those links were dead on any page other than the homepage. Homepage behaviour is byte-identical. This was a small scope extension beyond the brief, made because `/booked` is the first page to mount `Header` off the homepage.
- **The `/booked` video does not autoplay, by design.** Browsers only permit autoplay when muted, and this clip is meant to be heard. A poster frame plus an explicit orange play button (`BookedVideo.tsx`) makes the first play a real user gesture, so it starts with sound. Native `controls` are still on.
- **Video encoded at CRF 27, preset slow, full 1080x1920.** CRF 24 came out at 29MB, over the ~20MB budget. CRF 27 lands at 18MB with the first frame verified visually sharp. Resolution was deliberately kept at 1080 wide rather than downscaled, so it stays crisp on high-DPI phones.
- **`CtaButton`'s default variant is amber, not white.** No call site anywhere wants the old white default. Still reachable via `variant="default"`, currently unused.
- **Mobile comparison table is a static PNG, not live markup** (`public/comparison-table.png`). Chosen because stacked cards lost the side-by-side comparison. Knowingly accepted as not selectable text and not screen-reader accessible in that view, with `alt` text standing in.
- **`ffmpeg` is not a project dependency.** It is used ephemerally via the `ffmpeg-static` / `ffprobe-static` npm packages installed into a scratchpad directory outside the repo, purely as a one-off transcoding and frame-extraction tool.
- **`LeadMagnetPopup` deliberately does not duplicate unlock logic.** Same `useUnlock()` hook, same `/api/unlock` endpoint, same `mode_recipes_unlock` localStorage key as the `/recipes` gate, so unlocking via the popup and then navigating to `/recipes` shows everything already unlocked.
- **Stateless HMAC unlock tokens, no database.** A token is the normalized email, base64url-encoded, plus an HMAC keyed by `UNLOCK_SECRET`. The same email always regenerates the same token, which is what makes "send my link again" work with nothing stored. See `src/lib/unlock/token.ts`.
- **Chrome extension screenshot/CDP tooling hangs when the Hero's autoplay video is playing in the tab.** Confirmed an automation-environment quirk, not a site bug, via an A/B test against the untouched original `hero.mp4`. Workaround: `document.querySelector('video').pause()` before screenshotting any page with the Hero mounted.

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
│   │   ├── book/page.tsx            # Tally application form, redirects to /schedule
│   │   ├── schedule/page.tsx        # Calendly inline widget
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
│       ├── whatsappShots.ts         # whatsappShotsBatch1 / whatsappShotsBatch2 data
│       ├── recipes/                 # data.ts, scaling.ts, sharedComponents.ts, types.ts
│       └── unlock/
│           ├── email.ts             # the only Brevo-specific file: contact upsert + send
│           ├── emailTemplate.ts     # welcome email subject + copy, real as of this session
│           ├── issueAndSend.ts      # wraps token creation + send, swallows send errors
│           ├── token.ts             # stateless HMAC access tokens
│           └── useUnlock.ts         # shared by /recipes gate and LeadMagnetPopup
└── public/
    ├── videos/
    │   ├── hero-v3.mp4              # live hero video (H.264, transcoded from HEVC source)
    │   ├── hero.mp4                 # old V2, unused, kept as rollback backup
    │   ├── post-sign-up-video.mp4   # 18MB H.264, used by /booked
    │   └── posters/                 # extracted poster frames, incl. post-sign-up-video.jpg
    ├── comparison-table.png         # static mobile comparison table image, see Key decisions
    ├── gallery/                     # 14 before/after photos, split into two grids
    ├── social-proof/                # 9 WhatsApp screenshots, split into two batches
    └── recipes/                     # 5 recipe photos
```

**Homepage component order (`src/app/page.tsx`), top to bottom:**
Header -> Hero -> Empathy -> WhoForNotFor -> Testimonials (Riley/Francy videos) -> PullUpProgression (own CTA) -> ComparisonTable -> WhatsAppTestimonials ("See what my students are saying", batch 1) -> YourStory (own CTA) -> ResultsGallery ("Real Results", grid A, `id="results"`) -> WhatsAppTestimonials ("More from my students", batch 2) -> ResultsGallery (grid B, no heading) -> CTA ("Book a Free Discovery Call") -> Faq -> TrustBadges/logo footer -> LeadMagnetPopup (fixed overlay, not in document flow).

## Open TODOs / known issues

**Blocking, this session's work is not finished until these happen:**
- **`/booked` is not linked from anywhere.** Darsh needs to set the Calendly event's confirmation redirect to `https://www.darshmode.com/booked`, otherwise the page and video are unreachable.
- **Web Analytics has to be enabled in the Vercel dashboard** (Project -> Analytics -> Enable). The component is mounted but inert until then, and it never reports from localhost.
- **Confirm `darsh@darshmode.com` actually receives mail.** The new email copy asks people to hit reply. If that mailbox does not exist, replies bounce silently.
- ~~Confirm the Brevo attribute is named exactly `ACCESS_LINK` and typed as text.~~ Done, verified against the live Brevo API on 2026-10-08.
- **The 5 pre-existing list-6 contacts will never get an `ACCESS_LINK`, by decision.** Darsh chose on 2026-10-08 to skip the backfill rather than reconcile the secret or re-email them. Practical consequence: those 5 (including 2 who signed up on 7th and 8th October and are mid-automation) will receive automation emails with a blank link unless they re-submit their email through the site, which regenerates everything correctly. Everyone who signs up from this deploy onward is unaffected. If this is revisited, see the `UNLOCK_SECRET` note under Useful references first: a local backfill is impossible until the Vercel secret is copied into `.env.local`.
- **The live Brevo call was never exercised.** Testing it means a real signup. Worth one real submission through the homepage popup after deploy, then checking the contact in Brevo shows a populated `ACCESS_LINK`.

**Pre-existing, lower priority:**
- `public/videos/hero.mp4` (old V2) is unused dead weight, kept deliberately as a rollback option. Safe to delete once V3 is confirmed good live.
- `public/comparison-table.png` goes stale if the table's data, styling or copy changes without regenerating the image. To regenerate: load the homepage at desktop width, pause the hero video, get the live `<table>` element's `getBoundingClientRect()`, then use the Chrome extension `zoom` action on that region with `save_to_disk: true`.
- The hero video has never been independently confirmed visually autoplaying in a real browser, only confirmed valid and correctly served. Worth a manual check on the live site.
- `AGENTS.md` is a byte-identical untracked copy of `CLAUDE.md`, and `.agents/skills/save/SKILL.md` is an older variant of `.claude/skills/save/SKILL.md`. Both are untracked leftovers. Harmless, but they will drift if only one copy is ever edited.
- Instagram bio link swap to `/recipes` is still a manual action for Darsh.
- Dev server: run via `.claude/run-dev.sh`, or put `/Users/darsh/.nvm/versions/node/v24.20.0/bin` first on `PATH`. Do not run `npm run build` against the same `.next` directory while `npm run dev` is up, it corrupts the shared cache (fix: `rm -rf .next` and restart).
- If a recipe image is ever swapped or recropped, clear `.next/cache/images` and restart the dev server, otherwise Next's server-side image optimizer keeps serving the old crop and a browser hard-refresh will not help.

## Useful references

- Brevo dashboard: SMTP & API > API Keys (for `BREVO_API_KEY`), Contacts (list ID 6 is "Recipe Lead Magnet", attribute `ACCESS_LINK` feeds the 10-day automation).
- Vercel dashboard: env vars (`BREVO_API_KEY`, `UNLOCK_SECRET`, `NEXT_PUBLIC_SITE_URL`) are set there directly by Darsh, not synced from `.env.local`. Secrets live only in `.env.local` (gitignored) and Vercel, never in this file or the repo.
- **`UNLOCK_SECRET` in Vercel is NOT the same value as the one in `.env.local`.** Verified 2026-10-08: a token generated with the local secret validates against a local `next start` server but is rejected by `https://www.darshmode.com/api/unlock/verify`. Production is internally consistent (it signs and verifies with its own secret, so live signups and their emailed links work fine), but access links cannot be regenerated offline, and a link issued in local dev will not open the live site. Reconciling the two means copying the Vercel value into `.env.local`, never the reverse: overwriting Vercel's secret would invalidate every access link already emailed to every subscriber.
- Booking stack: Tally form `81BMPo` at `/book`, Calendly `calendly.com/darsh-jkyh/30min` at `/schedule`, then `/booked`.
- Post-booking video source: `~/Desktop/Desktop/COACHING BUSINESS/AI_ CLAUDE/WEBSITE_AI/VIDEOS/POST SIGN UP VIDEO_MODE.mp4`.
- Hero video sources: same `VIDEOS/` folder (`MODE_COACHING_V2.mp4`, `MODE_COACHING_V3.mp4`).
- Source recipe photos: `~/Desktop/Desktop/COACHING BUSINESS/AI_ CLAUDE/WEBSITE_AI/LEAD MAGNET/RECIPE PICTURES/`.
- Before/after photo originals: `~/Desktop/Desktop/COACHING BUSINESS/AI_ CLAUDE/WEBSITE_AI/Before and After Transformations - ready/`.
- Live site: darshmode.com. Instagram: @darshmode. Brand name in copy is "MODE", not "Darshmode".
- No em dashes, ever: hard rule from `CLAUDE.md`, grep-checked clean across everything touched this session.
- Node 24 via `nvm` (`~/.nvm`), no system Node, no Homebrew.

## How to resume

Tell Claude: "Read HANDOFF.md and continue."
