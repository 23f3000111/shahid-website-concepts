# Concept A: "Masak apa hari ni?"

A warm, playful, hand-drawn single-page site for Shahid Cooking Pastes. Open `index.html` in a browser (you need to be online for the fonts and animations).

## What's on the page

1. **Hero:** "All the rempah. None of the pounding." Doodles draw themselves in and three packs rise up.
2. **Flavour grid:** all 10 pastes. Every "Order" link opens WhatsApp with that pack already named.
3. **Pack-to-plate timer:** the digits roll through four cooking steps as you scroll (on phones, tap the tabs instead).
4. **Dinner decider:** tap what's in your fridge, then spin the plate to get tonight's paste.
5. **Receipt and certification stamps:** the "Dapur Shahid" receipt prints out as it scrolls into view.
6. **Reviews, Find us, footer.**

## Changing content

Almost everything lives in **`assets/js/data.js`**:

- `SHAHID.config`: WhatsApp number, opening hours, social links, store details.
- `SHAHID.flavours`: each paste's name, what to add, servings, colour, heat, cooking time, "best with" text and description. The grid, the decider and the pouches all read from this list.

Things written directly in `index.html`: the headlines, the cooking steps (on the timer tab buttons), the receipt, the reviews and the Find us cards.

### Real pack photos

The pouches are drawn in code from the real pack layout, with a stock dish photo in the window. Pes Asam Pedas already uses the client's real pack art. To use a real pack photo for any other flavour, put the image in `assets/img/` and add `packArt: 'assets/img/your-file.jpg'` to that flavour in `data.js`. The pouch frame and shadow are added automatically.

## Placeholders to confirm with the client

- [ ] **Logo:** `assets/img/logo-shahid.svg` is a redraw. Replace it with their vector logo.
- [ ] **WhatsApp number:** `config.whatsapp` and `config.whatsappDisplay` (currently +60 12-345 6789).
- [ ] **Opening hours** (`config.hours`), **social links** and **handle**.
- [ ] **Cooking times, heat levels and "best with" pairings:** educated guesses, per flavour.
- [ ] **Reviews:** three sample quotes (Aisyah, Farid, Mei Ling). Replace them with real ones.
- [ ] **Receipt lines:** playful copy ("about 20 min", "all of them").
- [ ] **"Johor's favourite" sticker** on Asam Pedas, and **"Become a stockist":** check the client wants both.
- [ ] **Halal JAKIM and MeSTI:** shown as text stamps. Use the official logo files if the client provides them.
- [ ] **Dish and lifestyle photos:** Unsplash stand-ins, listed in `CREDITS.md`. Replace them with the client's own photos.

## Technical notes

- Plain HTML, CSS and JavaScript, with no build step. The animations use GSAP 3.15 (ScrollTrigger, SplitText) and Lenis smooth scrolling from jsDelivr, pinned with integrity hashes.
- If the animation scripts can't load, or the visitor has reduced motion turned on, the page stays complete and usable, and the decider still spins.
- The logic tests live in the project root: `node --test tests/`.
