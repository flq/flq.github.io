import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
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
  markdown: {
    processor: unified({
      syntaxHighlight: {
        type: "shiki",
        excludeLangs: ["mermaid"]
      },
      remarkPlugins: [extractExcerptPlugin],
      rehypePlugins: [[rehypeMermaid, { strategy: "img-svg", dark: true, colorScheme: "forest" }]]
    })
  },
  integrations: [
    expressiveCode({ themes: ["dracula"] }),
    mdx(),
    sitemap({
      filter: page => !page.startsWith("https://realfiction.net/2245-ddlm-3321")
    }),
  ],
});
