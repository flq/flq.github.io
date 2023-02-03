import { CollectionEntry, getCollection } from "astro:content";
export default async function data() : Promise<CollectionEntry<"blog">[]> {
    const blogEntries = await getCollection("blog");
    const entries = blogEntries
        .sort(({ data: { date: b } }, { data: { date: a } }) => (a as any) - (b as any))
        .slice(0, 10);
    return entries;
}