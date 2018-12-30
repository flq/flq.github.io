---
title: "Creating and then using a local OpenWrap repository"
layout: post
tags: [software-development, libs-and-frameworks]
date: 2011-01-03 22:57:00
redirect_from: /go/195/
---

When I looked at this blog post here about [setting up a NuGet local repository](http://gregorsuttie.wordpress.com/2011/01/03/using-a-nuget-local-repository/) I couldn’t help but write up the necessary steps to get a local repository with OpenWrap:

#### I’m not sure so let’s ask OpenWrap
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:3c5d2646-cdea-43cf-ac5f-1db05b96e501" class="wlWriterEditableSmartContent"><pre name="code" class="c">PS C:\dotnet\dev\github&gt; o get-help add-remote
COMMAND
        add-remote
DESCRIPTION
        Adds a remote repository.

USAGE
        add-remote [-Name] &lt;String&gt; [-Href] &lt;Uri&gt;

PARAMETERS
        -Name &lt;String&gt;
                Specifies the name used to identify this remote repository.
        -Href &lt;Uri&gt;
                Specifies the URI used to access this remote.
 - file://[servername]/path/ for local or UNC paths
 - http://[servername] for OpenWrap repositories
 - nupack://[servername]/path for NuPack repositories</pre></div>

Ah, ok.

#### o add-remote –name local –href file:///C:/dotnet/openwrap

Now we have a local repository. 

You can use it by e.g. adding packages:

#### o publish-wrap fancyproject –remote local

When I ask my local repository what it contains it gives me...

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:f0ae588e-1b1e-488b-b27d-982e78acefe9" class="wlWriterEditableSmartContent"><pre name="code" class="c">PS C:\dotnet\dev\github&gt; o list-wrap -remote local
 - MemBus (available: 1.0.0.22806675, 1.0.1.23707739)
 - Twitterizer (available: 2.3.1.23744031)
 - structuremap (available: 2.6.2.0)
 - caliburnmicro (available: 1.0.0.47921975)</pre></div>

Unlike the mentioned post, steps of how to create a package isn’t shown here, this may be a subject for another post.