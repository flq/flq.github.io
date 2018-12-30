---
title: "Øredev: Things from Microsoft"
layout: post
tags: [dotnet, csharp, oredev]
date: 2010-11-15 10:30:00
redirect_from: /go/187/
---

Several sessions were held by guys from Microsoft, which I want to give you a quick rundown of those I’ve visited here.

### [Glenn Block](http://codebetter.com/blogs/glenn.block/): WCF embracing HTTP

Let’s face it: To get to HTTPs real capabilities in WCF you have to dig damn deep. Throughout time, the situation has somewhat improved, and letly new stuff is in the cooking at [wcf.codeplex.com](http://wcf.codeplex.com). NIce stuff we can apparently be looking forward include:

*   True REST-style separation of resource and representation. That looked pretty easy todo  <li>Exposure to HttpRequest and –Response Message if you really have to mess around with headers status codes and what have you
        *   On a per-method level  <li>On a global per-request level <li>Request processors. I love processors. I mean, maybe not that different to IHttpHandler after all? It’s nice when people come back to what works and leave death stars behind.  <li>Code based configuration.  <li>Wasn’t able to show that but there will be convention-based configuration (i.e. Attributes.Evict()) 

Glenn was also talking about support of a bunch of stuff I hadn’t heard of to this day, and I had to look up, most notably Hypermedia and Entity Tags. [Hypermedia](http://en.wikipedia.org/wiki/Hypermedia) seems to be used as term for the problem that the client is often the one holding the business logic (so you actually checked out your cart? I’ll let you do payment then…) – to put the server back in business you can send links back to the client which represent those resources that move your business process along. [Etags](http://en.wikipedia.org/wiki/HTTP_ETag) seem to be an HTTP mechanism to make request caching just that bit more efficient.

One book that was mentioned as source of inspiration is Ian Robinson &amp; Co.: [REST in practice](http://oreilly.com/catalog/9780596805838).

### Ade Miller: The Parallels Library

This was an informal introduction to the library that now ships with .NET 4.0 surrounding Tasks and Data that help parallelizing work. Today’s machines are only gaining performance through core multiplication: The clock rate has stagnated for a while, i.e. all our single-threaded apps are already stuck in yesterday. The concept of Tasks doesn’t actually talk about Threads and what have you, it allows you to express the degree of parallelism that your application supports by stating what can run in parallel and what has to wait for previous computations to become available. 

Additional help comes from parallelization of working with data processing, most notably the parallel.foreach stuff and friends. All in all it is recommended to every programmer in our days to start exploring the new ways of getting parallelism into your app, simply because you have to unless you don’t want to get stuck in 2006. What is more, C# will have new keywords regarding asynchronous programming which are built on top of Tasks, hence you should really get your head around these.

We could grab a copy of “[Parallel Programming with Microsoft.NET](http://parallelpatterns.codeplex.com/)” from the “patterns &amp; practices” series, in which stuff is elaborated in more detail, but not too much. As [Ade](http://oredev.org/2010/speakers/ade-miller) pointed out to me in a later chat, such a book should be “readable from start to end on one transatlantic flight”. Good!

### Glenn Block on Rx:

[Rx](http://msdn.microsoft.com/en-us/devlabs/ee794896.aspx) is currently my favourite child anyway, which is why I had to come and see this, see if there were any new angles. In my current Hello World app, which is part of [MemBus](https://github.com/flq/MemBus), I am doing Observables-stuff all the way up and down, thereby exploring the notion of a UI that just won’t block on you anymore, since relevant state changes are pushed into the from the back towards the great goal of complete user satisfaction. The degree of decoupling is actually quite shocking, but that’s what we want. Right?

Talking about Rx actually merits its own post, but I did finally learn the difference between hot and cold observables (tuning into a broadcast vs. starting to watch a DVD, thanks to [Jon Skeet](http://msmvps.com/blogs/jon_skeet/) for the analogy) and what the “Do” extension method of the Rx Framework actually does (A side-effect just prior to the push to the observer).

I am just beginning to wonder, though, if there will ever be a yield return for observables? :)

### Brad Wilson: ASP.NET MVC 3

Brad wilson talked about ASP.NET MVC3 which is now [available as RC](http://www.asp.net/mvc/mvc3). Here just a quick run-down of the most notable new stuff:

* Razor Viewengine
* This looks a lot cleaner than &lt;% %&gt; mayhem, however, having used Spark I am not sure whether I’ll switch to that. Sellers are of course the out of the box syntax highlighting and a commitment from Jetbrains to support this with resharper.*   Viewstart in Razor
* A small file that can be used to easily drop into it stuff common to (some) of your views (remember include in Perl CGI? It’s all coming back!)*   Showing off Nuget
* Package management in .NET? It’s becoming a reality. Sadly, Microsoft completely ignored [Sebastien Lambla](http://serialseb.blogspot.com/)’s efforts with [OpenWrap](https://github.com/OpenWrap/openwrap.github.com), but hey, at least I didn’t get burned by abandoning my [proof of concept](https://github.com/flq/Bin4Net) early.*   Simpler Dependency Injection for controller
  * now also for views 
  * Child Action Caching 
  * If controller action does not need a session, it can say so and skip serialization of requests that go on the same session 

That’s about it from the Microsoft Camp.