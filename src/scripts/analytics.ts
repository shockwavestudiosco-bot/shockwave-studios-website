/**
 * Site-wide click and scroll events for GA4 (and Meta, once a Pixel exists).
 *
 * Both calls are guarded: the GA4 tag in Layout.astro only loads in production
 * builds and no Meta Pixel is installed yet, so in dev these are no-ops.
 *
 *   data-book="book_call_<where>"   any booking link, fires `book_call`
 *   data-track="<event>"            any other link, fires that event, with
 *   data-track-label="<label>"      an optional label
 *
 * FunnelCTA and InlineCTA keep their own handlers for now; they fire the same
 * `book_call` event shape, so reports stay comparable.
 */

type Params = Record<string, string | number>;

export function track(event: string, params: Params = {}) {
  const w = window as any;
  if (typeof w.gtag === 'function') w.gtag('event', event, params);
}

export function trackBooking(label: string) {
  const w = window as any;
  track('book_call', { event_category: 'conversion', event_label: label, page_path: location.pathname });
  if (typeof w.fbq === 'function') w.fbq('track', 'Schedule', { content_name: label });
}

document.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-book], [data-track]');
  if (!el) return;
  if (el.dataset.book) trackBooking(el.dataset.book);
  else if (el.dataset.track) track(el.dataset.track, { event_label: el.dataset.trackLabel || '', page_path: location.pathname });
});

// One scroll-depth event per page view, so before/after reads are possible.
let sent = false;
const onScroll = () => {
  if (sent) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max > 0 && window.scrollY / max >= 0.75) {
    sent = true;
    track('scroll_75', { page_path: location.pathname });
    window.removeEventListener('scroll', onScroll);
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
