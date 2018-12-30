---
title: "MemBus + Caliburn.Micro = Lean Screen"
layout: post
tags: [software-development, dotnet, membus, libs-and-frameworks]
date: 2010-10-01 21:54:00
redirect_from: /go/184/
---

To be honest, without [this blog post](http://www.rudigrobler.net/Blog/screen-conductor-101) on [Caliburn.Micro](http://caliburnmicro.codeplex.com/) I was kind of stuck. But now I ended up with my Screen conductor, and it’s likely that it is not going to change a lot:
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:5c9b4a60-78d4-4fc8-97b3-89ac13b6ea27" class="wlWriterEditableSmartContent"><pre name="code" class="c#">[Single]
public class ShellViewModel : Conductor&lt;Screen&gt;
{
    private readonly IDisposable screenStreamDispose;

    public ShellViewModel(IObservable&lt;RequestToActivateScreen&gt; screenStream)
    {
        screenStreamDispose = screenStream
            .SubscribeOnDispatcher()
            .Where(msg=&gt;msg.ScreenAvailable)
            .Subscribe(onNextScreenRequest);
    }

    private void onNextScreenRequest(RequestToActivateScreen request)
    {
        ActivateItem(request.Screen);
    }

    protected override void OnDeactivate(bool close)
    {
        screenStreamDispose.Dispose();
        base.OnDeactivate(close);
    }
}</pre></div>

The Observable is constructed based on **MemBus**. The screenStream is shaped with the aid of the reactive framework while “**ActivateItem**” loads the corresponding view for the given Screen. Overriding **OnDeactivate** gives a nice place to dispose of a subscription. The whole code is to be found in the [MemBus “Hello World” App](http://github.com/flq/MemBus/tree/master//Membus.WpfTwitterClient/).