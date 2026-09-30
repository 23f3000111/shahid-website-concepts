/* Concept B: animation layer (GSAP + ScrollTrigger + SplitText + Lenis).
 * Optional by design: without it (CDN down, reduced motion) the page is
 * complete and usable. */
(function () {
  'use strict';
  var S = window.SHAHID || {};
  S.ui = S.ui || {};
  var gsap = window.gsap;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!gsap || !window.ScrollTrigger || reduce) return;

  var ScrollTrigger = window.ScrollTrigger;
  var SplitText = window.SplitText;
  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);
  document.documentElement.classList.add('js-anim');

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- smooth scroll ---------- */
  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    S.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function scrollToY(y, dur) {
    if (lenis) lenis.scrollTo(y, { duration: dur || 1.4 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    var target = id === '#' || id === '#top' ? 0 : document.querySelector(id);
    if (target === null) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.5 });
    else if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    else target.scrollIntoView({ behavior: 'smooth' });
    if (target !== 0 && target.focus) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
  });

  function wdthOf(el, fallback) {
    var v = parseFloat(getComputedStyle(el).getPropertyValue('--wdth'));
    return isNaN(v) ? fallback : v;
  }

  /* ---------- hero: the one big entrance ---------- */
  function hero() {
    var words = $$('.hero__word');
    var spices = $$('.spice');
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    gsap.set(words, { yPercent: 105, '--wdth': 34, autoAlpha: 0, rotate: -3, transformOrigin: '0% 100%' });
    gsap.set('.hero__lede, .hero__cta > *, .hero__corner', { autoAlpha: 0, y: 24 });
    gsap.set('.hero__pan', { rotate: -150, scale: 0.55, autoAlpha: 0 });
    gsap.set('.hero__pouch', { y: -520, rotate: -42, autoAlpha: 0 });
    gsap.set(spices, { scale: 0, autoAlpha: 0 });
    gsap.set('.hero__sticker', { scale: 0, rotate: -200 });
    gsap.set('.hdr > *', { y: -30, autoAlpha: 0 });

    tl.to('.hdr > *', { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.8, clearProps: 'transform' }, 0)
      .to(words, { yPercent: 0, '--wdth': 92, autoAlpha: 1, rotate: 0, duration: 1.1, stagger: 0.17 }, 0.15)
      .to('.hero__pan', { rotate: 0, scale: 1, autoAlpha: 1, duration: 1.6 }, 0.55)
      .to('.hero__pouch', { y: 0, rotate: -10, autoAlpha: 1, duration: 1.2, ease: 'back.out(1.7)' }, 0.95)
      .to(spices, {
        scale: 1, autoAlpha: 1, duration: 1.2, stagger: 0.07,
        startAt: { x: function (i, el) { return (el.parentElement.offsetWidth / 2 - el.offsetLeft - el.offsetWidth / 2) * 0.6; }, y: function (i, el) { return (el.parentElement.offsetHeight / 2 - el.offsetTop - el.offsetHeight / 2) * 0.6; } },
        x: 0, y: 0
      }, 1.1)
      .to('.hero__sticker', { scale: 1, rotate: 0, duration: 1.1, ease: 'back.out(1.8)' }, 1.3)
      .to('.hero__lede', { autoAlpha: 1, y: 0, duration: 0.9 }, 0.95)
      .to('.hero__cta > *', { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'back.out(1.8)', clearProps: 'transform' }, 1.1)
      .to('.hero__corner', { autoAlpha: 1, y: 0, duration: 0.8 }, 1.5);

    tl.add(function () {
      var idle = [gsap.to('.hero__pan img', { rotate: '+=360', duration: 90, ease: 'none', repeat: -1 })];
      spices.forEach(function (s, i) {
        idle.push(gsap.to(s, { yPercent: i % 2 ? 14 : -14, duration: 2.4 + i * 0.35, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
      });
      idle.push(gsap.to('.hero__pouch .pouch', { y: -10, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
      ScrollTrigger.create({ trigger: '.hero', start: 'top bottom', end: 'bottom top', onToggle: function (st) { idle.forEach(function (t) { if (st.isActive) t.resume(); else t.pause(); }); } });
      if (finePointer) parallax(spices);
    });

    // scroll away
    gsap.to('.hero__copy', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__art', { yPercent: 12, rotate: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  function parallax(items) {
    var hero = $('.hero');
    var movers = items.map(function (el) {
      var d = parseFloat(el.getAttribute('data-depth')) || 1;
      return { d: d, x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3' }) };
    });
    var pouchX = gsap.quickTo('.hero__pouch', 'x', { duration: 1, ease: 'power3' });
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var mx = (e.clientX - r.left) / r.width - 0.5, my = (e.clientY - r.top) / r.height - 0.5;
      movers.forEach(function (m) { m.x(mx * 50 * m.d); m.y(my * 40 * m.d); });
      pouchX(mx * -18);
    });
  }

  /* ---------- headings: words stretch in from narrow ---------- */
  function headings() {
    $$('.sec-head .h2, .ugc__head .h2').forEach(function (h) {
      if (!SplitText) return;
      var target = wdthOf(h, 75);
      var s = SplitText.create(h, { type: 'words', mask: 'words', wordsClass: 'w' });
      gsap.fromTo(s.words, { yPercent: 105, '--wdth': 30 }, {
        yPercent: 0, '--wdth': target, duration: 1.1, stagger: 0.08, ease: 'expo.out',
        scrollTrigger: { trigger: h, start: 'top 86%', once: true }
      });
    });
    $$('.sec-head__aside, .ugc__head p').forEach(function (p) {
      gsap.fromTo(p, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: p, start: 'top 90%', once: true } });
    });
  }

  /* ---------- statement ---------- */
  function statement() {
    var tl = gsap.timeline({ scrollTrigger: { trigger: '.statement__title', start: 'top 80%', once: true } });
    tl.fromTo('.statement__title', { yPercent: 18, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1, ease: 'expo.out' })
      .fromTo('.pill-img', { scale: 0, rotate: -25 }, { scale: 1, rotate: 0, duration: 0.8, stagger: 0.12, ease: 'back.out(2.4)' }, 0.3)
      .fromTo('.statement__lede', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.45)
      .fromTo('.statement__stockist', { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: 1, ease: 'expo.inOut' }, 0.55)
      .fromTo('.statement .btn', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'back.out(2)', clearProps: 'transform' }, 0.8);
    $$('.bowl').forEach(function (b) {
      var sp = parseFloat(b.getAttribute('data-speed')) || 0;
      gsap.fromTo(b, { yPercent: -sp }, { yPercent: sp, ease: 'none', scrollTrigger: { trigger: '.bowls', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo(b.querySelector('img'), { rotate: -25 }, { rotate: 25, ease: 'none', scrollTrigger: { trigger: '.bowls', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.fromTo('.tearline', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power2.inOut', scrollTrigger: { trigger: '.statement', start: 'top 85%', once: true } });
  }

  /* ---------- the lineup: pinned, sideways, colour-shifting ---------- */
  function lineup() {
    var pin = $('#lineup-pin'), track = $('#lineup-track');
    if (!pin || !track) return;
    var mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', function () {
      var panels = $$('.lu-intro, .lu-panel', track);
      var n = panels.length;
      var colors = [getComputedStyle(pin).backgroundColor].concat(S.flavours.map(function (f) { return f.color; }));
      var fgs = ['#FFF4E2'].concat(S.flavours.map(function (f) { return f.textOn === 'dark' ? '#3B0D0C' : '#FFF4E2'; }));
      var dist = function () { return track.scrollWidth - window.innerWidth; };
      var lastHud = -1;

      var tween = gsap.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: {
          trigger: pin, pin: true, start: 'top top', end: function () { return '+=' + dist(); },
          scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: function (self) {
            var p = self.progress * (n - 1);
            var i = Math.min(n - 2, Math.floor(p)), t = p - i;
            var blend = Math.min(1, Math.max(0, (t - 0.38) / 0.24));
            pin.style.backgroundColor = gsap.utils.interpolate(colors[i], colors[i + 1], blend);
            var near = Math.round(p);
            if (near !== lastHud) { lastHud = near; pin.style.setProperty('--hud', fgs[near]); }
            if (S.ui.lineupHud) S.ui.lineupHud(near, self.progress);
          }
        }
      });
      var st = tween.scrollTrigger;
      S.ui.lineupGo = function (i) {
        scrollToY(st.start + (st.end - st.start) * (i / (n - 1)), 1.6);
        return true;
      };

      panels.forEach(function (panel, k) {
        if (k === 0) return;
        var name = panel.querySelector('.lu-panel__name');
        var sc = { trigger: panel, containerAnimation: tween };
        gsap.fromTo(name, { '--wdth': 34 }, { '--wdth': 90, ease: 'none', scrollTrigger: Object.assign({ start: 'left 90%', end: 'left 25%', scrub: true }, sc) });
        gsap.fromTo(panel.querySelector('.lu-panel__pouch'), { rotate: -32, yPercent: 26 }, { rotate: 8, yPercent: -8, ease: 'none', scrollTrigger: Object.assign({ start: 'left right', end: 'right left', scrub: true }, sc) });
        gsap.fromTo(panel.querySelector('.lu-panel__photo'), { rotate: -50 }, { rotate: 50, ease: 'none', scrollTrigger: Object.assign({ start: 'left right', end: 'right left', scrub: true }, sc) });
        gsap.fromTo(panel.querySelector('.lu-panel__ghost'), { xPercent: 18 }, { xPercent: -18, ease: 'none', scrollTrigger: Object.assign({ start: 'left right', end: 'right left', scrub: true }, sc) });
        gsap.fromTo(panel.querySelectorAll('.lu-panel__copy > :not(.lu-panel__name)'), { y: 36, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.7, ease: 'expo.out', clearProps: 'transform',
          scrollTrigger: Object.assign({ start: 'left 65%', toggleActions: 'play none none reverse' }, sc)
        });
      });
      return function () { S.ui.lineupGo = null; pin.style.backgroundColor = ''; };
    });

    var intro = $('.lu-intro__title');
    if (intro && SplitText) {
      var s = SplitText.create(intro, { type: 'words', mask: 'words', wordsClass: 'w' });
      gsap.fromTo(s.words, { yPercent: 105, '--wdth': 30 }, { yPercent: 0, '--wdth': 66, duration: 1.1, stagger: 0.09, ease: 'expo.out', scrollTrigger: { trigger: '#lineup', start: 'top 65%', once: true } });
    }
    gsap.fromTo('.lu-dot', { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, clearProps: 'transform', stagger: 0.05, duration: 0.6, ease: 'back.out(2.5)', scrollTrigger: { trigger: '#lineup', start: 'top 55%', once: true } });
  }

  /* ---------- how it works ---------- */
  function how() {
    $$('.step').forEach(function (step) {
      var word = step.querySelector('.step__word');
      var target = wdthOf(word, 58);
      // Stretch only as wide as the word's own column allows, so it never runs into the illustration.
      var grow = function () {
        var range = document.createRange();
        range.selectNodeContents(word);
        var was = word.style.getPropertyValue('--wdth');
        var widest = S.logic.fitAxis(function (v) {
          word.style.setProperty('--wdth', v);
          return range.getBoundingClientRect().width;
        }, 34, target + 50, word.clientWidth - 16);
        if (was) word.style.setProperty('--wdth', was); else word.style.removeProperty('--wdth');
        return widest;
      };
      gsap.fromTo(word, { '--wdth': 34 }, { '--wdth': grow, ease: 'none', scrollTrigger: { trigger: step, start: 'top 92%', end: 'top 30%', scrub: true, invalidateOnRefresh: true } });
      gsap.fromTo(step.querySelector('.step__num'), { scale: 0, rotate: -180 }, { scale: 1, rotate: 0, duration: 0.9, ease: 'back.out(2.2)', scrollTrigger: { trigger: step, start: 'top 85%', once: true } });
      gsap.fromTo(step.querySelector('.step__art'), { scale: 0.4, autoAlpha: 0, rotate: 20 }, { scale: 1, autoAlpha: 1, rotate: 0, duration: 1, ease: 'back.out(1.8)', scrollTrigger: { trigger: step, start: 'top 85%', once: true } });
      gsap.fromTo(step.querySelector('.step__text'), { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.8, scrollTrigger: { trigger: step, start: 'top 85%', once: true } });
    });
  }

  /* ---------- recipes, ugc, reviews, order ---------- */
  function rest() {
    $$('.recipe').forEach(function (r, i) {
      gsap.fromTo(r, { x: i % 2 ? -90 : 90, autoAlpha: 0, rotate: i % 2 ? -2 : 2 }, { x: 0, autoAlpha: 1, rotate: 0, duration: 1, ease: 'expo.out', clearProps: 'transform', scrollTrigger: { trigger: r, start: 'top 88%', once: true } });
    });

    var row = $('#ugc-row');
    if (row) {
      gsap.fromTo(row, { x: function () { return window.innerWidth * 0.08; } }, {
        x: function () { return -(row.scrollWidth - window.innerWidth * 0.92); }, ease: 'none',
        scrollTrigger: { trigger: '.ugc', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true }
      });
      gsap.fromTo('.ugc__card', { yPercent: 30, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.08, duration: 1, ease: 'back.out(1.5)', scrollTrigger: { trigger: row, start: 'top 85%', once: true } });
    }

    S.ui.reviewIn = function () {
      gsap.fromTo('#rv-quote', { yPercent: 20, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out' });
      gsap.fromTo('#rv-initial', { scale: 0.3, rotate: -40 }, { scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(2.2)' });
      gsap.fromTo('#rv-pouch', { y: -60, rotate: -30, autoAlpha: 0 }, { y: 0, rotate: 8, autoAlpha: 1, duration: 0.9, ease: 'back.out(1.8)' });
    };
    gsap.fromTo('.reviews__card', { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.reviews__stage', start: 'top 82%', once: true } });
    gsap.fromTo('.reviews__flower', { scale: 0, rotate: -120 }, { scale: 1, rotate: 0, duration: 1.1, stagger: 0.15, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.reviews__stage', start: 'top 82%', once: true } });

    gsap.fromTo('.order__photo', { x: -70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.order__grid', start: 'top 80%', once: true } });
    gsap.fromTo('.order-form', { x: 70, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.order__grid', start: 'top 80%', once: true } });
    gsap.fromTo('.pack-row', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.5, ease: 'back.out(2)', scrollTrigger: { trigger: '.packs__grid', start: 'top 88%', once: true } });

    S.ui.menuIn = function (menu) {
      var links = $$('.menu__links a', menu);
      gsap.fromTo(links, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, stagger: 0.07, ease: 'expo.out' });
      gsap.fromTo('.menu__preview', { scale: 0.6, rotate: -30, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 1, ease: 'back.out(1.6)' });
      gsap.fromTo('.menu__foot', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, delay: 0.3 });
    };
  }

  /* ---------- marquee reacts to scroll speed ---------- */
  function marquee() {
    var track = $('#bigmarq');
    if (!track) return;
    var loop = gsap.to(track, { xPercent: -50, duration: 40, ease: 'none', repeat: -1, paused: true });
    var skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' });
    ScrollTrigger.create({
      trigger: '.bigmarq', start: 'top bottom', end: 'bottom top',
      onToggle: function (self) { if (self.isActive) loop.play(); else loop.pause(); },
      onUpdate: function (self) {
        var v = self.getVelocity();
        var speed = Math.min(7, 1 + Math.abs(v) / 350);
        gsap.to(loop, { timeScale: v < 0 ? -speed : speed, duration: 0.2, overwrite: true, onComplete: function () { gsap.to(loop, { timeScale: v < 0 ? -1 : 1, duration: 1.2 }); } });
        skew(Math.max(-12, Math.min(12, v / -220)));
        clearTimeout(marquee.t);
        marquee.t = setTimeout(function () { skew(0); }, 140);
      }
    });
    gsap.fromTo('.footer__giant svg', { yPercent: 55 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.footer__giant', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  }

  function start() {
    document.documentElement.classList.add('is-ready');
    hero();
    headings();
    statement();
    lineup();
    how();
    rest();
    marquee();
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  var started = false;
  function go() { if (!started) { started = true; start(); } }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(go);
    setTimeout(go, 2500);
  } else {
    go();
  }
})();
