---
title: "MemBus: Using an IoC Container to provide subscribers"
layout: post
tags: programming TrivadisContent patterns membus
date: 2010-09-27 20:41:00
redirect_from: "/go/183"
---

The “Observe” and “Subscribe” functionality already opens up numerous possibilities for reacting to messages. Another way to handle messages is by providing a Handler which accepts messages of a certain type:
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:4bce9fa8-07f8-46ad-a2e3-ca2140037987" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public interface IHandles&lt;T&gt; : ISubscription
{
    void Push(T message);
}</pre></div>

Once we’re down to providing instances to handle available messages, it makes a lot of sense to bring IoC containers to the stage. Indeed, it is relatively easy to put your Container of choice into action by providing an implementation of “**ISubscriptionResolver**”. 

MemBus comes with an implementation that uses the [Common service locator](http://commonservicelocator.codeplex.com/) dll to allow plugging your container of choice into the functionality of letting “IHandles” implementations handle messages. Numerous IoC container on the .NET platform come with a bridge to plug into the common service locator. It is also quite easy to provide your own bridge. Here’s an example for [StructureMap](http://structuremap.net/structuremap/index.html):

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:8830d825-85ac-43f7-8286-559d1e370eed" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public class ServiceLocator : ServiceLocatorImplBase
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
}</pre></div>

**ServiceLocatorImplBase** is a class from the common service locator dll. 

Moving along with the StructureMap example, the Container enters MemBus in the following way:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:d44a076e-6fd7-42f4-897b-08eab52836a9" class="wlWriterEditableSmartContent"><pre name="code" class="c#">var bus = BusSetup.StartWith&lt;AsyncRichClientFrontend, ClientPublishingConventions&gt;(
  new ServiceLocatorSupport(new ServiceLocator(() =&gt; ObjectFactory.Container)))
.Construct();</pre></div>

**ServiceLocatorSupport** is a MemBus class which accepts an implementation of **IServiceLocator**, the main interface of the common service locator library.

In StructureMap I can now make all IHandles implementations available e.g. inside a registry:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:4156246a-c4c8-4573-8c5e-c5a5175dd9f6" class="wlWriterEditableSmartContent"><pre name="code" class="c#">Scan(s =&gt;
{
  s.AssembliesFromApplicationBaseDirectory();
   s.AddAllTypesOf(typeof (IHandles&lt;&gt;));
});</pre></div>

That way, any implementations that close this interface will be picked up and resolved when requested by MemBus. 

Another nice way to bring in message notification is by defining how an observable is constructed. MemBus brings along a generic implementation of **IObservable&lt;T&gt;** that is IoC friendly. The class **MessageObservable**, which is also returned by a call to **IBus**.**Observe&lt;M&gt;** can also be constructed by the IoC container, provided you let it know how to provide an IBus implementation:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:62676971-a282-4123-97d4-9b261415c26b" class="wlWriterEditableSmartContent"><pre name="code" class="c#">ForSingletonOf&lt;IBus&gt;().Use(constructBus);
For(typeof (IObservable&lt;&gt;)).Use(typeof (MessageObservable&lt;&gt;));</pre></div>

Hence any instance that expresses a dependency to an IObservable&lt;T&gt; will obtain a valid instance that will pick up notifications published via MemBus.

&nbsp;

By the way, all code samples here are taken from the Sample Application which is part of MemBus.