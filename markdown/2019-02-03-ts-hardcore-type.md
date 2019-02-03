---
title: "Typescript type shenanigans 2: specify at least one property"
tags: [web, typescript]
date: 2019-02-03 19:00:00
---

Here is a situation I came across recently - Some part of the system specified a qualified "link" to a page with the following type:

```typescript
type PageType = "Awesome" | "Basic";

interface Qualified {
    pageType: PageType;
    id: string;
};
```

Somewhere else it looked like that:

```typescript
interface Qualified {
    pageType: PageType;
    pageId: string;
}
```

I wanted some other part to be able to handle both shapes - a use case you'll come across quite a few times in javascript. 

```typescript
// Like this?
interface Qualified {
    pageType: PageType;
    pageId?: string;
    id?: string;
}
```

Examples are configuration objects, or intermediate releases to deprecate a previous "shape", etc. Now, Typescript's type system's primary objective seems to be to allow idiomatic javascript to be verified statically, so I googled around to see if somebody figured out a type to express the following:

> Given some type with n properties and z optional properties, I want a type that expresses that someone must specifiy at least one of the optional properties

What I found was [this wonderful answer][1] at Stackoverflow. The type that does as specified has the following form:

```typescript
type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
        [K in Keys]-?:
            Required<Pick<T, K>>
            & Partial<Record<Exclude<Keys, K>, undefined>>
    }[Keys]
```

and in the above example you use it as such:

```typescript
type PageHandle = RequireOnlyOne<Qualified, "id" | "pageId">;
```
The SO answer in fact fully plays through an example, but before delving in there you should know all of the in-built types and syntax in use.

#### Exclude

Taken [straight from the release notes][2]:

> Exclude<T, U> – Exclude from T those types that are assignable to U

Used on the **Keys** of a type, it has the following effect:

```typescript
type X = { foo: string, bar: string };
type Y = Exclude<keyof X, "foo">
// Y is now "bar";
```

#### Pick with Exclude

We also find within the same release notes the following statement

> We did not include the Omit<T, K> type because it is trivially written as Pick<T, Exclude<keyof T, K>>.

The idea of an `Omit` type is to "subtract" the specified properties from some parent type:

```typescript
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type X = { foo: string, bar: string };
type Y = Omit<X, "bar">;
// Y is now { foo: string }
```

Incidentally this is the first part of the `RequireOnlyOne` type, giving us the part of the type which we want to be specified in any case.

#### Advanced types

The following two types are covered in the "Advanced Types" section of [the handbook][3].

The **Record**-type allows types with n properties where all of the properties are of some specified type.
The **Partial**-type makes all properties of a type optional.

```typescript
type Z = Record<"one" | "two" | "three", string>
// Z is now { one:string; two:string; three:string; }
type W = Partial<Z>
// W is now { one?:string; two?:string; three?:string; }
```

Finally, the feature of **mapping types** is used, which allows something like projections over types. Here's a useless but illustrative example:

```typescript
type X = { foo: string, bar: number };
type Craze = { [P in keyof X]: { [K in P]: X[P] }}
// Craze is now { foo: { foo: string; }; bar: { bar: number; }; }
```

During the mapping, we can also remove any optionality defined on the property:

```typescript
type X = { foo?: string, bar?: number };
type Craze = { [P in keyof X]-?: { [K in P]: X[P] }}
// Craze is still { foo: { foo: string; }; bar: { bar: number; }; }
// since -? removed the optionality of the properties
```

I think that this gathers all the interesting in-built pieces used in `RequireOnlyOne` that by now you should be able to revisit [KPD][4]'s (Who are you?) exquisitely assembled type [in the given answer][1].


[1]: https://stackoverflow.com/a/49725198/51428
[2]:https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
[3]: https://www.typescriptlang.org/docs/handbook/advanced-types.html
[4]: https://stackoverflow.com/users/2077574/kpd