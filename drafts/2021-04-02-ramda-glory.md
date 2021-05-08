---
title: "Ramda glory Pt. 1 / ?"
tags: [javascript, software-development, programming]
date: 2021-04-02 16:00:00
---

In our frontend code we have quite a bit of utility stuff, and I wanted to check out what of it would be replaceable by [Ramda], the functional library for js/ts folks. I haven't checked all functions, just a few as an example. While you can of course import ramda functions on their own, I imported all as R, so you can see which ones are the Ramda ones...

## flatMap

That's our signature

```typescript
flatMap<TIn, TOut>(
  array: TIn[], 
  mapper: (item: TIn, index: number, array: TIn[]) => TOut[]
): TOut[]
```

in Ramda, this is called a `chain` and is used like that:

```typescript
import * as R from "ramda";

const thingies = [
  { c: [1, 2, 3] }, 
  { c: [4, 5, 6] }]
const result = R.chain(x => x.c, thingies);
```

Note that in Ramda, the signatures always invit to be able to partially apply the arguments:

```typescript
const thingies = [
  { c: [1, 2, 3] }, 
  { c: [4, 5, 6] }]
const mapper = R.chain((x: typeof thingies[0]) => x.c);
console.log(mapper(thingies));
[ 1, 2, 3, 4, 5, 6 ]
```

## difference

Given an array and a second one, remove from the first those that are in the second:

```typescript
const diff = <T>(array1: T[], toRemove: T[]) =>
   R.filter(
     R.complement(R.includes(R.__, toRemove)), 
     array1);
```

Interesting here is the use of `__`, which allows to insert a placeholder that is respected in partial application, as well as the complement which, given a function that returns truthy, will then return falsy, and vice versa.

LOL, of course you could just use `difference` or `without` 😄x

## toLookupObject

We have a function that, given an array of objects. will create a single object where a chosen property of those objects becomes the _"lookup index"_

<Info>

This needs a little help of a type that allows to extract those keys of an object that return a given specified type:

```typescript
type OnlyKeysReturns<T, V> = 
  ({ [key in keyof T]: T[key] extends V ? 
    key : never})[keyof T]
type TypeOf<T> = T
```

ht to [Piotr Lewandowski][flagfilter]. At the end the type helps us only to call the function with correct types, unfortunately inside the lookup function the Typescript compiler is unable to discern that the return of using the provided key will always be a string.

</Info>

One way of defining this with Ramda could be:

```typescript
const toLookup = <T>(key: OnlyKeysReturns<T, string>, items: T[]) =>
  R.fromPairs(R.map(x => R.pair(x[key] as any as string, x), items))

const aList = [
  { name: "Joe", age: 23 },
  { name: "Sama", age: 34 }
]

console.log(toLookup("name", aList));

// { 
//  Joe: { name: 'Joe', age: 23 }, 
//  Sama: { name: 'Sama', age: 34 } 
// }
```

## omit

We have a function that actually removes specified properties from a list of equally typed objects. Ramda has it, too, in the equally named omit - however, the type provided for this function is not very satisfactory, as you can specifiy any property to be removed, and not just those specified by the type of the items.

...




[Ramda]: https://ramdajs.com/
[flagfilter]: https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c