---
title: "Spring.AOP, Castle.DynamicProxy2 - first glance from an outsider"
layout: post
tags: programming dotnet TrivadisContent castle-windsor
date: 2008-04-30 20:24:37
redirect_from: /go/120/
---

The other day I got a presentation on Spring.NET and that it brings along quite a bit of aspect oriented Zen. Frankly, I do not know much about Spring.NET. I did a [very quick look](http://realfiction.net/?q=node/143) at performance comparison with respect to object instantiation between Spring.Net and my weapon of choice lately: Castle Windsor. Part of the project is the **Castle.DynamicProxy2** (what a name!). It provides a functionality that is similar to the one you can extract from the **Spring.AOP** Assembly.

Leaving the funny word "aspect" behind, what do those funny named assemblies give us? They allow to generate **proxies** around our own objects and provide a way to inject behaviour every time our object is used, i.e. when properties / methods are accessed. Injecting behaviour means in both cases to provide a class that implements a specific interface which is passed to the proxy generator. From here on the generated proxy will call your "**Interceptor**" every time the encapsulated object is being used

While I do not know where Spring.AOP is used, I know that the DynamicProxy2 assembly enables [**NHibernate**](http://www.hibernate.org/343.html) to let us use our domain objects as if they would be the plain thing but when brought to the session magically seem to remember the changes we do to them.

You may also stumble upon another fantastic project with plenty of Mojo in it, Ayende/Oren's delicious and moist mocking tool, [Rhino Mocks](http://www.ayende.com/projects/rhino-mocks/downloads.aspx). You will see that the assembly contains the namespaces relevant to the Dynamicproxy2 - brought in there either via [ILMerge](http://research.microsoft.com/~mbarnett/ILMerge.aspx) or just getting the source and compiling it all together. It enables to generate a proxy for some interface / abstract class and by design provide an entry point to whenever such a generated proxy is being used by referencing a property or method. Ayende can then use this to build up his recording/playback/expectations framework.

For this post I set up a simple project referencing both assemblies like that:

![Project references](files/images/referencesProxies.png)

My aim was to get first a basic feeling what it costs performance-wise to create a proxy for some object, adding an interceptor to it and then accessing methods and properties on it. For that I created the HorridPerson class, a class so ugly, even VBA programmers may run away screaming:

![A yucky class](files/images/horridPersonProxies.png)

The use of interceptors is normally comfortably accessible from within the framework of Spring.Net/Castle Windsor. The documentation how the proxy generators should be used is not readily available. Best bet in such a case are the relevant test cases. With both projects being open source and providing a decent suite of test cases, there is no excuse in not figuring out how some part of a system is meant to be used.

Another infrastructural part is a wrapper to the StopWatch that allows us to get some performance pointers. For starters, we do the test with just the object without any proxies or interceptors:

`
      IHorridPerson p = new HorridPerson();
      p.AddAddress("Hurlistreet", "Zürich", "23", "3232", "CH");
      Console.WriteLine(p.City);
      Console.WriteLine(p.ReturnBirthDate()); 
`

Measuring the performance of it looks like that:

`
using (var s = new SimpleStopWatch("Standard Test"))
{
  tests.Standard.Test(s);
}
`

(Today) the code needs about 2ms in the first run, and about 1ms in subsequent runs. I say today, because yesterday the code was running a lot slower on the whole (e,g, 10ms in the first run). I am running it from the debugger, but all tests done have to live with that problem, which seems fair to me.

What about DynamicProxy2? Here we need a slightly different setup:

`
public void Test(SimpleStopWatch sw)
{
  ProxyGenerator gen = new ProxyGenerator(new DefaultProxyBuilder());
  sw.Ping("After proxygen");
  IHorridPerson p = gen.CreateInterfaceProxyWithTarget<IHorridPerson>(new HorridPerson(),
    new SimpleInterceptor());
  sw.Ping("After create class proxy");
  p.AddAddress("Hurlistreet", "Zürich", "23", "3232", "CH");
  sw.Ping();
  Console.WriteLine(p.City);
  sw.Ping();
  Console.WriteLine(p.ReturnBirthDate()); 
}
`

The interesting bits are at the beginning. It also shows one of the things one needs to have to create a proxy: The proxied class should implement an interface which we can use to talk to whatever implements said interface, or, in the case of DynamicProxy2, we can create a class whose members are all virtual. That way an inheriting class can override all members in a controllable fashion that does not resort to some kind of reflection.
The SimpleInterceptor is one that logs before and after invoking the object usage it is currently intercepting:

`
  class SimpleInterceptor : IInterceptor
  {

    public void Intercept(IInvocation invocation)
    {
      Console.WriteLine("Before proceed");
      invocation.Proceed();
      Console.WriteLine("After proceed");
    }
  }
`

The invocation holds all information about the current method call (e.g. Method Info, arguments, return value, etc.)

Let's look straight at the output of the SimpleStopWatch:

`
::STOPWATCH/Dynamicproxy Test - (0ms) - Starting
::STOPWATCH/Dynamicproxy Test - (21ms) - After proxygen
::STOPWATCH/Dynamicproxy Test - (212ms) - After create class proxy
Before proceed
Adding address
After proceed
::STOPWATCH/Dynamicproxy Test - (215ms) - Intermediate output
Before proceed
Calling city property
After proceed
::STOPWATCH/Dynamicproxy Test - (217ms) - Intermediate output
Before proceed
Returning birthdate
After proceed
30.04.2008 23:23:43
::STOPWATCH/Dynamicproxy Test - (220ms) - Ending
`

And a second run, straight away:

`
::STOPWATCH/Dynamicproxy Test - (0ms) - Starting
::STOPWATCH/Dynamicproxy Test - (0ms) - After proxygen
::STOPWATCH/Dynamicproxy Test - (57ms) - After create class proxy
Before proceed
Adding address
After proceed
::STOPWATCH/Dynamicproxy Test - (58ms) - Intermediate output
Before proceed
Calling city property
After proceed
::STOPWATCH/Dynamicproxy Test - (61ms) - Intermediate output
Before proceed
Returning birthdate
After proceed
30.04.2008 23:23:43
::STOPWATCH/Dynamicproxy Test - (64ms) - Ending
`

One can see that we do pay for the usage of such a proxying scheme. While yesterday it looked a lot more extreme, the penalty today is still fairly high when comparing it to a normal object call. On the other hand, if the called methods actually do any meaningful work, the 3-4ms penalty per call may quickly dissipate. Also, it is quite apparent that once the proxy has been generated, it will be reused for other instances of the same type.

Time is running out - Let us move swiftly to the Spring.AOP case. For brevity, just the first lines of the test case:
`
public void Test(SimpleStopWatch sw)
{
  ProxyFactory factory = new ProxyFactory(new HorridPerson());
  sw.Ping("After factory");
  factory.AddAdvice(new ConsoleLoggingAroundAdvice());
  sw.Ping("After AddAdvice");
  IHorridPerson p = (IHorridPerson)factory.GetProxy();
  ...
`

Looks slightly different and yet familiar...to make it complete here the "Advice":

`
public class ConsoleLoggingAroundAdvice : IMethodInterceptor
{
  public object Invoke(IMethodInvocation invocation)
  {
    Console.Out.WriteLine("Advice executing; calling the advised method...");
    object returnValue = invocation.Proceed();
    Console.Out.WriteLine("Advice executed; advised method returned " + returnValue);
    return returnValue;
  }
}
`

And finally  the output:

`
::STOPWATCH/Spring Test - (0ms) - Starting
::STOPWATCH/Spring Test - (144ms) - After factory
::STOPWATCH/Spring Test - (148ms) - After AddAdvice
::STOPWATCH/Spring Test - (225ms) - After GetProxy
Advice executing; calling the advised method...
Adding address
Advice executed; advised method returned
::STOPWATCH/Spring Test - (245ms) - Intermediate output
Advice executing; calling the advised method...
Calling city property
Advice executed; advised method returned
::STOPWATCH/Spring Test - (248ms) - Intermediate output
Advice executing; calling the advised method...
Returning birthdate
Advice executed; advised method returned 30.04.2008 23:34:18
30.04.2008 23:34:18
::STOPWATCH/Spring Test - (252ms) - Ending
`

And the second run straight away...

`
::STOPWATCH/Spring Test - (0ms) - Starting
::STOPWATCH/Spring Test - (0ms) - After factory
::STOPWATCH/Spring Test - (0ms) - After AddAdvice
::STOPWATCH/Spring Test - (1ms) - After GetProxy
Advice executing; calling the advised method...
Adding address
Advice executed; advised method returned
::STOPWATCH/Spring Test - (2ms) - Intermediate output
Advice executing; calling the advised method...
Calling city property
Advice executed; advised method returned
::STOPWATCH/Spring Test - (4ms) - Intermediate output
Advice executing; calling the advised method...
Returning birthdate
Advice executed; advised method returned 30.04.2008 23:34:18
30.04.2008 23:34:18
::STOPWATCH/Spring Test - (9ms) - Ending
`

The second one was already quite quick. Spring.Net beats Castle Windsor when it comes to wiring up the proxy. The penalties on the method/property invocations are quite comparable. Either way, that should not be the main driver when you choose to use those assemblies to perform what people like to call aspect-oriented programming. It would interest me why the aforementioned projects chose DanymicProxy2 over the Spring.AOP solution. Either way, usually it's a good thing to have a choice, it's not like we .NET folks are usually spoiled with it (Microsoft's closest thing to the subject is ContextBoundObject: You will run away...)

The solution (VS2008) is attached as download, you will have to provide the references yourself. Enjoy.

[![kick it on DotNetKicks.com](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http%3a%2f%2frealfiction.net%2f%3fq%3dnode%2f154&bgcolor=0000CC)](http://www.dotnetkicks.com/kick/?url=http%3a%2f%2frealfiction.net%2f%3fq%3dnode%2f154)