# Concept B: "Mudah. Pantas. Sedap."

A bold, loud, poster-like single-page site for Shahid Cooking Pastes. Open `index.html` in a browser (you need to be online for the fonts and animations).

## What's on the page

1. **Hero:** "Mudah. Pantas. Sedap." slams in, with a spinning pan, the real Asam Pedas pack and floating chillies and star anise that follow the mouse.
2. **Statement:** a headline with small photos set inside it, and three drifting bowls.
3. **The lineup:** a full-screen sideways scroll through all 10 packs. The whole screen changes to each pack's colour. On phones it becomes a swipeable carousel. The coloured dots jump straight to a flavour.
4. **Three steps:** TUMIS / TAMBAH / MAKAN. Each word stretches as you scroll, with small animated illustrations.
5. **Cook this week:** three recipe cards whose steps expand.
6. **#MasakDenganShahid:** tilted photo cards.
7. **Reviews.**
8. **Build your order:** pick packs with +/−, then "Send order on WhatsApp" opens WhatsApp with the whole order written out.
9. **Marquee and footer,** with the giant Shahid wordmark.

## Changing content

Almost everything lives in **`assets/js/data.js`**:

- `SHAHID.config`: WhatsApp number (orders are sent here), opening hours, social links, store details, and the pickup/delivery wording.
- `SHAHID.flavours`: each paste's name, what to add, servings, colour (this drives the lineup), heat, "best with" text and description. The lineup, order form, marquee and footer all read from this list.

Other places:

- **Reviews:** the `REVIEWS` list near the middle of `assets/js/main.js`.
- **Recipes, steps and headlines:** written directly in `index.html`.

### Real pack photos

The pouches are drawn in code from the real pack layout, with a stock dish photo in the window. Pes Asam Pedas already uses the client's real pack art. To use a real pack photo for any other flavour, put the image in `assets/img/` and add `packArt: 'assets/img/your-file.jpg'` to that flavour in `data.js`.

## Placeholders to confirm with the client

- [ ] **Logo:** `assets/img/logo-shahid.svg` is a redraw. Replace it with their vector logo. The giant footer wordmark uses the same shape.
- [ ] **WhatsApp number:** `config.whatsapp` and `config.whatsappDisplay` (currently +60 12-345 6789). Orders go to this number.
- [ ] **Delivery:** the order form offers "Delivery". Remove it (in `index.html`) if the client only does pickup.
- [ ] **Opening hours** (`config.hours`), **social links** and **handle** (`@shahidpes`).
- [ ] **Cooking times, heat levels and "best with" pairings:** educated guesses, per flavour.
- [ ] **Recipes:** the quantities and steps are samples. Ask the client for their own.
- [ ] **Reviews:** three sample quotes. Replace them with real ones.
- [ ] **Dish and lifestyle photos:** Unsplash stand-ins, listed in `CREDITS.md`. Replace them with the client's own photos.

## Technical notes

- Plain HTML, CSS and JavaScript, with no build step. The animations use GSAP 3.15 (ScrollTrigger, SplitText) and Lenis smooth scrolling from jsDelivr, pinned with integrity hashes.
- **Without the animation scripts, or with reduced motion on:** the lineup is a normal swipeable carousel and everything else stays readable and usable, including the order builder.
- The logic tests live in the project root: `node --test tests/`.
