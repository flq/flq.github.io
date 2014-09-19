---
title: "MemBus: A more complex rich client setup"
layout: post
tags: [software-development, dotnet, patterns, membus]
date: 2010-09-06 09:00:00
redirect_from: /go/178/
---

Let us consider a more complex Bus setup in order to understand the capabilities of the different parts of the infrastructure:

&nbsp;![image](/public/assets/image_7337b070-7353-4041-bb93-87aca8327ca8.png "image") 

What are we expressing here?

*   Publishing is configured

*   If a message of type Transport is published, use the Sequential publisher
*   If a message type ends with “Request” in its name, publish a message of type Transport as constructed and use the non blocking publisher for the Request message.
*   If a message type ends with “Response” in its name, publish it in the parallel blocking fashion, then an instance of type Transport as shown.*   Subscriptions are configured 

This is an example where you perform Requests with messages that may be long running: They are published and the UI would have to wait until a “Response” becomes available. The Transport-messages mark those cycles such that a UI can use them in a general form to provide feedback to the user that something is happening.