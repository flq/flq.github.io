import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import { extractExcerptPlugin } from './support/extract-excerpt.mjs';

// https://astro.build/config
export default defineConfig({
  site: "https://realfiction.net",
  integrations: [mdx({
    remarkPlugins: [extractExcerptPlugin],
    syntaxHighlight: 'prism'
  }),
  sitemap()]
});