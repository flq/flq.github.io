---
title: "Untested Extension method which should be a nice one"
layout: post
tags: programming dotnet TrivadisContent
date: 2007-09-21 20:25:28
redirect_from: /go/102/
---

You probably know by now that [I quite like](http://realfiction.net/?q=node/110) the upcoming extension methods in .NET 3.5.

I haven't tested the following code as I don't have the right framework at hand right now (and I cannot be asked to turn on my laptop), but I don't see why it shouldn't work:

**[Update 27.09.07: This version now does work, thanks to Christoph as well as a check on my Orcas VM]**

`
  static class TimeExtensions
  {
    public static DateTime AsDate(this string datetime)
    {
      return DateTime.Parse(datetime);
    }
  }

  static class GenericExtensions
  {
    public static bool Between<T>(this T me, T lower, T upper) where T : IComparable<T>
    {
      return me.CompareTo(lower) >= 0 && me.CompareTo(upper) < 0;
    }
  }
`
</strike>

Now you can write:

`
if (someNumber.Between(3,7)) // Do stuff...
if (someDate.Between("12.01.1978".AsDate(),"14.03.1988".AsDate())) // Do stuff
`

Does it go too far or do you like this stuff?