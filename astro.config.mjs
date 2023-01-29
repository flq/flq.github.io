import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import { extractExcerptPlugin } from './support/extract-excerpt.mjs';
// import react from "@astrojs/react";

export default defineConfig({
  markdown: {
    remarkPlugins: [extractExcerptPlugin],
    extendDefaultPlugins: true,
    syntaxHighlight: 'prism'
  },
  integrations: [
    mdx()
  ]
});