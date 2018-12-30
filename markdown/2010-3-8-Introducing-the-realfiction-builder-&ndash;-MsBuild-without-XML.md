---
title: "Introducing the realfiction builder...MsBuild without XML"
layout: post
tags: [own-software, software-development, msbuild]
date: 2010-03-08 05:05:00
redirect_from: /go/160/
---

I have previously [talked about](/go/144) using rake for building .NET apps. While I do like ruby, I’m not a big fan of the whole idea. It takes time to set up the correct environment, problems no .NET developer is aware of lurk around corners. If you want to learn ruby, that’s fine. But do you want to learn a language just to get some build scripts going?

On the other hand I can understand if you can’t stand XML anymore. I’d go as far as saying that you need to have loved something to truly hate it. Which is why I kicked off **rfb**. The _realfiction builder_ parses a syntax that is much lighter on the eye, but nonetheless gives you access to the MsBuild capabilities (well, currently not all, but it does run the [Rf.Sites build script](http://github.com/flq/Rf.Sites/blob/master/build.rfb)). Follow the link. The syntax is fairly self-explanatory. Nonetheless here a small introduction:

```powershell
Project "Default"
  UsingTask -TaskName:ATask -AssemblyFile:lib/SomeAssembly.dll
  // This variable controls the forces of evil
  $Foo = Bar Baz
  Target "Default" -Depends:Deps
    // This one a dir will be made of.
    $bar = Bang Bop
    @stuff = $(iisOutDir)\**\*.*
    MakeDir "This_$(bar).plonk"
```

This is the same as:

```xml
<?xml version="1.0" encoding="utf-16"?>
<Project DefaultTargets="Default" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <PropertyGroup>
    <Foo>Bar Baz</Foo>
  </PropertyGroup>
  <UsingTask TaskName="ATask" AssemblyFile="lib/SomeAssembly.dll" />
  <Target Name="Default" DependsOnTargets="Deps">
    <CreateProperty Value="Bang Bop">
      <Output TaskParameter="Value" PropertyName="bar" />
    </CreateProperty>
    <CreateItem Include="$(iisOutDir)\**\*.*">
      <Output TaskParameter="Include" ItemName="stuff" />
    </CreateItem>
    <MakeDir Directories="This_$(bar).plonk" />
  </Target>
</Project>
```

#### Let me ask you. Which one is easier to read? Which one is easier to write?

A few words about the syntax:

*   Scoping is done essentially Python-like, by indenting. 
* Properties and Item Groups are specified as shown, inside or outside of targets. 
* A target/task is usually constructed as a Word followed by options (words preceded by a hyphen ‘-‘). Those options may be on the same line or the following lines. The syntax is _–option:value_. It maps to arguments of e.g. some task. 
* There may be a default option, which can be specified by putting it in quotes. The Target’s default option is ‘Name’, while MakeDir’s default option is ‘Directories’. The default options currently supported are found in [this file](http://github.com/flq/rfb/blob/master/rfb/StandardDefaultValueResolver.cs).

A first version to play with is [available here](http://github.com/flq/rfb). The whole thing compiles into an exe of 37 KB (Compare to my roughly 40MB of my current ruby installation). A lot of stuff is still missing, but if there’s interest out there, I’ll keep adding to it.

### Update

The currently supported syntax will be [documented here](http://wiki.github.com/flq/rfb/syntax).