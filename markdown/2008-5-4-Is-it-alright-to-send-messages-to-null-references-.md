---
title: "Is it alright to send messages to null references?"
layout: post
tags: [software-development, dotnet, patterns]
date: 2008-05-04 19:01:54
redirect_from: /go/121/
---

This is a non-question, you may say, and even at the end of this post you will notice that it is still true that you cannot call anything on a null reference. But let me explain...
Foundation for this post are the following blog entries...

*   [Raising events using extension methods](http://www.sharpregion.com/post/Events2c-Generics-and-Extension-Methods.aspx)
The post proposes the idea to attach an extension method to the EventHandler type in order to have a simple way to raise an event. It goes like that:
`
public static void Raise<T>(this EventHandler<T> handler, object sender, T e) where T : EventArgs
{
  if (handler != null) handler(sender, e);
}`

This will allow you to do someting like... this.Click.Raise(this, new EventArgs());...

*   [Maybe I'm just a little slow...](http://blogs.msdn.com/alexj/archive/2008/02/29/maybe-i-m-just-a-little-slow.aspx) and it goes on that extension methods "are cool for avoiding NullReferenceExceptions". As a first encapsulation of this concept take the "Maybe" extension method that goes like that:
`
public static V Maybe<T, V>(this T target, Func<T, V> action) where T : class where V : class
{
  return target != null ?
    action(target) :
    null;
}`

Then you'll be able to do something like this on an object hierarchy like person.address.city.zipcode where any of the properties is a null reference:

`
Person p = new Person();
Console.WriteLine(p
          .Maybe((prs) => prs.Address)
          .Maybe((a) => a.City)
          .Maybe((c) => c.CityName));
`

The following post drives the point a bit further: [Vendredi c'est Expression Tree :)](http://blogs.developpeur.org/miiitch/archive/2008/02/29/vendredi-c-est-expression-tree.aspx). Here the idea is to be able to write just that: 

`
Console.WriteLine(p.Maybe2((prs) => prs.Address.City.CityName));
`

All those extension methods have in common that they will check whether the target that they will be attached to is null or not. Indeed, the examples circumvent two common scenarios where we need to check for null references. They do it by making use of the fact that you can call extension methods on null references (after all, they are just static methods that are handled in a a specific way by the compiler). In my personal opinion it is alright - null references are a repeated problem and this strategy may allow to alleviate the problem with unrepeated lines of code. On the other hand I have also read the opinion that calling a method on a null reference is something we were never able to do. It is a principal behaviour of objects that they may be un-instantiated and that using such a null reference inevitably leads to the NullReferenceException.

I would love to hear more opinions...

[![kick it on DotNetKicks.com](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http%3a%2f%2frealfiction.net%2f%3fq%3dnode%2f155&bgcolor=0000CC)](http://www.dotnetkicks.com/kick/?url=http%3a%2f%2frealfiction.net%2f%3fq%3dnode%2f155)