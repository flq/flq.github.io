---
title: "MemBus extension points"
layout: post
tags: programming dotnet TrivadisContent patterns C# membus
date: 2010-09-20 06:08:00
redirect_from: /go/181/
---

## ISubscription
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:190c5896-f866-4e11-a2d6-22e44164327c" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public interface ISubscription
{
    void Push(object message);
    Type Handles { get; }
}</pre></div>

This is the basic structure of a subscription. There is also a typed version:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:81de923a-f351-4572-8a38-89b394e9f86d" class="wlWriterEditableSmartContent"><pre name="code" class="c#">    public interface IHandles&lt;T&gt; : ISubscription
    {
        void Push(T message);
    }</pre></div>

If you want to write a handler, you can inherit from the Handles class:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:754201c5-1a3e-4b46-bd38-411cdf29a195" class="wlWriterEditableSmartContent"><pre name="code" class="c#">class MsgAHandler : Handles&lt;MessageA&gt; {
  protected override void push(MessageA msg) {
    // Do stuff.
  }
}</pre></div>

How can you introduce subscriptions into MemBus apart from method-based subscriptions? In the setup, either directly through _IConfigurableBus.AddSubscription(ISubscription subscription) _or more universal by adding an implementation of 

## ISubscriptionResolver

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:00b5db25-8125-44fc-beba-b16608b85197" class="wlWriterEditableSmartContent"><pre name="code" class="c#">    public interface ISubscriptionResolver
    {
        IEnumerable&lt;ISubscription&gt; GetSubscriptionsFor(object message);
        bool Add(ISubscription subscription);
    }</pre></div>

A resolver must provide subscriptions for a given message and it may accept subscriptions. The boolean return value states whether the subscription was accepted or not.

## IPublishPipelineMember

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:6cf03ad2-7dcf-4b79-a1d0-9fab2d060758" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public class PublishToken
{
    public object Message { get; private set; }
    public IEnumerable&lt;ISubscription&gt; Subscriptions { get; private set; }
    ...
}

public interface IPublishPipelineMember
{
    void LookAt(PublishToken token);
}</pre></div>

The “act” of publishing is the execution of the publish pipeline, which may consist of many pipeline members. You can participate in the publishing pipeline by implementing the above interface.

## ISubscriptionShaper

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:74f19f0c-9a5f-45b2-bbb3-e38181d6b3b1" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public interface ISubscriptionShaper
{
    ISubscription EnhanceSubscription(ISubscription subscription);
}</pre></div>

This allows you to provide instances that “shape” subscriptions. This interface is best explained by an example:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:a6dc4b98-2226-46c4-a370-34c556e15b9c" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public class ShapeToFilter&lt;M&gt; : ISubscriptionShaper
{
    private readonly Func&lt;M, bool&gt; filter;

    public ShapeToFilter(Func&lt;M,bool&gt; filter)
    {
        this.filter = filter;
    }

    public ISubscription EnhanceSubscription(ISubscription subscription)
    {
        return new FilteredSubscription&lt;M&gt;(filter, subscription);
    }
}</pre></div>

Consider that a subscription can interact with another instance implementing ISubscription in the “Push” method. A shaper is the abstraction of enhacing an existing subscription. It is used internally for making a subscription disposable, making it filtered, making it dispatch on the UI, etc.