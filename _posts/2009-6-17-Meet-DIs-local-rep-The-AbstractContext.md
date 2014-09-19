---
title: "Meet DIs local rep: The AbstractContext"
layout: post
tags: [dotnet, patterns]
date: 2009-06-17 20:12:46
redirect_from: /go/146/
---

I am having an unhealthy yet energetic and fruitful relation with a close relative of 'the' Dependency Injection (DI) container. She's called _AbstractContext_ and she's been able to cope with all kinds of thorny situations where numerous objects need to collaborate without resulting in a tangled mess of spaghetti.

The DI Container is like context's wise Mum. Tell her everything upfront and she will listen to you and make anything you want. Her daughter is also quite promiscuous but in a twisted way...She'll only take pre-made stuff and she'll take only one of a kind!

<csharp>
[Test]
public void ContextAcceptsOneOfAKind()
{
  var ctx = new StandardContext();
  ctx.Add("Hello");
  ctx.Get<string>().ShouldBeEqualTo("Hello");
}

[Test]
[ExpectedException(typeof(ArgumentException))]
public void AddingTwiceMakesContextChoke()
{
  var ctx = new StandardContext();
  ctx.Add("Hello");
  ctx.Add("World");
}
</csharp>

Although, for every kind, she's more than ready to switch partners...

<csharp>
[Test]
public void PartnersCanBeChanged()
{
  var ctx = new StandardContext();
  ctx.Add("Hotrod");
  ctx.Replace("Douchebag");
  ctx.Get<string>().ShouldBeEqualTo("Douchebag");
}
</csharp>

Her polymorphic roots can't be ignored, but compared to her mother she remains bleak...

<csharp>
[Test]
public void PrimitivePolymorphismIsThere()
{
  var ctx = new StandardContext();
  var reader = new BinaryReader(new MemoryStream());
  ctx.Add<IDisposable>(reader);
  ctx.Get<IDisposable>().ShouldBeTheSameAs(reader);
}
</csharp>

Context has a special relationship to her...extensions (btw, shameless plug from WCF Context & Extensions)

<csharp>
[Test]
public void ContextLovesExtensions()
{
  var extension = MockRepository
    .GenerateMock<IContextExtension<StandardContext>>();
  var ctx = new StandardContext();
  ctx.AddExtension(extension);
  extension.AssertWasCalled(
    e=>e.Attach(null), 
    o=>o.Constraints(Is.Equal(ctx)));
}
</csharp>

But Context wouldn't be context if she would forget such a close relationship just like that: A removed extension will get a last date.

<csharp>
[Test]
public void ContextEnsuresLastDateWithExtension()
{
  var extension = MockRepository
    .GenerateMock<IContextExtension<StandardContext>>();
  var ctx = new StandardContext();
  ctx.AddExtension(extension);
  ctx.Remove(extension);
  extension.AssertWasCalled(
    e => e.Remove(null),
    o => o.Constraints(Is.Equal(ctx)));
}
</csharp>

Far from elaborate caching and lifetime strategies, our context nonetheless can take care of all things disposable:

<csharp>
[Test]
public void ContextDisposesOfDisposableThings()
{
  var disp = MockRepository.GenerateMock<IDisposable>();
  using (var ctx = new StandardContext())
    ctx.Add(disp);
  disp.AssertWasCalled(d=>d.Dispose());
}
</csharp>

Alas, she's not the Queen in your app (at least I hope), and knowing that, you can tell her to leave your disposable things alone:

<csharp>
[Test]
public void ContextLeavesDisposableThingsAloneIfYouWant()
{
  var disp = MockRepository.GenerateMock<IDisposable>();
  using (var ctx = new StandardContext())
    ctx.Add(disp, false);
  disp.AssertWasNotCalled(d => d.Dispose());
}
</csharp>

Last but not least, context makes complicated things look easy: She is cloneable by the call of a method!

<csharp>
[Test]
public void ContextIsCloneable()
{
  StandardContext ctx = new StandardContext();
  ctx.Add("string");
  var ctx2 = ctx.CloneContext();
  ctx2.Get<string>().ShouldBeTheSameAs(ctx.Get<string>());
}
</csharp>

And while those replicas start off much like their cloned origins, they can now start a whole life on their own, not being afraid to mess with their parent's undoings...

<csharp>
[Test]
public void ContextCloneCanBeModifiedWithoutAffectingTheOriginal()
{
  StandardContext ctx = new StandardContext();
  ctx.Add("horse");
  var ctx2 = ctx.CloneContext();
  ctx2.Replace("dog");
  ctx2.Add(new StringBuilder());
  ctx.Get<string>().ShouldBeTheSameAs("horse");
  ctx.Get<StringBuilder>().ShouldBeNull();
}
</csharp>

What's all this about? In one of the next posts I will present an example of how it is used in an application currently under development. In this post,  you only have 10 tests that describe a class that is quite fun to use ("Context knows Best") - even so, try not to use it as a Service Locator. Try to keep things _local_ (Hence the Title).

Once your dependency injection container has resolved necessary dependencies you may expose such dependencies locally through a context. Advantages are a very simple class to provide services to some local scope of your application which allows you to spawn off even smaller scopes with clones of your context. Those scopes may then modify their own context and yet keep an attachment to parent services - meanwhile the parent context does not know anything about local dependencies.

The drawback is that a context has potentially a high afferent coupling: Changes to it may break a number of depending types. You may also feel a tendency towards using it as some kind of global repository of things.

All in all, this is a fun class with unlimited ways to use and misuse.