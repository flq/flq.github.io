import type { CollectionEntry } from "astro:content";

export function* windowIterator<T>(array: T[]): Generator<[T, T | undefined, T | undefined]> {
  if (array.length === 0) {
    return;
  }

  for (let i = 0; i < array.length; i++) {
    yield [array[i], array[i - 1], array[i + 1]];
  }
}

export function groupBy<T, K extends string | number | symbol>(items: T[], selector: (item: T) => K) {
  const result = {} as Record<K, T[]>;
  for (const item of items) {
    const key = selector(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
}


export function byDateAscending({data: { date: a } }: CollectionEntry<"blog">, {data: { date: b } }: CollectionEntry<"blog">) {
  return (a as any) - (b as any);
}

export function byDateDescending({data: { date: b } }: CollectionEntry<"blog">, {data: { date: a } }: CollectionEntry<"blog">) {
  return (a as any) - (b as any);
}