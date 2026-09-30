# Shahid Cooking Pastes: two website concepts

Two alternative single-page sites for the same brand, so the client can pick a direction.

| | Concept A: "Masak apa hari ni?" | Concept B: "Mudah. Pantas. Sedap." |
|---|---|---|
| Feel | Warm, playful, hand-drawn (after *Mello*) | Bold, loud, poster-like (after *Umami*) |
| Signature | A spin-the-plate dinner decider, and a cooking timer that runs as you scroll | A full-screen lineup that changes colour with every pack, and a WhatsApp order builder |
| Folder | `site-a-masak-apa/` | `site-b-mudah-pantas-sedap/` |

## Show it to the client

- **On your computer:** double-click `index.html` in this folder. It's a chooser page with both concepts side by side. Fonts and animations load from the internet, so stay online.
- **Online (free):** go to <https://app.netlify.com/drop> and drag this whole `SHAHID` folder onto the page. You get a link to send the client. You can also drag in just one site folder to publish that concept on its own.

## Folder map

```
index.html                  chooser page (links to both concepts)
site-a-masak-apa/           Concept A (self-contained)
site-b-mudah-pantas-sedap/  Concept B (self-contained)
tests/logic.test.js         unit tests for the shared logic (run: node --test tests/)
docs/superpowers/           design spec and build plan
UI Images/, reference Images/   the material you supplied (not used by the sites)
```

Each site folder has a `README.md` that explains how to swap in the client's real details, plus a list of every placeholder, and a `CREDITS.md` for photos and fonts.
