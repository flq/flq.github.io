---
title: "Do you think your Windows.Forms Application has no memory leaks?"
layout: post
tags: [software-development, dotnet, windows, csharp]
date: 2010-05-26 03:10:00
redirect_from: /go/169/
---

If your answer is yes, please read on, because, _once_, I thought so, too.

Let me first clarify what I mean by leaks in a .NET application. Under this definition you may have a leak when an instance persists in memory even though you expect it to be collected by the Garbage collector. A typical usage of your App on your local desktop may not expose any issues since local memory can be quite sufficient and some problems may only occur because of certain usage patterns. In other environments like e.g., a [Citrix Desktop](http://www.citrix.com/lang/English/home.asp), where the app runs in a much more constrained environment, problems may become apparent far quicker. 

In a windows forms application memory pressure is even higher, because Windows Forms, as it turns out, is a thin layer of .NET on top of a multi-decade old technology, [GDI](http://en.wikipedia.org/wiki/Graphics_Device_Interface). The great [Process Explorer](http://technet.microsoft.com/en-us/sysinternals/bb896653.aspx) allows you to look at the GDI Objects consumed by any process by turning on the respective column:

&nbsp;![gdiObjects](/assets/gdiObjects_6ffad6a0-8d1a-496a-93b8-ddf5f53cc21a.png "gdiObjects") 

The resource of GDI objects is quite limited, as it may not surpass a number defined in the registry as **GDIProcessHandleQuota**. The default is 10’000. You may increase that number, but as you can see you may run out of GDI Object handles long before your memory is exhausted.

![handleQuota](/assets/handleQuota_5cab2b59-cbb5-4178-8868-0c5082df4bd0.png "handleQuota") 

How can this be? .NET has a Garbage Collector (GC), or has it? Indeed, none of the issues arise because the GC is broken. It is not. The biggest source of loosing objects is by **attaching event handlers to events of objects that live longer than the instances to which the event handlers belong**. Add to this the failure to **correctly Dispose of Objects in the System.Windows.Forms namespace**. Let’s check out some real life examples.

The single most useful tool to approach possible issues with memory is a memory profiler. There are several on the market but since I am a sucker for Jetbrains products my choice fell on the [dotTrace](http://www.jetbrains.com/profiler/features/index.html) product.

### 1. Bad Icon, bad

The most hefty GDI object leak was related to…icons. The following code is _reeally baad_:

 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:c99699f5-203e-48c1-908c-6d82e68ce008" class="wlWriterEditableSmartContent"><pre name="code" class="c#">changeProvider.Icon = 
  Icon.FromHandle(Resources.data_edit.GetHicon());</pre></div>

I really don’t know enough about this sort of resource creation but after some strange behaviour regarding errors, the code was modified to the following (as outlined in the [documentation to GetHicon()](http://msdn.microsoft.com/en-us/library/system.drawing.bitmap.gethicon.aspx)):

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:0c5123fc-0219-494f-b88a-02105d69d70b" class="wlWriterEditableSmartContent"><pre name="code" class="c#">[System.Runtime.InteropServices.DllImport("user32")]
public static extern bool DestroyIcon(IntPtr hIcon);
...
public static Icon RetrieveEditIcon()
{
  var hIcon = Resources.data_edit.GetHicon();
  var temp = Icon.FromHandle(hIcon);
  var ico = (Icon)temp.Clone();
  temp.Dispose();
  DestroyIcon(hIcon);
  return ico;
}</pre></div>

### 2. The GC-Alloc’d Timer

You may or may not have the same opinion about Windows.Forms Binding but in my eyes it is an absolute beast. We are using a concept of Control connectors that abstract the behaviour of controls for our system. In there a timer is used that gets its say after a short period of the user typing in stuff in a textbox. That way we get a binding that is more logical to the user than the Focus Lost behaviour and is less intrusive than the SourceChanged Binding. To my dismay, something weird was happening to the TimerCallback, the Event handler delegate that represents a callback from the timer:

![timerLeak](/assets/timerLeak_6e94ad39-e5bd-4722-8a31-7ec4b782389c.png "timerLeak") 

A Garbage Collector Handle was keeping my Timer callback to go away. Since it was connected to a connector which in turn exposes events to other parts of some application module, all kind of objects are now stuck in memory, objects that due to their affinity to Windows Forms may also leak GDI objects.

Such handles can be constructed with the [GCHandle](http://msdn.microsoft.com/en-us/library/system.runtime.interopservices.gchandle_members(v=VS.100).aspx) struct. they allow you to pin objects to memory, avoiding that they be reclaimed by the Garbage Collector. I haven’t quite understood the behaviour to date, as the documentation of the [Timer](http://msdn.microsoft.com/en-us/library/system.threading.timer.aspx) says nothing about such behaviour. On the contrary, it puts the responsibility to the Timer’s user to ensure that a timer does not go out of scope.

The basic solution is to ensure explicit disposal of a timer, in our case by listening to the connected control’s Disposed-event. Alas, in some circumstances it appears that the Control’s Dispose was not called, leaving us still with objects dangling off the timer. The final end to this problem was to make the connection between Timer and event handler _weaker_.

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:1847e869-180d-472a-af31-81db5edffbe2" class="wlWriterEditableSmartContent"><pre name="code" class="c#">private readonly Timer changeDelayTimer;
...
changeDelayTimer = new Timer(onChangeDelayCallback, new WeakReference(this), ...);
...
private static void onChangeDelayCallback(object state)
{
  var wr = (WeakReference) state;
  if (wr.IsAlive)
   ((TextBoxConnector)wr.Target).HandleTimerSignal();
}</pre></div>

The timer now references a static handler, and just to be sure, the actual object is only accessible through a WeakReference object. Such a thing allows a targetted object to be collected by the GC. There may still be a minor headache in case that the GC collects the object between the if-statement and the access in the next line, but at least we got rid of the object trees dangling off the timer.

### 3. The 3rd party static event

Imagine you use some component and suddenly you realize that said component attaches to a static event handler, i.e. a part of the system that remains alive until the end of the AppDomain. This is what happens to you when you do not explicitly dispose certain components from [Infragistics](http://www.infragistics.com/):

![gridLeak](/assets/gridLeak_534c2e57-c6a5-447c-8714-6245a2af9029.png "gridLeak")

Infragistics was already made aware of this kind of behaviour quite some time ago as shown in this [discussion thread](http://forums.infragistics.com/forums/t/20841.aspx). As they say that this behaviour is by design and just make sure that all Controls get properly disposed, things remained like that up to the version that we are utilizing for the project. The solution to that one is either dispose of all controls, or use the somewhat dirty but effective move to empty the invocation list of the relevant static events. This is indeed possible through reflection and funny enough the required code had already been written and [is available on the Internet](http://subjectively.blogspot.com/2009/03/importance-of-recycling-memory.html). Since we don’t use any of the theme changing capabilities of Ig controls, this code is called at an appropriate moment and it ensures that no component leak happens through that chain anymore.

### 4. Undisposed Tooltips

Funny enough in the first snapshots I didn’t find much trace of undisposed tooltips but this was the case now in the latest snapshots that I was doing with dotTrace. One would think that issues as can be found with the [proper google search](http://www.google.de/search?ie=UTF-8&amp;q=windows+forms+tooltip+gdi+object+leak) are not relevant anymore, but there you go…Tooltips really aren’t that heavy objects, but their missing removal was a direct leak of GDI objects as I could notice upon ensuring proper disposal of them. Since we are using tooltips on a certain kind of label, the correct move was to move the tooltip creation into a class inheriting from label and using the base Control’s disposing event.

&nbsp;

I hope that if you still answer the title question with yes, it is based on a couple of memory profiling sessions and the awareness of the ways .NET and GDI object leaks may come into live.