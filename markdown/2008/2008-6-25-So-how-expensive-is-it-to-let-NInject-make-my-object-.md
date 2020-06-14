---
title: "So, how expensive is it to let NInject make my object?"
layout: post
tags: [software-development, dotnet, patterns, libs-and-frameworks]
date: 2008-06-25 13:11:57
redirect_from: /go/127/
---

Back [here](http://realfiction.net/go/143) I made a quick and dirty performance comparison. In the comments I actually got some "flak" scrutinizing some of the "design decisions" behind the example shown. I would like to reinstate that the example was made purely for checking instantiation performance of IoC container, and that I could not be asked to use "Foo" and "Bar" or "Samurai" and "Sword" ([no worries, Nate](http://dojo.ninject.org/wiki/display/NINJECT/Dependency+Injection+With+Ninject) ;)

I was pointed to the injection container [NInject](http://ninject.org/), and how the benchmark would look like when using this framework. Now that said framework has been released with a v 1.0 tag (you've got to love it just for doing that, after all, there are customers out there that you simply cannot approach with a v0.9 or a release candidate 3) I took the time to play through the code.

Instead of using an XML-file you perform a programmatic binding within a special class that is treated by the kernel as a module:

`
  class BankAccountModule : StandardModule
  {
    public override void Load()
    {
      Bind<IExchangeRateEngine>().To<SimpleExchangeRateEngine>();
      Bind<BankAccount>().ToSelf();
    }
  }
`

Instantiation of the kernel looks like this:

`
IKernel c = new Ninject.Core.StandardKernel(new BankAccountModule());
`

And getting a BankAccount reference looks like that:

`
BankAccount acc = c.Get<BankAccount>();
`

The time we get (for reference the Spring.NET time run today as well)

*   Container construction (Spring.NET): 0.0535 / 0.0459
*   Container construction (NInject): 0.0298 / 0.0293

So, performance-wise NInject shows benefits due to its approach of generating dynamic methods. This is certainly not the last post on NInject as it makes a very good first impression and I need to delve a bit into some question marks.