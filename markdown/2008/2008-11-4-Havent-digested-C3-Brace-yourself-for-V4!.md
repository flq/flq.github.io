---
title: "Haven't digested C#3? Brace yourself for V4!"
layout: post
tags: [software-development, dotnet, csharp]
date: 2008-11-04 22:37:45
---

After Microsoft's PDC, a whole host of C# 4.0 infos are coming up. Many months ago we were already allowed to peek at Hejlsberg & Team sitting in an old meeting room, talking about what C# 4.0 would be all about (I have lost the link but you [here's](http://channel9.msdn.com/pdc2008/TL16/) his talk at the PDC about the upcoming language - Takes some time, but it's pretty good).

**UPDATE**: You MUST watch at least the last 10 minutes. That stuff apparently won't enter the C#4.0 but "Compiler as a Service" is pretty close to magic.

Major keywords were: Concurrency, 'Declarativeness', Dynamic Features.

Just now, posts are coming up highlighting information available on new language features - a good moment for me to gather some links...

1.  The dynamic keyword:
    For an interesting example introducing the dynamic Keyword, making an XMLNode behave like an instance with properties, [go here](http://mark.michaelis.net/Blog/DynamicallyTypedObjectsWithC40.aspx). Such stuff may allow to do duck typing: Some sort of ad-hoc bolting on of an interface. For some comments on that, [go here](http://msmvps.com/blogs/jon_skeet/archive/2008/10/30/c-4-0-dynamic-lt-t-gt.aspx).
2.  The Dynamic language runtime appears to become a first class citizen in the CLR. Wonderful new possibilities (and great bugs) are waiting for us to discover!

3.  Parallel extensions for .NET is most likely becoming a part of the .NET Framework. At some point such things may appear in the language...

4.  Optional parameters and named parameters become part of the language. You will find an excellent writeup on the two [here (Optionals)](http://community.bartdesmet.net/blogs/bart/archive/2008/10/31/c-4-0-feature-focus-part-1-optional-parameters.aspx) and [here (Named)](http://community.bartdesmet.net/blogs/bart/archive/2008/11/01/c-4-0-feature-focus-part-2-named-parameters.aspx)

5.  COM Interop: Ever used Type.Missing to save a Word Document in C#? Well, that has become wholly unnecessary

6.  Co- and contravariance on generic types: That one is going to hurt your head (Then again, if you have worked with generics you will most certainly have missed it once or twice)! Here is an example (taken straight from Anders' slides):

```csharp
public interface IEnumerable<out T> {
  IEnumerator<T> GetEnumerator();
}
...
IEnumerable<string> strings = GetStrings();
IEnumerable<object> objs = strings; // No Problem!
...
public interface IComparer<in T> {
  void Compare(T x, T y);
}
IComparer<object> objComp = GetComparer();
IComparer<string> strComp = objComp; // No Problem!
```

I'd say that's enough for now. Some of this stuff is content that I have been waiting for. I have cursed the invariance of generic types a number of times, and I have been waiting for the marriage of CLR + DLR a long time to get some personal project of mine going. I have never really missed optional and named parameters, but guess that people having to do a lot of COM interop will just love it.
As a trainer in introduction to .NET with C#, however, this is an utter catastrophe. An introductionary course will now quite easily fill roughly 6-7 days!