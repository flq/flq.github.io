---
title: "Realfiction Goodies - .NET Stuff you may like to use"
layout: post
tags: [programming, download, dotnet]
date: 2006-07-02 12:01:08
redirect_from: /go/38/
---

**Last update**: 14.08.2006, **Version** 1.4 

When you have been programming for a while it so happens that there is code you reuse, because it&#39;s common, or good, or for whatever reason. This mostly stays at the level of doing some cut and paste. I finally decided to pack a few common things into a couple of libraries which I can reuse within other projects. The result are the **RF.Goodies dlls for .NET 2.0, written in C#**. 

I have put them here so I always have the latest version available. It also means that you can use them, too. What you get is this:

## Rf.Common.dll + doc.xml

**FixedSizeStack** - Provides a generic stack which you can initialise with a fixed size. This means that as soon as the stack reaches its maximum size, it will start to lose the oldest elements stored in the stack. 

**UndoStack **- quite similar to the fixed size stack, it is geared towards using it as undo stack. It provides events that fire either when the stack has gone empty, or has obtained its first element, or when an item is popped. 

**IRange and friends** - The start of an infrastructure to have a range object available. So far there is a concrete implementation, the Alphabetrange. It allows you to iterate over the standard alphabet, forwards and backwards. You can reset the range boundaries to any of the elements that the range knows to be valid. It supports usage of delegates to perform actions for each of the range elements. It can convert the represented range to an array and it can be used cursor style with Current, Next and Previous properties and methods.

**Augmentor - **This class has a single static method so far. It takes in two objects, A and B. It will then reflect on all private fields of A and will then look for a public method in B to which an attribute is added that marks the method as appliance for the same type as the one of the field found in A. The Augmentor then calls said method with the input parameter being the field identified in A. A very simple reflection pattern which may save you a lot of silly repeating lines where e.g. X methods initialize Y fields.

## RF.UI.dll + doc.xml

**LogBox** - The LogBox is a control that was born to have a simple way of visualizing what&#39;s going on in those test applications you write to figure out something. When the control initializes, it attaches a special Trace listener that will output trace input right into the Textbox of the LogBox control. The package has been designed to be less of a performance burden by decoupling the tracing from the output into the textbox. Drag the control into your Windows forms app, and start writing to the trace, and all will become pretty clear. Apart from logging strings the LogBox suports decent output of 

*   Exceptions and their inner ones in general and in particular
*   WebException (The server&#39;s response if there is any)
*   DllNotFoundException (which type exactly went MIA)
*   XmlException (line number and position, although it&#39;s usually also in the message of that exception).
*   HttpWebResponse: The Trace will log the response contained wihtout further ado (Trace.Write(request.GetResponse())
*   XmlDocument: Trace.Write(xmldoc) will get you the document as string, of course nicely formatted and properly indented.

The whole thing is rounded up by the control&#39;s ability to purge the visible log as well as save the current contents to a folder of your choice.

**PathStrip** - Seen any screenshots of Vista? There appears to be a new way of accessing and manipulating the full path of a file system folder currently in view. The path is separated into its constituent parts. Each part is clickable, allowing you to quickly move up the folder hierarchy again. Each clickable item also provides a dropdown list that shows all folders that are on the same level. 
<div style="text-align: center">![The PathStrip comonent in action](/assets/pathstrip.gif)</div>

Well, that is pretty much what I implemented in this component. It inherits straight from the ToolStrip, so you could mess around with it. For the sake of this component, however, you will be interested in the **Path **property to get and set the path that is currently visible, as well as the **PathChanged **event, which will allow you to be notified whenever a new path has been chosen by the user with the PathStrip component. 

## RF.NAnt.dll + doc.xml

**RenameTask** - This is the only task so far, but I find it a useful one, especially in the light of not finding any similar task in the core of NAnt. This task takes in a fileset, or dirset, or both and will rename the files and directories in question according to the attributes provided. The_ find-/replacestring_ and _match-/replaceregex_ attributes of the task allow you to rename the files via simple string replacement or by use of regular expressions, respectively.

## RF.KeyboardEvents.dll + doc.xml

**KeyboardEvents **- A cool base class that will attach itself as message filter upon construction. You can derive from it as seen in the **StandardFileOps **class. Using this class you can very simply attach events to certain keystrokes. You can write an event and with a provided attribute you specify that it should fire when e.g. Ctrl + F is pressed.
 