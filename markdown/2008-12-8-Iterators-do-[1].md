---
title: "Iterators do [1..]"
layout: post
tags: [software-development, dotnet, libs-and-frameworks]
date: 2008-12-08 22:00:14
redirect_from: /go/136/
---

The following picture probably doesn't surprise you

![](/assets/exception.png)

But as you can see in what is commented out, you can indeed e.g. do

    DataSource.Take(10).ToList

Such an iterator then has quite a similarity to Haskell's [1..], the infinite list. Just make sure that you don't pull all elements from the source...