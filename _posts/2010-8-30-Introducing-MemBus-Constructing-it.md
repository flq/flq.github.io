---
title: "Introducing MemBus: Constructing it"
layout: post
tags: [programming, dotnet, TrivadisContent, patterns, membus]
date: 2010-08-30 08:01:00
redirect_from: /go/176/
---

as you might have guessed, MemBus isn’t a single class. A number of different responsibilities are tucked nicely behind the IBus interface. Those responsibilities want to be configured, which is done through the **BusSetup** class.

The BusSetup either takes a class that interacts with, or it allows you to interact directly with the **IConfigurableBus**. 

![BusSetup](http://realfiction.net/assets/image_288bb54a-ea88-4197-a4e9-5fe13d7f6b76.png "BusSetup") 

 Let’s talk about those responsibilities by looking at the interface:

![IConfigurableBus_interface](http://realfiction.net/assets/ebe64f99-efa7-4c46-b66a-46eb7d74fb2a_4c6b7c23-511e-4fc4-b265-11d69c2dbbf9.png "IConfigurableBus_interface")

&nbsp;

*   **ConfigurePublishing**: Given a Message and a number of subscriptions, configure how the message is published on the subscriptions
*   **ConfigureSubscribing**: Given a subscription, configure how those subscriptions are shaped when a message is to be published to them
*   **ConfigureBubbling**: Given a Bus, which may be a child or a parent of some other bus (the concept will be explained in a later post), configures if messages bubble up to a parent or are pushed down to a child
*   **AddResolver**: A subscription resolver’s job is to provide subscriptions for a given message
*   **AddSubscription**: Pretty clear thing.
*   **AddAutomaton**: An automaton can be anything whose lifetime should be closely related to the Bus.
*   **AddService**: Similar to an automaton, these are rather instances that serve some purpose in making other parts of the Bus work. 

&nbsp;

MemBus doesn’t provide you with any singleton or anything. Being essentially a service to your application, it is your responsibility to keep as many instances of IBus as long as you want, although it is likely that you’ll usually have one instance around.