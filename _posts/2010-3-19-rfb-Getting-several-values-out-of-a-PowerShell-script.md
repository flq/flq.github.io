---
title: "rfb: Getting several values out of a PowerShell script"
layout: post
tags: dotnet msbuild open-source rfb powershell
date: 2010-03-19 20:37:00
redirect_from: "/go/163"
---

The whole “[MSBuild without XML](/go/160)“ started with the FubuMVC project using ruby for building. It quickly became apparent that one major omission of MSBuild is the lack of ability of adding “ad-hoc” code to it. Which is why MSBuild was [married to PowerShell](/go/162).

In the course of strengthening that marriage, I came across the following piece of code in the [FubuMVC build script](http://github.com/DarthFubuMVC/fubumvc/blob/master/rakefile.rb):
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:9432bbc5-0883-4a5d-8767-e81f13976ba7" class="wlWriterEditableSmartContent"><pre name="code" class="c#">gittag = `git describe --long`.chomp
gitnumberpart = /-(\d+)-/.match(gittag)
gitnumber = gitnumberpart.nil? ? '0' : gitnumberpart[1]
commit = (ENV["BUILD_VCS_NUMBER"].nil? ? `git log -1 --pretty=format:%H` : ENV["BUILD_VCS_NUMBER"])
</pre></div>

of which “gitnumber” and “commit” are used later on.

Now, doing something like the above in PowerShell isn’t that difficult, but I didn’t know at first how to get two values back to MSBuild from a single script, until I remembered the following construct in PowerShell.

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:3c77af92-65c7-48a6-ae97-240d4421af6a" class="wlWriterEditableSmartContent"><pre name="code" class="c#">PS C:\Users\flq&gt; $a = @{A="a";B="b"}
PS C:\Users\flq&gt; $a.A
a
PS C:\Users\flq&gt; $a.B
b
PS C:\Users\flq&gt;</pre></div>

It turns out that PowerShell constructs a Hashtable instance from the first line and then provides some syntax sugar to access the key-value pairs with a dot-notation. Armed with this knowledge I could teach rfb to support the following script: 

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:1da19d0d-13d5-4886-b0c2-0b331cd29c94" class="wlWriterEditableSmartContent"><pre name="code" class="c#">Project "Default"

  Target "Default"
    @gitInfo &lt;= GetGitInfo -Capture:number,commit
    $gitnumber = %(gitInfo.number)
    $commit = %(gitInfo.commit)
    Message "gitnumber $(gitnumber), commit $(commit)"

  PS:GetGitInfo &lt;&lt;END
    cd C:\dotnet\dev\github\rfb
    $gittag = git describe --long
    $gitnumberpart = [System.Text.RegularExpressions.Regex]::Match($gittag, "\.(\d+)").Groups[1].Value
    $commit = if ($env:BUILD_VCS_NUMBER -eq $null) { git log -1 --pretty=format:%H } else { $env:BUILD_VCS_NUMBER }
    Write-Host "$gitnumberpart and $commit"
    @{ number = $gitnumberpart; commit = $commit}
  END   </pre></div>

Some people may see it as a hack to use an item group for getting a single line, however the item group has the notion of metadata which allows for a dot-notation to access several values, which makes it a nice container to retrieve numerous values from a single PowerShell script.

<pre></pre>