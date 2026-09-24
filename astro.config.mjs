// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://shockwavestudios.co',
  // Inline page CSS into the HTML: the separate stylesheet requests were
  // render-blocking on mobile (~0.9s). Each page's CSS is only a few KB.
  build: { inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/intake'),
    }),
  ]
});