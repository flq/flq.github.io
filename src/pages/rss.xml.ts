import MarkdownIt from 'markdown-it';
import rss from '@astrojs/rss';
import type { RSSOptions } from '@astrojs/rss'
import query from "../components/mainPageQuery"
const parser = new MarkdownIt();

async function getItems(): Promise<RSSOptions["items"]> {
  const entries = await query();
  return entries.map(e => ({
    title: e.data.title,
    pubDate: e.data.date,
    link: `/posts/${e.slug}`,
    content: parser.render(e.body)
  }));
}

export async function get() {
  
  return rss({
    title: 'realfiction by Frank Quednau',
    description: 'RSS feed of the most recent 10 items',
    site: 'https://realfiction.net',
    items: await getItems(),
    customData: `<language>en-en</language>`,
  });
}