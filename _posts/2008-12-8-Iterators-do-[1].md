---
title: "Iterators do [1..]"
layout: post
tags: [programming, dotnet, TrivadisContent, LINQ]
date: 2008-12-08 22:00:14
redirect_from: /go/136/
---

The following picture probably doesn't surprise you

<div style="text-align:center">![](http://realfiction.net/files/exception.png)</div>

But as you can see in what is commented out, you can indeed e.g. do

<csharp>DataSource.Take(10).ToList</csharp>

Such an iterator then has quite a similarity to Haskell's [1..], the infinite list. Just make sure that you don't pull all elements from the source...