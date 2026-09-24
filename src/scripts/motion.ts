/**
 * The motion system. Pages opt in with data attributes, no per-page JS:
 *
 *   data-reveal            fade and lift into view (data-reveal-delay="0.2")
 *   data-stagger           the element's children cascade in one after another
 *   data-split             headline reveals word by word from behind a mask
 *   data-count="1400"      counts up from 0 (data-count-prefix / -suffix);
 *                          only ever use a number already approved in the brain
 *   data-magnetic          pulls toward the cursor on hover (fine pointers only)
 *   data-parallax="0.15"   drifts at a fraction of scroll speed
 *
 * Safety: nothing is hidden until this file runs. An inline script in
 * Layout.astro adds `motion` to <html> before paint (skipped for reduced
 * motion), CSS hides the opt-in elements only under that class, and a 2.5s
 * failsafe there removes the class if this module never arrives. So a blocked
 * or broken script leaves a finished, readable page, never a blank one.
 *
 * The older `.reveal` class (ScrollReveal.astro) still runs on the funnel
 * pages and is untouched by this file.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const EASE = 'expo.out';

/**
 * Runs `fn` once `el` peeks in at the bottom of the viewport, or is already
 * above that line. Measured live on every scroll frame instead of from cached
 * trigger positions: cached positions went stale when the page height shifted
 * on phones and left sections permanently invisible, and a fast fling past an
 * element could skip it. Checking "is it above the line yet?" cannot miss.
 */
const pending = new Map<Element, () => void>();
let ticking = false;

function checkPending() {
  ticking = false;
  // Start as soon as the element peeks in, so nothing looks late.
  const line = window.innerHeight * 0.98;
  for (const [el, fn] of pending) {
    if (el.getBoundingClientRect().top < line) { pending.delete(el); fn(); }
  }
}

const schedule = () => { if (!ticking) { ticking = true; requestAnimationFrame(checkPending); } };
window.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', schedule);
window.addEventListener('load', schedule);

(window as any).__motionReady = true;

if (reduced) {
  root.classList.remove('motion');
} else {
  try {
    initSmoothScroll();
    initSplit();
    initReveal();
    initStagger();
    initCount();
    initParallax();
    if (finePointer) initMagnetic();
    root.classList.add('motion-ready');
    // Fonts can shift layout after first measure; recalc trigger positions.
    document.fonts?.ready.then(() => { ScrollTrigger.refresh(); schedule(); });
  } catch (err) {
    // Any setup failure: show the finished page rather than hidden sections.
    console.error('motion init failed', err);
    root.classList.remove('motion');
    gsap.set('[data-reveal], [data-split], [data-split] .split-word, [data-stagger] > *', { clearProps: 'all' });
  }
}

function initSmoothScroll() {
  if (!finePointer) return; // touch devices keep native momentum scrolling
  const lenis = new Lenis({ duration: 1.1, anchors: true, prevent: (node: HTMLElement) => node.closest?.('[data-lenis-prevent]') != null });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.addEventListener('scroll-lock', () => lenis.stop());
  window.addEventListener('scroll-unlock', () => lenis.start());
  document.addEventListener('fullscreenchange', () => (document.fullscreenElement ? lenis.stop() : lenis.start()));
  (window as any).__lenis = lenis;
}

function onEnter(el: Element, fn: () => void) {
  pending.set(el, fn);
  schedule();
}

function initReveal() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.set(el, { autoAlpha: 0, y: 20 });
    onEnter(el, () =>
      gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE, delay: parseFloat(el.dataset.revealDelay || '0') })
    );
  });
}

function initStagger() {
  gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((wrap) => {
    const kids = [...wrap.children] as HTMLElement[];
    gsap.set(kids, { autoAlpha: 0, y: 24 });
    gsap.set(wrap, { autoAlpha: 1 });
    onEnter(wrap, () => gsap.to(kids, { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE, stagger: 0.05 }));
  });
}

/** Wraps every word in a mask so it can rise into place. Keeps inner markup
 *  (like the highlight span) by splitting text nodes only. */
function splitWords(el: HTMLElement) {
  const words: HTMLElement[] = [];
  const walk = (node: Node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent || '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const mask = document.createElement('span');
          mask.className = 'split-mask';
          const inner = document.createElement('span');
          inner.className = 'split-word';
          inner.textContent = part;
          mask.appendChild(inner);
          frag.appendChild(mask);
          words.push(inner);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(el);
  return words;
}

function initSplit() {
  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
    el.setAttribute('aria-label', el.textContent?.replace(/\s+/g, ' ').trim() || '');
    const words = splitWords(el);
    words.forEach((w) => w.setAttribute('aria-hidden', 'true'));
    gsap.set(words, { yPercent: 115 });
    gsap.set(el, { autoAlpha: 1 });
    const play = () => gsap.to(words, { yPercent: 0, duration: 0.8, ease: EASE, stagger: 0.035, delay: parseFloat(el.dataset.splitDelay || '0') });
    onEnter(el, play);
  });
}

function initCount() {
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count || '0');
    const prefix = el.dataset.countPrefix || '';
    const suffix = el.dataset.countSuffix || '';
    const fmt = (n: number) => prefix + Math.round(n).toLocaleString('en-US') + suffix;
    const obj = { n: 0 };
    el.textContent = fmt(0);
    onEnter(el, () => gsap.to(obj, { n: target, duration: 1.6, ease: 'power3.out', onUpdate: () => (el.textContent = fmt(obj.n)) }));
  });
}

function initParallax() {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = parseFloat(el.dataset.parallax || '0.15');
    gsap.to(el, {
      yPercent: amount * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement || el, start: 'top top', end: 'bottom top', scrub: true },
    });
  });
}

function initMagnetic() {
  gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

export { gsap, ScrollTrigger, reduced };
