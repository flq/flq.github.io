---
title: "“respond_to” in .NET"
layout: post
tags: [ruby, csharp]
date: 2010-07-16 20:00:00
redirect_from: /go/170/
---

One of the new features in .NET 4.0 is the introduction of the dynamic keyword that delegates the check whether something can be called to the runtime. This supports the Dynamic Language runtime and allows .NEt code to call e.g. an object created by a ruby script without much syntax hassle. One unfortunate omission in this functionality is the ability to question an object of type dynamic whether it would accept a certain kind of call. Ruby knows such an operation, called respond_to. 

Introducing this functionality is quite easy in .NET as well by catching the **RuntimeBinderException** when calling some method on a dynamic. However, this is far from elegant (See [Challenge: Dynamically dynamic](http://ayende.com/Blog/archive/2010/06/23/challenge-dynamically-dynamic.aspx)). On standard .NET types, the information whether a specific member exists on some instance can be obtained via Reflection. Armed with this, it is possible to support an extension method that allows you to check whether a certain type supports some kind of property, or method call.

You can find the relevant code as part of the MemBus project or as a gist (shown below, licensed under Apache 2.0). 

```csharp
var s = new SampleClass();
s.RespondsTo(d => d.Name).ShouldBeTrue();
s.RespondsTo(d => d.Name = "Jones").ShouldBeTrue(); //Has a public setter
s.RespondsTo(d => d.Birthdate = DateTime.Now).ShouldBeFalse(); //Only has private setter
s.RespondsTo(d => d.Name = true).ShouldBeFalse();
s.RespondsTo(d => d.SetDate(null)).ShouldBeFalse(); //param is a DateTime, null not allowed
s.RespondsTo(d => d.Hello("bla")).ShouldBeTrue();
s.RespondsTo(d => d.Hello(1)).ShouldBeFalse(); //param is string
s.RespondsTo(d => d.Hello("bla", "bli")).ShouldBeFalse(); //Wrong number of args
```

A small part of the code was inspired by a [blog post from Justin Chase](http://justinmchase.com/post/2009/07/02/Member-Exists-e28093-Dynamic-C-40.aspx).
<script src="http://gist.github.com/478382.js"></script>