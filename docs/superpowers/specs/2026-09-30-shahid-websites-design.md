# SHAHID Cooking Pastes: two website concepts (design spec)

Date: 2026-09-30. Status: awaiting your review.

## 1. Goal

Two alternative single-page marketing sites for SHAHID Cooking Pastes, built for a pitch. The client sees both and picks a direction. Each must feel premium, animated and clearly its own, not templated.

**The page's job:** make the 10 pastes look delicious, show how little effort they take, then send people to buy at Berkat Sauda Supply (Taman Idaman, Kluang) or order on WhatsApp.

**Audience:** Malaysian home cooks (busy parents, young adults cooking for family), mostly in Johor. Copy is English, with the Malay phrases that are printed on the packs.

**Decisions already made (2026-09-30):** one concept per reference (A after Mello, B after Umami); free stock photos as stand-ins; plain HTML/CSS/JS with GSAP; the palettes, fonts and signature features below.

**No dark theme (your request, 2026-09-30):** no section, panel, menu or footer has a dark background. Dark brown and maroon are used only for text, outlines and small UI details. Both sites stay light and bright.

## 2. Facts we use in copy

From the client's text and the two pack photos:

| Pack name | English name | What you add (pack badge) | Servings | Ribbon colour |
|---|---|---|---|---|
| Pes Beriyani Batu Pahat | Batu Pahat beriyani paste | Tambah Susu Sejat Saja (evaporated milk) | 4–5 | maroon |
| Pes Masak Merah | Masak merah (spicy tomato) paste | Tambah Air Saja | 4–5 | mustard |
| Pes Kari Daging | Beef curry paste | Tambah Santan Saja | 4–5 | amber |
| Pes Asam Pedas | Asam pedas paste | Tambah Air Saja | 4–5 | orange |
| Pes Lemak Cili Api | Lemak cili api (creamy Thai chillies) paste | Tambah Santan Saja | 4–5 | green |
| Pes Rendang | Rendang paste ("Resepi Baru" sticker) | Masukkan Santan Saja | 4–5 | red |
| Pes Tomyam | Tomyam paste | Tambah Air Saja | 4–5 | plum |
| Pes Mi Bandung | Mi bandung paste | Tambah Air Saja | 3–4 | magenta |
| Pes Soto | Soto paste | Tambah Air Saja | 4–5 (assumed, not legible) | olive |
| Pes Sambal Tumis Serbaguna | All-purpose sambal tumis paste | Tambah Air Saja | 3–4 | lime |

Printed on every pack: 220g net weight, Halal JAKIM (MS 1500), MeSTI, Keluaran Bumiputera, Produk Muslim, Buatan Malaysia. The logo is a white script "Shahid" in a brown oval (`#5F433F`). Badges are red circles (`#A91F22`).

## 3. Placeholders

Each site keeps these in one file (`assets/js/data.js`), and each README lists them:

- **Logo:** recreated as an SVG oval badge. Replace with the client's vector logo.
- **Product shots:** SVG pouches drawn from the real pack layout, with a dish photo in the window like the real packs. The clean Asam Pedas pack artwork is used as it is. Replace with transparent PNG pack shots.
- **Dish and lifestyle photos:** free stock photos (Unsplash or Pexels), credited in `CREDITS.md`.
- **Contact details:** WhatsApp number (`+60 12-345 6789`), opening hours, full address, social handles.
- **Cooking details:** cooking times, heat levels and "best with" pairings. These come from general cooking knowledge and need confirming.
- **Reviews:** sample quotes signed with a first name and town. Any avatars show initials, never stock faces posing as customers.
- **Brand story, stockist/agent programme, prices:** prices are not shown anywhere.
- **Halal and MeSTI logos:** text badges until the official artwork arrives.

## 4. Deliverables and folders

```
SHAHID/
  index.html                  concept chooser, links to A and B
  site-a-masak-apa/           Concept A
    index.html
    assets/css/style.css
    assets/js/data.js         flavours + contact placeholders
    assets/js/pouch.js        SVG pouch builder
    assets/js/main.js         animation + interactions
    assets/img/               photos, pack art, logo
    README.md                 how to edit, placeholder list
    CREDITS.md                photo and icon sources
  site-b-mudah-pantas-sedap/  Concept B, same layout
  docs/superpowers/specs/     this spec
```

There is no build step. Open `index.html` in a browser, or drag the folder onto Netlify. Each site is self-contained with no shared folder, so either one can be deployed alone.

## 5. Shared technology

- HTML, CSS (custom properties, `clamp()` fluid type, CSS grid) and plain JavaScript.
- GSAP 3.15.0 with ScrollTrigger and SplitText (all free since 3.13), plus Lenis 1.3.26 for smooth scrolling, loaded from jsDelivr.
- Google Fonts (listed per site below).
- **Pouch builder (`pouch.js`):** draws an SVG pouch from one flavour's data. It includes:
  - the serrated top seal and hang hole
  - a corner ribbon in the flavour colour with the pack name
  - the brown oval logo and a brush-style product name
  - red "Tambah … Saja" and servings badges
  - the dish photo in the window, and "220g"

  Both sites use the same builder.
- **Icons:** hand-drawn SVG doodles (chilli, star anise, lemongrass, steam, arrows, hearts, sparkles), the WhatsApp mark from Simple Icons (CC0), and a few UI icons from an MIT-licensed set (Phosphor or Lucide).
- **Photos:** downloaded, resized to at most 1600px wide, compressed to about 250 KB or less each, and lazy-loaded below the fold.

## 6. Concept A: "Masak apa hari ni?" (warm and playful, after Mello)

### Tokens

| Token | Value | Used for |
|---|---|---|
| `--kunyit-pale` | `#FCEFC6` | page background |
| `--kunyit` | `#F4B223` | bright blocks, marquee, highlights |
| `--rendang` | `#33180D` | text, outlines, small UI details (never a section background) |
| `--cili` | `#D8392B` | badges, stickers, the timer panel |
| `--santan` | `#FFF9EC` | cards |
| `--daun` | `#4F7A2B` | herb doodles only |

- **Type:** Bagel Fat One for headings, Sriracha for handwritten notes and section intros, Be Vietnam Pro 400/500/600 for body text and UI.
- **Scale:** h1 `clamp(3.25rem, 8.5vw, 8.5rem)` at line-height 0.95; h2 `clamp(2.5rem, 5.5vw, 5rem)` at line-height 1; body 17px at line-height 1.6.
- **Shapes:** 2px rendang-brown outlines on cards and buttons, 28px card corners, pill buttons. Sections join with a soft, irregular wave (a "gravy line"), not Mello's slant.
- **Layout:** the hero is centred. Other sections open with a heading on the left and a short line on the right, following Mello's rhythm. Content sits in a 1240px container with 16px side gutters on mobile.

### Sections, in order

1. **Top bar:** "Berkat Sauda Supply, Kluang ✿ Halal JAKIM ✿ 10 flavours, just add water".
2. **Header:** logo in the centre, links (Flavours, How it works, Find us) and an "Order on WhatsApp" button. It shrinks into a floating pill on scroll, and has its own mobile menu.
3. **Hero:**
   - Headline "All the rempah. None of the pounding.", a sub-line, and two buttons (Find your flavour / Order on WhatsApp).
   - A cluster of packs rises from the bottom (the Asam Pedas pack art plus two SVG pouches), with steam curling up.
   - Doodles (star anise, chilli) and handwritten notes with drawn arrows ("Johor's favourite", "tambah air saja!").
   - **Load sequence (the page's one big choreographed moment):** logo pops in, headline words drop in with a bounce, doodles draw themselves, buttons fade up, packs rise and settle, arrows draw, notes write themselves in.
4. **Marquee:** flavour names and pack promises separated by chillies. Pauses on hover.
5. **Flavour grid:** "Pick tonight's flavour".
   - Two large photo cards (Asam Pedas, Rendang) and eight smaller cards tinted in each flavour's colour.
   - Small cards show the pouch, name, "add" badge, servings and heat.
   - On hover the pouch lifts and tilts.
   - Every card has "Order this", which opens WhatsApp with the flavour already filled in.
6. **Pack-to-plate timer:**
   - A chilli-red panel with giant cream digits that roll (00:00 → 00:02 → 00:05 → 00:08 → 00:20).
   - Four steps: Tumis the paste, Add your protein, Add water or santan, Makan!
   - On desktop the panel stays pinned while scrolling moves the timer. On mobile you tap the step tabs instead.
7. **Dinner decider (the signature feature):** set on a full turmeric background. "Tak tahu nak masak apa?"
   - Fridge chips (Ayam, Ikan, Daging, Udang, Telur, Sayur) can be combined, and they dim any flavour that doesn't match.
   - A plate split into 10 flavour-coloured slices, with a ladle as the pointer.
   - "Pusing!" spins the plate, which slows to a stop with a small wobble.
   - The result card shows the pouch, what to add, pairings, heat, servings, "Order this pack" and "Spin again".
   - Screen readers hear the result announced.
8. **Why Shahid + receipt:** "Things that make weeknights easier."
   - A receipt from "Dapur Shahid" prints downward when it scrolls into view. Lines: Rempah, ready-made ✓ / Pounding time 0 min / Cooking ±20 min / Plates cleaned 5 / TOTAL: one happy family. Then a barcode and "Terima kasih!".
   - A row of trust badges: Halal JAKIM, MeSTI, Bumiputera, Made in Malaysia, 220g.
9. **Reviews:** a large quote carousel with arrows, a star rating, and name plus town (sample content).
10. **Find us:** a light (cream) section of mixed-size cards in turmeric, red and white: Berkat Sauda Supply (with an "Open in Google Maps" link), WhatsApp, opening hours, "Stock Shahid in your shop", and two photo cards.
11. **Footer:** logo, link columns, socials, © 2026.

## 7. Concept B: "Mudah. Pantas. Sedap." (bold and fiery, after Umami)

### Tokens

| Token | Value | Used for |
|---|---|---|
| `--cili` | `#E1251B` | hero, marquee, primary buttons |
| `--cili-kering` | `#3B0D0C` | text and outlines (never a section background) |
| `--kertas` | `#F6EFE4` | light sections |
| `--kunyit` | `#FFC53D` | stickers, highlights |
| `--santan` | `#FFF4E2` | text on red or colour panels, cards |

**Flavour colours** (used for the lineup panels and pouch ribbons):

| Flavour | Colour |
|---|---|
| Beriyani (raspberry maroon) | `#A3324A` |
| Mi Bandung (magenta) | `#C8317A` |
| Sambal Tumis (lime) | `#8DB03A` |
| Tomyam (plum) | `#9C3478` |
| Masak Merah (mustard) | `#E2A92B` |
| Rendang (red) | `#C8302B` |
| Asam Pedas (orange) | `#EE5A21` |
| Kari Daging (amber) | `#D9891F` |
| Soto (olive) | `#B3A532` |
| Lemak Cili Api (green) | `#2F8A4E` |

- **Type:** Anybody for display: uppercase, weight 800–900, with the width animated between 55 and 110. Figtree 400/500/700 for body text and UI. Buttons use sentence case.
- **Scale:** h1 `clamp(4rem, 13vw, 12rem)` at line-height 0.85; h2 `clamp(2.75rem, 7vw, 6.5rem)` at line-height 0.9; body 17px at line-height 1.55.
- **Shapes:** sections join with the pouch's serrated seal edge and a small tear notch. Flower and sunburst stickers. Pill buttons with a hard 4px bottom shadow that presses down on click.

### Sections, in order

1. **Header:** a round menu button that opens a full-screen turmeric menu with a flavour-coloured preview, the logo in the centre, and an "Order now" pill. It sits transparent over the hero and turns solid on scroll.
2. **Hero:** red background.
   - MUDAH. / PANTAS. / SEDAP. stacked huge on the left.
   - On the right, a bowl photo seen from above, spinning slowly, with a pouch in front.
   - Chilli, star anise, lemongrass and garlic float and follow the mouse.
   - A spinning sticker reads "10 flavours, Halal". The corners read "Made in Malaysia" and "At Berkat Sauda Supply, Kluang".
   - **Load sequence:** the words slam in one at a time, stretching from narrow to wide; the bowl spins in; the pouch drops with a bounce; the spices scatter into place; the sticker spins in.
3. **Statement:** "TEN PASTES [photo pill] ZERO POUNDING [photo pill] ALL THE FLAVOUR."
   - Sub-copy, the stockist line between two rules, and a button.
   - Below it, a row of three large round bowl photos drifting at different speeds.
4. **The lineup (the signature feature):** a pinned sideways scroll through all 10 packs.
   - Each panel fills the screen in its flavour colour, and the background blends from one colour to the next.
   - A giant outlined name sits behind a big pouch that turns as you scroll.
   - The name stretches in, followed by badges (what to add, servings, heat), a "best with" list and "Order this".
   - A 01/10 counter and a progress bar.
   - On mobile it becomes a swipeable carousel instead of a pinned scroll.
5. **How it works:** three huge rows, 1 TUMIS / 2 TAMBAH / 3 MAKAN. Each has a looping mini illustration: paste sizzling in a kuali, water or santan pouring, a bowl steaming.
6. **Cook this week:** on a turmeric background, three recipe cards (Asam pedas ikan tenggiri, Rendang daging, Mi bandung Muar).
   - Each has a time block, title, one-line description and a photo in a circular cut-out.
   - "See steps" expands the card to show 4 steps.
7. **Reviews:** on the Asam Pedas orange, a big cream quote card, flower-shaped avatars showing initials, and arrows.
8. **#MasakDenganShahid:** tilted photo cards that straighten on hover and shift as you scroll.
9. **Order builder:** "Build your order".
   - Fields: name, area, pickup or delivery, a +/− quantity control for each of the 10 flavours, and a note.
   - A live pack count.
   - "Send on WhatsApp" opens WhatsApp with the order written out.
10. **Marquee:** a giant red band of flavour names with round pouch icons between them. It speeds up and leans as you scroll faster.
11. **Footer:** chilli red, joined to the marquee band, with columns (Flavours, Find us, Follow) and a giant cream "Shahid" script logo cut off by the bottom edge.

## 8. Chooser page

One screen split in two: Concept A (turmeric) and Concept B (red). Each half shows its headline, a three-word description and an "Open concept" link. Hovering a half widens it. On mobile the halves stack vertically.

## 9. Motion rules (both sites)

- **One big load moment:** each site has one choreographed hero sequence. After that, everything is triggered by scrolling or by the user.
- **Reveals:** section headings reveal word by word (SplitText) and cards stagger in once. Not every element fades up.
- **Loops:** the marquee, steam, floating spices and spinning bowl pause when off screen.
- **Easing:** A is bouncy (`back.out`, with an elastic stop for the wheel). B is punchy (`expo.out`, `power4`).
- **Reduced motion:** when `prefers-reduced-motion` is set, there is no Lenis, no pinning or scroll-driven animation, and no loops. Content appears in its final state, and the wheel jumps straight to its result.

## 10. Quality bar

- **Responsive:** checked at 1440, 1024, 768 and 390px, with no horizontal scroll and 16px side gutters on mobile.
- **Accessibility:**
  - one h1 per page, with headings in order
  - alt text on photos; decorative SVGs hidden from screen readers
  - visible keyboard focus, and every interaction works from the keyboard
  - body text contrast of at least 4.5:1
- **Performance:** hero assets load first and everything else lazy-loads. Each page stays under about 3 MB in total.

## 11. How we'll check it

Using Playwright on each page:

- screenshots of every section at desktop and mobile sizes
- zero console errors and no horizontal overflow
- a pass with reduced motion turned on
- the decider's result matches the selected fridge chips
- the order builder produces the correct WhatsApp link
- every in-page link lands on its section

## 12. Out of scope

Online checkout or a cart, a CMS, backend form handling, a Bahasa Melayu translation, an embedded live map (we link to Google Maps instead), and real product photography.
