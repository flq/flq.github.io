---
title: "Some hints on how different JAVA generics appear to be to .NET generics"
layout: post
tags: [programming, dotnet, JAVA, TrivadisContent]
date: 2007-01-26 14:06:33
redirect_from: /go/58/
---

A tss entry caught my curiosity as it was talking about a &quot;[generics puzzle](http://stuffthathappens.com/blog/2007/01/25/java-generics-puzzler/)&quot; in JAVA. Finally, I thought, an example-based look at how JAVA generics differ from their .NET pendant? Indeed, the puzzle turns out to not be one in e.g. C#.

If the intent is to be able to create instances of a provided type argument, we need a constrain on the provided type argument to provide a parameterless constructor... 

`
  class GenericCheck<T> where T : new() {
    public T Instance {
      get {
        return Activator.CreateInstance<T>();
      }
    }
  }
`
Beware, though that if T has no default constructor, construction will fail with a MissingMethodException. Funny enough though, the Activator's method has no constraint on T, which it could easily implement:
`
  public V CreateInstance<V>() where V : new() ...
`
Apart from that you could also construct types that have no default constructor. Just sprinkle in some reflection. The type in question is easily accessed with typeof(T)...
`
  class GenericCheck<T> {

    public T Instance(string name, int age) {
        Type t = typeof(T);
        ConstructorInfo info = t.GetConstructor(
           new Type[] { typeof(string), typeof(int) });
        if (info != null) {
          return (T)info.Invoke(BindingFlags.CreateInstance,
             null,new object[] { name, age },null);
        }
        return default(T);
    }

  }

...
    public static void Test() {
      GenericCheck<Person> gp = new GenericCheck<Person>();
      Person p = gp.Instance("martha", 24);
    }
`
What you don't get with this approach is type safety, and you'll probably have a performance penalty, but that's another subject.
So, no puzzles to be seen...