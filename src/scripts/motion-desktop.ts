/**
 * Desktop-only motion: Lenis smooth scroll, magnetic buttons, parallax.
 * Loaded by ./motion.ts only for a mouse-driven device without reduced motion,
 * and only once the page is idle, so phones never download GSAP or Lenis.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.1,
  anchors: true,
  prevent: (node: HTMLElement) => node.closest?.('[data-lenis-prevent]') != null,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
window.addEventListener('scroll-lock', () => lenis.stop());
window.addEventListener('scroll-unlock', () => lenis.start());
document.addEventListener('fullscreenchange', () => (document.fullscreenElement ? lenis.stop() : lenis.start()));
if (document.documentElement.classList.contains('menu-locked')) lenis.stop();

gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
  const amount = parseFloat(el.dataset.parallax || '0.15');
  gsap.to(el, {
    yPercent: amount * 100,
    ease: 'none',
    scrollTrigger: { trigger: el.parentElement || el, start: 'top top', end: 'bottom top', scrub: true },
  });
});

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
