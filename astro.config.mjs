import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import remarkWikilinks from './src/lib/remark-wikilinks.mjs';

export default defineConfig({
  integrations: [
    react(),
    tailwind()
  ],
  markdown: {
    remarkPlugins: [remarkWikilinks],
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
