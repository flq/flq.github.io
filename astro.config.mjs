import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { extractExcerptPlugin } from "./support/extract-excerpt.mjs";
import rehypeMermaid from "rehype-mermaid";

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
      syntaxHighlight: {
        excludeLangs: ['mermaid']
      },
      remarkPlugins: [extractExcerptPlugin],
      rehypePlugins: [[rehypeMermaid, { strategy: "img-svg", dark: true, colorScheme: "forest" }]]
    }),
    sitemap(),
  ],
});
