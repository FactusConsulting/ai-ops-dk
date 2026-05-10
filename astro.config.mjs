// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ai-ops.dk',
  trailingSlash: 'ignore',

  build: {
    format: 'directory',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});