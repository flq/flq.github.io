---
title: "Ugly integration test&hellip;what can I do better?"
layout: post
tags: [programming, dotnet, patterns]
date: 2010-08-16 09:08:00
redirect_from: /go/174/
---

This test was driving me somewhat crazy...
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:7dac1a5d-86fa-4216-8163-f664191f1544" class="wlWriterEditableSmartContent"><pre name="code" class="c#">//TODO: A lot of setup noise here. Will we do similar tests again?!
var threadId = -2;
var threadIdFromTest = -1;
IBus bus = null;

var resetEvent = new ManualResetEvent(false);

var uiThread = new Thread(
    () =&gt;
        {
            SynchronizationContext.SetSynchronizationContext(
                new DispatcherSynchronizationContext(Dispatcher.CurrentDispatcher));
            var frame = new DispatcherFrame();
            threadId = Thread.CurrentThread.ManagedThreadId;
            bus = BusSetup.StartWith&lt;RichClientFrontend&gt;().Construct();
            bus.Subscribe&lt;MessageB&gt;(
                msg =&gt;
                    {
                        threadIdFromTest = Thread.CurrentThread.ManagedThreadId;
                        frame.Continue = false;
                    },
                c =&gt; c.DispatchOnUiThread());
            resetEvent.Set();
            Dispatcher.PushFrame(frame);
        });
uiThread.Start();
resetEvent.WaitOne();
bus.Publish(new MessageB());
uiThread.Join();
threadIdFromTest.ShouldBeEqualTo(threadId);</pre></div>

I want to test that a certain activity is performed on a designated thread, even if the execution of the activity happens from a different thread. This kind of functionality is needed for frontends in Windows Forms or WPF since modifications to the UI can only happen on the same thread under which all UI activities happen. 

When I tried running the things that are now running in their own thread in the test itself, a deadlock would occur since the call to **Publish** blocks, such that that the test’s thread cannot be used for performing any work, which is attempted in lines 19,20. 

The test works, and it proves that the subscription code runs on the UI thread, but damn, is it ugly!