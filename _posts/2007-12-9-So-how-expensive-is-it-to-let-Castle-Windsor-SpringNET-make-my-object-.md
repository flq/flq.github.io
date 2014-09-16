---
title: "So, how expensive is it to let Castle Windsor / Spring.NET make my object?"
layout: post
tags: [programming, dotnet, TrivadisContent, software-architecture, castle-windsor, dependency-injection]
date: 2007-12-09 16:43:46
redirect_from: /go/109/
---

Lately I was getting increasingly curious about the overhead of using a [Dependency Injection](http://martinfowler.com/articles/injection.html)-container to provide me with instances of my objects. With overhead I mean if and how much longer it takes for the DI container to provide me with the desired instance. 

Indeed, this is not an overly interesting number. After all, how often do you instantiate an object in your Application's lifecycle and even if you do it very often, how does it compare to other activities of your Software like doing a Database Query?

Even so, I was curious, so here we go. First I needed a simple example. I came up with the usual BankAccount stuff that depends on a Exchange rate facility in order to work correctly. The following image gives you an overview: 
 ![System overview Bankaccount](/public/assets/scrshot_bank.png) 

I decided for the possibility of constructor-based injection, such that the normal usage of the BankAccount class would be like that:
 <pre class="sh_csharp">
BankAccount b = new BankAccount(new SimpleExchangeRateEngine());
b.Deposit(new MonetaryValue("EUR", 1000.23M));
</pre>
The first DI container I used was the [Castle Project Windsor container](http://www.castleproject.org/container/index.html), which we have started to use on a customer's project. Necessary configuration aspects can be covered in the app.config and the configuration for this specific example looks like this:
<pre class="sh_csharp">
&lt;configuration&gt;
  &lt;configSections&gt;
    &lt;section name=&quot;castle&quot;
      type=&quot;Castle.Windsor.Configuration.AppDomain.CastleSectionHandler, Castle.Windsor&quot; /&gt;
  &lt;/configSections&gt;
  &lt;castle&gt;
    &lt;components&gt;
      &lt;component id=&quot;ExchangeEngine&quot; service=&quot;TheBank.IExchangeRateEngine, TheBank&quot;
        type=&quot;TheBank.SimpleExchangeRateEngine, TheBank&quot;
        lifestyle=&quot;transient&quot;  /&gt;
      &lt;component id=&quot;BankAccount&quot; type=&quot;TheBank.BankAccount, TheBank&quot; lifestyle=&quot;transient&quot; /&gt;
    &lt;/components&gt;
  &lt;/castle&gt;
&lt;/configuration&gt;
</pre>

As you can see, the two important classes that we will be using are registered in the configuration. 
Interesting in this framework is the fact that you can explicitly state the "service" (i.e. the interface) which a class implements. You can then obtain a reference to an underlying implementation simply by passing an interface to the "Kernel", the part of the DI container that you need to talk to to get the desired object instance. In terms of the given framework this looks like that:

<pre class="sh_csharp">
IWindsorContainer c = new WindsorContainer(new XmlInterpreter());
BankAccount b = c.Resolve<BankAccount>();
</pre>

How did the dependency to the **IExchangeRateEngine** service go into the BankAccount? This is a feature of the framework. It looks at the BankAccount constructor and will find that for the necessary service to be provided there is an entry in the configuration. It instantiates the dependency and passes it to the BankAccount instance.

For testing the construction speed, I wrote a program with two loops: The outer one ten times, the inner ones 10000 times the creation of a BankAccount object in the following ways:

1.  Simple Instantiation with new as already shown
2.  Instantiation with the Activator: Activator.CreateInstance(typeof(BankAccount), new SimpleExchangeRateEngine());
3.  DI based creation with Castle Windsor as already shown
4.  DI based creation with Spring.NET

Just for completeness I had a quick look at [Spring.NET](http://www.springframework.net/) and paced it through pretty much the same routine. The major difference here is that for constructor-based dependency injection you need to explicitly state the constructor argument and what object of the registry should be passed in.

<pre class="sh_csharp">
&lt;configuration&gt;
  &lt;configSections&gt;
    &lt;sectionGroup name=&quot;spring&quot;&gt;
      &lt;section name=&quot;context&quot; type=&quot;Spring.Context.Support.ContextHandler, Spring.Core&quot;/&gt;
      &lt;section name=&quot;objects&quot; type=&quot;Spring.Context.Support.DefaultSectionHandler, Spring.Core&quot; /&gt;
    &lt;/sectionGroup&gt;
  &lt;/configSections&gt;
  &lt;spring&gt;
    &lt;context&gt;
      &lt;resource uri=&quot;config://spring/objects&quot;/&gt;
    &lt;/context&gt;
    &lt;objects xmlns=&quot;http://www.springframework.net&quot;&gt;
      &lt;object id=&quot;ExchangeEngine&quot; type=&quot;TheBank.SimpleExchangeRateEngine, TheBank&quot; singleton=&quot;false&quot; /&gt;
      &lt;object id=&quot;BankAccount&quot; type=&quot;TheBank.BankAccount, TheBank&quot; singleton=&quot;false&quot;&gt;
        &lt;constructor-arg name=&quot;engine&quot; ref=&quot;ExchangeEngine&quot;/&gt;
      &lt;/object&gt;
    &lt;/objects&gt;
  &lt;/spring&gt;
&lt;/configuration&gt;
</pre>

A call to this framework looks like this:

<pre class="sh_csharp">
IApplicationContext ctx = ContextRegistry.GetContext();
BankAccount b = (BankAccount)ctx.GetObject("BankAccount");
</pre>

Anyway, I used the **StopWatch** object to time the 10000 instantiation loops and calculated an average. Here are the findings (average min/max values out of the ten times that the whole cycle was repeated, Release build running outside vshost) in milliseconds:

*   Normal construction: 0.0001 / 0.0002
*   Activator construction: 0.0069 / 0.0071
*   Container construction (Castle Windsor): 0.1014 / 0.1068
*   Container construction (Spring.NET): 0.069 / 0.0722

It should be noted that the very first instantiation is the most costly one in any scenario and that I have taken out the first instantiation in the Container case because that one is significantly slower than anything else: 

*   Container construction (Castle Windsor): 55 milliseconds
*   Container construction (Spring.NET): 45 milliseconds
<p>, a bl... eternity...

However, the Container seems to exist as some kind of singleton, since the recreation of the container did not affect that number (for both containers).

Well, yeah, one can state dramatically that the creation of an object via DI takes about 1000 times longer than by writing a simple "new". But since I am not a very dramatic person, and since us Engineers always have to live with conflicting options, I will not elaborate further.<p>

[![kick it on DotNetKicks.com](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http%3a%2f%2frealfiction.net%2f%3fq%3dnode%2f143&amp;bgcolor=0000CC)](http://www.dotnetkicks.com/kick/?url=http%3a%2f%2frealfiction.net%2f%3fq%3dnode%2f143)