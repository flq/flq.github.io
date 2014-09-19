---
title: "Singletons are boring, hence factor out the concern"
layout: post
tags: [programming, dotnet, patterns]
date: 2008-04-29 14:16:54
redirect_from: /go/119/
---

[dotnetkicks](http://www.dotnetkicks.com) has an astonishing amount of entries related to ["The Singleton"&reg;](http://www.dotnetkicks.com/search?q=singleton)...

Regardless of whether Singletons are considered harmful or not, I could not resist but provide you with my own take on factoring out the need to get a Singleton which doesn't feel like a Singleton at all. We can single-ton out any classes that provide a default constructor. Due to the reflection spice you can provide a private one as well. Takes somewhat longer, but you're only doing it once, don't you ;) ?

Indeed, the solution is hugely similar to [this one here](http://www.cognitivecoding.com/2008/03/hidden-gem-singleton-factory-in-c.html), which was also [credited at dotnetkicks](http://www.cognitivecoding.com/2008/03/hidden-gem-singleton-factory-in-c.html), however, I added the implicit operator for providing some "I am instantiating" feeling to the whole thing:

`
class SingletonOf<T> where T : class
{
    static T instance = (T)Activator.CreateInstance(typeof(T), true);

    public static implicit operator T (SingletonOf<T> singleton) {
        return SingletonOf<T>.instance;
    }
}
`

The implicit operator makes it possible to do this:

`
Person p = new SingletonOf<Person>();
Person p2 = new SingletonOf<Person>();
Debug.Assert(object.ReferenceEquals(p, p2), "W00t?! They should be equal!");
`

Doesn't it look funny? I find it quite likeable and you definitely don't pollute the class in question with some singleton boilerplate. I would like to say "Go forth and multiply" but it seems wholly inappropriate for the issue at hand...

[![kick it on DotNetKicks.com](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http%3a%2f%2frealfiction.net%2f%3fq%3dnode%2f153&bgcolor=0000CC)](http://www.dotnetkicks.com/kick/?url=http%3a%2f%2frealfiction.net%2f%3fq%3dnode%2f153)