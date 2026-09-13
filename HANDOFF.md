# Project Handoff

_Last updated: 2026-09-13_

## What this is

`darshmo` is a Next.js 14 (App Router) site for **MODE**, a 1-on-1 fitness coaching business run by Darsh. It has the original marketing landing page (`src/app/page.tsx`) plus booking flow, and `/recipes`: an interactive recipe lead magnet meant to replace the Instagram bio link (currently pointing at an old food-tracker lead magnet that barely converts).

## Current state

**Uncommitted, content-complete, real photography wired in. Blocked on two things only: the real Brevo API key, and confirming the BBQ photo assumption below.** Build-tested (`npm run build` and `tsc --noEmit` both pass clean) and manually verified in-browser.

**What changed in the most recent session (BBQ method variant, two image bugs, Brevo):**
- **Recipe component methods generalized to support equal-option variants.** `RecipeComponent`'s `method: MethodStep[]` became `methods: MethodVariant[]` (each `{ id, label, steps, image? }`). A component with one entry renders exactly as before (no visible change). Recipe 4's kebab component now has two: "Air Fryer" (unchanged steps) and "BBQ" (new steps per the user's brief), rendered as a toggle in the method header, presented as equal options, not a primary+fallback. `resolveComponent()` in `sharedComponents.ts` normalizes shared components (flatbread, chutney) into the same one-item `methods` shape so `RecipeDetail` has one consistent shape to render regardless of origin.
- **Assumption made, needs user confirmation:** the user said a BBQ photo was in the source folder for recipe 4, but no new/separate BBQ-looking file exists there, only the same `Kebab.jpg` already wired in as recipe 4's photo, which itself already shows the kebabs cooking on an open-flame BBQ grill. Treated that existing photo as "the BBQ photo" the user meant, set it as the BBQ variant's `image` (the Air Fryer variant has no photo of its own, falls back to the recipe's default image, i.e. the same photo). If the user actually has a different, separate BBQ photo in mind, it needs to be located and swapped in.
- **Found the actual root cause of the recipe 5 "empty area" complaint: Next.js's own server-side image optimizer cache (`.next/cache/images/`) was serving a stale, pre-fix crop.** After republishing the recropped file (below), the live page kept showing the old framing because `/_next/image` responses came back with `X-Nextjs-Cache: STALE`, a browser hard-refresh would NOT have fixed this since it's a server-side cache, not a browser one. Fixed by `rm -rf .next/cache/images` and restarting the dev server, confirmed the header now reads `X-Nextjs-Cache: HIT` against the fresh file. **If a recipe image is ever swapped or recropped again, clear `.next/cache/images` and restart the dev server afterward**, otherwise old crops can keep being served indefinitely even though the file on disk is correct. In production this cache lives in the deployment platform's equivalent (e.g. Vercel's image cache), which typically busts automatically on redeploy, but worth keeping in mind if a live image update ever looks like it "didn't take."
- **Fixed a real, verified bug: Tandoori Chicken Thigh Burger's photo (recipe 5) was a dramatically more extreme portrait ratio than all four siblings** (0.563 vs 0.67-0.75 for the others), confirmed via `sips` dimensions on every published file. This made its card image object-cover-crop far more tightly/zoomed than its siblings, visibly mismatched side by side in the grid, verified before and after with a live screenshot comparison against the Lean Lamb Kebabs card in the same grid row. Fixed by re-cropping the source photo (`sips -c 3100 2252` on the original, centered crop, verified the full burger stays in frame with margin before publishing) to land at 0.727, in line with the other four, then republished to `public/recipes/tandoori-chicken-thigh-burger.jpg`.
- **Investigated recipe 3's "not centred" report thoroughly, found no reproducible container/CSS bug.** Checked computed layout at the actual card grid (forced 3-column via injected CSS, matches `lg:grid-cols-3`) and at the square detail crop (forced via injected CSS override, since this sandbox's `resize_window` tool does not actually change the browser viewport, confirmed via `window.innerWidth` staying fixed regardless of the resize call), and the image fills its box correctly, non-rotated, in both. Also chased what looked like a HEIC-rotation bug (Next's image optimizer serves the two HEIC-sourced photos, recipes 1 and 3, at swapped width/height versus their raw `sips`-reported pixel dimensions) down to a metadata inconsistency between `sips` and `file`/EXIF, but the real, live, browser-rendered image is unaffected and displays correctly, this was a dead end, not the bug. Did find and fix one genuine, related issue: `RecipeImage`'s `sizes` attribute was hardcoded to a value correct for the 2-column detail grid but wrong for the 3-column card grid (claimed 50vw at ≥768px when the actual card grid is 33vw at ≥1024px), which would serve a lower-resolution image than needed on desktop, now `RecipeCard` passes its own correct `sizes`. Also added a general-purpose `Recipe.imagePosition` (CSS object-position) field, threaded through `RecipeImage`/`RecipeCard`/`RecipeDetail`, and applied a small, best-effort refinement to recipe 3 (`"45% center"`) based on where the plate sits in frame. If it still looks off to the user (who can see the actual desktop rendering, unlike this sandbox), the fix is a one-line tweak to that value in `data.ts`, not a structural change.
- **Brevo unlock email: code was already fully correct and complete from an earlier session** (`sendAccessEmail(email, token)` in `src/lib/unlock/email.ts`, called via `issueAndSendAccess` in `src/lib/unlock/issueAndSend.ts`, wired into both `/api/unlock` and `/api/unlock/resend`). The only missing piece is a real `BREVO_API_KEY` value, there is none in this environment (`.env.local` doesn't exist, no matching env var set). Cannot proceed on this without the user supplying the actual key, it's a secret and must come from them, not be guessed or hunted for on disk.

**What changed in the session before that (photos + shopping list rules + recipe 1 edits):**
- **Real food photography wired in for all 5 recipes.** Source files were at `~/Desktop/Desktop/COACHING BUSINESS/AI_ CLAUDE/WEBSITE_AI/LEAD MAGNET/RECIPE PICTURES/` (2 HEIC, 3 JPEG, all genuine phone photos of the actual cooked dishes, not stock imagery). Converted HEIC to JPEG with macOS `sips`, resized every file to 1600px on the long edge, saved into `public/recipes/<slug>.jpg`, and set `image` on each recipe in `data.ts`. `RecipeImage`/`next/image` handles further optimization at request time, no component changes needed. If new/replacement photos ever land in that same source folder, redo the same `sips -s format jpeg -s formatOptions 85 --resampleWidth 1600` conversion into `public/recipes/`.
- **Shopping-list-only quantity rules added**, per explicit new spec: the shopping list can now diverge from the ingredient list for to-taste/range items, while the ingredient list and method keep the original wording untouched. Implemented via three new optional `Ingredient` fields (`excludeFromShoppingList`, `shoppingListAmount`/`shoppingListUnit`, `shoppingListLabel`) and a new `scaleShoppingListItems()` in `scaling.ts`, called separately from `scaleComponentIngredients()` in `RecipeDetail`. Concretely: salt and water/boiling water are dropped from every shopping list entirely; fresh chilli shows the top of its stated range as a whole number and scales with servings (`Math.ceil`, e.g. "3 fresh chillies" for a 2-3 range at 4 servings, "5 chillies" at 6 servings); curry leaves show a fixed "small pack" label that doesn't scale.
- **Chickpea flatbread's ghee amount is now exact** ("1 tsp, for cooking," was `toTaste`) and its method was rewritten per the updated brief (salt now blended in with the flour/water/coriander in one step, ghee heating combined into the pan step), 5 steps instead of 6.
- **Recipe 1 (chicken curry) gets its specified exact coaching note wording** ("Follow the spice measurements, they're a good starting point...") and a reworded step 10 for adding the boiling water gradually. Fresh chilli notes across all recipes that have it now say "chopped" per the updated ingredient wording.

**What changed in the session before that (data model + nutrition):**
- **Data model extended to support shared sub-recipes and multi-part recipes.** `Recipe.ingredients`/`method`/`optionalIngredients` (flat, single-part) replaced with `Recipe.components: RecipeComponent[]`, each either `{ kind: "custom", ingredients, method }` (e.g. "Bombay potatoes" as its own labeled section) or `{ kind: "shared", sharedComponentId }` referencing a `SharedComponent` defined once in `src/lib/recipes/sharedComponents.ts`. This is what lets the chickpea flour flatbread (recipe 1 and recipe 4) and the mint chutney (recipe 4 only) exist as single sources of truth instead of duplicated data. `RecipeDetail` renders one heading/ingredients/method block per component, only showing component titles when a recipe has more than one.
- **All 5 recipes now have final nutrition and locked ingredient quantities**, taken directly from the user's brief, not recalculated or estimated. `Recipe.nutrition` is no longer nullable, the old "being finalized" fallback UI in `NutritionPanel`/`RecipeCard` was removed since it's now dead code.
- **Scaling generalized for mixed base-servings and countable units.** `scaleComponentIngredients()` (`src/lib/recipes/scaling.ts`) scales a component's ingredients against its own base (the flatbread is written for a batch of 4, the mint chutney per single serving, i.e. `baseServings: 1`) and namespaces ingredient ids by component (`componentId__ingredientId`) so two components in one recipe can both have a "salt" line without colliding as shopping-list/checkbox keys. Pluralization (onion/bulb/bun/lemon/stick) now stays singular below 1 unit ("1/2 lemon", not "1/2 lemons").
- **Fixed a real bug**: `RecipesHeader`'s "Book a Call" button was using the site's neutral white `accent` token instead of the brand orange, contradicting the explicit brief requirement that every button on this page (including that one) uses the same orange as the rest of the site's CTAs. Now `bg-[#E8862B] hover:bg-[#D1751F]`, matching every other button on the page.
- **Fixed a content bug**: recipe 5 (Tandoori Chicken Thigh Burger) previously listed "Mint chutney" as an ingredient. The brief is explicit that mint chutney only ever appears with recipe 4. Removed from recipe 5; its serving suggestion now correctly offers "a sauce of your choice" instead.

**What's still not real, by design (unchanged from before):**
- No `BREVO_API_KEY` or `UNLOCK_SECRET` set anywhere in this environment. Dev/build/test so far has used a throwaway `UNLOCK_SECRET=devtestsecret` passed inline on the command line, never written to a file.
- Unlock email copy is still the placeholder in `src/lib/unlock/emailTemplate.ts` ("Here are your 5 recipes: {{link}}"), meant to be rewritten before launch.
- Logo is still whatever the main site already ships (`public/darshmode-logo-transparent.png`), the user said a logo would be provided separately, no new logo has landed yet.

## Key decisions

- **Nutrition data caveat (internal only, not on the public page):** the figures are calculated from standard ingredient nutrition data, not from the specific product brands that will actually be used (yoghurt, tandoori powder, and burger buns especially). Noted as a comment at the top of `src/lib/recipes/data.ts`. Treat as accurate estimates, not lab-tested figures. Never surface this caveat in the UI, the user was explicit it's internal-only.
- **Whole spice ranges stay "to taste," exact single quantities scale.** Where the brief gives a range ("2 to 3 fresh chillies", "4 to 5 cloves", "2 to 4 curry leaves", "300 to 400ml boiling water"), it's rendered as a to-taste pill with the range in the note rather than picking one number to scale, since a range has no single "true" amount to multiply. Everything given as one exact number (weights, tbsp/tsp spice amounts, tin sizes, bun/lemon counts) scales by simple multiplication as instructed.
- **Shared components use their own `baseServings`, not the parent recipe's.** The chickpea flatbread's ingredients are written for a batch of 4 (`baseServings: 4`, "makes 4, one per serving"), the mint chutney's for a single serving (`baseServings: 1`, "50g yoghurt" = one portion). Both scale correctly against the recipe's selected serving count because `RecipeDetail` passes each component's own base into the scaling call, not the recipe's.
- **Component-level nutrition (flatbread "per piece", chutney "per serving") is shown as a small info line under that component's method**, not summed into anything, it's informational since the recipe-level per-serving nutrition already accounts for it.
- **Stateless HMAC unlock token, no database.** Unchanged from the prior session, see `src/lib/unlock/token.ts`. A token is the visitor's email, HMAC-signed with `UNLOCK_SECRET`, so the same email always regenerates the same permanent link.
- **Built directly into the existing `darshmo` repo** (`~/Documents/GitHub/darshmo`, remote `github.com/darshmode/darshmo`), `/recipes` is a normal route here, not a separate app.
- **Orange hex is `#E8862B` / hover `#D1751F`**, confirmed from the main site's shipped `CtaButton` component (the "amber" variant), not approximated. Every button on `/recipes` uses this, including the header's "Book a Call" (fixed in an earlier session, see above).
- **Shopping list quantity rules only affect the shopping list**, per explicit instruction. The ingredient list and method always keep the original "to taste"/range wording, only the checkable shopping list underneath applies exclusions, top-of-range overrides, or fixed labels. This is why `scaleShoppingListItems()` is a separate function from `scaleComponentIngredients()` rather than a flag on the existing one, the two are allowed to diverge per ingredient.
- **Chilli's shopping-list override still scales with servings** (top-of-range number at `baseServings`, then `Math.ceil` after scaling), rather than being a flat constant, so doubling the recipe doubles the chilli count too, consistent with "never requires the user to manually calculate anything."

## Project structure

```
darshmo/
├── HANDOFF.md                       # this file
├── .env.local.example               # documents required env vars, not committed as .env.local
├── src/
│   ├── app/
│   │   ├── recipes/
│   │   │   ├── page.tsx             # server component, SEO metadata only
│   │   │   └── RecipesPageClient.tsx # all page interactivity/state lives here
│   │   └── api/unlock/
│   │       ├── route.ts             # POST: issue token + send unlock email
│   │       ├── resend/route.ts      # POST: same, for "get your link again"
│   │       └── verify/route.ts      # GET ?token=: validates a token's signature
│   ├── components/recipes/          # RecipeCard, RecipeDetail, NutritionPanel,
│   │                                 # ServingsSelector, IngredientList, ShoppingList,
│   │                                 # CoachingNote, UnlockGate, RecipeImage,
│   │                                 # RecipesHeader, RecipesHero, RecipesCta
│   └── lib/
│       ├── recipes/
│       │   ├── types.ts             # Recipe, RecipeComponent, SharedComponent, Ingredient types
│       │   ├── data.ts              # the 5 recipes, all recipe content lives here
│       │   ├── sharedComponents.ts  # flatbread + mint chutney, referenced by id from data.ts
│       │   │                        # (resolveComponent normalizes method(s) shape for RecipeDetail)
│       │   └── scaling.ts           # scaleIngredient(s), scaleComponentIngredients, scaleShoppingListItems, formatting
│       └── unlock/
│           ├── token.ts             # createAccessToken/verifyAccessToken (HMAC)
│           ├── email.ts             # sendAccessEmail, the only Brevo-specific file
│           ├── emailTemplate.ts     # placeholder unlock-email copy, swap before launch
│           ├── issueAndSend.ts      # shared by /api/unlock and /api/unlock/resend
│           └── useUnlock.ts         # client hook: localStorage + ?access= handling
(everything else unchanged from before this session, see prior HANDOFF history in git log)
```

## Open TODOs / known issues

- **Not committed yet.** Ask before committing/pushing, wasn't requested this session.
- **Blocking: `BREVO_API_KEY` needed from the user.** This is the only thing standing between the unlock flow and actually sending real emails, the code side is done (see above). Once given, put it in `.env.local` (never commit it) alongside a real `UNLOCK_SECRET` (`openssl rand -hex 32`), see `.env.local.example`.
- **Needs confirmation: is the existing kebab photo really "the BBQ photo"?** Asked the user to confirm the assumption made this session (see above). If there's a genuinely separate BBQ photo somewhere, find it and swap it into the `bbq` method variant's `image` in `data.ts` (recipe 4, kebabs component).
- **Logo still pending.** The user said the exact logo and any additional visual assets would be provided separately, check whether that's landed in `~/Desktop/Desktop/COACHING BUSINESS/AI_ CLAUDE/WEBSITE_AI/` (or wherever else) before launch, the page currently reuses the existing site's logo file.
- **Unlock email copy is placeholder** ("Here are your 5 recipes: {{link}}"), rewrite `src/lib/unlock/emailTemplate.ts` once the on-brand version is ready.
- **Instagram bio link swap is a manual action for the user**, not something done in this repo, do once `/recipes` is deployed and live.
- **No analytics wired up.** Nothing existed in the codebase to hook into (checked `layout.tsx` and found no analytics script anywhere on the existing site either), flagged but not built since it wasn't explicitly requested.
- Dev server was last run locally on port 3000 (`UNLOCK_SECRET=devtestsecret npm run dev`). Check whether it's still running before starting a new one.

## Useful references

- Brevo dashboard: SMTP & API > API Keys, for `BREVO_API_KEY`.
- Source recipe photos (originals, pre-conversion): `~/Desktop/Desktop/COACHING BUSINESS/AI_ CLAUDE/WEBSITE_AI/LEAD MAGNET/RECIPE PICTURES/`. The published, resized copies live in this repo at `public/recipes/`.
- Live site for visual reference: darshmode.com (deployed CSS is how the exact orange hex and Inter font were confirmed).
- No em dashes, ever: hard rule from `CLAUDE.md`/`AGENTS.md`, grep-checked clean across all recipe/unlock code.
- Node/npm environment: Node 24 via `nvm` (`~/.nvm`), no system Node, no Homebrew. Run dev with `PATH="/Users/darsh/.nvm/versions/node/v24.20.0/bin:$PATH"` if `nvm` isn't already active in the shell.

## How to resume

Tell Claude: "Read HANDOFF.md and continue."
