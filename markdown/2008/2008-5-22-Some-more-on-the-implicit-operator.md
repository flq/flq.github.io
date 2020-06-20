---
title: "Some more on the implicit operator"
layout: post
tags: [software-development, dotnet]
date: 2008-05-22 19:59:27
---

Elaborating on my [past post](/go/104) on the implicit operator in C#, here some additional information to round this thing up.

*   Can you inherit the implicit operator(s)? 

 No, you cannot. Within a type you could write as many implicit operator implementations as you like, but any of the two types referenced must be the enclosing type. The compiler will tell you that:
  `error CS0556: User-defined conversion must convert to or from the enclosing type `  

As an example:

```csharp
class Foo
{
  string Value { get; set; }

  public static implicit operator string(Foo theFoo)
  {
    return theFoo.Value;
  }

  public static implicit operator Foo(string theValue)
  {
    return new Foo() { Value = theValue };
  }
}

class Bar : Foo {
}
```

The type "Bar" cannot do anything with the operators defined on "Foo", hence you cannot write

`Bar b = "hi";`

What compiles is this:

```csharp
Bar b = (Bar)(Foo)"hi";
```

But, as you might have guessed, you will get a runtime error. A "Foo" instance cannot be cast to
a "Bar" instance.

*   Any chance to do that with generics?

This contrived example will not work either:

```csharp
class Implicitable<T, V> where V : Implicitable<T,V>
{
  T Value { get; set; }

  public static implicit operator T(V theImplicitable)
  {
    return theImplicitable.Value;
  }
}
```

same error.

A different restriction with its own error is when you would try this:

```csharp
  class Bar : Foo
{
  public static implicit operator Foo(Bar theValue)
  {
    return new Bar() { Value = theValue };
  }
}

error CS0553: '...': user-defined conversions to or from a base class are not allowed
```

Which makes sense after all, as it kind of leads polymorphism ad absurdum.

Lately I have come across a pattern where it appears useful to me to provide implicit operators. 
It is the case for generic utility classes that enhance a given type in a sort of decorator style.
You can find an example here with the [SingletonOf&lt;T&gt;](https://realfiction.net/2008/04/29/singletons-are-boring-hence-factor-out-the-concern). Further examples are

*   Monitored<T> : It provides a decorator around a value of type T that, when changed through a property raises a ValueChanged event.
*   Historized<T&> : It provides a decorator around a value of type T that keeps track in a Dictionary with timestamp when the value is changed and could be rolled back to some point in time.

All of those provide this pattern:

```csharp
class Utility<T>
{
  T Value { get; set; }

  public static implicit operator T(Utility<T> u)
  {
    return u.Value;
  }

  public static implicit operator Utility<T>(T theValue)
  {
    return new Utility<T>() { Value = theValue };
  }
}
```

The boilerplate enables a simple instantiation like Utility&lt;int&gt; i = 3; as well as enables the Utility
to behave pretty much like the type it decorates, e.g. z = i + 5;
However, that is at far as it goes. To actually enable their additional behaviour you will have to keep
the reference alive:

```csharp
Utility<int> i = 3;
i = 5; //bad
i.Value = 7; // good
```

That's it for now. Next time, the explicit operator :)