# SHAHID websites implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task by task. Steps use checkbox (`- [ ]`) syntax for tracking.
> The user approved the spec, asked to go straight to development, and will judge the finished sites directly. So there is no plan-review gate and no commits (the folder is not a git repo).

**Goal:** Build two self-contained, animated single-page sites for SHAHID Cooking Pastes (Concept A "Masak apa hari ni?" and Concept B "Mudah. Pantas. Sedap."), plus a chooser page.

**Architecture:** Static HTML, CSS and plain JS per site with no build step. Each site has its own copy of the data (`data.js`), the SVG pouch builder (`pouch.js`), pure helpers (`logic.js`) and DOM/animation wiring (`main.js`). The pure files attach to `globalThis.SHAHID`, so Node tests can `require()` them and the browser can load them as classic scripts (this works over `file://`).

**Tech stack:** GSAP 3.15.0 (core, ScrollTrigger, SplitText) and Lenis 1.3.26 from jsDelivr, and Google Fonts. Node 20 `node:test` for logic tests and Playwright (MCP) for visual/behaviour checks. Assets are prepared with Python PIL and opentype.js (scratchpad only).

**Spec:** `docs/superpowers/specs/2026-09-30-shahid-websites-design.md`

## Global constraints

- **Library versions:** GSAP `3.15.0`, Lenis `1.3.26`, all via `https://cdn.jsdelivr.net/npm/...`.
- **Fonts:**
  - A: Bagel Fat One, Sriracha, Be Vietnam Pro 400/500/600/700
  - B: Anybody (variable wdth 50–150, wght 100–900), Figtree 400/500/600/700/800
  - Both: Protest Riot, used only for the product name on the pouch
- **A colours:** `--kunyit-pale #FCEFC6`, `--kunyit #F4B223`, `--rendang #33180D`, `--cili #D8392B` (badges and accents only), `--santan #FFF9EC`, `--daun #4F7A2B` (herb doodles only).
- **B colours:** `--cili #E1251B`, `--cili-kering #3B0D0C`, `--kertas #F6EFE4`, `--kunyit #FFC53D`, `--santan #FFF4E2`, plus the 10 flavour colours from the spec's section 7.
- **Brand colours:** logo oval `#5F433F`, pack badge red `#A91F22`.
- **Paths and loading:** all paths are relative, with no ES modules and no `fetch()`, so the sites work when opened as files.
- **No dark theme** (user, 2026-09-30): no dark section, panel, menu or footer backgrounds. `--rendang` and `--cili-kering` are for text and outlines only. Flavour colours were updated: beriyani `#A3324A`, tomyam `#9C3478`.
- **No prices** anywhere.
- **Reviews:** first name and town, with initials-only avatars.
- **Assets:** photos from Unsplash/Pexels only; icons and SVG are hand-made, CC0 or MIT. Every source goes into `CREDITS.md`.
- **Responsive:** checked at 1440, 1024, 768 and 390px, with no horizontal overflow and 16px mobile gutters.
- **Contrast:** body text at least 4.5:1, a visible focus ring, and everything operable from the keyboard.
- **Motion:** one choreographed hero load per site. `prefers-reduced-motion` gets no Lenis, no pinning or scroll-driven animation, and no loops.
- **Graceful failure:** content must stay visible if the scripts don't load. Nothing is hidden by CSS alone. Pre-animation states are set only by JS, behind an `html.js-anim` class.

## Review focus

1. **Scripts blocked** (offline, CDN down, JS error): every section is still readable, and nothing is stuck at `opacity: 0`. The test is to load a page with CDN requests aborted and confirm that the hero headline and flavour names are visible.
2. **Fonts arriving late:** SplitText runs only after `document.fonts.ready`, so words don't wrap wrongly and the reveals don't jump. Confirmed by screenshots after a hard reload.
3. **Resizing or rotating the screen** during a pinned section (A's timer, B's lineup): positions recalculate through `ScrollTrigger.refresh()`, and nothing overlaps. Checked by resizing 1440 → 390 → 1440 and taking screenshots.
4. **Opening with `file://`:** links, images, the WhatsApp links (new tab) and fonts all work when `index.html` is double-clicked. Checked by loading via a `file:///` URL in Playwright.
5. **Awkward inputs to the decider and order builder:**
   - a single fridge chip that matches only one flavour
   - all chips cleared, which should make every flavour eligible
   - zero packs, which disables Send and explains why
   - quantity capped at 99
   - `&`, `#` or emoji in the name and note, which must be encoded in the link

   Covered by the `node:test` cases in Task 2 and the Playwright checks in Tasks 8 and 14.

---

### Task 1: Asset pipeline (logo, photos, pack art, icons)

**Files:**
- Create: `site-a-masak-apa/assets/img/logo-shahid.svg` (and the same in site-b)
- Create: `site-*/assets/img/photos/*.jpg` (resized to at most 1600px, about 250 KB or less)
- Create: `site-*/assets/img/pack-asam-pedas.jpg` (cropped to the pack)
- Create: `site-*/CREDITS.md`

- [ ] Script specimen: compare script fonts against the pack logo and pick the closest one.
- [ ] Use opentype.js (scratchpad `npm i opentype.js`) to turn "Shahid" into SVG paths inside a brown oval `#5F433F` with an inner ring, then save it as `logo-shahid.svg`.
- [ ] Search Unsplash (with the free-licence filter) or Pexels for:
  - each of the 10 dishes
  - a top-down bowl for the hero
  - three top-down bowls
  - chillies and spices
  - wok cooking
  - a family table
  - five UGC-style food shots

  Look at every candidate before using it. Download with `fm=jpg`, then resize and compress with PIL. Make portrait crops (700×1000) for the pouch windows.
- [ ] Crop the clean Asam Pedas pack art to the pack itself.
- [ ] Verify: open a contact sheet of all the processed images and check each for subject, quality and file size.

### Task 2: Shared data, pouch builder and logic (with tests)

**Files:**
- Create: `site-a-masak-apa/assets/js/data.js`, `pouch.js`, `logic.js` (and copies in site-b)
- Test: `tests/logic.test.js`

**Interfaces (produced):**
- `SHAHID.config = { whatsapp: '60123456789', whatsappDisplay: '+60 12-345 6789', store: {name, area, city, state, mapsUrl}, hours, socials: {instagram, facebook, tiktok} }`
- `SHAHID.flavours: Array<{ id, pack, en, short, add: 'air'|'santan'|'susu sejat', addLabel, serves, color, textOn: 'light'|'dark', heat: 1|2|3, minutes, proteins: string[], bestWith, desc, photo, packArt? , sticker? }>` holds all 10 flavours, in the client's order.
- `SHAHID.logic.eligible(flavours, selectedProteins) → flavour[]`. An empty selection means all flavours are eligible. Otherwise a flavour is eligible if any of its proteins is selected.
- `SHAHID.logic.spinTarget(currentDeg, index, count, jitterDeg, turns) → deg`. The end rotation that puts slice `index` under a pointer at the top, and is always greater than `currentDeg + turns*360`.
- `SHAHID.logic.waLink(number, text) → 'https://wa.me/<number>?text=<encoded>'`
- `SHAHID.logic.orderMessage({name, area, mode, note, items:[{pack, qty}]}) → string`. Items with qty 0 are dropped, and the total pack count is included.
- `SHAHID.logic.clampQty(n) → integer 0..99`
- `SHAHID.pouch(flavour, {uid, size}) → SVG string`. Contents: serrated seal, hang hole, ribbon in the flavour colour, oval logo, name in Protest Riot, red badges, photo window, 220g. If `flavour.packArt` is set, the real pack art sits inside the same frame instead.

- [ ] Write failing tests in `tests/logic.test.js`:
  - eligible: empty, single chip, several chips
  - spinTarget: lands the slice centre under the pointer (±jitter) for every index, and increases monotonically
  - waLink: encodes `&`, `#`, newlines and emoji
  - orderMessage: drops qty 0, sums the total, includes the optional lines only when present
  - clampQty: handles -1, 0, 5, 99, 150 and 'abc'
  - pouch: returns an `<svg` string containing the pack name and flavour colour, and uses unique ids per call
- [ ] Run `node --test tests/` and confirm the tests fail.
- [ ] Implement `data.js`, `logic.js` and `pouch.js` as IIFEs that attach to `globalThis.SHAHID`.
- [ ] Run `node --test tests/` again and confirm they pass.
- [ ] Render all 10 pouches on a scratch page in Playwright and look at the screenshot.

### Task 3: Site A structure, tokens, header, hero, marquee

**Files:** create `site-a-masak-apa/index.html` and `assets/css/style.css`.

- [ ] Semantic skeleton for every section, in spec order, with real copy and one h1.
- [ ] Tokens, base type scale, buttons, the wave joins, the top bar, the centred header, and the floating pill nav markup.
- [ ] Hero: headline, sub-line, buttons, pack cluster (pack art plus two pouches), doodles, notes with arrows, steam.
- [ ] Marquee with chilli separators, pausing on hover.
- [ ] Verify: screenshot at 1440 and 390. Check the headline fits, the packs are cropped by the bottom edge as designed, and there is no overflow.

### Task 4: Site A flavour grid and pack-to-plate timer

- [ ] Flavour grid: two photo cards (Asam Pedas, Rendang), eight small cards with pouches, and a "Can't decide?" card. "Order this" goes to `waLink`. Mobile uses 1 column for the big cards and 2 for the small ones.
- [ ] Timer panel: rolling odometer digits, four step tabs, a progress bar per tab. Desktop pins and scrubs with the scroll. Mobile uses tabs you tap.
- [ ] Verify: screenshots, and on mobile, tapping a tab changes the digits and the step text.

### Task 5: Site A dinner decider

- [ ] Fridge chips (`aria-pressed`), a plate SVG with 10 slices (enamel rim and a ladle pointer), a "Pusing!" hub button, the result card with an empty state, and an `aria-live` announcement.
- [ ] Spinning uses `logic.spinTarget`, a small wobble at the end, and a ladle tick at each slice boundary. Reduced motion jumps straight to the result.
- [ ] Verify with Playwright: select "Ikan", spin, and confirm the result is one of the fish-eligible flavours. Clear all chips, spin, and confirm any flavour can come up.

### Task 6: Site A receipt, trust stamps, reviews, find us, footer, menus

- [ ] Receipt that prints downward when it scrolls into view, and circular trust stamps (SVG textPath).
- [ ] Review carousel (3 sample quotes) with arrow buttons and keyboard support.
- [ ] Find-us cards (store card with a Maps link, WhatsApp, hours, stockist, photos), the footer, the floating pill nav that appears after the hero, and the mobile menu overlay.
- [ ] Verify with screenshots at 1440 and 390.

### Task 7: Site A motion and fallbacks

- [ ] Hero load timeline as in the spec, section heading reveals (SplitText after `fonts.ready`), card staggers, doodles drawing themselves, Lenis working with ScrollTrigger, and anchor links scrolling through Lenis.
- [ ] Reduced-motion branch, loops that pause off screen, and the `html.js-anim` guard.
- [ ] Verify: Playwright console shows zero errors. With CDN requests aborted, the content is still visible. With reduced motion emulated, the final states show.

### Task 8: Site A QA pass

- [ ] Full-page screenshots at 1440, 1024, 768 and 390, section by section. Fix any issues.
- [ ] Checks for horizontal overflow, focus-ring visibility, and anchors landing on their sections. Load it over `file://`.

### Task 9: Site B structure, tokens, header/menu, hero

**Files:** create `site-b-mudah-pantas-sedap/index.html` and `assets/css/style.css`.

- [ ] Skeleton for every section, tokens, Anybody width variable (`--wdth`), pill buttons with a hard shadow, and serrated joins (plus one tear line with scissors below the hero).
- [ ] Header (menu circle, logo, "Order now") and the full-screen menu with a pouch preview.
- [ ] Hero: stacked words, a spinning bowl photo, the pouch, floating spices (flat SVG), the spinning sticker, and the corner texts.
- [ ] Verify with screenshots at 1440 and 390.

### Task 10: Site B statement, bowls row, lineup

- [ ] Statement headline with inline photo pills, the stockist line between rules, and three circular bowls with parallax.
- [ ] Lineup: an intro panel and 10 flavour panels. Desktop pins a sideways track, blends the background between flavour colours based on scroll progress, animates each name's width in, turns the pouch, and shows a counter and progress bar. Mobile uses a scroll-snap carousel with an IntersectionObserver counter.
- [ ] Verify with screenshots at several scroll positions, and check the text/background contrast on each panel.

### Task 11: Site B how-it-works, recipes, reviews, UGC

- [ ] Three step rows whose word width follows the scroll, and looping SVG mini illustrations that play only while in view.
- [ ] Recipe cards whose "See steps" expands the card, with `aria-expanded`.
- [ ] Reviews on a photo background with the quote card, flower avatars and arrows.
- [ ] Tilted UGC cards that straighten on hover and drift with scroll.

### Task 12: Site B order builder, marquee, footer

- [ ] Form with steppers (clamped to 0–99), the pickup/delivery toggle, and a live total. Send stays disabled with a reason until at least 1 pack is chosen. It opens `waLink(orderMessage(...))`.
- [ ] Velocity-reactive giant marquee, and a footer with the giant script logo rising in as you scroll.
- [ ] Verify with Playwright: add 2 Rendang and 1 Asam Pedas with the name "Mei & Co #1", then check the generated URL decodes to the expected message.

### Task 13: Site B motion and fallbacks

- [ ] Hero load timeline (word slams with width stretch, bowl spin-in, pouch drop, spices scatter, sticker), heading reveals, the reduced-motion branch, and the `js-anim` guard.
- [ ] Verify: zero console errors, content visible with CDN requests aborted, and final states shown under reduced motion.

### Task 14: Site B QA pass

- [ ] Same checks as Task 8.

### Task 15: Chooser page, READMEs, final verification

- [ ] Root `index.html` split screen (hover widens a half, stacks on mobile).
- [ ] A `README.md` per site (how to edit `data.js`, the placeholder list, how to deploy) and a finished `CREDITS.md`.
- [ ] Final run of `node --test`, a Playwright sweep of all three pages, and cleanup of any stray tool folders in the project.
