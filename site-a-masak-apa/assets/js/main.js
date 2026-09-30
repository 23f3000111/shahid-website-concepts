/* Concept A: rendering and interactions. Works without GSAP; motion.js adds
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
  function heat(n) {
    var out = '<span class="heat" role="img" aria-label="Heat ' + n + ' of 3">';
    for (var i = 1; i <= 3; i++) out += '<svg class="' + (i > n ? 'is-off' : '') + '" aria-hidden="true"><use href="#i-chilli"/></svg>';
    return out + '</span>';
  }
  var ADD = {
    air: { icon: 'i-air', word: 'water', chip: 'water' },
    santan: { icon: 'i-santan', word: 'santan', chip: 'santan' },
    'susu sejat': { icon: 'i-susu', word: 'evaporated milk', chip: 'susu sejat' }
  };
  function orderText(f) { return "Hi Shahid! I'd like to order " + f.pack + '.'; }

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

  /* ---------- pouches in [data-pouch] slots ---------- */
  function renderPouches(root) {
    $$('[data-pouch]', root).forEach(function (slot, i) {
      if (slot.querySelector('.pouch')) return;
      var f = S.flavourById(slot.getAttribute('data-pouch'));
      if (!f) return;
      slot.insertAdjacentHTML('afterbegin', S.pouch(f, { uid: 'slot' + i }));
    });
  }

  /* ---------- flavour grid ---------- */
  var ORDER = ['asam-pedas', 'rendang', 'tomyam', 'masak-merah', 'kari-daging', 'lemak-cili-api', 'beriyani', 'soto', 'mi-bandung', 'sambal-tumis'];
  var TAGS = {
    'masak-merah': 'kids ask for seconds', 'kari-daging': 'with potatoes, always', 'lemak-cili-api': 'pedas, but creamy',
    'tomyam': 'hot and sour', 'beriyani': 'Batu Pahat style', 'soto': 'comfort in a bowl',
    'mi-bandung': 'Muar-style gravy', 'sambal-tumis': 'goes with everything'
  };
  var STICKERS = { 'asam-pedas': "Johor's favourite", 'rendang': 'new recipe' };

  function photoCard(f, variant) {
    return '<article class="fl-card fl-card--photo fl-card--' + variant + '" style="--c:' + f.color + '">' +
      '<img class="fl-card__img" src="' + esc(f.photo) + '" alt="A bowl of ' + esc(f.short.toLowerCase()) + '" loading="lazy">' +
      (STICKERS[f.id] ? '<span class="fl-card__sticker">' + esc(STICKERS[f.id]) + '</span>' : '') +
      '<div class="fl-card__label">' +
        '<p class="fl-card__meta"><span class="chip-add">' + icon(ADD[f.add].icon) + esc(f.addLabel) + '</span>' + heat(f.heat) + '</p>' +
        '<h3 class="fl-card__name">' + esc(f.short) + '</h3>' +
        '<p class="fl-card__desc">' + esc(f.desc) + '</p>' +
        '<p class="fl-card__foot"><span>Serves ' + esc(f.serves) + '</span>' +
        '<a class="fl-card__order js-wa" href="#" data-wa="' + esc(orderText(f)) + '">Order ' + esc(f.short) + '</a></p>' +
      '</div>' +
      '<div class="fl-card__pouch" data-pouch="' + f.id + '" aria-hidden="true"></div>' +
    '</article>';
  }

  function smallCard(f) {
    return '<article class="fl-card fl-card--small" style="--c:' + f.color + '">' +
      '<span class="fl-card__ribbon" aria-hidden="true"></span>' +
      '<span class="fl-card__tag" aria-hidden="true">' + esc(TAGS[f.id] || '') + '</span>' +
      '<p class="fl-card__meta"><span class="chip-add">' + icon(ADD[f.add].icon) + '+ ' + esc(ADD[f.add].chip) + '</span></p>' +
      '<h3 class="fl-card__name">' + esc(f.short) + '</h3>' +
      '<p class="fl-card__en">' + esc(f.en) + '</p>' +
      '<div class="fl-card__foot">' + heat(f.heat) + '<span>Serves ' + esc(f.serves) + '</span>' +
        '<a class="fl-card__order js-wa" href="#" data-wa="' + esc(orderText(f)) + '">Order this<span class="sr-only">: ' + esc(f.pack) + '</span></a></div>' +
      '<div class="fl-card__pouch" data-pouch="' + f.id + '" aria-hidden="true"></div>' +
    '</article>';
  }

  function ctaCard() {
    return '<article class="fl-card fl-card--cta" data-loop>' +
      '<p class="hand">can\'t decide?</p>' +
      '<h3>Let the plate pick tonight\'s dinner.</h3>' +
      '<a class="btn btn--primary" href="#decider">Spin the plate</a>' +
      '<div class="fl-card__wheel" aria-hidden="true"></div>' + icon('i-chilli', 'fl-card__plate-chilli') +
    '</article>';
  }

  function renderFlavours() {
    var grid = $('#flavour-grid');
    if (!grid) return;
    var html = ORDER.map(function (id, i) {
      var f = S.flavourById(id);
      if (i === 0) return photoCard(f, 'hero');
      if (i === 1) return photoCard(f, 'wide');
      return smallCard(f);
    }).join('') + ctaCard();
    grid.innerHTML = html;
  }

  /* ---------- marquee: duplicate for a seamless loop ---------- */
  function marquee() {
    $$('.marquee__track').forEach(function (track) {
      var g = track.querySelector('.marquee__group');
      if (g && track.children.length === 1) track.appendChild(g.cloneNode(true));
    });
  }

  /* ---------- navigation ---------- */
  function nav() {
    var pill = $('.pillnav');
    var hero = $('.hero');
    if (pill && hero) {
      var onScroll = function () {
        var show = window.scrollY > hero.offsetTop + hero.offsetHeight * 0.75;
        pill.classList.toggle('is-visible', show);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    var menu = $('#menu');
    var openers = $$('.menu-btn');
    var closer = $('.menu__close');
    var lastFocus = null;
    function open() {
      lastFocus = document.activeElement;
      menu.hidden = false;
      openers.forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
      document.documentElement.style.overflow = 'hidden';
      if (S.lenis) S.lenis.stop();
      if (S.ui.menuIn) S.ui.menuIn(menu);
      closer.focus();
    }
    function close(skipFocus) {
      menu.hidden = true;
      openers.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      document.documentElement.style.overflow = '';
      if (S.lenis) S.lenis.start();
      if (!skipFocus && lastFocus) lastFocus.focus();
    }
    openers.forEach(function (b) { b.addEventListener('click', open); });
    if (closer) closer.addEventListener('click', function () { close(); });
    $$('.menu__links a', menu).forEach(function (a) { a.addEventListener('click', function () { close(true); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) close();
      if (e.key === 'Tab' && !menu.hidden) {
        var f = $$('a, button', menu);
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* ---------- pack-to-plate timer ---------- */
  function timer() {
    var clock = $('#timer-clock');
    var tabs = $$('.timer__tab');
    if (!clock || !tabs.length) return;
    var title = $('#timer-title'), text = $('#timer-text'), iconUse = $('#timer-icon use'), count = $('#timer-count');
    var detail = $('.timer__detail');
    var strips = [];
    var current = -1;

    // odometer digits
    var initial = tabs[0].getAttribute('data-time');
    clock.textContent = '';
    initial.split('').forEach(function (ch) {
      if (ch === ':') {
        var c = document.createElement('span');
        c.className = 'timer__colon';
        c.textContent = ':';
        clock.appendChild(c);
        return;
      }
      var d = document.createElement('span');
      d.className = 'digit';
      var strip = document.createElement('span');
      strip.className = 'digit__strip';
      for (var n = 0; n <= 9; n++) {
        var s = document.createElement('span');
        s.textContent = n;
        strip.appendChild(s);
      }
      d.appendChild(strip);
      clock.appendChild(d);
      strips.push(strip);
    });
    clock.setAttribute('aria-label', initial);

    function setClock(t) {
      var digits = t.replace(':', '').split('');
      strips.forEach(function (strip, i) { strip.style.transform = 'translateY(' + (-Number(digits[i])) + 'em)'; });
    }

    function setStep(i) {
      if (i === current) return;
      current = i;
      var tab = tabs[i];
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      setClock(tab.getAttribute('data-time'));
      title.textContent = tab.querySelector('.timer__tab-title').textContent;
      text.textContent = tab.getAttribute('data-text');
      iconUse.setAttribute('href', '#' + tab.getAttribute('data-icon'));
      count.textContent = 'step ' + (i + 1) + ' of ' + tabs.length;
      if (detail.animate && !reduceMotion) {
        detail.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
    }

    function setProgress(i, frac) {
      tabs.forEach(function (t, k) {
        var v = k < i ? 1 : k === i ? frac : 0;
        t.querySelector('.timer__bar').style.transform = 'scaleX(' + v + ')';
      });
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        if (S.ui.timerScrollTo && S.ui.timerScrollTo(i)) return; // desktop: scroll the pinned panel
        setStep(i);
        setProgress(i, 1);
      });
      t.addEventListener('keydown', function (e) {
        var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!k) return;
        e.preventDefault();
        var n = (i + k + tabs.length) % tabs.length;
        tabs[n].focus();
        tabs[n].click();
      });
    });

    setStep(0);
    setProgress(0, 1);
    S.ui.timerSetStep = setStep;
    S.ui.timerSetProgress = setProgress;
    S.ui.timerSteps = tabs.length;
  }

  /* ---------- dinner decider ---------- */
  function decider() {
    var spinG = $('#plate-spin');
    var chipRow = $('#chip-row');
    var clearBtn = $('#chip-clear');
    var spinBtn = $('#spin-btn');
    var ladle = $('.plate__ladle');
    var card = $('#result-card'), empty = $('#result-empty'), live = $('#result-live');
    if (!spinG || !spinBtn) return;

    var flavours = S.flavours;
    var count = flavours.length, seg = 360 / count;
    var selected = [];
    var rotation = 0, spinning = false, lastPick = -1;
    var CX = 260, CY = 260, R = 226, R0 = 58;
    // Dish names start a fixed gap outside the "Pusing!" hub. The hub is 27% of the plate wide plus a
    // .58% dark ring (see .plate__hub in style.css), so its outer edge sits at 73.2 of the 520 units.
    var LABEL_R = 520 * (0.27 / 2 + 0.0058) + 14;

    // slices
    function pt(r, deg) {
      var a = (deg - 90) * Math.PI / 180;
      return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
    }
    var html = '';
    flavours.forEach(function (f, i) {
      var a0 = i * seg, a1 = (i + 1) * seg;
      var p0 = pt(R, a0), p1 = pt(R, a1), q1 = pt(R0, a1), q0 = pt(R0, a0);
      var d = 'M' + q0[0].toFixed(1) + ' ' + q0[1].toFixed(1) +
        ' L' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) +
        ' A' + R + ' ' + R + ' 0 0 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) +
        ' L' + q1[0].toFixed(1) + ' ' + q1[1].toFixed(1) +
        ' A' + R0 + ' ' + R0 + ' 0 0 0 ' + q0[0].toFixed(1) + ' ' + q0[1].toFixed(1) + ' Z';
      var mid = a0 + seg / 2;
      var tp = pt(LABEL_R, mid);
      var fill = f.textOn === 'dark' ? '#33180D' : '#FFF9EC';
      html += '<g class="slice" data-i="' + i + '"><path d="' + d + '" fill="' + f.color + '"/>' +
        '<text x="' + tp[0].toFixed(1) + '" y="' + tp[1].toFixed(1) + '" fill="' + fill + '" dominant-baseline="central" ' +
        'transform="rotate(' + (mid - 90).toFixed(1) + ' ' + tp[0].toFixed(1) + ' ' + tp[1].toFixed(1) + ')">' + esc(f.short.replace(' Batu Pahat', '')) + '</text></g>';
    });
    spinG.innerHTML = html;
    var slices = $$('.slice', spinG);

    // mini copy of the plate for the "can't decide?" card
    var mini = $('.fl-card__wheel');
    if (mini) {
      mini.innerHTML = '<svg viewBox="0 0 520 520"><circle cx="260" cy="260" r="252" fill="#fff"/>' +
        '<circle cx="260" cy="260" r="246" fill="none" stroke="#1F4E9C" stroke-width="10"/>' +
        html.replace(/<text[\s\S]*?<\/text>/g, '') + '<circle cx="260" cy="260" r="62" fill="#C7302A" stroke="#FFF9EC" stroke-width="8"/></svg>';
    }

    function setRotation(deg) {
      rotation = deg;
      spinG.setAttribute('transform', 'rotate(' + deg.toFixed(2) + ' ' + CX + ' ' + CY + ')');
    }

    // fridge chips
    chipRow.innerHTML = S.proteins.map(function (p) {
      return '<button class="chip-btn" type="button" aria-pressed="false" data-p="' + p.id + '">' +
        icon('i-' + p.id) + '<span>' + esc(p.label) + '</span><span class="sr-only"> (' + esc(p.en) + ')</span></button>';
    }).join('');
    function updateDim() {
      var ok = S.logic.eligible(flavours, selected).map(function (f) { return f.id; });
      slices.forEach(function (s, i) { s.classList.toggle('is-dim', ok.indexOf(flavours[i].id) === -1); });
      clearBtn.hidden = selected.length === 0;
    }
    $$('.chip-btn', chipRow).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-p');
        var at = selected.indexOf(id);
        if (at === -1) selected.push(id); else selected.splice(at, 1);
        b.setAttribute('aria-pressed', at === -1 ? 'true' : 'false');
        updateDim();
      });
    });
    clearBtn.addEventListener('click', function () {
      selected = [];
      $$('.chip-btn', chipRow).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      updateDim();
    });

    // result card
    function youAdd(f) {
      var p = f.proteins.filter(function (x) { return selected.indexOf(x) !== -1; })
        .map(function (x) { for (var i = 0; i < S.proteins.length; i++) if (S.proteins[i].id === x) return S.proteins[i].label; return x; });
      return (p.length ? p.join(' or ') : 'Your protein') + ' + ' + ADD[f.add].word;
    }
    function showResult(f) {
      card.innerHTML =
        '<div class="result__top"><div class="result__pack" style="--c:' + f.color + '">' + S.pouch(f, { uid: 'result' }) + '</div>' +
        '<div><p class="result__kicker">tonight\'s pick</p><h3 class="result__name">' + esc(f.short) + '</h3></div></div>' +
        '<p class="result__desc">' + esc(f.desc) + '</p>' +
        '<dl class="result__facts">' +
          '<div><dt>You add</dt><dd>' + esc(youAdd(f)) + '</dd></div>' +
          '<div><dt>Best with</dt><dd>' + esc(f.bestWith) + '</dd></div>' +
          '<div><dt>Heat</dt><dd>' + heat(f.heat) + '</dd></div>' +
          '<div><dt>Serves</dt><dd>' + esc(f.serves.replace('–', ' to ')) + '</dd></div>' +
          '<div><dt>Cooking time</dt><dd>about ' + f.minutes + ' min</dd></div>' +
        '</dl>' +
        '<div class="result__actions"><a class="btn btn--primary btn--small js-wa" href="#" data-wa="' + esc(orderText(f)) + '">' +
        icon('i-whatsapp', 'icon') + 'Order this pack</a>' +
        '<button class="btn btn--outline btn--small" type="button" data-respin>Spin again</button></div>';
      wireLinks(card);
      empty.hidden = true;
      card.hidden = false;
      card.querySelector('[data-respin]').addEventListener('click', spin);
      live.textContent = "Tonight's pick: " + f.pack + '. You add ' + youAdd(f) + '.';
      if (card.animate && !reduceMotion) {
        card.animate([{ opacity: 0, transform: 'translateY(18px) rotate(-2deg)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.34,1.56,.64,1)' });
      }
    }

    // small tween helper (no library needed)
    function tween(from, to, ms, ease, onUpdate, done) {
      var t0 = performance.now();
      function frame(now) {
        var t = Math.min(1, (now - t0) / ms);
        onUpdate(from + (to - from) * ease(t));
        if (t < 1) requestAnimationFrame(frame); else if (done) done();
      }
      requestAnimationFrame(frame);
    }
    var easeOutQuart = function (t) { return 1 - Math.pow(1 - t, 4); };
    var easeInOut = function (t) { return 0.5 - Math.cos(Math.PI * t) / 2; };

    var lastTick = -1, lastTickAt = 0;
    function tick(deg) {
      var idx = Math.floor((((-deg) % 360) + 360) % 360 / seg);
      if (idx !== lastTick) {
        lastTick = idx;
        var now = performance.now();
        if (ladle.animate && now - lastTickAt > 70) {
          lastTickAt = now;
          ladle.animate([{ transform: 'translateX(-50%) rotate(-14deg)' }, { transform: 'translateX(-50%) rotate(0deg)' }], { duration: 160, easing: 'ease-out' });
        }
      }
    }

    function spin() {
      if (spinning) return;
      var pool = S.logic.eligible(flavours, selected);
      var choices = pool.map(function (f) { return flavours.indexOf(f); });
      if (choices.length > 1) choices = choices.filter(function (i) { return i !== lastPick; });
      var pick = choices[Math.floor(Math.random() * choices.length)];
      lastPick = pick;
      var jitter = (Math.random() * 2 - 1) * (seg / 2 - 6);
      var target = S.logic.spinTarget(rotation, pick, count, jitter, 4 + Math.floor(Math.random() * 2));
      slices.forEach(function (s) { s.classList.remove('is-win'); });

      var finish = function () {
        spinning = false;
        spinBtn.disabled = false;
        slices[pick].classList.add('is-win');
        showResult(flavours[pick]);
      };
      if (reduceMotion) { setRotation(target); finish(); return; }

      spinning = true;
      spinBtn.disabled = true;
      tween(rotation, target + 5, 3800, easeOutQuart, function (v) { setRotation(v); tick(v); }, function () {
        tween(rotation, target, 520, easeInOut, setRotation, finish);
      });
    }
    spinBtn.addEventListener('click', spin);
    setRotation(-seg / 2);
    updateDim();
  }

  /* ---------- stamps: fit each ring of text to its circle ---------- */
  function stamps() {
    var C = 2 * Math.PI * 44 * 0.97;
    $$('.stamp text').forEach(function (t) {
      var len = t.getComputedTextLength ? t.getComputedTextLength() : 0;
      if (!len) return;
      var fs = parseFloat(getComputedStyle(t).fontSize) || 10;
      t.style.fontSize = Math.min(12, fs * C / len).toFixed(2) + 'px';
    });
  }


  /* ---------- pause CSS loops while they're off screen ---------- */
  function loops() {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-paused', !en.isIntersecting); });
    });
    $$('[data-loop]').forEach(function (el) { io.observe(el); });
  }

  /* ---------- receipt barcode ---------- */
  function barcode() {
    var svg = $('#barcode');
    if (!svg) return;
    var x = 0, out = '', seed = 7;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    while (x < 196) {
      var w = rnd() < 0.3 ? 3 : rnd() < 0.5 ? 2 : 1;
      out += '<rect x="' + x + '" y="0" width="' + w + '" height="44"/>';
      x += w + (rnd() < 0.5 ? 2 : 3);
    }
    svg.innerHTML = out;
  }

  /* ---------- reviews carousel ---------- */
  function reviews() {
    var items = $$('.review');
    var countEl = $('#review-count');
    if (!items.length) return;
    var i = 0;
    function show(n) {
      i = (n + items.length) % items.length;
      items.forEach(function (el, k) {
        var on = k === i;
        el.classList.toggle('is-active', on);
        el.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
      countEl.textContent = (i + 1) + ' / ' + items.length;
      if (S.ui.reviewIn) S.ui.reviewIn(items[i]);
    }
    $('#review-prev').addEventListener('click', function () { show(i - 1); });
    $('#review-next').addEventListener('click', function () { show(i + 1); });
    show(0);
  }

  renderFlavours();
  renderPouches(document);
  wireLinks(document);
  marquee();
  nav();
  timer();
  decider();
  barcode();
  reviews();
  loops();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(stamps); else stamps();
})();
