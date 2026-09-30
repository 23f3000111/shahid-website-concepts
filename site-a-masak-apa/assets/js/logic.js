/* Pure helpers (no DOM): the dinner decider and the WhatsApp order links. */
(function (root) {
  var S = (root.SHAHID = root.SHAHID || {});

  // Flavours that suit any of the selected proteins. No selection means all of them.
  function eligible(flavours, selected) {
    if (!selected || selected.length === 0) return flavours.slice();
    return flavours.filter(function (f) {
      return f.proteins.some(function (p) { return selected.indexOf(p) !== -1; });
    });
  }

  // Final clockwise rotation (degrees) that stops slice `index` of `count` under a
  // pointer at the top, at least `turns` full turns past `currentDeg`.
  // `jitterDeg` nudges the landing spot off the slice centre so it feels less mechanical.
  function spinTarget(currentDeg, index, count, jitterDeg, turns) {
    var seg = 360 / count;
    var want = -(index * seg + seg / 2 + (jitterDeg || 0));
    var base = currentDeg + (turns || 0) * 360;
    var delta = (((want - base) % 360) + 360) % 360;
    return base + delta;
  }

  // Largest value in [lo, hi] of a font axis (e.g. width) whose text still fits in `avail` px.
  // `measure(v)` returns the rendered text width at axis value v and must not shrink as v grows.
  // Nothing fits: returns lo. Unusable `avail` (0, negative, NaN, missing): returns hi, no limit known.
  function fitAxis(measure, lo, hi, avail) {
    if (!(avail > 0) || !isFinite(avail)) return hi;
    if (hi <= lo) return lo;
    if (measure(hi) <= avail) return hi;
    if (measure(lo) > avail) return lo;
    for (var i = 0; i < 14 && hi - lo > 0.05; i++) {
      var mid = (lo + hi) / 2;
      if (measure(mid) <= avail) lo = mid; else hi = mid;
    }
    return lo;
  }

  // Whole packs from 0 to 99.
  function clampQty(n) {
    var v = Math.floor(Number(n));
    if (!isFinite(v) || v < 0) return 0;
    return Math.min(99, v);
  }

  function waLink(number, text) {
    return 'https://wa.me/' + String(number).replace(/\D/g, '') + '?text=' + encodeURIComponent(text);
  }

  // The WhatsApp message for an order, or null when there is nothing to send.
  function orderMessage(o) {
    o = o || {};
    var items = (o.items || [])
      .map(function (it) { return { pack: it.pack, qty: clampQty(it.qty) }; })
      .filter(function (it) { return it.qty > 0; });
    if (!items.length) return null;

    var total = items.reduce(function (sum, it) { return sum + it.qty; }, 0);
    var modes = (S.config && S.config.modes) || {};
    var lines = ["Hi Shahid! I'd like to order:"];
    items.forEach(function (it) { lines.push('• ' + it.pack + ' × ' + it.qty); });
    lines.push('Total: ' + total + (total === 1 ? ' pack' : ' packs'));
    lines.push('');

    var name = String(o.name || '').trim();
    var area = String(o.area || '').trim();
    var note = String(o.note || '').trim();
    if (name) lines.push('Name: ' + name);
    if (area) lines.push('Area: ' + area);
    if (o.mode && modes[o.mode]) lines.push(modes[o.mode]);
    if (note) lines.push('Note: ' + note);
    return lines.join('\n');
  }

  S.logic = {
    eligible: eligible,
    spinTarget: spinTarget,
    clampQty: clampQty,
    fitAxis: fitAxis,
    waLink: waLink,
    orderMessage: orderMessage
  };
})(typeof window !== 'undefined' ? window : globalThis);
