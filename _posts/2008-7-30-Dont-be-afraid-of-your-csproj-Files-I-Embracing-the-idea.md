---
title: "Don't be afraid of your csproj-Files (I): Embracing the idea"
layout: post
tags: [programming, msbuild]
date: 2008-07-30 22:05:37
redirect_from: /go/128/
---

# Intro

Blimey, what a shock when [MSBuild](http://msdn.microsoft.com/en-us/library/0k6kkbsd.aspx) became available. [NAnt](http://nant.sourceforge.net/) was alive & kicking, hence the question emerged...WHY?

Either way, different people did different things with it. By the looks of it NAnt is well and being used e.g. by Castle Windsor. Others, like me, have been lured into the MSBuild camp by the simplicity of getting a Visual Studio solution with projects and all to compile and do any sort of funny things with it. You get used to the syntax and at some point you'll know all the pitfalls (nope, that's not me).

This is the first of a few posts that will deal with the fact that a csproj file is nothing else but an MSBuild-Script. Admittedly, you don't have access to all the internals of a Build, but there are a number of points where you can enter and modify the behaviour of your project.

There are indeed voices who will say that anything hidden in some Project file that changes some behaviour before/during/after compilation is weird - I would like to respond that you should make it clear if you do stuff in your csproj file that is not immediately obvious. E.g. place a readme into the project and document your modifications (kinda obvious, really).

Before you look into your csproj file, aquaint yourself with the basic structure of MSBuild scripts, i.e. what's a **PropertyGroup**, **ItemGroup**, **Target**, **Task** and all that XML noise.

# All will be good

Once you feel ready, open your csproj file. There is a Visual Studio add-on (I cannot find the link) that would allow you to open the csproj as XML inside the Visual Studio - however, it is somewhat clumsy. The project will be unloaded, and you will have to manually reload it again. I find it easier to open the csproj file in an editor of your choice. When you do mods and save them, Visual Studio will notice once it gets the focus again and will ask you to reload the project. If you didn't mess anything up your project is renewed with whatever you changed. If you failed, you will get a message box stating where you went wrong. From here on the project is unavailable and will only be resuscitated by right-clicking and reloading it. 

Bottom line: You can't go wrong, especially if there is some source code repository in the background!

# The obvious ones: BeforeBuild, AfterBuild

Have you ever used the Build Events page on the project properties? Isn't that anachronistic? Isn't that ugly?

If you need this you may as well redefine targets readily available for you. In your virgin csproj file towards the end you will find two Targets commented out, "**BeforeBuild**" and "**AfterBuild**".

In here you will be able to put any tasks you may want to perform at those events. If you want a list of all Targets you can readily redefine, open **Microsoft.Common.targets** in the Framework directories under Windows\Microsoft.NET and search for **&lt;Target.*/&gt;** as regular expression. Most of the time the two that you got are sufficient. Quite often people want to copy some files before or after the build. 

Here is an example of defining an AfterBuild command that tags the project's build output for the current configuration and merges it into one assembly via ILMerge to some previously created directory:

`
<Project ...>
  <Import Project="$(MSBuildExtensionsPath)\MSBuildCommunityTasks\MSBuild.Community.Tasks.Targets"/>
  ...
  <Target Name="AfterBuild">
    <CreateItem Include="$(ProjectDir)bin\$(Configuration)\$(TargetFileName)">
      <Output TaskParameter="Include" ItemName="DllOutput" />
    </CreateItem>
    <CreateItem Include="$(ProjectDir)bin\$(Configuration)\*.dll">
      <Output TaskParameter="Include" ItemName="DllOutput" />
    </CreateItem>
    <MakeDir Directories="..\output" />
    <Message Text="Merging @(DllOutput) into ..\output\$(TargetFileName)" />
    <ILMerge InputAssemblies="@(DllOutput)" 
      OutputFile="..\output\$(TargetFileName)"
      DebugInfo="true"
      XmlDocumentation="true" />
  </Target>
  ...
</Project>
`

For this to run you'll need [ILMerge ](http://research.microsoft.com/~mbarnett/ILMerge.aspx)as well as the 
[msbuildtasks](http://msbuildtasks.tigris.org/) from the tigris community.

For now, I hope I have wet your appetite, and hope you'll stay tuned for the next posts.