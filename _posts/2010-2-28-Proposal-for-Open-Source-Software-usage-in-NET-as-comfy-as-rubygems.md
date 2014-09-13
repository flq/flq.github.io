---
title: "Proposal for Open Source Software usage in .NET (as comfy as rubygems)"
layout: post
tags: dotnet TrivadisContent open-source bin4net
date: 2010-02-28 06:00:00
redirect_from: /go/157/
---

Every once in a while I turn on twitter to see if I can finally handle that form of communication (I still can’t). Even so, I saw a tweet from (I think) Jeremy Miller who said something along the lines of the .NET Open-Source (OS) ecosystem missing something like [RubyGems](http://docs.rubygems.org/). There’s a [follow-up](http://codebetter.com/blogs/jeremy.miller/archive/2010/02/25/a-vision-for-fubumvc-s-component-model-gems-nu-engines-slices-oh-my.aspx) on this on his blog. It touches a lot of stuff, I am just going to look a bit at the RubyGems story.

In ruby-land, developers can package their code into _gems_. Apart from containing the code, a gem comprises a specification that further describes what the gem is about, and, quite importantly, specifies the dependencies of said gem. Gem repositories are made available for users to download gems.&nbsp; A ruby-user can install gems into his local ruby installation with a simple CLI. Because of the specification of the gem, the tool will also download any gems that are not yet available on the local installation and which are nonetheless necessary for the gem to run. From there on the user can reference the downloaded component in his own code.

Things aren’t quite as comfy in .NET land. Despite the fact that there are outstanding Open Source projects that in turn enable us to write excellent software for our customers, getting them isn’t cut for all developers out there that could profit from high-quality frameworks and solutions. Often, the only feasible way to get the code is...to get the code. That is, identify where the Open source software project is hosted, get the code (git, svn, what-have-you), get the code built (for which you will need ruby in a couple of projects unless you actually want to enter the VS solution), identifying which dlls are actually the ones you need, and then make available the resulting dlls to your project.

Jeremy mentioned that there is a project named [Nu](http://wiki.github.com/phatboyg/nu/). I looked at the code, since there is no explanation of what the thing is supposed to do, apart from the info that it should recreate the experience of rubygems. So far I didn’t understand much of it.

In other words, let me set up a scene for you on a clean sheet.

### Scene – the action

In order to get this working, OSS maintainers/developers would need to put a teeny bit of effort into it. Otherwise it would just be a maintenance nightmare. They would have to get the latest version of the hypothetical software, let’s call it bin4net. 

Bin4net concentrates on getting you the **binaries** (a distinction ruby does not need to make) and provides you with the following:

1.  A set of **assembly attributes** which you will use to provide meta-information about your Open Source project. A couple of obvious ones don’t even need to be recreated: Assembly Version, description etc. are already available.

    Additional attributes could be Tags to describe your OSS, but, **most importantly**, dependencies to other OSS known to bin4net to enable it to be able to get your Software working out there.

    As maintainers may not want to ‘pollute’ their main assembly with the Mechanism-Attributes it should be possible to put them into their own assembly and ‘forward’ the attributes’ info to the actual assembly.

    It may also be that attributes are not sufficiently expressive due to their numerous limitations. In such a case, a **base class** to inherit from which provides an **internal DSL** that allows to put down the information necessary to satisfy The Mechanism.
 <li>**A tool for the publisher** to make the current version of your project public. It will obtain all its information from the attributes you used in your assembly. The only thing you need to tell the tool is where your zip-file (makes things easier to distribute a single file, I’d think) will be available. What the tool produces is a torrent-file that will be made available to the public.
    Creating the torrent file and associating it with web seeds, which would play the role of initial seeders, is a [solved problem](http://projects.qnetp.net/projects/show/monotorrent) in .NET.

     <div class="alert">_Why a torrent?
_
I’m looking at it as a beefed up URL. Via web seeds you can provide multiple download locations (initial seeders). Older versions of the project may actually be removed from the initial download locations if other peers guarantee to host it. I need to check against the torrent specification (if I ever find one) whether it is actually allowed to put custom key/value information into torrent files, but monotorrent happily allows to write &amp; read them and a client like utorrent ignores them. This would allow to e.g. encode assembly dependencies, tags etc. into the torrent file.
    Finally, if you have the right torrent you will get the correct file. The file hashing already built into the torrent protocol will see to that.

    Even so, neither user nor publisher need really care about this.
</div>
Indeed the only bit of infrastructure that bin4net would need is some place to host the torrent files, which, even with metadata, will not be very big. A torrent tracker is readily available with e.g. [openbittorrent.com](http://openbittorrent.com/).
 <li>**A tool for the consumer** to download Open Source Software registered with bin4net. This would be similar to the gem install bit. It would allow to list the available _Gizmos_ (interim name for OSS made available with The Mechanism) <li>An **add-in into visual studio** to tap into the local bin4net repository. Admittedly, this is the point where I’m doing most of the hand-waving: I don’t know if you can add to the ‘Add reference…’ mechanics of Visual Studio. I have seen a [project on codeplex](http://npanday.codeplex.com/) which may be doing something like that but haven’t yet looked into it. If it is possible, it would actually allow a scenario where we browse bin4net’s repository from within Visual Studio and trigger the download, add the dependency to the project etc. 

Here’s a little picture to summarize what we have so far…

[![nozz1](http://realfiction.net/files/nozz1_thumb.png "nozz1")](http://realfiction.net/files/nozz1_2.png)

The optionality of the VS-Add-in refers to the idea of using the GAC as repository. What is good about it is the direct availability to your project and that there is a solution available for versioning. Bad is the necessity of strong naming, necessary administrative privileges to install and probably a host of other things I don’t know about.

If the GAC wouldn’t be used, bin4net would define its own repository structure which would probably be simply file-based as in rubygems. bin4net could then include some API that you would attach to your AppDomain and which resolves assemblies with its local repository. Such a file-based solution would not need administrative privileges – like the rubygems mechanics it can be a user-based or global thing. You could xcopy a repository to some other machine and deploy your projects without copying all the Open Source dlls.

So far, so good. But the story does not need to end there…the future would hold automatic update to newer versions. An API for the Assembly resolver whether to use newer versions or not. A Build task to “flatten” your dependencies and copy them all into a lib folder, a service to keep you informed whether new versions have been made available from your favourite projects, extension points into bin4net’s workflow like making code callable when your assembly has been placed into a local repository, etc., etc.

### finally – using a cloth to soak some of it up

What I would really like to know is: Does this make sense, or have I gone loony (that is, beyond the usual)? Would open source projects adopt this? How to actually reach those projects, at least the big ones?

For my part, I would be willing to invest time into this and write a good part of the necessary parts. I think that supporting The Mechanism would not be very intrusive to Open Source projects and that it is possible to craft a very nice end-user experience that would at least rival the beauty of rubygems.

Oh, and if you come up with a good name for The Mechanism, its tools and its output, let me know!

#### Addendum – added much later

The proof of concept regarding torrenting and package descriptor [can be found here](https://github.com/flq/bin4net).