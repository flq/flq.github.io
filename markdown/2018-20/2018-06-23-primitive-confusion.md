---
title: "Primitive Confusion"
layout: post
tags: [programming, fsharp, csharp]
date: 2018-06-23 22:00:00
---

My last post on primitive obsession has been [a while ago][1], whose predecessor is [even older][2].

Primitives are still bad. The following illustrative code just happened to me two days ago (it didn't reach production, but hey):

```csharp
public class Program
{
	public static string UserId => "u-123";
	public static string ProductId => "p-abc";
	
	public static void Order(string userId, string productId)
		=> System.Console.WriteLine($"User {userId} ordered {productId}");
	
	public static void Main() => Order(ProductId, UserId);
}
```

See the problem? Because we are the dealing with ids as strings, the compiler can't help us when we use APIs the wrong way. When you use the API correctly in unit tests it so can happen that confusing such IDs may only turn up in integration or, as the _very last resort_, production.

The same mistake can happen to us in other languages, too. Here's the example in F#:

```fsharp
let getUserId = "u-123"
let getProductId = "p-ABC"

let order userId productId = 
    printfn "user %s orders %s" userId productId

[<EntryPoint>]
let main argv =
    order getProductId getUserId
    0
```

The compiler happily does its job, no surprises. Obviously I chose F# as second example for a reason. Here, the barrier to type even singular primitives to provide improved compile time safety is considerably lower. Enter [**Discriminated Unions**][3].

They are something like the crack of type-safe pattern matching, or state representations on steroids or whatever you like to call them. Let's use them in our example:

```fsharp
type UserId = UserId of string
type ProductId = ProductId of string

let getUserId = UserId "u-123"
let getProductId = ProductId "p-ABC"

let order (UserId userId) (ProductId productId) =
    printfn "user %s orders %s" userId productId

[<EntryPoint>]
let main argv =
    order getUserId getProductId
    0
```

In this case the `userId` and `productId`are still essentially strings, but you can only get at them by acknowledging the type that is guarding those primitive values. It is hard to conceive and even smaller encoding of semantics with regard to some primitive value, which is why I highly approve of this use case of discriminated unions and often miss them in C#.



[1]: /2015/12/30/nmeasure-and-the-global-warming
[2]: /2010/11/30/dealing-with-primitive-obsession-this-time-measurements
[3]: https://fsharpforfunandprofit.com/posts/discriminated-unions/
