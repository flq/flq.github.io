---
title: "Three degrees of Framework"
layout: post
tags: programming patterns
date: 2013-04-04 07:12:51
redirect_from: "/go/221"
---

In case it would not be obvious, there is a ton of things out there that can be reused in the form of packages. Those packages would roughly fall into any of the following categories where a single framework can obviously fall into several categories at once.

1. A framework that you interact with by **calling on to its API**.<br><br>
   Strictly speaking, such a piece of code is not a framework but a **library**.Many things that are typically related to the infrastructure of your application have to be done by yourself. The _library_ provides you with some useful functionality that you do not want to create yourself. This could be things like parsing markdown, connection string builders & the like. Since most responsibility lies within your application such a library may not use _low-level_ concurrency mechanisms. Higher level abstractions are available these days to provide concurrency at a level controllable by the **caller** in the form of Promises (**Tasks** in .NET).Arguably, such libraries should not interfere too much with the lifecycle of objects, but certain libraries do have caching of runtime-constructed artefacts for performance reasons (e.g. [Newtonsoft.Json][1] or [ServiceStack.Text][2]).<br><br>

2. A framework with which you interact by **inheriting from certain base classes, implementing interfaces, participate in predefined lifecycles** and the like<br><br>You will find many frameworks in this category that provide some kind of infrastructure into which you hook your code. Many Frameworks from Microsoft fall into this category, be it Web frameworks like ASP.NET (MVC), or Rich client frameworks like WPF, Winforms, etc. Such frameworks usually use low-level functionality in order to provide higher-level abstractions with which your code interacts. While such Frameworks can provide rich environments, testing code that is meant to run _on top_ of such a framework can be a chore, e.g. when to obtain a certain infrastructural possibility you have to inherit from some class which has dependencies that are required and are complex to set up. <br><br>

3. A framework which employs **predefined conventions** in order to cut on configuration time, or the need to implement certain interfaces or inherit from base classes. Such a framework is not necessarily much different from one described in **(2)**

4. A framework which **lets you define in what way you want to make use of the framework's functionality**<br><br>This kind of writing a framework has the most potential for you to be able to write code which has no dependencies on the used framework. This can only be achieved by applying _conventions_ as well as applying _dependency injection_ - given carefully chosen abstractions you can write code which you can happily test run but which does play nice with the framework of choice. The drawback for the framework developer is increased effort in designing a sound Meta-API (In the sense that you use such an API to tell the framework how you intend to interact with the runtime API). As a Framework user, though, I am happy when I can use a framework that fulfils the definition of **(4)**.

Interestingly, in terms of .NET Microsoft itself provides very little that falls into Category 4. This area has been pioneered by Non-MS Open Source. 

[1]: http://json.codeplex.com
[2]: https://github.com/ServiceStack/ServiceStack.Text