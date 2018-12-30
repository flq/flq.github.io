---
title: "fixie and resharper, smooth sailing on the Agenda."
layout: post
tags: [software-development]
date: 2014-02-22 20:56:26
redirect_from: /go/242/
---

I was willing to have a play with [fixie](https://github.com/plioi/fixie), a new test runner, but was unimpressed by the situation of how to get fixie tests run in resharper. Yesterday, I tried the internet again:
![search on fixie](http://i.imgur.com/B2QG8OH.png)

Right, a [fixie runner](https://github.com/JohnStov/ReSharperFixieRunner)!

The readme shows a short and concise way to bring the plugin into resharper by adding a new nuget feed to the resharper extension sources (*Resharper -> Options & Extension Manager...*). Once you want to install that extension, make sure you **read the readme** (which I didn't, so I missed that the extension is a pre-release package and you have to make sure that you see it).

![options](http://i.imgur.com/xirBRSA.png) ![extension manager](http://i.imgur.com/aj47Mi2.png)

Fixie is then available as a Nuget package, too, which you install into your test project. You will also need an assertion library, I took [Shouldly](http://shouldly.github.io/) (*which btw plays it neat in the message output, don't understand how it does it yet*).

At first I didn't see any tests appearing in the Resharper's Unit Test explorer, this was remedied by right-clicking the project file and saying "*Run Unit Tests*" - lo and behold, fixie tests were running happily and I haven't looked back since on this project.

Your own testing conventions also get honored by the test runner. Here, it is sufficient to put a class into your test project that derives from **Convention** (or, indeed **DefaultConvention**). I used that to have a convention on how to feed input parameters to a test method...

	public void Distance_Correctly_Calculated(Note note1, Note note2, int distance)
	{
	    (note1 - note2).ShouldBe(distance);
	}
	
	public static IEnumerable<object[]> Note1Note2DistanceSource()
	{
	    Func<Note,Note,int,object[]> f = (note, note1, arg3) => new object[] { note, note1, arg3 };
	    yield return f(new Note("C"), new Note("D"), 1);
	    yield return f(new Note("C"), new Note("H"), 6);
	}

This also gets correctly executed with the kind of output you'd expect...

![test runner display](http://i.imgur.com/vxW3W4s.png)

Consider me a happy camper!