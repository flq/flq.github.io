import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { extractExcerptPlugin } from "./support/extract-excerpt.mjs";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  site: "https://realfiction.net",
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // or "modern"
        }
      }
    }
  },
  integrations: [
    expressiveCode({ themes: ["dracula"] }),
    mdx({
      remarkPlugins: [extractExcerptPlugin],
    }),
    sitemap(),
  ],
});
