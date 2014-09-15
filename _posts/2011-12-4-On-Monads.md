---
title: "On Monads"
layout: post
tags: [programming, dotnet, Haskell, TrivadisContent]
date: 2011-12-04 12:00:00
redirect_from: /go/209/
---

> The following was written by me as a comment on a [post from Derick Bailey regarding Monads][1]. Since then,
> the comments have disappeared, presumably because they moved to the disqus commenting system. While I managed to migrate my comments
> lostechies apparently is unable to do so - sad, considering that the comments on a blog post often add a lot of value.

When you move on in the [very same wikipedia article][2] __(Concepts/Definition)__ (_about monads - ed._), I think it all becomes a lot clearer. A monad is defined by
 
> "A type construction that defines, for every underlying type, how to obtain a corresponding monadic type."

The mere ability to say that for every T you can construct a _Maybe(Of T)_ should satisfy this condition.

> "A unit function that maps a value in an underlying type to a value in the corresponding monadic type."

This is quite clearly your extension method _"ToMaybe()"_
> "A binding operation of polymorphic type (M t)->(t->M u)->(M u)"

Looks weird, but check out the signature of your e.g. _"If"_ 

    Maybe<TInput> If<TInput>(this Maybe<TInput> maybe, Func<TInput,bool> func)

Input is a type of your "nested" monadic type system. Then comes a mapping from a non-monadic type to a monadic one. This doesn't become apparent in the function signature, but you will notice that the "Func" is used to construct an instance in the monadic type system. 

Finally the result is an instance of the Monadic type system. Hence, your "If" is the "bind" part of the monad. In this case _"t" = "u"_, but in your definition of _"Get"_, "t" and "u" can be different types.

`Maybe<TResult> Get<TInput, TResult>(Maybe<TInput> maybe, Func<TInput, TResult> func)`

Chaining comes automatically, since the output of a bind is part of the Monadic type system and you have ensured that for every type "t" or "u" (sticking to the above definition) there is a mapping to the monadic type system.

As another example LINQ is "almost" monadic. What it has missing is a unit function from T -> IEnumerable which you can provide easy enough:

    public IEnumerable<T> ToEnumerable(this T obj) { yield return obj; }
    
You'll probably recognize that e.g. the _"Select"_ has a very similar structure, with the monadic type system being _IEnumerable(Of T)_. Again, method chaining follows from the mere definition of a monad. It looks similar to a fluent interface but I wouldn't confuse the two, as it doesn’t help and in fluent interfaces you often just return the instance on which you called the method, sparing you the use of _";"_

That's my 2 cents, almost a blog post in itself :)

  [1]: http://lostechies.com/derickbailey/2010/09/30/monads-in-c-which-part-is-the-monad/
  [2]: http://en.wikipedia.org/wiki/Monad_(functional_programming)