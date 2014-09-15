---
title: "MemBus: New Features…"
layout: post
tags: [programming, dotnet, TrivadisContent, patterns, membus]
date: 2010-11-26 00:00:00
redirect_from: /go/190/
---

MemBus has taken a couple of updates based on some inspiration from an example of a very simple [CQRS style example application](https://github.com/gregoryyoung/m-r) from Greg Young and input from working on the Hello World App MemBusOnTweet.

### Give your Rx-based observables a home

You can do this by *gulp* inheriting from RxEnabledObservable&lt;T&gt;, with T being your message. The class will force you to implement the “constructObservable” method, in which you can enrich with Rx-glory an observable instance that is provided into the method by MemBus. Check out e.g. the example of screens ready to be displayed:

&nbsp;

 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:94724fcb-d280-4f74-8bee-8102ed2a3939" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public class StreamOfScreensToActivate : RxEnabledObservable&lt;RequestToActivateMainScreen&gt;
{
    public StreamOfScreensToActivate(IBus bus) : base(bus)
    {
    }

    protected override IObservable&lt;RequestToActivateMainScreen&gt; constructObservable(
      IObservable&lt;RequestToActivateMainScreen&gt; startingPoint)
    {
        return startingPoint
            .Where(msg =&gt; msg.ScreenAvailable)
            .ObserveOnDispatcher();
    }
}</pre></div>

Now, in the ViewModel of the Mainwindow, I can state a dependency to the concrete class:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:347f0320-ca4f-46a2-a40c-ec044067b5b0" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public ShellViewModel(StreamOfScreensToActivate activationStream, ActivityViewModel activityVm, AttentionViewModel attentionVm)</pre></div>

There may be an issue regarding testability (a Dispatcher is involved), alas, we still need to deal a lot with dispatching.

### The subscription interface changed!

Considering that this may be the single most important interface of the project, why would I do that?

Compare the old one:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:7d195777-6658-4c88-97f3-d10294d6699e" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public interface ISubscription
{
    void Push(object message);
    Type Handles { get; }
}</pre></div>

With the new one:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:fd49168b-6892-4ef8-9b17-720491b640fc" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public interface ISubscription
{
    void Push(object message);
    bool Handles(Type messageType);
}</pre></div>

This adds a lot more flexibility to what the subscription can state that it can handle. In theory, an implementation can now state to handle multiple disparate types and MemBus will act accordingly. A direct effect is that **message handling** (with the exception of calling out to an IoC) **is now contravariant by default**. A subscription that handles objects, can also handle strings or Customers. Logging all your messages in MemBus is now as easy as saying:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:fe820cad-45e7-4632-978a-a9d8e10a0ae0" class="wlWriterEditableSmartContent"><pre name="code" class="c#">bus.Subscribe&lt;object&gt;(msg=&gt;log.Info(msg.ToString());</pre></div>

The API change imposes some restrictions on picking up subscriptions fast when looking for a type, but caching is still possible when a kind of ramp up phase has been endured. However, note that MemBus makes the assumption about ISubscription instances in that **over time they do not change the answers they give whether they handle a certain message type or not**.

### Subscribe with any object

For the lazy of us this is surely a nice feature. Why would you have to manually subscribe your message handling methods, when MemBus can do it for you? You just need to tell it based on which rules you want subscriptions to be picked up. Imagine you define your following interface in your project:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:53f7957f-2dd3-4f7f-8418-a7f52887585e" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public interface YetAnotherHandler&lt;in T&gt; {
  void Handle(T msg);
}</pre></div>

You now tell MemBus to consider it when you subscribe via instance. You do this when constructing the bus:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:2dbff060-df1e-4c8c-a557-621bbd4e4273" class="wlWriterEditableSmartContent"><pre name="code" class="c#">var b = BusSetup
  .StartWith&lt;Conservative&gt;()
  .Apply&lt;FlexibleSubscribeAdapter&gt;(c =&gt; c.ByInterface(typeof(YetAnotherHandler&lt;&gt;))
  .Construct();</pre></div>

Now, when you define a class as such:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:692aa462-f1ca-4914-b795-88f4203d320a" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public class CustomerHandling : YetAnotherHandler&lt;CustomerCreated&gt;, YetAnotherHandler&lt;CustomerChangedAddress&gt;
...</pre></div>

you may instantiate and push it into Membus:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:eefd87c4-afe1-4a52-9e1c-59049f2688b0" class="wlWriterEditableSmartContent"><pre name="code" class="c#">var d = bus.Subscribe(new CustomerHandling());</pre></div>

The result is that the two implemented methods on the class are now subscriptions inside Membus and will receive the “CustomerCreated” and “CustomerchangedAddress” messages published through it. You may also wire up a class based on method naming, if a naming convention is sufficient for your needs.

The return value, by the way, is still an IDisposable. When you call dispose on it, all references to your subscribing instance will be removed from MemBus. Hold dear to it if the lifetime of your subscribing object is shorter than the lifetime of your Bus instance.

That’s it for now, i hope you enjoy the new stuff.