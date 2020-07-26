---
title: "Ugly integration test - what can I do better?"
layout: post
tags: [software-development, dotnet, patterns]
date: 2010-08-16 09:08:00
---

This test was driving me somewhat crazy...

```csharp
//TODO: A lot of setup noise here. Will we do similar tests again?!
var threadId = -2;
var threadIdFromTest = -1;
IBus bus = null;

var resetEvent = new ManualResetEvent(false);

var uiThread = new Thread(
    () =>
        {
            SynchronizationContext.SetSynchronizationContext(
                new DispatcherSynchronizationContext(Dispatcher.CurrentDispatcher));
            var frame = new DispatcherFrame();
            threadId = Thread.CurrentThread.ManagedThreadId;
            bus = BusSetup.StartWith<RichClientFrontend>().Construct();
            bus.Subscribe<MessageB>(
                msg =>
                    {
                        threadIdFromTest = Thread.CurrentThread.ManagedThreadId;
                        frame.Continue = false;
                    },
                c => c.DispatchOnUiThread());
            resetEvent.Set();
            Dispatcher.PushFrame(frame);
        });
uiThread.Start();
resetEvent.WaitOne();
bus.Publish(new MessageB());
uiThread.Join();
threadIdFromTest.ShouldBeEqualTo(threadId);
```

I want to test that a certain activity is performed on a designated thread, even if the execution of the activity happens from a different thread. This kind of functionality is needed for frontends in Windows Forms or WPF since modifications to the UI can only happen on the same thread under which all UI activities happen. 

When I tried running the things that are now running in their own thread in the test itself, a deadlock would occur since the call to **Publish** blocks, such that that the test’s thread cannot be used for performing any work, which is attempted in lines 19,20. 

The test works, and it proves that the subscription code runs on the UI thread, but damn, is it ugly!