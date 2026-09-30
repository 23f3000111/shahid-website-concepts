// Unit tests for the pure, DOM-free parts of both sites:
// data.js (flavours + config), logic.js (decider, WhatsApp helpers), pouch.js (SVG builder).
// Run from the project root:  node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const SITES = ['site-a-masak-apa', 'site-b-mudah-pantas-sedap'];
const FILES = ['data.js', 'logic.js', 'pouch.js'];

function load(site) {
  delete globalThis.SHAHID;
  for (const f of FILES) {
    const p = path.join(__dirname, '..', site, 'assets', 'js', f);
    delete require.cache[require.resolve(p)];
    require(p);
  }
  return globalThis.SHAHID;
}

// WCAG relative luminance / contrast, used to check panel text colours.
function lum(hex) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

// Which wheel slice sits under a pointer at the top for a clockwise rotation of `deg`.
function sliceUnderPointer(deg, count) {
  const seg = 360 / count;
  const phi = (((-deg) % 360) + 360) % 360;
  return Math.floor(phi / seg) % count;
}

const ORDER = ['beriyani', 'masak-merah', 'kari-daging', 'asam-pedas', 'lemak-cili-api',
  'rendang', 'tomyam', 'mi-bandung', 'soto', 'sambal-tumis'];
const PROTEINS = ['ayam', 'ikan', 'daging', 'udang', 'telur', 'sayur'];

for (const site of SITES) {
  test(`[${site}] flavours: ten packs in the client's order`, () => {
    const S = load(site);
    assert.deepEqual(S.flavours.map((f) => f.id), ORDER);
  });

  test(`[${site}] flavours: every pack has complete, valid data`, () => {
    const S = load(site);
    for (const f of S.flavours) {
      assert.match(f.pack, /^Pes /, `${f.id} pack name`);
      assert.ok(f.en && f.short && f.desc && f.bestWith, `${f.id} text fields`);
      assert.ok(['air', 'santan', 'susu sejat'].includes(f.add), `${f.id} add`);
      assert.ok(['4–5', '3–4'].includes(f.serves), `${f.id} serves`);
      assert.match(f.color, /^#[0-9A-F]{6}$/i, `${f.id} color`);
      assert.ok([1, 2, 3].includes(f.heat), `${f.id} heat`);
      assert.ok(Number.isFinite(f.minutes) && f.minutes > 0, `${f.id} minutes`);
      assert.ok(f.proteins.length > 0 && f.proteins.every((p) => PROTEINS.includes(p)), `${f.id} proteins`);
      assert.match(f.photo, /^assets\/img\/photos\/dish-[a-z-]+\.jpg$/, `${f.id} photo`);
      assert.match(f.pouchPhoto, /^assets\/img\/photos\/pouch-[a-z-]+\.jpg$/, `${f.id} pouchPhoto`);
    }
  });

  test(`[${site}] flavours: facts printed on the packs`, () => {
    const S = load(site);
    const by = Object.fromEntries(S.flavours.map((f) => [f.id, f]));
    assert.equal(by['mi-bandung'].serves, '3–4');
    assert.equal(by['sambal-tumis'].serves, '3–4');
    assert.equal(by['rendang'].addLabel, 'Masukkan Santan Saja');
    assert.equal(by['beriyani'].add, 'susu sejat');
    assert.equal(by['beriyani'].addLabel, 'Tambah Susu Sejat Saja');
    assert.equal(by['kari-daging'].addLabel, 'Tambah Santan Saja');
    assert.equal(by['lemak-cili-api'].addLabel, 'Tambah Santan Saja');
    assert.equal(by['asam-pedas'].addLabel, 'Tambah Air Saja');
    assert.equal(by['asam-pedas'].packArt, 'assets/img/pack-asam-pedas.jpg');
  });

  test(`[${site}] flavours: panel text colour is readable on every flavour colour (>= 4.5:1)`, () => {
    const S = load(site);
    for (const f of S.flavours) {
      const fg = f.textOn === 'dark' ? '#3B0D0C' : '#FFF4E2';
      assert.ok(contrast(fg, f.color) >= 4.5, `${f.id}: ${fg} on ${f.color} = ${contrast(fg, f.color).toFixed(2)}`);
    }
  });

  test(`[${site}] config: WhatsApp number and store`, () => {
    const S = load(site);
    assert.match(S.config.whatsapp, /^60\d{8,10}$/);
    assert.equal(S.config.store.name, 'Berkat Sauda Supply');
    assert.match(S.config.store.mapsUrl, /^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/);
  });

  test(`[${site}] eligible: no chips selected means every flavour`, () => {
    const S = load(site);
    assert.equal(S.logic.eligible(S.flavours, []).length, 10);
  });

  test(`[${site}] eligible: one chip keeps only matching flavours`, () => {
    const S = load(site);
    const ids = S.logic.eligible(S.flavours, ['ikan']).map((f) => f.id);
    assert.ok(ids.includes('asam-pedas') && ids.includes('lemak-cili-api'));
    assert.ok(!ids.includes('rendang') && !ids.includes('soto'));
  });

  test(`[${site}] eligible: several chips give the union`, () => {
    const S = load(site);
    const soto = S.logic.eligible(S.flavours, ['ayam']).map((f) => f.id);
    const both = S.logic.eligible(S.flavours, ['ayam', 'udang']).map((f) => f.id);
    assert.ok(soto.includes('soto'));
    assert.ok(both.includes('soto') && both.includes('mi-bandung'));
    assert.ok(both.length >= soto.length);
  });

  test(`[${site}] spinTarget: lands every slice under the pointer, with jitter`, () => {
    const S = load(site);
    for (const current of [0, 37, 725.5, -90]) {
      for (let i = 0; i < 10; i++) {
        for (const j of [0, 12, -12]) {
          const t = S.logic.spinTarget(current, i, 10, j, 5);
          assert.equal(sliceUnderPointer(t, 10), i, `current ${current}, index ${i}, jitter ${j}`);
          assert.ok(t >= current + 5 * 360 && t < current + 6 * 360, `range for ${current}/${i}`);
        }
      }
    }
  });

  test(`[${site}] clampQty: whole numbers from 0 to 99`, () => {
    const S = load(site);
    const c = S.logic.clampQty;
    assert.deepEqual([c(-1), c(0), c(5), c(99), c(150), c('abc'), c('7'), c(2.7), c(undefined)], [0, 0, 5, 99, 99, 0, 7, 2, 0]);
  });

  test(`[${site}] fitAxis: finds the widest axis value whose text still fits`, () => {
    const S = load(site);
    const w = S.logic.fitAxis((v) => v * 4, 34, 110, 300);   // text width = 4px per axis unit
    assert.ok(Math.abs(w - 75) < 0.3, `expected about 75, got ${w}`);
  });

  test(`[${site}] fitAxis: never returns a value that overflows the available width`, () => {
    const S = load(site);
    const curves = [(v) => 3 + 2.7 * v, (v) => (v * v) / 20, (v) => 40 + v * 1.1, (v) => 6.2 * v - 90];
    for (const measure of curves) {
      for (const avail of [120, 210, 330, 480, 700]) {
        const w = S.logic.fitAxis(measure, 34, 110, avail);
        assert.ok(w >= 34 && w <= 110, `${w} outside the range`);
        if (measure(34) <= avail) assert.ok(measure(w) <= avail + 0.01, `overflows: ${measure(w)} > ${avail} at ${w}`);
      }
    }
  });

  test(`[${site}] fitAxis: returns the top of the range when everything fits`, () => {
    const S = load(site);
    assert.equal(S.logic.fitAxis((v) => v * 2, 34, 110, 1000), 110);
  });

  test(`[${site}] fitAxis: returns the bottom of the range when even that overflows`, () => {
    const S = load(site);
    assert.equal(S.logic.fitAxis((v) => v * 10, 34, 110, 100), 34);
  });

  test(`[${site}] fitAxis: an unusable available width (0, negative, NaN) leaves the range top`, () => {
    const S = load(site);
    for (const avail of [0, -50, NaN, undefined]) assert.equal(S.logic.fitAxis((v) => v * 4, 34, 110, avail), 110);
  });

  test(`[${site}] waLink: digits-only number and a round-trippable message`, () => {
    const S = load(site);
    const text = 'Hi Shahid! Mei & Co #1\nPes Rendang × 2 🌶️';
    const url = S.logic.waLink('+60 12-345 6789', text);
    assert.ok(url.startsWith('https://wa.me/60123456789?text='));
    assert.equal(decodeURIComponent(url.split('?text=')[1]), text);
    assert.ok(!/[\s&#]/.test(url.split('?text=')[1]), 'message is fully encoded');
  });

  test(`[${site}] orderMessage: lists packs, drops zeros, totals, optional lines`, () => {
    const S = load(site);
    const msg = S.logic.orderMessage({
      name: '  Aisyah ', area: 'Taman Idaman', mode: 'pickup', note: '',
      items: [{ pack: 'Pes Rendang', qty: 2 }, { pack: 'Pes Soto', qty: 0 }, { pack: 'Pes Asam Pedas', qty: 1 }],
    });
    assert.match(msg, /Pes Rendang × 2/);
    assert.match(msg, /Pes Asam Pedas × 1/);
    assert.doesNotMatch(msg, /Pes Soto/);
    assert.match(msg, /Total: 3 packs/);
    assert.match(msg, /Name: Aisyah\n/);
    assert.match(msg, /Area: Taman Idaman/);
    assert.match(msg, /Pickup at Berkat Sauda Supply/);
    assert.doesNotMatch(msg, /Note:/);
  });

  test(`[${site}] orderMessage: singular pack, delivery, and nothing to send`, () => {
    const S = load(site);
    const one = S.logic.orderMessage({ mode: 'delivery', items: [{ pack: 'Pes Soto', qty: 1 }], note: 'No chilli' });
    assert.match(one, /Total: 1 pack(?!s)/);
    assert.match(one, /Delivery/);
    assert.match(one, /Note: No chilli/);
    assert.doesNotMatch(one, /Name:/);
    assert.equal(S.logic.orderMessage({ items: [{ pack: 'Pes Soto', qty: 0 }] }), null);
  });

  test(`[${site}] pouch: SVG with the pack name, colour, photo and accessible label`, () => {
    const S = load(site);
    const f = S.flavours.find((x) => x.id === 'rendang');
    const svg = S.pouch(f, { uid: 'a1' });
    assert.ok(svg.startsWith('<svg'));
    assert.match(svg, /RENDANG/);
    assert.ok(svg.includes(f.color));
    assert.ok(svg.includes(f.pouchPhoto));
    assert.match(svg, /role="img"/);
    assert.match(svg, /aria-label="Pes Rendang, 220g pack"/);
  });

  test(`[${site}] pouch: real pack art is used when a flavour has it`, () => {
    const S = load(site);
    const f = S.flavours.find((x) => x.id === 'asam-pedas');
    assert.ok(S.pouch(f, { uid: 'z' }).includes('assets/img/pack-asam-pedas.jpg'));
  });

  test(`[${site}] pouch: ids are unique per call`, () => {
    const S = load(site);
    const f = S.flavours[0];
    const ids = (s) => new Set([...s.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
    const a = ids(S.pouch(f)), b = ids(S.pouch(f));
    assert.ok(a.size > 0);
    for (const id of a) assert.ok(!b.has(id), `duplicate id ${id}`);
  });

  test(`[${site}] pouch: text is escaped`, () => {
    const S = load(site);
    const f = { ...S.flavours[0], pack: 'Pes <b>X</b>', short: '<i>X</i>', en: 'X & Y' };
    const svg = S.pouch(f, { uid: 'e' });
    assert.ok(!svg.includes('<b>') && !svg.includes('<i>'));
  });
}
