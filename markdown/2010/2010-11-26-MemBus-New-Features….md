---
title: "MemBus: New Features…"
layout: post
tags: [software-development, dotnet, patterns, membus]
date: 2010-11-26 00:00:00
redirect_from: /go/190/
---

MemBus has taken a couple of updates based on some inspiration from an example of a very simple [CQRS style example application](https://github.com/gregoryyoung/m-r) from Greg Young and input from working on the Hello World App MemBusOnTweet.

### Give your Rx-based observables a home

You can do this by *gulp* inheriting from `RxEnabledObservable<T>`, with T being your message. The class will force you to implement the “constructObservable” method, in which you can enrich with Rx-glory an observable instance that is provided into the method by MemBus. Check out e.g. the example of screens ready to be displayed:

```csharp
public class StreamOfScreensToActivate : RxEnabledObservable<RequestToActivateMainScreen>
{
    public StreamOfScreensToActivate(IBus bus) : base(bus)
    {
    }

    protected override IObservable<RequestToActivateMainScreen> constructObservable(
      IObservable<RequestToActivateMainScreen> startingPoint)
    {
        return startingPoint
            .Where(msg => msg.ScreenAvailable)
            .ObserveOnDispatcher();
    }
}
```

Now, in the ViewModel of the Mainwindow, I can state a dependency to the concrete class:

```csharp
public ShellViewModel(StreamOfScreensToActivate activationStream, ActivityViewModel activityVm, AttentionViewModel attentionVm)
```

There may be an issue regarding testability (a Dispatcher is involved), alas, we still need to deal a lot with dispatching.

### The subscription interface changed!

Considering that this may be the single most important interface of the project, why would I do that?

Compare the old one:

```csharp
public interface ISubscription
{
    void Push(object message);
    Type Handles { get; }
}
```

With the new one:

```csharp
public interface ISubscription
{
    void Push(object message);
    bool Handles(Type messageType);
}
```

This adds a lot more flexibility to what the subscription can state that it can handle. In theory, an implementation can now state to handle multiple disparate types and MemBus will act accordingly. A direct effect is that **message handling** (with the exception of calling out to an IoC) **is now contravariant by default**. A subscription that handles objects, can also handle strings or Customers. Logging all your messages in MemBus is now as easy as saying:

```csharp
bus.Subscribe<object>(msg=>log.Info(msg.ToString());
```

The API change imposes some restrictions on picking up subscriptions fast when looking for a type, but caching is still possible when a kind of ramp up phase has been endured. However, note that MemBus makes the assumption about ISubscription instances in that **over time they do not change the answers they give whether they handle a certain message type or not**.

### Subscribe with any object

For the lazy of us this is surely a nice feature. Why would you have to manually subscribe your message handling methods, when MemBus can do it for you? You just need to tell it based on which rules you want subscriptions to be picked up. Imagine you define your following interface in your project:

```csharp
public interface YetAnotherHandler<in T> {
  void Handle(T msg);
}
```

You now tell MemBus to consider it when you subscribe via instance. You do this when constructing the bus:

```csharp
var b = BusSetup
  .StartWith<Conservative>()
  .Apply<FlexibleSubscribeAdapter>(c => c.ByInterface(typeof(YetAnotherHandler<>))
  .Construct();</pre></div>
```

Now, when you define a class as such:

```csharp
public class CustomerHandling : YetAnotherHandler<CustomerCreated>, YetAnotherHandler<CustomerChangedAddress>
{ }
```

you may instantiate and push it into Membus:

```csharp
var d = bus.Subscribe(new CustomerHandling());
```

The result is that the two implemented methods on the class are now subscriptions inside Membus and will receive the “CustomerCreated” and “CustomerchangedAddress” messages published through it. You may also wire up a class based on method naming, if a naming convention is sufficient for your needs.

The return value, by the way, is still an IDisposable. When you call dispose on it, all references to your subscribing instance will be removed from MemBus. Hold dear to it if the lifetime of your subscribing object is shorter than the lifetime of your Bus instance.

That’s it for now, i hope you enjoy the new stuff.