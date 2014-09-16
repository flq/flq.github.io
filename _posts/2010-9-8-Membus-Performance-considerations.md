---
title: "Membus: Performance considerations"
layout: post
tags: [programming, dotnet, TrivadisContent, patterns, C, membus]
date: 2010-09-08 12:00:00
redirect_from: /go/179/
---

When developing a piece of code that could potentially be used as a central component, one should have a look at the performance as well. There is no easy answer as to whether MemBus is fast or not – it depends which features you are using.

I have been doing a number of performance measurements wit the following setup:
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:264e5340-184d-49b5-961b-25a36e9297f4" class="wlWriterEditableSmartContent"><pre name="code" class="c#">        public void Run(IBus bus, TextWriter w)
        {
            bus.Subscribe&lt;MessageA&gt;(onMessageA);
            bus.Subscribe&lt;MessageB&gt;(onMessageB);
            bus.Subscribe&lt;MessageC&gt;(onMessageC);

            var r = new Random();
            var dict = new Dictionary&lt;int, Func&lt;object&gt;&gt;
                           {
                               {0, () =&gt; new MessageA()},
                               {1, () =&gt; new MessageB()},
                               {2, () =&gt; new MessageC()},
                           };
            int count = 0;
            var sw = Stopwatch.StartNew();
            while (count &lt; 100000)
            {
                bus.Publish(dict[r.Next(0, 3)]());
                count++;
            }

            w.WriteLine("Through {0}", sw.ElapsedMilliseconds);

            count = 0;
            while (count &lt; 4)
            {
                w.WriteLine("From MsgA:{0}({1}), B:{2}({3}), C:{4}({5})", aCount, MessageA.Count, bCount,
                            MessageB.Count, cCount, MessageC.Count);
                Thread.Sleep(200);
                count++;
            }
        }</pre></div>

The actual publishing happens in line 18. We publish three different messages by random, in total 100’000 messages. The three subscriptions each increment a counter, the messages themselves increment an internal counter when they are constructed. Let’s start with the simple setup (“**Conservative**”):

![image](http://realfiction.net/assets/image_5314e329-cdb9-4cdc-82d8-2245ebc72749.png "image") 

Pretty quick. Let’s compare it to the “**AsyncConfiguration**”:

![image](http://realfiction.net/assets/image_e3e558bc-b06e-4827-bf63-59863e4ff134.png "image") 

That’s taking a while...Let us actually do some work in a subscription and put a small thread.sleep() of 1 milliseconds in the subscription of message B. Let’s go **Conservative**:

![image](http://realfiction.net/assets/image_26fb2203-0e83-4070-a1b7-93ac4c8c9dab.png "image") 

That could be expected! B got 33463 messages, at 1ms each it gives you roughly that number. Let’s push it through the **AsyncConfiguration**:

![image](http://realfiction.net/assets/image_4f1ee625-b549-4ff8-933f-35ee48eb3165.png "image") 

The Publishing loop comes back much quicker, but now we can see that the work hasn’t been completed yet – The message construction count differs from the subscription counters! Also note that in this scenario I had to change the Increment code (“**++**”) to the thread-safe version (“**Interlocked.Increment(ref i)**”) as the counts would not match up anymore. As opposed to the code shown, I changed the counter output to be delayed by 1 seconds. Hence, after roughly 9 seconds all work was done.

As a final check, let’s use the “**Fast**” setup:

![image](http://realfiction.net/assets/image_7519dc98-15d1-439f-aa9f-1ac3a30d139a.png "image") 

Here, publishing comes back pretty quick, but the work also takes about the same time. the Fast setup was created after some sessions with the dotTrace performance profiler that showed where time could be saved. The fast setup will not do **contravariant publishing** (i.e. a subscription on a message of type object will not receive a message of type “MessageA”) and exceptions in subscriptions are **not taken care of**.

As usual, answering performance related issues isn’t easy. It very much depends on the circumstances, what kind of setup you should take, how much work subscriptions do, how many messages are sent, etc., etc.