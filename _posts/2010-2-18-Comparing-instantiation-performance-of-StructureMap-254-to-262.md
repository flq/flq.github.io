---
title: "Comparing instantiation performance of StructureMap 2.5.4 to 2.6.2"
layout: post
tags: dotnet dependency-injection StructureMap
date: 2010-02-18 18:30:00
redirect_from: "/go/156"
---

Some weeks ago Jeremy [released StructureMap 2.6.x](http://codebetter.com/blogs/jeremy.miller/archive/2010/02/04/structuremap-2-6-and-2-5-4-is-released.aspx) . An interesting change is the apparent ditching of Reflection.Emit code in favour of using Expressions to do the “instance instantiation” (sic). Almost 2 years ago I wrote a post on [instantiation performance of DI containers](/Content/Entry/109). I never checked up on StructureMap (SM). Now it’s time to do just that. 

My focus was on comparing SM 2.5.4 to SM 2.6.2, assuming that the 2.5 version still has the Emit code in it (pretty sure of it because there was some emit-related bug in it once). I extended the solution used for the performance comparison and set it up exactly the same for the two StructureMap versions.

The only line of code that changes is the definition of the dependency. While in StructureMap 2.5.x you say:
 `IContainer c = new Container(e => e.ForRequestedType<IExchangeRateEngine>().TheDefaultIsConcreteType<SimpleExchangeRateEngine>());  ` 

The current version gives you this syntax:
 ` IContainer c = new Container(e=>e.For<IExchangeRateEngine>().Use<SimpleExchangeRateEngine>()); ` 

I was after comparative figures, hence I just ran the 2 projects from within Visual Studio as debug build. The times are noted in milliseconds / instantiation and denote the shortest / longest measured time:

*   StructureMap 2.5.4 : 0.0058 / 0.0087  <li>StructureMap 2.6.2 : 0.0068 / 0.0104 

This is a performance loss of roughly 17% / 19% . Therefore, there _is_ some loss. However, it is far away from any order of magnitude and should not matter much at all in all but the most devious cases of excessive instantiating.