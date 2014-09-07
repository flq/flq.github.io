---
title: "Introducing MemBus: In-Memory Publish/Subscribe Messaging"
layout: post
tags: programming dotnet TrivadisContent patterns membus
date: 2010-08-24 20:50:00
redirect_from: "/go/175"
---

What is a Bus?

A bus carries people from A to B. That much is easy. You might have guessed that I am not in the transport business, nonetheless a bus in the software world also carries payloads around. You put something into the bus, expecting it to deliver your stuff to its designated destination. How it does that isn’t necessarily your business. Differing from the real business of public transportation you may not even care where your payload arrives.

The notion of putting your payload into the bus is called **publishing**.

You can attach your bus stop to the bus line. Normally you can specify which “passengers” you are interested in, and only those will come along to visit you. Other times you may interested in all “passengers” coming your way. Again, you do not necessarily care where your passengers come from, but you really wish they come in one piece and don’t get lost along the way.

The notion of attaching to the bus line to expect passengers is called **subscribing**.

A final word about the passengers. They are usually called **messages**, this time stealing the word from the world of mail delivery.

There are plenty of buses around in .NET world, let’s name a few: [NServiceBus](http://www.nservicebus.com/), [MassTransit](http://masstransit-project.com/) and [.NET Service Bus](http://www.microsoft.com/windowsazure/appfabric/). They all cover different grounds – what can be said, though, is that they all help setting up applications that scale well in terms of performance and throughput. This is because the publisher and the subscriber aren’t connected much more than via the payload that moves along the bus line. In other words, there aren’t much guarantees given in terms of when exactly a message arrives at this destination. Such applications are designed to handle node failures, network latencies, peak loads and similar situations.

MemBus is none of that. What _is_ MemBus then?

It is a [messaging framework available at github](http://github.com/flq/MemBus) and licensed under the Apache 2.0 license that utilizes the semantics of sending and receiving messages. Those messages are not meant to leave the AppDomain where the Bus lives in. There is no durability - when the AppDomain is gone, the Bus is gone.

MemBus simply allows you to use the messaging paradigm while staying internal to your App. By the way, this concept has a lot of similarities to what people call **Event Aggregator**, however, I prefer to think of this pattern in a “bus/messaging”-way.

As a final note to this introduction here’s the most simple code possible with MemBus:
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:e0bae41d-f35c-435b-a0de-b0c71e28e966" class="wlWriterEditableSmartContent"><pre name="code" class="c#">var bus = BusSetup.StartWith&lt;Conservative&gt;().Construct();
using (bus.Subscribe&lt;MessageA&gt;(Console.WriteLine))
    bus.Publish(new MessageA());</pre></div>

The following posts will show you in what different ways you can setup MemBus in order to support different scenarios.

<div class="alert">

*   [Introducing MemBus: Constructing it](/go/176) 
<li>[Introducing MemBus: Construction Variants](/go/177) 
<li>[MemBus: A more complex rich client setup](/go/178) 
<li>[Membus: Performance considerations](/go/179) 
<li>[Using MemBus](/go/180) 
<li>[MemBus extension points](/go/181)
<li>[MemBus: Using an IoC Container to provide subscribers](/go/183)</div>[![kick it on DotNetKicks.com](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http%3a%2f%2frealfiction.net%2fgo%2f175)](http://www.dotnetkicks.com/kick/?url=http%3a%2f%2frealfiction.net%2fgo%2f175) [![Shout it](http://dotnetshoutout.com/image.axd?url=http%3A%2F%2Frealfiction.net%2Fgo%2F175)](http://dotnetshoutout.com/Introducing-MemBus-In-Memory-PublishSubscribe-Messaging)