/**
 * The motion system. Pages opt in with data attributes, no per-page JS:
 *
 *   data-reveal            fade and lift into view (data-reveal-delay="0.2")
 *   data-stagger           the element's children cascade in one after another
 *   data-split             headline rises word by word from behind a mask
 *   data-count="1400"      counts up from 0 (data-count-prefix / -suffix);
 *                          only ever use a number already approved in the brain
 *   data-magnetic          pulls toward the cursor (desktop only, see below)
 *   data-parallax="0.15"   drifts at a fraction of scroll speed (desktop only)
 *
 * Built for phones first (rewritten 2026-09-24 after a PageSpeed audit). The
 * old version ran GSAP on every element at load, which cost ~2.9s of main
 * thread on a throttled phone and kept the hero headline invisible until it
 * finished. Now:
 *   - The work is CSS. This file only adds classes, so there are no inline
 *     transforms left behind to fight hover styles, and no layout reads.
 *   - IntersectionObserver decides when things enter, plus a cheap check
 *     every 250ms while scrolling that catches anything flung past.
 *   - GSAP and Lenis (smooth scroll, magnetic buttons, parallax) load only on
 *     desktop with a mouse, after the page is idle: ./motion-desktop.ts.
 *   - Above-the-fold hero content does not use these attributes at all; it
 *     animates in pure CSS so the headline paints immediately.
 *
 * Safety: nothing is hidden until this file runs. An inline script in
 * Layout.astro adds `motion` to <html> before paint (skipped for reduced
 * motion), the CSS hides opt-in elements only under that class, and a 2.5s
 * failsafe there removes the class if this module never marks itself ready.
 */

const root = document.documentElement;
export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Wraps each word in a mask so it can rise into place. Splits text nodes
 *  only, so inner markup (the hero highlight span) survives. Words stay real
 *  text, so screen readers read the sentence normally. */
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

function countUp(el: HTMLElement) {
  const target = parseFloat(el.dataset.count || '0');
  const prefix = el.dataset.countPrefix || '';
  const suffix = el.dataset.countSuffix || '';
  const fmt = (n: number) => prefix + Math.round(n).toLocaleString('en-US') + suffix;
  const t0 = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / 1600);
    el.textContent = fmt(target * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function init() {
  const pending = new Set<HTMLElement>();

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (el.dataset.revealDelay) el.style.setProperty('--d', `${el.dataset.revealDelay}s`);
    pending.add(el);
  });
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((wrap) => {
    [...wrap.children].forEach((kid, i) => (kid as HTMLElement).style.setProperty('--d', `${i * 0.06}s`));
    pending.add(wrap);
  });
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    splitWords(el).forEach((w, i) => w.style.setProperty('--i', String(i)));
    el.classList.add('is-split');
    pending.add(el);
  });
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    el.textContent = (el.dataset.countPrefix || '') + '0' + (el.dataset.countSuffix || '');
    pending.add(el);
  });

  const reveal = (el: HTMLElement) => {
    if (!pending.delete(el)) return;
    io.unobserve(el);
    el.classList.add('is-in');
    if (el.dataset.count) countUp(el);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      // Entering, or already above the viewport (a fling skipped past it).
      if (e.isIntersecting || e.boundingClientRect.top < 0) reveal(e.target as HTMLElement);
    });
  }, { rootMargin: '0px 0px -4% 0px' });
  pending.forEach((el) => io.observe(el));

  // Belt and braces for fast flings: while scrolling, every 250ms reveal
  // anything whose top is already above the bottom of the screen. Reads only,
  // so it never forces a layout mid-frame; stops once everything is in.
  let timer = 0;
  const sweep = () => {
    timer = 0;
    const line = window.innerHeight;
    [...pending].forEach((el) => { if (el.getBoundingClientRect().top < line) reveal(el); });
    if (!pending.size) window.removeEventListener('scroll', onScroll);
  };
  const onScroll = () => { if (!timer) timer = window.setTimeout(sweep, 250); };
  window.addEventListener('scroll', onScroll, { passive: true });
}

if (reduced || !('IntersectionObserver' in window)) {
  root.classList.remove('motion');
} else {
  try {
    init();
    (window as any).__motionReady = true;
    root.classList.add('motion-ready');
  } catch (err) {
    console.error('motion init failed', err);
    root.classList.remove('motion');
  }

  // Desktop extras, after the page is idle so they never compete with first paint.
  if (finePointer) {
    const load = () => import('./motion-desktop').catch(() => {});
    const idle = (window as any).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1200));
    if (document.readyState === 'complete') idle(load);
    else window.addEventListener('load', () => idle(load), { once: true });
  }
}
