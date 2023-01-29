import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { extractExcerptPlugin } from './support/extract-excerpt.mjs';

export default defineConfig({
  integrations: [
    mdx({
      remarkPlugins: [extractExcerptPlugin],
      syntaxHighlight: 'prism'
    }),
    react()
  ]
});