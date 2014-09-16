---
title: "Suggestions to improve your WPF ViewModels"
layout: post
tags: [programming, dotnet, TrivadisContent, WPF]
date: 2011-01-31 13:00:00
redirect_from: /go/196/
---

Throughout the years where I have been working on WPF projects, I have seen a fair share of classes used as ViewModels (VM) that have been lacking in revealing their intended and proper usage, such that their resistance to maintenance is increased. I think that the following suggestions help to make ViewModels that still work well and are more explicit about their functionality.

### Don’t slap setters on everything / Use the Binding Mode

Many properties of VM will only get read from WPF and will not be written to neither from WPF nor from your own code external to the VM. One obvious example is something like this:
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:8a0f8859-4ec5-4bd6-9656-e7f3960c4200" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public ObservableCollection&lt;string&gt; Names {
  get { ... }
  set { ... /*Maybe even OnPropertyChanged?*/ }
}</pre></div>

Will you really set a new ObservableCollection to your ViewModel? What is WPF supposed to make out of that?

If your intent is that a collection is exposed, which cannot be exchanged from the outside, use the **Mode** property when defining the **Binding** in WPF:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:14ec1ba9-b40e-4bd6-9437-077da2ec9117" class="wlWriterEditableSmartContent"><pre name="code" class="xml">&lt;ItemsControl ItemsSource="{Binding Names, Mode=OneWay}" /&gt;</pre></div>

**OneWay** states that changes can only flow from the source to the representation (i.e. WPF). Hence, a setter is not required and WPF honours that! In my experience there are many properties which are controlled purely from inside the VM, e.g. booleans regarding visibility of items, etc. Bind to these with OneWay and those properties can be read-only.

While not as useful as OneWay, the other modes can also communicate intent to fellow developers.

*   OneTime – The Property will be read once and cannot be updated anymore.
*   OneWayToSource – Changes only flow from UI to VM. While you still need get/set, Notifying of Property Changed doesn’t make any sense on such a property.
*   TwoWay – The default which does not have to be set explicitly

### BooleanToVisibility conversion? Don’t write it for the 13th time

Out of sheer curiosity I went to the object browser and did a “find derived types” with Resharper on the IValueConverter:

![image](/public/assets/image_17963921-3cc2-4611-8fdd-46b5a341ae61.png "image") 

I don’t know about you but I have written a **BooleanToVisibilityConverter** very often! This one is a bit like the System.IO.Path type.

### Your VM properties need only expose what you need for your coding

A small example: Imagine that for your coding, the list of names exposed above only ever gets enumerated, but the contents of the collection is controlled by the VM. In this case, expose the collection as...

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:9c81c03f-7fe2-4ac4-b943-a7ed35931237" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public IEnumerable&lt;string&gt; Names { 
  get { ... }
}</pre></div>

Regarding the WPF capabilities with regard to interacting with **INotifyPropertyChanged** and **INotifyCollectionChanged**, these interfaces will be discovered regardless of the actual property type you expose in your VM. 

By the way, if you still want Notify and Collection capabilities you can use the ReadOnlyObservableCollection which you can use as such:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:717d8241-da4a-4ca3-b1e6-576669b4efc1" class="wlWriterEditableSmartContent"><pre name="code" class="c#">private ObservableCollection&lt;string&gt; col = new ObservableCollection&lt;string&gt;();

public ReadOnlyObservableCollection&lt;string&gt; Names { get; private set; }

public ctor()
{
  Names = new ReadOnlyObservableCollection&lt;string&gt;(col);
 }</pre></div>

Changed events are still exposed, but Names cannot be used to add new elements from outside the VM. This is hardly a hassle, and it means that you as a developer has much tighter control on e.g. who adds items to your collections. Try to “Find All References…“ on who adds to a collection of a VM when the default way is to use **VM.Collection.Add(…)**

&nbsp;

These suggestions do not change the VMs functionality but they reduce the VMs surface, which in my book isn’t a bad thing.