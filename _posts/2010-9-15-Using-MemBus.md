---
title: "Using MemBus"
layout: post
tags: programming dotnet TrivadisContent patterns C# membus
date: 2010-09-15 07:25:00
redirect_from: "/go/180"
---

Usage of MemBus always goes through the IBus interface:
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:d062b0a7-ae8e-48c9-b2a2-cf8f8b8018d5" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public interface IBus : IDisposable
{
    void Publish(object message);
    IDisposable Subscribe&lt;M&gt;(Action&lt;M&gt; subscription);
    IDisposable Subscribe&lt;M&gt;(Action&lt;M&gt; subscription, ISubscriptionShaper customization);
    IDisposable Subscribe&lt;M&gt;(Action&lt;M&gt; subscription, Action&lt;ISubscriptionCustomizer&lt;M&gt;&gt; customization);
    IObservable&lt;M&gt; Observe&lt;M&gt;();
}</pre></div>

Whenever you want to...well...publish a message, you use the Publish method. It will accept an instance of anything.

Subscribing is a more open thing. Note that the IBus interface helps in subscribing through a method. There is also the possibility of registering Handlers, i.e. instances whose purpose is to handle messages of a certain type. This will be the subject of another post.

The standard subscription takes a method, returning an IDisposable. Please note that MemBus by default follows the pattern that we will see in the future by IObservable implementations – When you dispose the returned object it is ensured that your subscription is removed from MemBus. I have planned in the future a weak-reference based alternative that will allow you to forget about subscriptions, but for now it is the responsibility of the subscriber to remove subscriptions:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:34d4255a-afc9-46a4-a249-639c35be94e9" class="wlWriterEditableSmartContent"><pre name="code" class="c#">var d = bus.Subscribe&lt;MessageA&gt;(msg =&gt; received++);
bus.Publish(new MessageA());
received.ShouldBeEqualTo(1);
d.Dispose();
bus.Publish(new MessageA());
received.ShouldBeEqualTo(1);</pre></div>

The other overloads are variations of subscribing. The overload with the subscription customizer will allow you to change the rules by which you get messages. So far it will allow you to do filtering and to specify that a call on your subscription happens on the dispatcher thread, which makes it useful for UI operations.

The lines 

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:77e014ec-c0c4-4d0f-8ee6-4982b13f43d4" class="wlWriterEditableSmartContent"><pre name="code" class="c#">bus.Subscribe&lt;MessageB&gt;(subscription, c=&gt;c.SetFilter(msg=&gt;msg.Id == "A"));
bus.Subscribe&lt;MessageB&gt;(subscription, c =&gt; c.DispatchOnUiThread());</pre></div>

show you the syntax.

More about the ISubscriptionShaper overload when talking about the extension points of MemBus.

The Observe method opens to you the new and wonderful world of the [reactive framework](http://msdn.microsoft.com/en-us/devlabs/ee794896.aspx). It returns to you an Observable from which you obtain push-based notification of incoming instances of the desired type. Here’s a small example of using the filtering capabilities:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:183a6a4a-033b-419e-a76e-b78523fc49f2" class="wlWriterEditableSmartContent"><pre name="code" class="c#">var messages = 
    from msg in bus.Observe&lt;MessageA&gt;() 
    where msg.Name == "A" 
    select msg;

using (messages.Subscribe(msg =&gt; msgCount++))
{
    bus.Publish(new MessageA {Name = "A"});
    bus.Publish(new MessageA {Name = "B"});
    bus.Publish(new MessageA {Name = "A"});
    msgCount.ShouldBeEqualTo(2);
}</pre></div>