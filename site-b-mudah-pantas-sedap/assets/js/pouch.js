/* Draws a Shahid pouch as an SVG string, following the real pack layout:
 * serrated heat seal with hang hole, a corner ribbon in the flavour colour,
 * the brown oval logo, red "Tambah ... Saja" and servings badges, the brush
 * product name over a dish photo, and the white info strip with 220g.
 * If a flavour has real pack art (packArt), that art is framed instead. */
(function (root) {
  var S = (root.SHAHID = root.SHAHID || {});

  // "Shahid" script (Norican, converted to a path). Placeholder until the client's vector logo arrives.
  var SCRIPT_VB = '-7.4 -78.1 269.5 90.9';
  var SCRIPT_D = 'M12.30 8.79L12.30 8.79Q8.84 8.79 5.18 7.54Q1.51 6.30-0.95 3.71Q-3.42 1.12-3.42-2.88L-3.42-2.88Q-3.42-6.20-0.98-8.08Q1.46-9.96 4.69-10.11L4.69-10.11L6.79-10.21Q6.74-9.23 6.67-7.96Q6.59-6.69 6.59-5.42L6.59-5.42Q6.59-2.93 6.96-0.71Q7.32 1.51 9.30 2.91Q11.28 4.30 16.02 4.30L16.02 4.30Q18.90 4.30 22.12 3.30Q25.34 2.29 28.20 0.39Q31.05-1.51 32.84-4.32Q34.62-7.13 34.62-10.69L34.62-10.69Q34.62-14.01 32.71-17.31Q30.81-20.61 27.81-23.85Q24.80-27.10 21.46-30.35Q18.12-33.59 15.11-36.87Q12.11-40.14 10.21-43.41Q8.30-46.68 8.30-50L8.30-50Q8.30-55.71 11.18-60.21Q14.06-64.70 18.73-67.80Q23.39-70.90 28.78-72.51Q34.18-74.12 39.21-74.12L39.21-74.12Q41.80-74.12 44.70-73.41Q47.61-72.71 50.15-71.09Q52.69-69.48 54.30-66.75Q55.91-64.01 55.91-59.91L55.91-59.91Q55.91-59.47 53.96-58.13Q52.00-56.79 49.05-54.98Q46.09-53.17 42.97-51.42Q39.84-49.66 37.38-48.36Q34.91-47.07 34.08-46.78L34.08-46.78L34.08-51.61Q35.25-52.29 37.40-53.27Q39.55-54.25 41.77-55.40Q43.99-56.54 45.56-57.69Q47.12-58.84 47.12-59.81L47.12-59.81Q47.12-65.33 44.14-67.41Q41.16-69.48 36.91-69.48L36.91-69.48Q32.91-69.48 28.74-67.75Q24.56-66.02 21.73-62.79Q18.90-59.57 18.90-54.98L18.90-54.98Q18.90-51.76 20.80-48.95Q22.71-46.14 25.71-43.43Q28.71-40.72 32.06-37.87Q35.40-35.01 38.40-31.76Q41.41-28.52 43.31-24.61Q45.21-20.70 45.21-15.82L45.21-15.82Q45.21-9.72 42.21-5.10Q39.21-0.49 34.33 2.59Q29.44 5.66 23.66 7.23Q17.87 8.79 12.30 8.79ZM80.86 1.42L80.86 1.42Q79.00 1.42 78.37 0.27Q77.73-0.88 77.73-2.29L77.73-2.29Q77.73-2.73 77.81-3.30Q77.88-3.86 77.93-4.30L77.93-4.30Q78.08-5.62 78.93-8.50Q79.79-11.38 80.83-15.04Q81.88-18.70 82.67-22.44Q83.45-26.17 83.45-29.20L83.45-29.20Q83.45-31.98 80.66-31.98L80.66-31.98Q78.42-31.98 76.03-30.20Q73.63-28.42 71.44-25.51Q69.24-22.61 67.53-19.14Q65.82-15.67 64.94-12.30L64.94-12.30Q63.72-7.52 62.65-4.47Q61.57-1.42 59.86 0L59.86 0L52.25 0Q52.44-1.37 53.34-5.20Q54.25-9.03 55.59-14.40Q56.93-19.78 58.52-25.81Q60.11-31.84 61.67-37.67Q63.23-43.51 64.50-48.29Q65.77-53.08 66.55-55.93Q67.33-58.79 67.33-58.79L67.33-58.79Q68.60-63.43 69.58-65.99Q70.56-68.55 71.68-69.70Q72.80-70.85 74.44-71.12Q76.07-71.39 78.66-71.39L78.66-71.39Q79.25-71.39 79.88-71.36Q80.52-71.34 80.86-71.19L80.86-71.19L68.07-24.90Q70.36-29.15 73.78-32.84Q77.20-36.52 81.15-38.77Q85.11-41.02 88.96-41.02L88.96-41.02Q93.75-41.02 93.75-35.30L93.75-35.30Q93.75-33.59 92.80-30.62Q91.85-27.64 90.60-24.12Q89.36-20.61 88.40-17.24Q87.45-13.87 87.45-11.38L87.45-11.38Q87.45-11.38 87.57-10.64Q87.70-9.91 88.38-9.91L88.38-9.91Q88.77-9.91 90.06-11.13Q91.36-12.35 93.21-14.23Q95.07-16.11 97.12-18.12Q99.17-20.12 100.98-21.68L100.98-21.68L100.98-16.21Q99.22-14.21 96.53-11.25Q93.85-8.30 90.89-5.40Q87.94-2.49 85.25-0.54Q82.57 1.42 80.86 1.42ZM102.54 1.42L102.54 1.42Q99.46 1.42 97.83-0.63Q96.19-2.69 95.61-5.57Q95.02-8.45 95.02-10.99L95.02-10.99Q95.02-16.41 97.58-21.73Q100.15-27.05 104.64-31.42Q109.13-35.79 114.97-38.40Q120.80-41.02 127.29-41.02L127.29-41.02Q129.49-41.02 131.45-40.55Q133.40-40.09 135.50-39.40L135.50-39.40Q135.40-38.82 134.81-36.25Q134.23-33.69 133.45-30.13Q132.67-26.56 131.91-22.90Q131.15-19.24 130.64-16.33Q130.13-13.43 130.13-12.21L130.13-12.21Q130.13-9.08 131.59-9.08L131.59-9.08Q132.91-9.08 135.18-10.89Q137.45-12.70 140.38-15.67Q143.31-18.65 146.53-22.22L146.53-22.22L146.53-16.60Q145.36-15.19 143.14-12.96Q140.92-10.74 138.13-8.25Q135.35-5.76 132.54-3.56Q129.74-1.37 127.32 0.02Q124.90 1.42 123.44 1.42L123.44 1.42Q121.24 1.42 120.48-0.56Q119.73-2.54 119.73-4.98L119.73-4.98Q119.73-6.25 119.85-7.50Q119.97-8.74 120.12-9.72L120.12-9.72Q118.12-7.13 115.33-4.54Q112.55-1.95 109.28-0.27Q106.01 1.42 102.54 1.42ZM110.21-6.40L110.21-6.40Q111.72-6.40 113.65-7.52Q115.58-8.64 117.48-10.25Q119.38-11.87 120.70-13.28L120.70-13.28L126.32-37.30Q122.22-37.30 118.46-35.11Q114.70-32.91 111.77-29.37Q108.84-25.83 107.13-21.70Q105.42-17.58 105.42-13.72L105.42-13.72Q105.42-10.89 106.47-8.64Q107.52-6.40 110.21-6.40ZM169.19 1.42L169.19 1.42Q167.33 1.42 166.70 0.27Q166.06-0.88 166.06-2.29L166.06-2.29Q166.06-2.73 166.14-3.30Q166.21-3.86 166.26-4.30L166.26-4.30Q166.41-5.62 167.26-8.50Q168.12-11.38 169.17-15.04Q170.21-18.70 171.00-22.44Q171.78-26.17 171.78-29.20L171.78-29.20Q171.78-31.98 168.99-31.98L168.99-31.98Q166.75-31.98 164.36-30.20Q161.96-28.42 159.77-25.51Q157.57-22.61 155.86-19.14Q154.15-15.67 153.27-12.30L153.27-12.30Q152.05-7.52 150.98-4.47Q149.90-1.42 148.19 0L148.19 0L140.58 0Q140.77-1.37 141.67-5.20Q142.58-9.03 143.92-14.40Q145.26-19.78 146.85-25.81Q148.44-31.84 150-37.67Q151.56-43.51 152.83-48.29Q154.10-53.08 154.88-55.93Q155.66-58.79 155.66-58.79L155.66-58.79Q156.93-63.43 157.91-65.99Q158.89-68.55 160.01-69.70Q161.13-70.85 162.77-71.12Q164.40-71.39 166.99-71.39L166.99-71.39Q167.58-71.39 168.21-71.36Q168.85-71.34 169.19-71.19L169.19-71.19L156.40-24.90Q158.69-29.15 162.11-32.84Q165.53-36.52 169.48-38.77Q173.44-41.02 177.29-41.02L177.29-41.02Q182.08-41.02 182.08-35.30L182.08-35.30Q182.08-33.59 181.13-30.62Q180.18-27.64 178.93-24.12Q177.69-20.61 176.73-17.24Q175.78-13.87 175.78-11.38L175.78-11.38Q175.78-11.38 175.90-10.64Q176.03-9.91 176.71-9.91L176.71-9.91Q177.10-9.91 178.39-11.13Q179.69-12.35 181.54-14.23Q183.40-16.11 185.45-18.12Q187.50-20.12 189.31-21.68L189.31-21.68L189.31-16.21Q187.55-14.21 184.86-11.25Q182.18-8.30 179.22-5.40Q176.27-2.49 173.58-0.54Q170.90 1.42 169.19 1.42ZM188.72 1.42L188.72 1.42Q186.38 1.42 185.40-0.66Q184.42-2.73 184.42-4.98L184.42-4.98Q184.42-6.54 184.99-9.64Q185.55-12.74 186.40-16.48Q187.26-20.21 188.21-23.90Q189.16-27.59 189.97-30.40Q190.77-33.20 191.21-34.28L191.21-34.28Q192.24-36.91 193.73-37.96Q195.21-39.01 197.27-39.21Q199.32-39.40 202.00-39.40L202.00-39.40Q201.51-37.74 200.59-34.72Q199.66-31.69 198.58-28.00Q197.51-24.32 196.53-20.68Q195.56-17.04 194.92-14.11Q194.29-11.18 194.29-9.72L194.29-9.72Q194.29-9.03 194.60-7.76Q194.92-6.49 196.00-6.49L196.00-6.49Q196.58-6.49 198.66-8.30Q200.73-10.11 203.37-12.67Q206.01-15.23 208.35-17.68Q210.69-20.12 211.82-21.39L211.82-21.39L211.82-15.92Q203.56-7.81 198.39-3.32Q193.21 1.17 188.72 1.42ZM201.86-50.98L201.86-50.98Q199.80-50.98 198.93-52.12Q198.05-53.27 198.05-54.79L198.05-54.79Q198.05-56.45 198.90-58.23Q199.76-60.01 201.29-61.25Q202.83-62.50 204.83-62.50L204.83-62.50Q207.71-62.50 208.98-61.35Q210.25-60.21 210.25-58.69L210.25-58.69Q210.25-57.03 209.08-55.22Q207.91-53.42 206.01-52.20Q204.10-50.98 201.86-50.98ZM213.62 1.42L213.62 1.42Q210.79 1.42 209.35-0.32Q207.91-2.05 207.42-4.44Q206.93-6.84 206.93-8.89L206.93-8.89Q206.93-14.16 209.28-19.80Q211.62-25.44 215.45-30.25Q219.29-35.06 223.90-38.04Q228.52-41.02 233.06-41.02L233.06-41.02Q235.45-41.02 236.96-40.65Q238.48-40.28 239.45-39.99L239.45-39.99L245.95-63.18Q246.78-66.50 247.56-68.26Q248.34-70.02 250.27-70.65Q252.20-71.29 256.35-71.29L256.35-71.29L258.06-71.29Q258.01-70.65 257.45-68.43Q256.88-66.21 256.35-64.50L256.35-64.50Q255.57-62.16 254.27-57.86Q252.98-53.56 251.42-48.22Q249.85-42.87 248.32-37.26Q246.78-31.64 245.48-26.59Q244.19-21.53 243.41-17.87Q242.63-14.21 242.63-12.79L242.63-12.79Q242.63-10.94 242.99-10.33Q243.36-9.72 244.14-9.72L244.14-9.72Q245.36-9.72 248.88-13.23Q252.39-16.75 257.03-21.63L257.03-21.63L257.03-16.06Q254.54-13.23 251.56-10.18Q248.58-7.13 245.61-4.49Q242.63-1.86 240.11-0.22Q237.60 1.42 236.04 1.42L236.04 1.42Q233.79 1.42 232.91-0.46Q232.03-2.34 232.03-5.08L232.03-5.08Q232.03-8.20 232.86-11.62L232.86-11.62Q227.29-5.13 222.00-1.86Q216.70 1.42 213.62 1.42ZM221.24-7.71L221.24-7.71Q222.95-7.71 225.07-8.76Q227.20-9.81 229.20-11.35Q231.20-12.89 232.62-14.40Q234.03-15.92 234.23-16.80L234.23-16.80L238.53-35.69Q238.48-35.94 237.30-36.77Q236.13-37.60 233.94-37.60L233.94-37.60Q230.66-37.60 227.66-35.35Q224.66-33.11 222.31-29.49Q219.97-25.88 218.60-21.78Q217.24-17.68 217.24-13.92L217.24-13.92Q217.24-10.45 218.33-9.08Q219.43-7.71 221.24-7.71Z';

  var count = 0;
  var NAME_FONT = "'Protest Riot', 'Arial Black', Impact, sans-serif";
  var SMALL_FONT = "'Figtree', 'Be Vietnam Pro', 'Segoe UI', Arial, sans-serif";

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Pouch outline: zigzag seal edge on top, tear notches at the seal line, rounded base.
  var BODY = (function () {
    var d = 'M6 8';
    for (var x = 6; x < 294; x += 8) d += ' L' + (x + 4) + ' 2 L' + (x + 8) + ' 8';
    d += ' L294 26 L288 30 L294 34 L294 404 Q294 420 278 420 L22 420 Q6 420 6 404 L6 34 L12 30 L6 26 Z';
    return d;
  })();

  // Adds the shared script symbol to the page once (browser only).
  function sprite() {
    if (typeof document === 'undefined' || !document.body || document.getElementById('shahid-sprite')) return;
    var holder = document.createElement('div');
    holder.innerHTML = '<svg id="shahid-sprite" width="0" height="0" style="position:absolute;overflow:hidden" aria-hidden="true" focusable="false">' +
      '<symbol id="shahid-script" viewBox="' + SCRIPT_VB + '"><path d="' + SCRIPT_D + '"/></symbol></svg>';
    document.body.insertBefore(holder.firstChild, document.body.firstChild);
  }

  function text(x, y, s, size, attrs) {
    return '<text x="' + x + '" y="' + (+y).toFixed(1) + '" font-size="' + (+size).toFixed(1) + '" ' + (attrs || '') + '>' + esc(s) + '</text>';
  }

  function badgeLines(label) {
    var w = String(label).split(' ');
    if (w.length === 3 && w[1].length <= 4) return [w[0], w[1] + ' ' + w[2]];
    if (w.length === 4) return [w[0], w[1] + ' ' + w[2], w[3]];
    return w;
  }

  function circleBadge(cx, cy, r, fill, lines) {
    var size = lines.length > 2 ? 8.4 : 9.6;
    var lh = size * 1.14;
    var y0 = cy - ((lines.length - 1) * lh) / 2;
    var out = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '" stroke="#fff" stroke-opacity=".55" stroke-width="1.2"/>';
    for (var i = 0; i < lines.length; i++) {
      out += text(cx, y0 + i * lh, lines[i], size, 'fill="#fff" text-anchor="middle" dominant-baseline="central" font-weight="800" font-family="' + SMALL_FONT + '"');
    }
    return out;
  }

  function ribbon(f) {
    var on = f.textOn === 'dark' ? '#3B0D0C' : '#FFF4E2';
    var lines = ['PES'].concat(f.lines || [String(f.short).toUpperCase()]);
    var ts = lines.length > 2 ? [0.4, 0.62, 0.84] : [0.5, 0.74];
    var out = '<path d="M0 30 L0 150 L120 30 Z" fill="' + f.color + '"/>';
    for (var i = 0; i < lines.length; i++) {
      var px = (60 * ts[i]).toFixed(1), py = (30 + 60 * ts[i]).toFixed(1);
      out += '<text transform="translate(' + px + ' ' + py + ') rotate(-45)" font-size="11.5" fill="' + on +
        '" text-anchor="middle" dominant-baseline="central" letter-spacing=".4" font-family="' + NAME_FONT + '">' + esc(lines[i]) + '</text>';
    }
    return out;
  }

  function logo() {
    return '<g><ellipse cx="160" cy="64" rx="60" ry="24" fill="#4A322E"/>' +
      '<ellipse cx="160" cy="64" rx="57" ry="21.5" fill="#5F433F"/>' +
      '<ellipse cx="160" cy="64" rx="53" ry="18" fill="none" stroke="#F4E9E6" stroke-width="1.4"/>' +
      '<use href="#shahid-script" x="116" y="49.5" width="88" height="29.7" fill="#fff"/></g>';
  }

  function nameBlock(f) {
    var lines = f.lines && f.lines.length ? f.lines : [String(f.short).toUpperCase()];
    var longest = Math.max.apply(null, lines.map(function (l) { return l.length; }));
    var size = Math.min(lines.length === 1 ? 58 : 46, Math.floor(262 / (longest * 0.62)));
    var y = lines.length === 1 ? 322 : 302;
    var style = 'fill="#fff" stroke="#5A120D" stroke-linejoin="round" paint-order="stroke" text-anchor="middle" font-family="' + NAME_FONT + '"';
    var out = text(150, y - size * 0.98, 'PES', Math.round(size * 0.68), style + ' stroke-width="' + (size * 0.1).toFixed(1) + '" letter-spacing="1"');
    for (var i = 0; i < lines.length; i++) {
      var fit = lines[i].length >= 10 ? ' textLength="262" lengthAdjust="spacingAndGlyphs"' : '';
      out += text(150, y + i * size * 0.94, lines[i], size, style + ' stroke-width="' + (size * 0.13).toFixed(1) + '"' + fit);
    }
    var subY = y + (lines.length - 1) * size * 0.94 + 22;
    out += text(150, subY, String(f.sub || f.en).toUpperCase(), 10.5,
      'fill="#fff" stroke="rgba(40,10,5,.45)" stroke-width="2.4" paint-order="stroke" text-anchor="middle" font-weight="800" letter-spacing=".8" font-family="' + SMALL_FONT + '"');
    return out;
  }

  function infoStrip() {
    var small = 'font-family="' + SMALL_FONT + '" font-weight="800"';
    return '<rect x="0" y="372" width="300" height="48" fill="#FFFCF6"/>' +
      '<rect x="14" y="384" width="42" height="15" rx="7.5" fill="#2B5CB8"/>' +
      text(35, 391.5, 'MeSTI', 8.6, 'fill="#fff" text-anchor="middle" dominant-baseline="central" ' + small) +
      '<circle cx="72" cy="391.5" r="8.5" fill="none" stroke="#2E7D32" stroke-width="1.5"/>' +
      text(72, 391.5, 'HALAL', 3.9, 'fill="#2E7D32" text-anchor="middle" dominant-baseline="central" ' + small) +
      text(88, 389, 'KELUARAN', 6, 'fill="#3A2A26" ' + small) +
      text(88, 397, 'BUMIPUTERA', 6, 'fill="#3A2A26" ' + small) +
      text(286, 389, 'Berat Bersih: 220g', 7, 'fill="#3A2A26" text-anchor="end" font-style="italic" ' + small) +
      text(286, 398, 'Nett Weight: 220g', 7, 'fill="#3A2A26" text-anchor="end" font-style="italic" ' + small);
  }

  function seal(u) {
    return '<rect x="0" y="0" width="300" height="30" fill="#F4EFE9"/>' +
      '<rect x="0" y="4" width="300" height="23" fill="url(#rb-' + u + ')"/>' +
      '<rect x="0" y="29.4" width="300" height="1.2" fill="#000" opacity=".12"/>';
  }

  function finish(u) {
    return '<rect x="0" y="0" width="300" height="420" fill="url(#sh-' + u + ')"/>' +
      '<rect x="0" y="0" width="300" height="420" fill="url(#gl-' + u + ')"/>';
  }

  function defs(u) {
    return '<defs>' +
      '<clipPath id="cp-' + u + '"><path d="' + BODY + '"/></clipPath>' +
      '<mask id="mk-' + u + '"><rect width="300" height="420" fill="#fff"/><ellipse cx="150" cy="16" rx="13" ry="4.8" fill="#000"/></mask>' +
      '<pattern id="rb-' + u + '" width="4" height="23" patternUnits="userSpaceOnUse"><rect width="1.6" height="23" fill="#000" opacity=".09"/></pattern>' +
      '<linearGradient id="vg-' + u + '" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset=".42" stop-color="#1A0703" stop-opacity="0"/><stop offset="1" stop-color="#1A0703" stop-opacity=".62"/></linearGradient>' +
      '<linearGradient id="sh-' + u + '" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#000" stop-opacity=".24"/><stop offset=".07" stop-color="#000" stop-opacity="0"/>' +
        '<stop offset=".93" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".26"/></linearGradient>' +
      '<linearGradient id="gl-' + u + '" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/>' +
        '<stop offset=".37" stop-color="#fff" stop-opacity=".2"/><stop offset=".45" stop-color="#fff" stop-opacity=".03"/>' +
        '<stop offset=".63" stop-color="#fff" stop-opacity="0"/><stop offset=".69" stop-color="#fff" stop-opacity=".1"/>' +
        '<stop offset=".73" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '</defs>';
  }

  S.pouch = function (f, opts) {
    opts = opts || {};
    sprite();
    var u = 'pz' + (opts.uid ? String(opts.uid).replace(/[^\w-]/g, '') + '-' : '') + (++count);
    var inner;
    if (f.packArt) {
      inner = '<rect width="300" height="420" fill="#fff"/>' +
        '<image href="' + esc(f.packArt) + '" x="0" y="30" width="300" height="390" preserveAspectRatio="xMidYMid slice"/>' +
        seal(u) + finish(u);
    } else {
      var badges = circleBadge(256, 116, 27, '#A91F22', badgeLines(f.addLabel)) +
        circleBadge(256, 176, 27, '#A91F22', [String(f.serves).replace('–', ' ke '), 'Hidangan']);
      var sticker = f.sticker ? circleBadge(44, 190, 25, '#2E8B3E', badgeLines(f.sticker)) : '';
      inner = '<rect width="300" height="420" fill="#FBF7F2"/>' +
        '<image href="' + esc(f.pouchPhoto) + '" x="0" y="30" width="300" height="372" preserveAspectRatio="xMidYMid slice"/>' +
        '<rect x="0" y="30" width="300" height="342" fill="url(#vg-' + u + ')"/>' +
        ribbon(f) + logo() + badges + sticker + nameBlock(f) + infoStrip() + seal(u) + finish(u);
    }
    return '<svg class="pouch" viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(f.pack) + ', 220g pack">' +
      defs(u) + '<g mask="url(#mk-' + u + ')"><g clip-path="url(#cp-' + u + ')">' + inner + '</g></g></svg>';
  };

  S.pouchSprite = sprite;
})(typeof window !== 'undefined' ? window : globalThis);
