---
title: "MemBus extension points"
layout: post
tags: [own-software, patterns, csharp, membus]
date: 2010-09-20 06:08:00
topic: "membus"
---

## ISubscription

```csharp
public interface ISubscription
{
    void Push(object message);
    Type Handles { get; }
}
```

This is the basic structure of a subscription. There is also a typed version:

```csharp
public interface IHandles&lt;T&gt; : ISubscription
{
    void Push(T message);
}
```

If you want to write a handler, you can inherit from the Handles class:

```csharp
class MsgAHandler : Handles&lt;MessageA&gt; {
  protected override void push(MessageA msg) {
    // Do stuff.
  }
}
```

How can you introduce subscriptions into MemBus apart from method-based subscriptions? In the setup, either directly through _IConfigurableBus.AddSubscription(ISubscription subscription) _or more universal by adding an implementation of 

## ISubscriptionResolver

```csharp
public interface ISubscriptionResolver
{
    IEnumerable&lt;ISubscription&gt; GetSubscriptionsFor(object message);
    bool Add(ISubscription subscription);
}
```

A resolver must provide subscriptions for a given message and it may accept subscriptions. The boolean return value states whether the subscription was accepted or not.

## IPublishPipelineMember

```csharp
public class PublishToken
{
    public object Message { get; private set; }
    public IEnumerable&lt;ISubscription&gt; Subscriptions { get; private set; }
    ...
}

public interface IPublishPipelineMember
{
    void LookAt(PublishToken token);
}
```

The “act” of publishing is the execution of the publish pipeline, which may consist of many pipeline members. You can participate in the publishing pipeline by implementing the above interface.

## ISubscriptionShaper

```csharp
public interface ISubscriptionShaper
{
    ISubscription EnhanceSubscription(ISubscription subscription);
}
```

This allows you to provide instances that “shape” subscriptions. This interface is best explained by an example:

```csharp
public class ShapeToFilter<M> : ISubscriptionShaper
{
    private readonly Func<M, bool> filter;

    public ShapeToFilter(Func<M,bool> filter)
    {
        this.filter = filter;
    }

    public ISubscription EnhanceSubscription(ISubscription subscription)
    {
        return new FilteredSubscription<M>(filter, subscription);
    }
}
```

Consider that a subscription can interact with another instance implementing ISubscription in the “Push” method. A shaper is the abstraction of enhacing an existing subscription. It is used internally for making a subscription disposable, making it filtered, making it dispatch on the UI, etc.