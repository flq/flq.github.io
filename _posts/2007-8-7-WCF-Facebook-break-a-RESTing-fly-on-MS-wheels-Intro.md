---
title: "WCF + Facebook (break a RESTing fly on MS wheels) - Intro"
layout: post
tags: [programming, dotnet, TrivadisContent, WCF]
date: 2007-08-07 20:00:00
redirect_from: /go/96/
---

<div class="messages status">This post is the first of two. While this one is introductory and collects a number of useful links if you want to use WCF to talk to everyday web-based Web APIs like those from del.icio.us, facebook or flickr, the second one (link to come) deals with the specific problem of sending something to a service that is not XML.</div>

A few weeks ago I was invited by a friend of mine to join [Facebook](http://www.facebook.com). Fair enough, I tought, I had been looking for a nice excuse to join the system, since I had heard a number of things regarding the availability of platform functions through an API.

I first looked whether there was already a **C#/.NET wrapper** available in order to talk to Facebook, and found [this one here](http://camelot.homelinux.com/facebook/). While the source code is readily available (a nice touch) I wasn't too happy with what I saw (I am horribly picky when it comes to code, totally opposite to my usual "unfussedness") - for once I don't think one needs to rummage around in XmlDocument formed from the response and handpick the response parameters. Ever heard of deserialization? Anyway, don't get me wrong, I looked a few times into the code later on - it enabled me to compare my own endeavours to working code, which is a real gain.

 Furthermore, I was looking for a good excuse to learn something about **WCF**. There it was. Little did I know then that this would be the beginning of a 10-day tour de force into WCF (and incidentally, the facebook API).

WCF (**Windows Communication Foundation**) is .NET 3.0's way of talking to remote resources. It follows the ABC paradigm that is also expressed in the Web Service Standards (Address, Binding, Contract). [This intro to WCF Endpoints](http://msdn2.microsoft.com/en-us/library/ms733107.aspx) explains what is more or less meant.

Facebook opens up a few of its capabilities through an API. They call it **RESTful** - I call it weird. For once, the whole process of talking to facebook is not fully stateless. You will need to get a session. The way to get a session is fairly involved.

1.  Retrieve a token with a valid API key.
2.  Call a login page for the user using your application, passing along the obtained token and application key.
3.  Call a session creation with the token.
4.  Henceforth you will have to call facebook API methods passing along the obtained session key
5.  Not forgetting the added spice of security measure that an additional parameter must be sent that is all previous parameters hashed with a secret that was given to you in the beginning (and in fact is replaced when you call createSession)
6.  Phew...

Calling facebook is always via HTTP POST, with content type **application/x-www-form-urlencoded**. An exception is the upload picture method that has a content type of **multipart/form-data**. In other words, you're submitting forms when talking to facebook. I have seen prettier things in life. For a full explanation of the facebook API, look here ([Facebook API documentation](http://developers.facebook.com/documentation.php?v=1.0&doc=)). On a sidenote, if you want to see something that I would say is a lot closer to **Re**presentational **S**tate **T**ransfer, check out the [Twitter API documentation](http://groups.google.com/group/twitter-development-talk/web/api-documentation).

Would WCF be able to do something so..._mundane_?

With the keywords REST and WCF I found this link: [Clemens Vasters - How to teach Indigo to do REST/POX](http://staff.newtelligence.net/clemensv/PermaLink,guid,2d61b97b-3a6e-46bd-89db-b1b20499ba18.aspx). Alas, I found it a difficult read, which is why I didn't finish it. A lot of text, a lot of code. You must excuse my current attention span, I am in desperate need of a holiday. Microsoft also had a go on the whole idea: [Microsoft's take on REST and POX in WCF](http://msdn2.microsoft.com/En-US/library/aa395208.aspx). The one link I really read through and digested was the following: [Juan Wajnermann - REST/POX client with WCF](http://weblogs.manas.com.ar/waj/2007/05/13/rest-pox-client-with-wcf/). Here he chooses to talk to [del.icio.us](http://del.icio.us) with WCF, a web site I really adore. Best of all, he provides a solution to download. It worked right from the spot. Not too much code, some commenting, great! The solution therefore exposed to me numerous entry points to the WCF stack.

Also very useful for comprehending WCF are the [WCF samples from MSDN](http://msdn2.microsoft.com/en-us/library/ms751527(VS.90).aspx) for downloading and looking at, covering numerous aspects of WCF stack extension and customization. One of those extension points is using a [Custom Text Encoder](http://msdn2.microsoft.com/en-us/library/ms751486(VS.90).aspx). <strike>Why we need that will be the subject of the next post.</strike> (Damn I haven't written it up still, motivate me!)