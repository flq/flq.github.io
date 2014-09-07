---
title: "Introducing the realfiction builder &ndash; MsBuild without XML"
layout: post
tags: rfb programming msbuild open-source
date: 2010-03-08 05:05:00
redirect_from: "/go/160"
---

I have previously [talked about](/go/144) using rake for building .NET apps. While I do like ruby, I’m not a big fan of the whole idea. It takes time to set up the correct environment, problems no .NET developer is aware of lurk around corners. If you want to learn ruby, that’s fine. But do you want to learn a language just to get some build scripts going?

On the other hand I can understand if you can’t stand XML anymore. I’d go as far as saying that you need to have loved something to truly hate it. Which is why I kicked off **rfb**. The _realfiction builder_ parses a syntax that is much lighter on the eye, but nonetheless gives you access to the MsBuild capabilities (well, currently not all, but it does run the [Rf.Sites build script](http://github.com/flq/Rf.Sites/blob/master/build.rfb)). Follow the link. The syntax is fairly self-explanatory. Nonetheless here a small introduction:
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:1d8948e9-82ba-4f83-b26f-d1c1b548b2d9" class="wlWriterEditableSmartContent"><pre name="code" class="c#">Project "Default"
  UsingTask -TaskName:ATask -AssemblyFile:lib/SomeAssembly.dll
  // This variable controls the forces of evil
  $Foo = Bar Baz
  Target "Default" -Depends:Deps
    // This one a dir will be made of.
    $bar = Bang Bop
    @stuff = $(iisOutDir)\**\*.*
    MakeDir "This_$(bar).plonk"
</pre></div>

This is the same as:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:bdec6781-7f39-44ed-b150-a6107273a5f0" class="wlWriterEditableSmartContent"><pre name="code" class="xml">&lt;?xml version="1.0" encoding="utf-16"?&gt;
&lt;Project DefaultTargets="Default" xmlns="http://schemas.microsoft.com/developer/msbuild/2003"&gt;
  &lt;PropertyGroup&gt;
    &lt;Foo&gt;Bar Baz&lt;/Foo&gt;
  &lt;/PropertyGroup&gt;
  &lt;UsingTask TaskName="ATask" AssemblyFile="lib/SomeAssembly.dll" /&gt;
  &lt;Target Name="Default" DependsOnTargets="Deps"&gt;
    &lt;CreateProperty Value="Bang Bop"&gt;
      &lt;Output TaskParameter="Value" PropertyName="bar" /&gt;
    &lt;/CreateProperty&gt;
    &lt;CreateItem Include="$(iisOutDir)\**\*.*"&gt;
      &lt;Output TaskParameter="Include" ItemName="stuff" /&gt;
    &lt;/CreateItem&gt;
    &lt;MakeDir Directories="This_$(bar).plonk" /&gt;
  &lt;/Target&gt;
&lt;/Project&gt;
</pre></div>

### Let me ask you. Which one is easier to read? Which one is easier to write?

A few words about the syntax:

*   Scoping is done essentially Python-like, by indenting. 
<li>Properties and Item Groups are specified as shown, inside or outside of targets. 
<li>A target/task is usually constructed as a Word followed by options (words preceded by a hyphen ‘-‘). Those options may be on the same line or the following lines. The syntax is _–option:value_. It maps to arguments of e.g. some task. 
<li>There may be a default option, which can be specified by putting it in quotes. The Target’s default option is ‘Name’, while MakeDir’s default option is ‘Directories’. The default options currently supported are found in [this file](http://github.com/flq/rfb/blob/master/rfb/StandardDefaultValueResolver.cs).

A first version to play with is [available here](http://github.com/flq/rfb). The whole thing compiles into an exe of 37 KB (Compare to my roughly 40MB of my current ruby installation). A lot of stuff is still missing, but if there’s interest out there, I’ll keep adding to it.

### Update

The currently supported syntax will be [documented here](http://wiki.github.com/flq/rfb/syntax).
[![Shout it](http://dotnetshoutout.com/image.axd?url=http%3A%2F%2Frealfiction.net%2Fgo%2F160)](http://dotnetshoutout.com/Introducing-the-realfiction-builder-MsBuild-without-XML)