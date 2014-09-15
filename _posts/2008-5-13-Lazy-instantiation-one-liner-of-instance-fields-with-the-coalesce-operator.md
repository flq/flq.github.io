---
title: "Lazy instantiation one-liner of instance fields with the coalesce operator"
layout: post
tags: [programming, dotnet, TrivadisContent]
date: 2008-05-13 12:00:01
redirect_from: /go/123/
---

It is hardly worth blogging, but...

Did you know that the return value of an assignment is the assignment? i.e.

`
class Person {
  public string Name;
}
...
Person p;
Console.WriteLine((p = new Person()).Name);
`

And did you know there is a coalesce operator since .NET 2.0 that will return the left-hand side if not null, or the right-hand side if the left-hand is null?

`
a ?? b;
`

If you combine these information snippets you get the modern one-liner for lazy instantiation of instance fields:

`
Person p;
public Person Example {
  get {
    return p ?? (p = new Person());
  }
}
`

[![kick it on DotNetKicks.com](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http%3a%2f%2frealfiction.net%2f%3fq%3dnode%2f157&bgcolor=0000CC)](http://www.dotnetkicks.com/kick/?url=http%3a%2f%2frealfiction.net%2f%3fq%3dnode%2f157)