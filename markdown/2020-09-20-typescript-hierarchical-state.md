---
title: "How to typescript: Representing hierarchical state with tuples"
tags: [programming, typescript]
date: 2020-09-20 19:30:00
---

For our latest feature in ahead, [messages][1], the UI is in one of three major states:

```typescript
type MessagingState = 
  | "IDLE" 
  | "STARTING_CONVERSATION" 
  | "ACTIVE_CONVERSATION";
```

A couple of iterations and additions later, the mode in which there is an active conversation had two sub-states, depending whether you are writing and looking at the latest messages or are browsing older messages. Some UI parts are only really interested in whether there is currently a conversation active or not.

One could expand the state of the UI with an additional property denoting that sub-state:

```typescript
{
  mainMode: MessagingState;
  subMode: "SYNCED" | "EXPLORING" | null;
}
```

While this certainly works, there is no quick way to consolidate into the type that the sub-state is only valid for one of the main states and not for the other.

> Well, there is. [The last post][previous] dealt with using discriminated unions for the state type as well. This has its own drawbacks, though - dealing with the type can become cumbersome.

So, here's another way to represent the dependency between main and sub-state, namely via tuples:

```typescript
type MessagingState = 
  | ["IDLE"] 
  | ["STARTING_CONVERSATION"] 
  | ["ACTIVE_CONVERSATION", "SYNCED" | "EXPLORING"];
```

It is now clear that only one of the main states has two further sub-states. However, 
checking against in which state we are can become cumbersome, 
as we can't just do an equality check of the state value but must rather check against the members of the tuple.

To overcome this, a helper function is introduced:

```typescript
function matches<
  T extends [string] | [string,string], 
  X extends T[0], 
  Y extends T[1]>(
  value: T,
  check: X,
  check2?: Extract<T, [X, Y]>[1],
) {
  return value[0] === check && (check2 ? value[1] === check2 : true);
}
```

it accepts
* a first value being a string-tuple with one or two members
* A second value that needs to be of the type of the first tuple member
* An optional third value that, if given, must correspond to the second tuple member in the context of the first member given 

The way the type of the function is defined allows to "check" the checks one writes down at compile-time. That is, the function only supports calls that correspond to valid states:

```typescript
const state = ["IDLE"] as MessagingState;

matches(state, "IDLE") // Compiles
matches(state, "BLA") // Doesn't Compile
matches(state, "ACTIVE_CONVERSATION") // Compiles
matches(state, "ACTIVE_CONVERSATION", "SYNCED") // Compiles
matches(state, "ACTIVE_CONVERSATION", "BLA") // Doesn't Compile
matches(state, "IDLE", "SYNCED") // Doesn't Compile
```

With this kind of state definition, UI code can now quickly check whether some state is given in general, or can make a stricter check whether some sub-state is currently set or not.

If you want to play around with this code, [you can visit this playground][2].

[1]: https://www.aheadintranet.com/release-notes/09-09-2020
[2]: https://www.typescriptlang.org/play?ts=4.0.2#code/C4TwDgpgBAysCGxoF4oG0BEBJAIgGQFEMBdKAH3QxgBUBBAJWqwDkBxAfWYIHV2BhAPLMAagXoxaTISXKU+ACVrMuedrT5NRGADRQqATWZ8CODLIwEAGgAU8A+i1YkA3ACgAxgHsAdgGdgUP6IEACMUKiYuIQy8L6wCEjOUAD0yVACANIePv6BCRAATOFyisoEquqaRLoWNnYObDFxcMFJqelZ7V5+AUFIAMzFkfjVela29o5N8a0paTieEHHengFeALZgAJYANhCurgBmAK7e7sBbPlDriO4AFksAPNRQEAAeSN4AJnFo-gBOW28AHNSBQ-sBASDdACgaDdJZXh8IN84tQ0AAGYi6fRIz4-KDokLEAB8AApXFAoAA3eA7Y4QABchO0lKg9wg7gA1szLKyqRzuQUAPzMggff7wc7PXRoPlQfSktDE1wASigAG82f8IMBjv9vDS6QzMaRkOb2Q9uVAAGQ2qBkwVcorCy2c53hC20+kQZWkZmQhmqtwAXwO3Vyhy2-1yqBuwA5vjJfVCNSiRGDcyggf2Ed6nJ8X2K8cTyfyBRqCiUKjUGiwWkzqRz2R62bu0aLcduDyTKYreirZQqda0NRghmMpkbyUOdN8+1c7WoDygh08Ox2ngA7nCoFs4nSt-AQHFZzt53vDcAV-9Thd1hBdAAjY4BLYBL6LXzeADkAQg1IouynibLsEAAHSLmkearp4+rXsW3ZLGWwT9tgIw6Ho45GCYGDBuGOTrhBm7AmSGpRjGwAwgW3y6NeHZQCGwZAA
[previous]: /2020/06/14/how-to-typescript-in-react-i-can-haz-better-component-states/