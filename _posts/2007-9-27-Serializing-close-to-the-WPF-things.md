---
title: "Serializing close to the WPF things"
layout: post
tags: [dotnet, libs-and-frameworks]
date: 2007-09-27 20:57:06
redirect_from: /go/103/
---

I should probably write about the facebook WCF wrapper [as promised](http://realfiction.net/go/130), but since I am have been working my a... off on the frontend of things with the aid of WPF, I will write something about that instead.

There is plenty of stuff to write but in this post I reflect upon an idea I had a few days ago. The whole thing is certainly inspired by Dan Crevier's fantastic job on outlining how a [decent WPF application architecture may look like](http://blogs.msdn.com/dancre/archive/2006/09/17/dm-v-vm-part-8-view-models.aspx) with the added bonus of a nicely laid out and documented WPF solution to download. Very helpful indeed!

In his work, Dan explores how to use attached properties to enhance the functionality of XAML-Tree members. In his example he essentially does expensive web requests for data only when the items actually become visible to the user. That way my facebook client can also do expensive calls to the Facebook API only when necessary.

Back to the idea. In my client you will have the ability to create Image Buckets which you can enrich with some metadata (like to what Web service you want to upload it, with what titles or tags or whatever - currently only facebook is supported :) - Since the user may want to stop in his actions and return later, I wanted to give the application the ability to persist state. The concept I pursued was to have an attached property that, when applied to an ItemsControl (like e.g. a ListBox) would persist the contents of the ItemsSource without much further ado. A reusable concept seemed appropriate since the ItemsSource will in a WPF application most likely point to actual Business Objects.

The actual attached property is constructed analogously to Dan's Model activation property:

```csharp
  /// <summary>
  /// Attached property that can be used on Itemscontrol elements to persist its ItemsSource
  /// </summary>
  public static class PersistControl {

    static List<ItemsControlPersistenceHandler> persistenceHandler = 
      new List<ItemsControlPersistenceHandler>();

    public static readonly DependencyProperty PersistProperty = 
      DependencyProperty.RegisterAttached(
        "Persist", typeof(string), typeof(PersistControl),
        new PropertyMetadata(new PropertyChangedCallback(OnNameGiven)));

    public static string GetPersist(DependencyObject sender) {
      return (string)sender.GetValue(PersistProperty);
    }

    public static void SetPersist(DependencyObject sender, string value) {
      sender.SetValue(PersistProperty, value);
    }

    private static void OnNameGiven(DependencyObject dependencyObject, 
      DependencyPropertyChangedEventArgs e) {
      ItemsControl element = dependencyObject as ItemsControl;
      if (element == null) return;      
      if (e.OldValue == null && e.NewValue != null)
        persistenceHandler.Add(
          new ItemsControlPersistenceHandler((string)e.NewValue, element));
    }
  }
```

What happens is that when the property is used on a DependencyObject, an associated callback instantiates an object of type **ItemsControlPersistenceHandler** which we will get to know later. The value provided is simply a string that is used as a key for serialization/deserialization of any objects encountered in the ItemsSource of the DependencyObject (here an ItemsControl). This is how you then use it in XAML:

    <ListBox x:Name="ListOfBuckets" ... local:PersistControl.Persist="buckets"> ...

* Serialization: Ignore events
* Observablecollection: shadow copy
* unloaded: not raised when window closes?!