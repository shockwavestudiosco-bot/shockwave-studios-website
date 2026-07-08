// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://shockwavestudios.co',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/intake'),
    }),
  ]
});