---
title: "Spoiled with Dependency Injection"
layout: post
tags: [dotnet, patterns]
date: 2008-09-07 11:19:43
redirect_from: /go/132/
---

<div class="messages status">

The incredible truth is that there are constantly synchronicities. While I was quickly jotting down the contenders for the Dependency Injection throne in .NET, others make full-blown, multi-part comparisons. Need an example? Go here:

* [Comparing .NET DI (IoC) Frameworks, Part 1](http://blog.ashmind.com/index.php/2008/08/19/comparing-net-di-ioc-frameworks-part-1/)
* [Comparing .NET DI (IoC) Frameworks, Part 2](http://blog.ashmind.com/index.php/2008/09/08/comparing-net-di-ioc-frameworks-part-2/)

</div>

There are a number of reasons why [Dependency Injection](http://www.martinfowler.com/articles/injection.html) is a good thing, and many people of high esteem have written about it. Hopefully only those developers completely cut off from modern-day communications are left with a good excuse not to know about this subject.

Do I sound too dogmatic? Well, to be honest, if you are undertaking a project of a certain degree of complexity that is meant to be maintainable I find the use of a DI framework easier to justify than not using it. It really helps to get to grips with a clean OO-approach. It helps your code to stay [SOLID](http://www.lostechies.com/blogs/chad_myers/archive/2008/03/07/pablo-s-topic-of-the-month-march-solid-principles.aspx).

As a .NET developer you are indeed spoiled with choice - it's almost like back in Java, if you know what I mean. Which DI Container should you take?

This post could be interpreted as a starting point to get links and a few warm words to the choice available. Without further ado, let's get going...

# [Castle Windsor](http://www.castleproject.org/container/index.html)

Castle Windsor is the first DI container I have used in .NET. It is quite present in the community since it has links to some other very popular frameworks, [ActiveRecord](http://www.castleproject.org/activerecord/index.html) (a design pattern in itself which you will have to consciously choose but which will make your life with NHibernate a lot easier once you do) and [MonoRail](http://www.castleproject.org/monorail/index.html), which was giving you rails long before Microsoft figured out what [MVC](http://en.wikipedia.org/wiki/Model_View_Controller) [could mean](http://www.asp.net/mvc/) for the web generation.

Castle Windsor's official download is of a "Version 1 Release Candidate 3". This does not tell much of the quality, because the features you get are well tested and can be used without problems in a production environment. I have once made a comparison performance wise of Spring.NET and Castle Windsor [here](http://realfiction.net/go/143), which will show you a basic configuration scenario.

We used said version and the best way to configure it was via (an) XML file(s). All major concerns you expect to be solved by DI are solved, however the configuration via XML can get nasty, especially when you use generic classes and interfaces (IDictionary`2[[System.String, mscorlib],[System.String, mscorlib]] anyone?).

Castle Windsor is probably the largest of all DI containers I know as it has legions of additional functionality. The only sensible way to get to them is to pull down their current trunk. In my opinion it makes the project less accessible than others. Either way, if you want your container to also handle e.g. WCF integration and also get your hands on a fluent interface to handle the configuration side of things, it is worth having a look into this project (Also see [why I couldn't get my INotifyPropertyChanged proxy to work](http://realfiction.net/go/160) with the 1.0RC3 version of DynamicProxy2). One of the system's selling point is also the possibility to change the configuration during system runtime, something not allowed by every DI container.

Lastly, one of the contributors, Hamilton Verissimo, aka hammett, will be [joining Microsoft](http://hammett.castleproject.org/?p=312). Although he states that nothing changes for Castle, I am wondering whether his efforts won't be needed to give Unity a stronger voice in the community.

# [Spring.NET](http://www.springframework.net/)

There is not much I can tell about this one, apart from the fact that I know the name from old Java times and that it looks like Java devs would probably go for Spring.NET since they would feel right at home. It was presented at our company and from what I can see it should provide you with typical DI functionality, but I commonly hear that the configuration side of things is rather heavy (where's my "say NO to XML" shirt?).

# [Ninject](http://ninject.org/)

This is a recent addition to the landscape, a system developed by [Nate Kohari](http://kohari.org/). This is one container that leaves behind XML files for a fluent API to be talked to with your MSIL beautifier of choice. Additionally, the introduction of something Nate calls **contextual binding** makes for some interesting functionality:

```csharp
// Adding some spice to the "Bind" call Ninject provides in its "Modules"
protected ViewModelSetup<M> RegisterModel<M>(string modelID) where M : IViewModel
{
  Bind<IViewModel>().To<M>().Only(When.Context.Variable(BaseWindow.ModelID).EqualTo(modelID));
  return new ViewModelSetup<M>(this, modelID);
}
// ...somewhere else...
public ViewModelSetup<M> WithControls(ControlMap controlMap)
{
  module.Bind<ControlMap>().ToConstant(controlMap).ForMembersOf<M>();
  return this;
}
```

This is just one example of a number of possibilities. The idea is to provide dependencies based on the context of your request, be it that you add your own stuff to a present context object or that it allows you to state things like "Dependency d should be satisfied with object x provided that the target parameter y is decorated with attribute A.".

The configuration interface is lovely, you probably won't miss the fact that there is no XML configuration available. The framework is quite usable and has a good performance for what it does (but also not orders of magnitude away from other DI servicing candidates).

For me the most problematic current omission (Ninject is in Version 1) is that I cannot define _n_ classes all satisfying service _s_ and get all those dependencies at once e.g. in the form of an array like _s[]_.

Documentation is there for the most basic scenarios but if you get stuck it's best to post something on Ninject's [usergroup](http://groups.google.com/group/ninject).

# [StructureMap](http://structuremap.sourceforge.net/Default.htm)

This container seems to have been around for quite some time, and there are a number of mainainers, most notably the creator [Jeremy Miller](http://codebetter.com/blogs/jeremy.miller/), and just mentioning [Chad Myers](http://www.lostechies.com/blogs/chad_myers/), since he has been helping out with some nice [explanatory blog posts](http://www.lostechies.com/blogs/chad_myers/archive/tags/StructureMap/default.aspx) on Structuremap (code [here](http://sourceforge.net/projects/structuremap/)).

During the past half a year I tried once or twice to break into its mindset. The third time round just a few days ago I finally made some progress into it, so far that it feels like it could be the right choice for one of my upcoming projects. Let me try and explain why.

*   While this thing does have some XML config layer, much effort is going into a fluent interface for configuration.*   Support of arrays of stuff is strong (pipelines are not only a Russian thing).
*   Attributes PluginFamily and Plugin allow for easy implementations of ...plugins (doh!).
*   Defining autowiring capabilities based on your own implementation of a TypeScanner, thereby allowing you to state conventions on how to bind together stuff, is just plain neat. Why shouldn't a FunkDataSet be automatically bound to a FunkModel, if it is depending on one? (Yeah, go flak me for using the D-word!)
*   Jeremy and colleagues seem to be working away towards version 2.5 of StructureMap which seems to fully embrace 3.5 framework capabilities. I haven't looked much at the code yet, but some parts make heavy use of Expressions which should allow you to write some really expressive ;) code.

StructureMap also has a user group over [here](http://groups.google.com/group/structuremap-users).

# [AutoFac](http://code.google.com/p/autofac/)

This is really just a pointer. I can't say anything about it since I haven't tried it yet. If anything changes about that I will gladly post here.

# [Unity](http://www.codeplex.com/unity)

Same goes to Unity. No hands-on experience yet. I should certainly note that this is Microsoft's offering in this matter, with Unity being part of the grand scheme of Enterprise Application blocks.

* * *

I hope you enjoyed this post and feel free to comment about your own experiences with any of the listed frameworks or if I did completely miss some offering.
