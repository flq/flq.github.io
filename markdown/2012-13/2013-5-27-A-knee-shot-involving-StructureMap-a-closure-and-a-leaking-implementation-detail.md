---
title: "A knee-shot involving StructureMap, a closure and a leaking implementation detail"
layout: post
tags: [programming,dotnet]
date: 2013-05-27 18:41:45
redirect_from: /go/223/
---

## The participants
* StructureMap
* A few human nitwits

## The scene

* An integration test

Every once in a while objects that are instantiated together by your DI Container of choice don't match up in terms of life expectancy. What you can do, instead of taking some dependency on a service, you take a dependency on a **Func(Of That Service)** - the expectation being that every time you say **service()** you'll get a fresh instance of whatever is returned.

After a row of refactoring (that's where the nitwit part comes in), the definition of a certain service registration looked like this:

    configurationExpression
		.For<IFoo>()
		.Use(ctx => new Foo(ctx.GetInstance<IDependency>, /* some other stuff */));

Note the subtle use of a method group where a Func is expected in **Foo**'s constructor.

Tests were failing. First we found a bug in our code, then we found out that calling RavenDB's **IDocumentSession.Dispose()** [does nothing](https://groups.google.com/forum/?fromgroups#!topic/ravendb/Gmq2vCLu2m4). We only found out because we realized that we were using the same document session over and over again. 

After some befuddlement it dawned on us that the method group based on StructureMap's context was the culprit. Turns out that this guy, once it has provided an instance for some requested type, it will fulfil subsequent requests from its private Cache. Whatever implements *IContext* in  the configuration lambda is not really meant to leave its natural boundary *inside* of the lambda. Interestingly, **F#** makes it harder to steal things off lambdas.

## The morale of the story

* Try not to steal instances that are provided to lambdas for the sole purpose of being used in there.