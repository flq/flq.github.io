---
title: "Visual Studio 2010: Introducing new pitfalls"
layout: post
tags: programming dotnet visual-studio
date: 2010-05-07 22:37:00
redirect_from: "/go/167"
---

A couple of days ago I installed Visual Studio 2010 on my machine. In general it seems to be a fine release, especially when beefed up with Resharper V5 (I very, very much like the new Ctrl + Shift + Alt + A).

However, the new release managed to drive me nuts yesterday when I started a new demo project with the good old Console Project. It so appears that the _Target Framework_ set in the Project properties is by default the new “.Net Framework 4 Client Profile”. 

![image](http://realfiction.net/files/image_3.png "image") 

This is a limited subset which, if you can restrict yourself to the assemblies contained, allows for a smaller redistribution footprint.

However, as outlined in this [msdn document](http://msdn.microsoft.com/en-gb/library/cc656912.aspx) (which also lists the available assemblies), when using this Target, **you cannot reference any other assembly as those contained in the Client profile**. Imagine my not-understanding-the-world-face when I added a reference, let R# do my code-completion and then realize that the compiler complained about a missing assembly reference ! Here, then a warning. If you intend to reference anything that is not contained in the client profile.

The second pitfall in using the Command line profile is the very controversially discussed decision to have a Console App default to x86 processor

&nbsp;![image](http://realfiction.net/files/image_063ac2d2-5e6a-4e49-a5b4-391b8297e427.png "image") 

This setting is not changeable through the Visual studio IDE anymore once you add additional projects to your solution. I learned it the hard way (is there any other way?) when writing Unit Tests in a separate class library project and referencing the console project. The only thing that the R# task runner was able to say was a “BadImageFormatException” which under the circumstances absolutely makes sense since the class library is allowed to run in any processor mode. 

See also [Rick Byers - AnyCPU Exes are usually more trouble than they're worth](http://blogs.msdn.com/rmbyers/archive/2009/06/08/anycpu-exes-are-usually-more-trouble-then-they-re-worth.aspx) (btw, [I know the issues](/go/153), thank you very much) and [New C# Console application targets x86 by default](http://connect.microsoft.com/VisualStudio/feedback/details/455103/new-c-console-application-targets-x86-by-default) (Microsoft Connect)

Personally I don’t get why Microsoft makes such a decision if there quite obviously are a large number of developers who want to **decide for themselves** what processor architecture to target. If you want to change it – bad luck. You can enter the .sln with an editor though an add the line as shown in the following screenshot...

![image](http://realfiction.net/files/image_b4b6799f-0ce4-4b72-b03b-17df7e356909.png "image")