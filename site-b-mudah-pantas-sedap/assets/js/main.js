/* Concept B: rendering and interactions. Works without GSAP; motion.js adds
 * the animation layer on top when the libraries are available. */
(function () {
  'use strict';
  var S = window.SHAHID;
  if (!S) return;
  var cfg = S.config;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  S.ui = S.ui || {};

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icon(id, cls) { return '<svg class="' + (cls || '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function orderText(f) { return "Hi Shahid! I'd like to order " + f.pack + '.'; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- config-driven links ---------- */
  function wireLinks(root) {
    $$('.js-wa', root).forEach(function (a) {
      a.href = S.logic.waLink(cfg.whatsapp, a.getAttribute('data-wa') || 'Hi Shahid!');
      a.target = '_blank';
      a.rel = 'noopener';
    });
    $$('.js-maps', root).forEach(function (a) { a.href = cfg.store.mapsUrl; });
    $$('.js-social', root).forEach(function (a) { a.href = cfg.socials[a.getAttribute('data-social')] || '#'; });
    $$('[data-config]', root).forEach(function (el) {
      var v = cfg[el.getAttribute('data-config')];
      if (typeof v === 'string') el.textContent = v;
    });
  }

  function renderPouches(root) {
    $$('[data-pouch]', root).forEach(function (slot, i) {
      if (slot.querySelector('.pouch')) return;
      var f = S.flavourById(slot.getAttribute('data-pouch'));
      if (f) slot.insertAdjacentHTML('afterbegin', S.pouch(f, { uid: 'slot' + i }));
    });
  }

  /* ---------- header: tuck away on scroll down, return on scroll up ---------- */
  function header() {
    var hdr = $('.hdr');
    var menu = $('#menu');
    var last = window.scrollY;
    function onScroll() {
      var y = window.scrollY;
      hdr.classList.toggle('is-scrolled', y > 60);
      if (menu.hidden) {
        if (y > 420 && y - last > 6) hdr.classList.add('is-hidden');
        else if (last - y > 6 || y < 200) hdr.classList.remove('is-hidden');
      }
      last = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- full-screen menu ---------- */
  function menu() {
    var m = $('#menu'), opener = $('.hdr__menu'), closer = $('.menu__close');
    var preview = $('.menu__preview'), slot = $('#menu-pouch');
    var cache = {}, lastFocus = null;
    function show(id) {
      var f = S.flavourById(id);
      if (!f) return;
      preview.style.setProperty('--c', f.color);
      if (!cache[id]) cache[id] = S.pouch(f, { uid: 'menu' });
      slot.innerHTML = cache[id];
      if (slot.animate && !reduceMotion) slot.animate([{ transform: 'rotate(-24deg) scale(.8)', opacity: 0 }, { transform: 'rotate(-8deg)', opacity: 1 }], { duration: 500, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    }
    $$('.menu__links a', m).forEach(function (a) {
      var id = a.getAttribute('data-flavour');
      a.addEventListener('mouseenter', function () { show(id); });
      a.addEventListener('focus', function () { show(id); });
      a.addEventListener('click', function () { close(true); });
    });
    function open() {
      lastFocus = document.activeElement;
      m.hidden = false;
      opener.setAttribute('aria-expanded', 'true');
      document.documentElement.style.overflow = 'hidden';
      if (S.lenis) S.lenis.stop();
      show('rendang');
      if (S.ui.menuIn) S.ui.menuIn(m);
      closer.focus();
    }
    function close(skipFocus) {
      m.hidden = true;
      opener.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
      if (S.lenis) S.lenis.start();
      if (!skipFocus && lastFocus) lastFocus.focus();
    }
    opener.addEventListener('click', open);
    closer.addEventListener('click', function () { close(); });
    document.addEventListener('keydown', function (e) {
      if (m.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        var f = $$('a, button', m);
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* ---------- the lineup ---------- */
  function heatIcons(n) {
    var out = '';
    for (var i = 1; i <= 3; i++) out += '<svg class="' + (i > n ? 'is-off' : '') + '" aria-hidden="true"><use href="#i-chilli"/></svg>';
    return out;
  }
  function lineup() {
    var track = $('#lineup-track'), dots = $('#lu-dots');
    if (!track) return;
    var flavours = S.flavours;
    track.insertAdjacentHTML('beforeend', flavours.map(function (f, i) {
      var fg = f.textOn === 'dark' ? '#3B0D0C' : '#FFF4E2';
      var long = f.short.length > 11 ? ' is-long' : '';
      return '<article class="lu-panel" data-i="' + (i + 1) + '" style="--fg:' + fg + ';--bgc:' + f.color + ';--len:' + f.short.length + '" aria-labelledby="lu-name-' + f.id + '">' +
        '<span class="lu-panel__ghost" aria-hidden="true">' + esc(f.short) + '</span>' +
        '<div class="lu-panel__copy">' +
          '<p class="lu-panel__pes">Pes</p>' +
          '<h3 class="lu-panel__name display' + long + '" id="lu-name-' + f.id + '">' + esc(f.short) + '</h3>' +
          '<p class="lu-panel__en">' + esc(f.en) + '</p>' +
          '<p class="lu-panel__tags"><span class="lu-tag">' + esc(f.addLabel) + '</span>' +
          '<span class="lu-tag">' + esc(f.serves.replace('–', ' ke ')) + ' hidangan</span>' +
          '<span class="lu-tag" role="img" aria-label="Heat ' + f.heat + ' of 3">' + heatIcons(f.heat) + '</span></p>' +
          '<p class="lu-panel__desc">' + esc(f.desc) + '</p>' +
          '<p class="lu-panel__best">Best with ' + esc(f.bestWith.charAt(0).toLowerCase() + f.bestWith.slice(1)) + '</p>' +
          '<a class="btn btn--santan js-wa" href="#" data-wa="' + esc(orderText(f)) + '">' + icon('i-whatsapp', 'icon') + 'Order ' + esc(f.short) + '</a>' +
        '</div>' +
        '<div class="lu-panel__art" aria-hidden="true">' +
          '<div class="lu-panel__photo"><img src="' + esc(f.photo) + '" alt="" loading="lazy"></div>' +
          '<div class="lu-panel__pouch" data-pouch="' + f.id + '"></div>' +
        '</div>' +
      '</article>';
    }).join(''));

    dots.innerHTML = flavours.map(function (f, i) {
      return '<button class="lu-dot" type="button" style="--c:' + f.color + '" data-go="' + (i + 1) + '" aria-label="Jump to ' + esc(f.pack) + '"></button>';
    }).join('');

    var now = $('#lu-now'), bar = $('#lu-bar');
    S.ui.lineupHud = function (index, progress) {
      now.textContent = pad(index);
      bar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, progress)) + ')';
    };

    // mobile / no-pin mode: the track scrolls sideways by itself
    function mobileHud() {
      var panels = $$('.lu-panel, .lu-intro', track);
      var w = panels[1] ? panels[1].offsetLeft - panels[0].offsetLeft : 1;
      var i = Math.round(track.scrollLeft / w);
      S.ui.lineupHud(i, track.scrollWidth > track.clientWidth ? track.scrollLeft / (track.scrollWidth - track.clientWidth) : 0);
    }
    track.addEventListener('scroll', mobileHud, { passive: true });

    dots.addEventListener('click', function (e) {
      var b = e.target.closest('[data-go]');
      if (!b) return;
      var i = Number(b.getAttribute('data-go'));
      if (S.ui.lineupGo && S.ui.lineupGo(i)) return;
      var panel = track.children[i];
      if (panel) track.scrollTo({ left: panel.offsetLeft - (track.clientWidth - panel.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    S.ui.lineupHud(0, 0);
  }

  /* ---------- how it works: loop the little illustrations only while visible ---------- */
  function steps() {
    var items = $$('.step');
    if (!('IntersectionObserver' in window)) { items.forEach(function (s) { s.classList.add('is-live'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-live', en.isIntersecting); });
    }, { threshold: 0.2 });
    items.forEach(function (s) { io.observe(s); });
  }

  /* ---------- recipes ---------- */
  function recipes() {
    $$('.recipe__toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.recipe');
        var open = !card.classList.contains('is-open');
        card.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.textContent = open ? 'Hide steps' : 'See steps';
      });
    });
  }

  /* ---------- reviews ---------- */
  var REVIEWS = [   // SAMPLE reviews: replace with real customer quotes
    { q: "My asam pedas finally tastes like my late mother's. I just add the fish and water.", name: 'Aisyah', town: 'Kluang', f: 'asam-pedas' },
    { q: 'Rendang for Raya, done in one evening. My mother-in-law asked for the recipe.', name: 'Farid', town: 'Batu Pahat', f: 'rendang' },
    { q: "I keep three packs in the cupboard for the nights I'm too tired to think.", name: 'Mei Ling', town: 'Johor Bahru', f: 'tomyam' }
  ];
  function reviews() {
    var quote = $('#rv-quote'), nameEl = $('#rv-name'), town = $('#rv-town'), initial = $('#rv-initial'), pouchSlot = $('#rv-pouch');
    if (!quote) return;
    var i = 0;
    function show(n) {
      i = (n + REVIEWS.length) % REVIEWS.length;
      var r = REVIEWS[i];
      quote.textContent = r.q;
      nameEl.textContent = r.name;
      town.textContent = r.town;
      initial.textContent = r.name.charAt(0);
      pouchSlot.innerHTML = S.pouch(S.flavourById(r.f), { uid: 'rv' });
      if (S.ui.reviewIn) S.ui.reviewIn();
    }
    $('#rv-prev').addEventListener('click', function () { show(i - 1); });
    $('#rv-next').addEventListener('click', function () { show(i + 1); });
  }

  /* ---------- order builder ---------- */
  function order() {
    var form = $('#order-form'), grid = $('#packs-grid');
    if (!form) return;
    var totalEl = $('#order-total'), unitEl = $('#order-unit'), send = $('#order-send'), hint = $('#order-hint');
    grid.innerHTML = S.flavours.map(function (f) {
      return '<div class="pack-row" style="--c:' + f.color + '" data-id="' + f.id + '">' +
        '<span class="pack-row__dot" aria-hidden="true"></span>' +
        '<span class="pack-row__name" id="pn-' + f.id + '">' + esc(f.short) + '</span>' +
        '<div class="stepper">' +
          '<button type="button" data-d="-1" aria-label="One less ' + esc(f.pack) + '">−</button>' +
          '<input type="number" inputmode="numeric" min="0" max="99" value="0" name="q-' + f.id + '" aria-labelledby="pn-' + f.id + '">' +
          '<button type="button" data-d="1" aria-label="One more ' + esc(f.pack) + '">+</button>' +
        '</div></div>';
    }).join('');
    var rows = $$('.pack-row', grid);

    function items() {
      return rows.map(function (r) { return { pack: S.flavourById(r.getAttribute('data-id')).pack, qty: S.logic.clampQty(r.querySelector('input').value) }; });
    }
    function update(normalise) {
      var total = 0;
      rows.forEach(function (r) {
        var inp = r.querySelector('input');
        var q = S.logic.clampQty(inp.value);
        if (normalise || Number(inp.value) > 99 || Number(inp.value) < 0) inp.value = q;
        r.classList.toggle('has-qty', q > 0);
        total += q;
      });
      totalEl.textContent = total;
      unitEl.textContent = total === 1 ? 'pack' : 'packs';
      send.disabled = total === 0;
      hint.textContent = total === 0 ? 'Add at least one pack to send your order.' : 'WhatsApp opens with your order written out, ready to send.';
    }
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-d]');
      if (!b) return;
      var inp = b.parentElement.querySelector('input');
      inp.value = S.logic.clampQty(S.logic.clampQty(inp.value) + Number(b.getAttribute('data-d')));
      update(true);
      if (totalEl.animate && !reduceMotion) totalEl.animate([{ transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    });
    grid.addEventListener('input', function () { update(false); });
    grid.addEventListener('change', function () { update(true); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var el = form.elements;
      var msg = S.logic.orderMessage({
        name: el.namedItem('name').value, area: el.namedItem('area').value,
        mode: el.namedItem('mode').value, note: el.namedItem('note').value, items: items()
      });
      if (!msg) { update(true); return; }
      var url = S.logic.waLink(cfg.whatsapp, msg);
      S.ui.lastOrderUrl = url;
      window.open(url, '_blank', 'noopener');
      hint.textContent = 'Opening WhatsApp with your order. Just press send.';
    });
    update(true);
  }

  /* ---------- marquee + footer ---------- */
  function marquee() {
    var track = $('#bigmarq');
    if (!track) return;
    var group = '<div class="bigmarq__group">' + S.flavours.map(function (f) {
      return '<span>' + esc(f.short) + '</span><span class="bigmarq__dot"><img src="' + esc(f.pouchPhoto) + '" alt="" loading="lazy"></span>';
    }).join('') + '</div>';
    track.innerHTML = group + group;
  }
  function footer() {
    var list = $('#footer-flavours');
    if (list) list.innerHTML = S.flavours.map(function (f) { return '<li><a href="#lineup">' + esc(f.short) + '</a></li>'; }).join('');
  }


  /* ---------- pause CSS loops while they're off screen ---------- */
  function loops() {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-paused', !en.isIntersecting); });
    });
    $$('[data-loop]').forEach(function (el) { io.observe(el); });
  }

  /* ---------- fit sticker ring text to its circle ---------- */
  function rings() {
    var C = 2 * Math.PI * 40 * 0.98;
    $$('.sticker__ring text').forEach(function (t) {
      var len = t.getComputedTextLength ? t.getComputedTextLength() : 0;
      if (!len) return;
      var fs = parseFloat(getComputedStyle(t).fontSize) || 9;
      t.style.fontSize = Math.min(11, fs * C / len).toFixed(2) + 'px';
    });
  }

  lineup();
  marquee();
  footer();
  renderPouches(document);
  wireLinks(document);
  header();
  menu();
  steps();
  recipes();
  reviews();
  order();
  loops();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rings); else rings();
})();
