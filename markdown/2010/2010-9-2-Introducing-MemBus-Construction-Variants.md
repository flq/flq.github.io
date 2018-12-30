---
title: "Introducing MemBus: Construction Variants"
layout: post
tags: [csharp, membus]
date: 2010-09-02 14:16:00
redirect_from: /go/177/
---

I have used the “Conservative” class several times now. It is a concrete example of how to set up MemBus. Let us have a look at what it does:

![image](/assets/image_35f48b02-c5a5-4090-9a9d-122b6268b256.png "image")&nbsp;

*   A default publishpipeline is added by specifying a IPublishPipelineMember: It’s the sequential publisher which takes all resolved subscriptions and pushes the message to them
*   A resolver is added which stores subscriptions in a hash table, resolving them via the message’s Type.
*   A subscription shaper is associated with the subscribing activity. Its job will be to take care that a newly added subscription can be disposed. 

There isn’t anything more you need to get a MemBus instance up and running. Compare this with a setup for a rich client (WPF or Windows Forms)

![image](/assets/image_6fd22de0-dda4-40d7-af17-74cc4a188340.png "image") 

You will see 2 major differences: 

*   A different publisher gets used. The **ParallelBlockingPublisher** will use several threads to publish a message, but will block until all subscriptions return (as opposed to the **ParallelNonBlockingPublisher**).
*   A task scheduler is added that can be used to ensure that receiving a message happens on a specific thread: An essential feature when programming multi-threaded in a rich client to ensure that UI changes happen on the UI thread.