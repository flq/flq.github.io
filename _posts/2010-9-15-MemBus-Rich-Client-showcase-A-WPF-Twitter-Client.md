---
title: "MemBus Rich Client showcase: A WPF Twitter Client"
layout: post
tags: programming dotnet membus
date: 2010-09-15 20:35:00
redirect_from: "/go/182"
---

After pondering a bit about the example application that should showcase MemBus, I thought that it should be a Twitter client. I think that Twitter Clients are something like the web era’s Hello World examples.

The example application is found under the MemBus directory at github: [http://github.com/flq/MemBus/tree/master/Membus.WpfTwitterClient/](http://github.com/flq/MemBus/tree/master/Membus.WpfTwitterClient/)

It will use MemBus, a DI container and a WPF framework to show off message-based patterns. Functionality-wise it will be a Twitter Client that will allow you to post status updates and see your timeline.
 <div class="alert"> 

**Nag**

Since this Client is open source there is the problem that distributing the necessary secrets to access the Twitter API would be just too obvious. In this [discussion thread here](http://groups.google.com/group/twitter-development-talk/browse_thread/thread/c18ade9d86c8b239?pli=1) a strategy is proposed how to solve that issue. For now, I am afraid that I cannot distribute the secrets. Stay tuned for a better solution.
</div>