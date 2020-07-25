---
title: "MemBus: Using an IoC Container to provide subscribers"
layout: post
tags: [software-development, patterns, membus]
date: 2010-09-27 20:41:00
redirect_from: /go/183/
---

```csharp
public interface IHandles<T> : ISubscription
{
    void Push(T message);
}
```

Once we’re down to providing instances to handle available messages, it makes a lot of sense to bring IoC containers to the stage. Indeed, it is relatively easy to put your Container of choice into action by providing an implementation of “**ISubscriptionResolver**”. 

MemBus comes with an implementation that uses the [Common service locator](http://commonservicelocator.codeplex.com/) dll to allow plugging your container of choice into the functionality of letting “IHandles” implementations handle messages. Numerous IoC container on the .NET platform come with a bridge to plug into the common service locator. It is also quite easy to provide your own bridge. Here’s an example for [StructureMap](http://structuremap.net/structuremap/index.html):

```csharp
public class ServiceLocator : ServiceLocatorImplBase
{
    private readonly Func&lt;IContainer&gt; containerLookup;

    private IContainer container
    {
        get { return containerLookup(); }
    }

    public ServiceLocator(Func&lt;IContainer&gt; containerLookup)
    {
        this.containerLookup = containerLookup;
    }

    protected override object DoGetInstance(Type serviceType, string key)
    {
        return string.IsNullOrEmpty(key) ? container.GetInstance(serviceType) : container.GetInstance(serviceType, key);
    }

    protected override IEnumerable&lt;object&gt; DoGetAllInstances(Type serviceType)
    {
        return container.GetAllInstances(serviceType).OfType&lt;object&gt;();
    }
}
```

**ServiceLocatorImplBase** is a class from the common service locator dll. 

Moving along with the StructureMap example, the Container enters MemBus in the following way:

```csharp
var bus = BusSetup.StartWith&lt;AsyncRichClientFrontend, ClientPublishingConventions&gt;(
  new ServiceLocatorSupport(new ServiceLocator(() =&gt; ObjectFactory.Container)))
.Construct();
```

**ServiceLocatorSupport** is a MemBus class which accepts an implementation of **IServiceLocator**, the main interface of the common service locator library.

In StructureMap I can now make all IHandles implementations available e.g. inside a registry:

```csharp
Scan(s =>
{
  s.AssembliesFromApplicationBaseDirectory();
   s.AddAllTypesOf(typeof (IHandles<>));
});
```

That way, any implementations that close this interface will be picked up and resolved when requested by MemBus. 

Another nice way to bring in message notification is by defining how an observable is constructed. MemBus brings along a generic implementation of **IObservable&lt;T&gt;** that is IoC friendly. The class **MessageObservable**, which is also returned by a call to **IBus**.**Observe&lt;M&gt;** can also be constructed by the IoC container, provided you let it know how to provide an IBus implementation:

```csharp
ForSingletonOf<IBus>().Use(constructBus);
For(typeof (IObservable<>)).Use(typeof (MessageObservable<>));
```

Hence any instance that expresses a dependency to an `IObservable<T>` will obtain a valid instance that will pick up notifications published via MemBus.

By the way, all code samples here are taken from the Sample Application which is part of MemBus.