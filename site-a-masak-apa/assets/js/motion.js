/* Concept A: animation layer (GSAP + ScrollTrigger + SplitText + Lenis).
 * Everything here is optional: if the CDN scripts fail or the visitor prefers
 * reduced motion, the page stays fully readable and usable without it. */
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

  /* ---------- smooth scroll ---------- */
  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.11, smoothWheel: true });
    S.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2 && id !== '#') return;
    var target = id === '#' || id === '#top' ? 0 : document.querySelector(id);
    if (target === null) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    else target.scrollIntoView({ behavior: 'smooth' });
    if (target !== 0 && target.focus) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
  });

  function draw(els, vars) {
    return gsap.fromTo(els, { strokeDasharray: 1, strokeDashoffset: 1 }, Object.assign({ strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, vars || {}));
  }

  function split(el) {
    if (!SplitText) return null;
    return SplitText.create(el, { type: 'words', mask: 'words', wordsClass: 'w' });
  }

  /* ---------- hero: the one orchestrated moment ---------- */
  function hero() {
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    var words = [];
    $$('.hero__line').forEach(function (line) { var s = split(line); if (s) words = words.concat(s.words); });

    gsap.set('.hero__lede, .hero__cta > *', { autoAlpha: 0, y: 24 });
    gsap.set('.site-nav a', { autoAlpha: 0, y: -10 });
    gsap.set('.brand img', { scale: 0.5, rotate: -12, autoAlpha: 0 });
    gsap.set('.hero__pack--c', { yPercent: 60, autoAlpha: 0 });
    gsap.set('.hero__pack--l', { yPercent: 70, rotate: -24, autoAlpha: 0 });
    gsap.set('.hero__pack--r', { yPercent: 70, rotate: 24, autoAlpha: 0 });
    gsap.set('.hero__callout, .hero__note', { autoAlpha: 0 });
    gsap.set('.hero__spark, .hero__note-flower', { scale: 0, rotate: -90 });
    if (words.length) gsap.set(words, { yPercent: 115, rotate: 7 });

    tl.from('.topbar', { yPercent: -100, duration: 0.6 })
      .to('.brand img', { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.9, ease: 'back.out(2.2)', clearProps: 'transform' }, 0.1)
      .to('.site-nav a', { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.5 }, 0.35);
    if (words.length) tl.to(words, { yPercent: 0, rotate: 0, stagger: 0.07, duration: 0.95, ease: 'back.out(1.7)' }, 0.35);
    tl.to('.hero__lede', { autoAlpha: 1, y: 0, duration: 0.8 }, 0.95)
      .to('.hero__cta > *', { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'back.out(1.6)', clearProps: 'transform' }, 1.05)
      .add(draw('.hero__anise, .hero__chilli, .hero__grass', { duration: 1.3, stagger: 0.15 }), 1.0)
      .to('.hero__spark', { scale: 1, rotate: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(3)' }, 1.3)
      .to('.hero__pack--c', { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: 'back.out(1.25)' }, 1.15)
      .to('.hero__pack--l', { yPercent: 0, rotate: -11, autoAlpha: 1, duration: 1.1, ease: 'back.out(1.3)' }, 1.3)
      .to('.hero__pack--r', { yPercent: 0, rotate: 10, autoAlpha: 1, duration: 1.1, ease: 'back.out(1.3)' }, 1.38)
      .to('.hero__callout', { autoAlpha: 1, duration: 0.5 }, 1.9)
      .from('.hero__callout', { x: -24, duration: 0.7 }, 1.9)
      .add(draw('.hero__callout-arrow', { duration: 0.8 }), 2.05)
      .to('.hero__note', { autoAlpha: 1, duration: 0.5 }, 2.1)
      .from('.hero__note p', { clipPath: 'inset(0 100% 0 0)', duration: 0.9, ease: 'power2.inOut' }, 2.1)
      .to('.hero__note-flower', { scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(2.5)' }, 2.25)
      .add(draw('.hero__note-line', { duration: 0.7 }), 2.45)
      ;

    // gentle idle life once the hero has landed
    tl.add(function () {
      var idle = [
        gsap.to('.hero__pack--c .pouch', { y: -8, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut' }),
        gsap.to('.hero__pack--l .pouch, .hero__pack--r .pouch', { y: -6, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.6 }),
        gsap.to('.hero__anise', { rotate: 20, duration: 14, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      ];
      ScrollTrigger.create({ trigger: '.hero', start: 'top bottom', end: 'bottom top', onToggle: function (s) { idle.forEach(function (t) { if (s.isActive) t.resume(); else t.pause(); }); } });
    });

    // doodles drift as the hero scrolls away
    gsap.to('.hero__doodles', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* ---------- section headings, eyebrows, doodles ---------- */
  function headings() {
    $$('.reveal-title').forEach(function (h) {
      var s = split(h);
      if (!s) return;
      gsap.from(s.words, {
        yPercent: 110, rotate: 6, duration: 0.9, stagger: 0.06, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: h, start: 'top 86%', once: true }
      });
    });
    $$('.section .eyebrow').forEach(function (e) {
      gsap.from(e, { autoAlpha: 0, x: -16, duration: 0.7, scrollTrigger: { trigger: e, start: 'top 90%', once: true } });
    });
    $$('.section .doodle.draw, .timer__after-arrow').forEach(function (d) {
      gsap.set(d, { strokeDasharray: 1, strokeDashoffset: 1 });
      ScrollTrigger.create({ trigger: d, start: 'top 85%', once: true, onEnter: function () { draw(d, { duration: 1.1 }); } });
    });
  }

  /* ---------- flavour cards ---------- */
  function cards() {
    var els = $$('.fl-card');
    gsap.set(els, { autoAlpha: 0, y: 70, rotate: function (i) { return i % 2 ? 2.5 : -2.5; } });
    ScrollTrigger.batch(els, {
      start: 'top 90%', once: true,
      onEnter: function (batch) { gsap.to(batch, { autoAlpha: 1, y: 0, rotate: 0, duration: 0.9, stagger: 0.09, ease: 'back.out(1.4)', clearProps: 'transform' }); }
    });
  }

  /* ---------- pinned, scroll-driven timer (desktop) ---------- */
  function timer() {
    var panel = $('#timer-panel');
    if (!panel || !S.ui.timerSetStep) return;
    var mm = gsap.matchMedia();
    mm.add('(min-width: 1025px) and (min-height: 700px)', function () {
      var steps = S.ui.timerSteps;
      var st = ScrollTrigger.create({
        trigger: panel, start: 'center center', end: '+=1700', pin: true, pinSpacing: true,
        onUpdate: function (self) {
          var p = Math.min(0.9999, self.progress) * steps;
          var i = Math.floor(p);
          S.ui.timerSetStep(i);
          S.ui.timerSetProgress(i, p - i);
        }
      });
      S.ui.timerScrollTo = function (i) {
        var y = st.start + (st.end - st.start) * ((i + 0.55) / steps);
        if (lenis) lenis.scrollTo(y, { duration: 1 }); else window.scrollTo({ top: y, behavior: 'smooth' });
        return true;
      };
      return function () { S.ui.timerScrollTo = null; };
    });
    gsap.from(panel, { y: 60, opacity: 0, rotate: -1.5, duration: 1, ease: 'back.out(1.3)', scrollTrigger: { trigger: panel, start: 'top 88%', once: true } });
  }

  /* ---------- decider entrance ---------- */
  function decider() {
    gsap.from('.plate', { rotate: -120, scale: 0.7, opacity: 0, duration: 1.4, ease: 'back.out(1.2)', scrollTrigger: { trigger: '.decider__stage', start: 'top 80%', once: true } });
    gsap.from('.plate__ladle', { yPercent: -80, autoAlpha: 0, duration: 0.8, delay: 0.7, ease: 'back.out(2)', scrollTrigger: { trigger: '.decider__stage', start: 'top 80%', once: true } });
    gsap.from('.chip-btn', { y: 20, autoAlpha: 0, stagger: 0.06, duration: 0.6, ease: 'back.out(2)', clearProps: 'transform', scrollTrigger: { trigger: '.decider__chips', start: 'top 88%', once: true } });
    gsap.from('.result', { x: 40, opacity: 0, rotate: 3, duration: 1, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.decider__stage', start: 'top 75%', once: true } });
  }

  /* ---------- receipt prints out ---------- */
  function receipt() {
    var r = $('#receipt');
    if (!r) return;
    var tl = gsap.timeline({ scrollTrigger: { trigger: r, start: 'top 78%', once: true } });
    tl.fromTo('.receipt__inner', { clipPath: 'inset(0 0 100% 0)', y: -30 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.6, ease: 'steps(14)' })
      .from('.receipt__rows > div, .receipt__total', { autoAlpha: 0, x: -10, stagger: 0.09, duration: 0.4 }, 0.5)
      .from('#barcode rect', { scaleY: 0, transformOrigin: '50% 100%', stagger: 0.006, duration: 0.3 }, 1.2)
      .from('.why__heart', { scale: 0, rotate: -40, stagger: 0.12, duration: 0.7, ease: 'back.out(3)' }, 1.1);
    gsap.from('.stamp', { scale: 0.4, rotate: -120, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.stamps', start: 'top 90%', once: true } });
  }

  /* ---------- reviews + find us ---------- */
  function rest() {
    gsap.from('.reviews__quote', { scale: 0, rotate: -30, duration: 0.9, ease: 'back.out(2.4)', scrollTrigger: { trigger: '.reviews', start: 'top 75%', once: true } });
    S.ui.reviewIn = function (el) {
      var p = el.querySelector('p');
      gsap.fromTo(p, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'back.out(1.5)' });
    };
    var f = $$('.fcard');
    gsap.set(f, { autoAlpha: 0, y: 60, scale: 0.96 });
    ScrollTrigger.batch(f, {
      start: 'top 92%', once: true,
      onEnter: function (b) { gsap.to(b, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.08, ease: 'back.out(1.4)', clearProps: 'transform' }); }
    });
    S.ui.menuIn = function (menu) {
      gsap.fromTo($$('.menu__links a, .menu .btn, .menu__note', menu), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.6, ease: 'back.out(1.6)' });
      gsap.fromTo('.menu__doodle', { rotate: -90, scale: 0.6 }, { rotate: 0, scale: 1, duration: 1.2, ease: 'back.out(1.4)' });
    };
    // loops pause off screen
    $$('.marquee').forEach(function (m) {
      ScrollTrigger.create({ trigger: m, start: 'top bottom', end: 'bottom top', onToggle: function (s) { m.querySelector('.marquee__track').style.animationPlayState = s.isActive ? 'running' : 'paused'; } });
    });
  }

  function start() {
    document.documentElement.classList.add('is-ready');
    hero();
    headings();
    cards();
    timer();
    decider();
    receipt();
    rest();
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  // Split text only after the web fonts have loaded, so line breaks don't shift.
  var started = false;
  function go() { if (!started) { started = true; start(); } }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(go);
    setTimeout(go, 2500);
  } else {
    go();
  }
})();
