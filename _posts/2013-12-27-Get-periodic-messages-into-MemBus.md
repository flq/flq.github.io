---
title: "Get periodic messages into MemBus"
layout: post
tags: [programming, membus]
date: 2013-12-27 14:00:00
redirect_from: /go/241/
---

In the previous post introducing MemBus v3 I mentioned that I removed a project in the solution that contained code to help setting up the creation of periodic messages - once I probed the Rx-codebase a little more I found that there is support to set up Observables that create output periodically - so here's a (very) short post on how you combine that with MemBus.
First, go forth and make yourself a bus - don't forget to setup the flexible subscribe adapter. The provided lambda returns true for all method candidates (*I realize that this screams for an overload*).

```c#
readonly IBus _bus = BusSetup
    .StartWith<Conservative>()
    .Apply<FlexibleSubscribeAdapter>(cfg => cfg.RegisterMethods(info => true))
    .Construct();
```

As an example, let's have a class that provides timers for our application - the example shown sends out a **MessageA** instance 5 times every 100 milliseconds on the *Default Scheduler* (according to documentation the most appropriate strategy on the targetted system that does not block the current thread).

```c#
private class Timers
{
    public IObservable<MessageA> ASignal()
    {
        return Observable
        .Timer(TimeSpan.FromMilliseconds(10), TimeSpan.FromMilliseconds(100), Scheduler.Default)
        .Take(5)
        .Select(_ => new MessageA());
    } 
}
```

Providing the observable to MemBus is as easy as saying...


	_bus.Subscribe(new Timers());


and obtaining the messages could look like


    using (_bus.Subscribe((MessageA _) => cd.Signal()))
    {
		// Blabla
	}
	

I agree that this hardly merits a post, yet sometimes it's nice to see that something is as easy as eating an oven pizza.