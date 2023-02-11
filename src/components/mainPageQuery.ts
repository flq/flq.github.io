import { CollectionEntry, getCollection } from "astro:content";
import { byDateDescending } from "./utils";
export default async function data() : Promise<CollectionEntry<"blog">[]> {
    const blogEntries = await getCollection("blog");
    const entries = blogEntries
        .sort(byDateDescending)
        .slice(0, 10);
    return entries;
}