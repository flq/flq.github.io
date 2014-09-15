---
title: "Fashion of the week - Building with Rake"
layout: post
tags: [programming, ruby, dotnet, TrivadisContent, DLR]
date: 2009-06-01 14:01:23
redirect_from: /go/144/
---

Here & There I have been seeing people using Ruby's build system [rake](http://rake.rubyforge.org/) in their .NET open source projects instead of NAnt or MSBuild. 

I don't really feel like commenting this fact here, but it is slightly annoying that people expect us to know ruby and do not write a single line about the fact that their build system actually requires an environment that has nothing to do with .NET.

Thankfully the last part is not quite true anymore. The Dynamic Language Runtime (DLR) is slowly coming into mainstream with the first [.NET 4.0 beta](http://www.microsoft.com/downloads/details.aspx?FamilyID=ee2118cc-51cd-46ad-ab17-af6fff7538c9&displaylang=en) made available.

IronRuby is being developed to run on the DLR and there is already work to make it run [with the 4.0 Beta](http://ironruby.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=27606).

Unfortunately, important dependencies are not part of this release such that my attempt to get rake running didn't work out.

I tried it with the current [IronRuby](http://www.ironruby.net/) release. I suppose it doesn't make any use of the Beta 1 things of the 4.0 framework, but you can get the idea...
Ironruby makes rake available in the form of _irake_, and gem (the installer of libraries in ruby) as _igem_. In retrospect I am uncertain if I needed it, but I performed an igem install rake in order to call irake on the system.

I tried the setup on Jeremy Miller's [storyteller](http://storyteller.tigris.org/) project, which contains a rake file for building. Once I removed a dependency in _BuildUtils.rb_ to the module FileTest (which seems to exist in the ruby 1.9 core library, however I cannot really pinpoint it) the rake file walked through without issues. 

Armed with this setup you should be able to fend the latest fashion in .NET solution building!