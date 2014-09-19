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
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:4ca25c79-eed6-455e-bf80-e113ab1cfb56" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public class TheSubscriber : ICancelSpecials
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
}</pre></div>

Note that ICancelSpecials is something from your application. What we want is that when the subsciber is “Suspended”, no more “special” messages are moved into the corresponding “Handle” method. In order to support this, we set up MemBus in the following way:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:a21c6292-fd48-4a4a-90a7-b4eb42cba63c" class="wlWriterEditableSmartContent"><pre name="code" class="c#">_bus = BusSetup.StartWith&lt;Conservative&gt;()
    .Apply&lt;FlexibleSubscribeAdapter&gt;(a =&gt; a.ByMethodName("Handle"))
    .Apply&lt;BlockSpecialsIfsuspended&gt;()
    .Construct();</pre></div>

The **BlockSpecialsIfSuspended** is not a MemBus class, but provided by “us”. Let’s have a look at it:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:58922d2c-8f18-4260-8f65-84e8600fe737" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public class BlockSpecialsIfsuspended : ISetup&lt;IConfigurableBus&gt;
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
}</pre></div>

What this class does it accessing the configuration part regarding subscribing. Based on a MessageMatch, essentially a filter to state for which messages you want to influence the way subscriptions are treated. Here we specify the [ISubscriptionShape](http://realfiction.net/go/181) instances that will be applied to the basic subscription inside out. Hence, **DenyIfSuspended** is an **ISubscriptionShape** implementation:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:c36de501-2108-486e-b710-88af2b41abf0" class="wlWriterEditableSmartContent"><pre name="code" class="c#">private class DenyIfSuspended : ISubscriptionShaper, ISubscription
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
        var theCancelSpecials = (subscription as IKnowsSubscribedInstance).IfNotNull(ks =&gt; ks.Instance as ICancelSpecials);
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
}</pre></div>

This class plays the role of shaping a subscription as well as being a subscription. If it can figure out that the subsription it is looking at knows the instance providing (**IKnowsSubscribedInstance**) the subscription and if that instance implements ICancelSpecials, then it will return itself as subscription, otherwise it will do nothing.

Being a subscription, it will only push the message downwards if the instance is not suspended.

In the end, you may say that this involves a bit of ceremony as well – bear in mind, though, that this is done once, and applies to that particular situation in your application. You can e.g. implement ICancelSpecials in a base class, and have your handle methods in the specializations