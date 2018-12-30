---
title: "More tricks from ye olde Event Aggregator: No, I don’t want that message for a while"
layout: post
tags: [software-development, membus]
date: 2011-08-12 20:46:00
redirect_from: /go/203/
---

You may know by now that MemBus is my favorite Event Aggregator. This is because it allows you to mess quite a bit with the way publishing and subscription needs. Consider the following situation:

An instance is accepting messages of a certain kind but wants to opt out of it from time to time. The easy way out would be to check some boolean in your message handle code. alas, handle implementors would have to think of not forgetting that – it leads to that ceremony code we have learned to despise.

Check out the subscribing code:

```csharp
public class TheSubscriber : ICancelSpecials
{
    private bool _isSuspended;

    public void Suspend()    {  _isSuspended = true;  }

    public void Resume()  {  _isSuspended = false;  }

    public void Handle(NormalMessage msg)   {  }

    public void Handle(SpecialMessage msg) {  }

    bool ICancelSpecials.IsSuspended
    {
        get { return _isSuspended; }
    }
}
```

Note that ICancelSpecials is something from your application. What we want is that when the subsciber is “Suspended”, no more “special” messages are moved into the corresponding “Handle” method. In order to support this, we set up MemBus in the following way:

```csharp
_bus = BusSetup.StartWith<Conservative>()
    .Apply<FlexibleSubscribeAdapter>(a => a.ByMethodName("Handle"))
    .Apply<BlockSpecialsIfsuspended>()
    .Construct();
```

The **BlockSpecialsIfSuspended** is not a MemBus class, but provided by “us”. Let’s have a look at it:

```csharp
public class BlockSpecialsIfsuspended : ISetup<IConfigurableBus>
{
    public void Accept(IConfigurableBus setup)
    {
        setup.ConfigureSubscribing(SubscribeConfig);
    }

    private static void SubscribeConfig(IConfigurableSubscribing cs)
    {
        cs.MessageMatch(mi =&gt; mi.Name.StartsWith("Special"), ConfigureSpecial);
    }

    private static void ConfigureSpecial(IConfigureSubscription cs)
    {
        cs.ShapeOutwards(new DenyIfSuspended(), new ShapeToDispose());
    }
}
```

What this class does it accessing the configuration part regarding subscribing. Based on a MessageMatch, essentially a filter to state for which messages you want to influence the way subscriptions are treated. Here we specify the [ISubscriptionShape](http://realfiction.net/go/181) instances that will be applied to the basic subscription inside out. Hence, **DenyIfSuspended** is an **ISubscriptionShape** implementation:

```csharp
private class DenyIfSuspended : ISubscriptionShaper, ISubscription
{
    private readonly ISubscription _inner;
    private readonly ICancelSpecials _cancelSpecials;

    public DenyIfSuspended() { }

    private DenyIfSuspended(ISubscription inner, ICancelSpecials cancelSpecials)
    {
        _inner = inner;
        _cancelSpecials = cancelSpecials;
    }

    ISubscription ISubscriptionShaper.EnhanceSubscription(ISubscription subscription)
    {
        var theCancelSpecials = (subscription as IKnowsSubscribedInstance).IfNotNull(ks => ks.Instance as ICancelSpecials);
        return theCancelSpecials != null ? new DenyIfSuspended(subscription, theCancelSpecials) : subscription;
    }

    void ISubscription.Push(object message)
    {
        if (!_cancelSpecials.IsSuspended)
            _inner.Push(message);
    }

    bool ISubscription.Handles(Type messageType)
    {
        return _inner.Handles(messageType);
    }
}
```

This class plays the role of shaping a subscription as well as being a subscription. If it can figure out that the subsription it is looking at knows the instance providing (**IKnowsSubscribedInstance**) the subscription and if that instance implements ICancelSpecials, then it will return itself as subscription, otherwise it will do nothing.

Being a subscription, it will only push the message downwards if the instance is not suspended.

In the end, you may say that this involves a bit of ceremony as well – bear in mind, though, that this is done once, and applies to that particular situation in your application. You can e.g. implement ICancelSpecials in a base class, and have your handle methods in the specializations