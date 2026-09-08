# Project Handoff

_Last updated: 2026-09-08_

## What this is

`darshmo` is a Next.js 14 (App Router) marketing site for **MODE**, a 1-on-1 fitness coaching business run by Darsh. Single long landing page (`src/app/page.tsx`) composed of a sticky header, 9 content sections, and a bottom trust-badges/logo footer. Booking is a two-page flow (`/book` then `/schedule`), not a modal. Built through several rounds of chat-dictated change specs on top of an initial build; there is no separate written spec doc, each round came in as a numbered list in chat.

## Current state

The page reflects the latest ("v4") spec. `npm run dev` runs clean; every major change in this pass was verified live in-browser (see Key decisions for exactly what was tested). **Everything is committed and pushed**: `main` is up to date with `origin/main` (`https://github.com/darshmode/darshmo`) at commit `18e4827`, working tree clean. Section by section:

1. **Header** (`Header.tsx`): sticky, transparent MODE logo top-left, 3 nav tabs (Testimonials / Results / Transformations) in white, sized up (`text-lg sm:text-xl`) to better match the logo's visual weight. "Book a Call" is a plain Next.js `Link` to `/book` (no modal, no external link).
2. **Hero** (`Hero.tsx`): full-bleed video fills the entire viewport (`h-[100svh]`) as the background, `object-cover`. Headline "Doing all the right things, but still not seeing your body change?" and subhead sit in a bottom gradient-overlay block, centered, with the CTA. Mute toggle top-right. CTA uses a one-off amber color (`variant="amber"` on `CtaButton`, `#E8862B`/`#D1751F` hover) distinct from the site's white accent used everywhere else.
3. **Empathy, WhoForNotFor**: unchanged from earlier passes.
4. **Testimonials** (`Testimonials.tsx`): Riley and Francy quotes updated to the latest copy. 4 WhatsApp screenshots (`rochelle.png`, `vish_1.png`, `james_1.png`, `kapil.png`) enlarged (`w-64 sm:w-72 md:w-80`) and each has an amber highlighter-box over its standout sentence, via the new shared `SocialProofShot` component.
5. **Pull-Up Progression** (`PullUpProgression.tsx`): captions replaced with full sentences about Francy's and Cody's progress (previously just "1 → 7 REPS" style labels).
6. **Real Results Gallery** (`ResultsGallery.tsx`): now 2 rows of 6 photos each (12 total, `sm:grid-cols-6`), including Veena and Cody folded into the existing rows.
7. **Comparison Table** (`ComparisonTable.tsx`): full grid borders (`border border-edge` on every cell) and a continuous grey highlight (`bg-surface/60`) across the entire MODE column from header to last row. Rows/columns match the latest spec ("What matters" / Cheap App / Generic Online Coach / MODE).
8. **Your Story** (`YourStory.tsx`): heading "From a 20kg Overweight Optometrist With Lower Back Pain, to Coach", centered full-width 3-paragraph copy ("9-5" not "nine-to-five"), optometrist photo (landscape) side by side with `darsh-profile.jpg` (the current physique/profile photo, square). No expand/collapse, no raw story text, `before-darshmode.jpg` no longer used anywhere.
9. **SocialProofBlock** (5 more WhatsApp screenshots, standalone section before FAQ): `umesh_1.png`, `penn_1.png`, `vish_2.jpg`, `damon_1.png`, `james_2.png`, same highlighter treatment.
10. **FAQ, trust badges, footer**: unchanged from earlier passes.
11. **Booking flow, fully rebuilt this pass**: `BookingModal.tsx` (the old 9-question custom form + Calendly-widget modal) is deleted entirely. Now:
    - Every CTA (`CtaButton`, header) is a Next.js `Link` to `/book`.
    - `/book` (`src/app/book/page.tsx`) embeds the actual Tally form (`https://tally.so/embed/81BMPo?...`) in an iframe via Tally's `embed.js` widget script, styled to match the site (dark page, white card, MODE logo).
    - `/book` listens for the `Tally.FormSubmitted` `postMessage` event and calls `router.push('/schedule')` automatically on successful submission, no manual button needed.
    - `/schedule` (`src/app/schedule/page.tsx`) embeds Calendly inline (`Calendly.initInlineWidget`, same API as the old modal), pointed at `https://calendly.com/darsh-jkyh/30min`.
    - The whole flow (CTA click → fill form → submit → pick a time) stays on the darshmode domain, no new tabs, no redirect to tally.so or calendly.com.

## Key decisions

- **Booking flow went through two iterations this session.** First pass: Tally form as a plain external link (`target="_blank"` to `https://tally.so/r/81BMPo`), because the user's spec said CTAs "link to" the Tally URL and Tally "handles the full flow internally." Tested and confirmed the external-link version worked end to end (form → Tally's own thank-you page → their "Continue to Booking" link → Calendly). The user then explicitly asked to keep everyone on the darshmode site instead ("I still want it all on the darshmode website. Not to take them off"), so it was rebuilt as the two-page embed described above. Both versions were verified live with real test submissions before landing on the embed approach.
- **Found and fixed a real CSS bug while updating WhatsApp screenshot highlights.** The highlight boxes are positioned with `top`/`height` in `%`, meant to be relative to the screenshot image's own rendered height. But the flex containers in `Testimonials.tsx` and `SocialProofBlock.tsx` used the default `align-items: stretch`, which stretched every card's wrapper `<div>` to match the tallest card in its row (since screenshots have varying aspect ratios). That inflated the percentage base and threw highlight boxes onto empty space below the intended text. Fixed by adding `items-start` to both flex containers. Confirmed via `getBoundingClientRect()` in the live page before and after the fix. Any future highlight-box work on these components should rely on this being in place, don't reintroduce `items-stretch`/default alignment on that container.
- **Highlight-box coordinates are hand-measured per screenshot**, computed from each source image's native pixel dimensions (line-by-line reading of the screenshot), not derived from any OCR or text-detection. If a screenshot file is ever replaced, its highlight box will need to be re-measured the same way.
- **"James's 'Over 24kg down' message" (from the user's spec) was actually a mislabeled reference to `vish_2.jpg`**, not a James screenshot, matching text was found only in the second bubble of `vish_2.jpg`. Highlighted there instead of on `james_2.png`, flagged to the user rather than silently guessing.
- **Your Story's "physique photo" is `darsh-profile.jpg`**, not `darsh.jpg`. The user asked to replace the topless photo with "darshmode_profile pic", traced to `/Users/darsh/Desktop/.../DARSHMODE/profile picture.heic`, which turned out to be pixel-identical (2316x2316) to the already-in-repo `public/darsh-profile.jpg`, so no new asset was needed. `darsh.jpg` is now unused/orphaned (left on disk, not deleted).
- **No em dashes, ever**: unchanged hard rule from `CLAUDE.md`. Grep-checked clean across `src/` after every pass this session.
- **Global font is Inter everywhere** (headings and body); this was already true going into this session, not changed.

## Project structure

```
darshmo/
├── CLAUDE.md                     # project rules: no em dashes, ever
├── HANDOFF.md                    # this file
├── .claude/skills/save/          # this handoff skill
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Inter font, dark theme
│   │   ├── page.tsx              # the main landing page, no more BookingModalProvider wrapper
│   │   ├── globals.css
│   │   ├── book/page.tsx         # NEW: embedded Tally form, "use client", posts to /schedule on submit
│   │   └── schedule/page.tsx     # NEW: embedded Calendly widget
│   └── components/
│       ├── Header.tsx            # CTA is a Link to /book now, no modal hook
│       ├── Hero.tsx               # full-bleed video hero, amber CTA
│       ├── Empathy.tsx, WhoForNotFor.tsx, ComparisonTable.tsx, Faq.tsx
│       ├── Testimonials.tsx      # updated quotes, highlighter boxes
│       ├── SocialProofShot.tsx   # NEW: shared component, image + highlighter overlay
│       ├── SocialProofBlock.tsx  # updated highlighter boxes
│       ├── PullUpProgression.tsx # new full-sentence captions
│       ├── ResultsGallery.tsx    # 2 rows of 6 now
│       ├── YourStory.tsx         # rewritten, darsh-profile.jpg, no expand/collapse
│       ├── CtaButton.tsx         # CTA is a Link to /book now; variant="amber" for hero
│       └── Section.tsx
│   (BookingModal.tsx deleted this session, no longer exists)
├── public/
│   ├── darshmode-logo-transparent.png
│   ├── optometrist.jpg, darsh-profile.jpg   # used in Your Story
│   ├── darsh.jpg                 # now orphaned/unused, left on disk
│   ├── before-darshmode.jpg      # now orphaned/unused, left on disk
│   ├── social-proof/             # 9 real WhatsApp screenshots, all have highlighter boxes
│   ├── gallery/                  # 12 transformation photos (incl. veena.png, cody.png)
│   ├── videos/                   # all H.264, ~102MB total
│   └── logo-mode.png, logo-text.webp, logo.webp  # orphaned/unused
└── tailwind.config.ts
```

## Open TODOs / known issues

- **A handful of orphaned asset files remain on disk, never referenced in `src/`**: `public/darsh.jpg`, `public/before-darshmode.jpg`, `public/logo-mode.png`, `public/logo-text.webp`, `public/logo.webp`. Awaiting a delete decision from the user (asked previously, not yet answered).
- **Test data exists in both the Tally dashboard and as an actual Tally form response** (a couple of submissions from this session, e.g. "Test Submission (embed check)" / `sitetest@example.com`), created while verifying the booking flow end to end. The user may want to delete these from their Tally dashboard.
- **Node/npm environment**: Node 24 LTS via `nvm` (`~/.nvm`), no system Node, no Homebrew.

## Useful references

- Source copy/assets folder (outside this repo): `/Users/darsh/Desktop/Desktop/COACHING BUSINESS/AI_ CLAUDE/WEBSITE_AI/`.
- Tally form: `https://tally.so/r/81BMPo` (form ID `81BMPo`), embedded at `/book`.
- Calendly booking link: `https://calendly.com/darsh-jkyh/30min`, embedded at `/schedule`.
- This handoff is generated by the `/save` skill (`.claude/skills/save/`). Run it again any time to refresh this file.

## How to resume

Tell Claude: "Read HANDOFF.md and continue."
