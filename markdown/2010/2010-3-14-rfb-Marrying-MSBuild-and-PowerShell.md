---
title: "rfb: Marrying MSBuild and PowerShell"
layout: post
tags: [dotnet, msbuild, tools, own-software]
date: 2010-03-14 02:44:00
redirect_from: /go/162/
---

I have previously written about [rfb, MsBuild without XML](/go/160). It took me longer than expected to support this script, but it’s available in the current source now:
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:ceb951f9-aff1-4dc4-8e62-9fd02f3f14b4" class="wlWriterEditableSmartContent"><pre name="code" class="c#">Project "Default"

  Target "Default"
    @files &lt;= smallPNGs -Capture:FullName, Extension
    Message "%(files.Identity) and extension %(files.Extension)"

  PS:smallPNGs &lt;&lt;END
    echo "Returning small pngs"
    cd C:\users\xyz\Documents
    Get-ChildItem -Recurse | 
    Where-Object { $_.Extension -eq ".png" -and $_.Length -lt 7000 } | 
    select FullName, Extension
  END
</pre></div>

The syntax used is described in more detail in the [new syntax section](http://wiki.github.com/flq/rfb/syntax-powershell-integration) on the rfb source site wiki. 

What happens is that this is the first of a couple of use cases surrounding a seamless integration of PowerShell with MSBuild. So far, you can define PowerShell.scripts, use them to fill item groups, and use those item groups in MSBuild tasks. <del>When the integration is feature complete you will be able to</del>The integration allows you to

*   Capture a single output value of PowerShell directly into a property 
<li>Run a PowerShell script without expecting any output 
<li>Write the PowerShell scripts inline in your targets as if they were MsBuild tasks 
<li>Pass parameters into your script 
<li>Have the PowerShell scripts log into the same Console that rfb is running in.[![Shout it](http://dotnetshoutout.com/image.axd?url=http%3A%2F%2Frealfiction.net%2Fgo%2F162)](http://dotnetshoutout.com/realfiction-rfb-Marrying-MSBuild-and-PowerShell)