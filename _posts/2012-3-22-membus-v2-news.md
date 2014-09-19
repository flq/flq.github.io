---
title: "membus v2 news"
layout: post
tags: [software-development, dotnet, membus]
date: 2012-03-22 13:00:00
redirect_from: /go/216/
---

Membus 1.5.0 is a kind of V2 release in that it removed a number of things that had ben marked as obsolete and also provides users with a new feature.

### IOC-Adapter

If you wanted to have MemBus call into your DI-Container of choice you pretty much followed the things outlined in this [blog post here][1]. Things changed since then. The dependency to the __CommonServiceLocator__ package has been removed, you rather implement the __IocAdapter__-interface whose contract is straightforward:

    public interface IocAdapter
    {
        IEnumerable<object> GetAllInstances(Type desiredType);
    }

Implement this interface, bridging e.g. to your DI-Container and finally use it when setting up MemBus:

    _bus = BusSetup
        .StartWith<Conservative>()
        .Apply<IoCSupport>(s => s.SetAdapter(new MyAdapter()).SetHandlerInterface(typeof(GimmeMsg<>)))
        .Construct();

__SetHandlerInterface__ is a new call that lets you provide an interface that your handler types implement. It expects an open generic type where the generic argument closes a __single method__ defined on the interface that can accept one object and returns void (_void Foo(T msg)_).

Previously the interface that had to be implemented was fixed and provided by MemBus. The change means that there is a whole new category of classes that can be called by MemBus but __do not__ take a direct dependency on it, since they implement an interface that you provide.

### Flexible subscribing

The flexible subscription adapter has received an extension that allows you to subscribe methods that return either an object or as a special case an __IEnumerable__.

In both cases, MemBus will take the __return value and either publish it back__ on the Bus again, or will enumerate the return value and __publish every yielded object__ on the Bus.

Taking an example from the tests:

    var bus = BusSetup
              .StartWith<Conservative>()
              .Apply<FlexibleSubscribeAdapter>(
                c => c.ByMethodName("Handle").PublishMethods("Route"))
              .Construct();

And a subscriber may look like this:

    public class Controller {
      public View Route(Input msg) {
        return new View();
      }
    }
    ...
    bus.Subscribe(new Controller());

Now, when publishing a new Input instance, the __Route__-method will be called and the return value will subsequently be delivered to any subscribers of the __View__-Type.

This should open up a new set of scenarios where you have methods that publish a new message based on a different one. This scenario can now be implemented __without__ taking a direct dependency to MemBus.

  [1]: http://realfiction.net/go/183