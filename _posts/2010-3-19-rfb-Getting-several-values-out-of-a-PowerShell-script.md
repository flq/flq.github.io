---
title: "rfb: Getting several values out of a PowerShell script"
layout: post
tags: [dotnet, msbuild, own-software, tools]
date: 2010-03-19 20:37:00
redirect_from: /go/163/
---

The whole “[MSBuild without XML](/go/160)“ started with the FubuMVC project using ruby for building. It quickly became apparent that one major omission of MSBuild is the lack of ability of adding “ad-hoc” code to it. Which is why MSBuild was [married to PowerShell](/go/162).

    gittag = `git describe --long`.chomp
    gitnumberpart = /-(\d+)-/.match(gittag)
    gitnumber = gitnumberpart.nil? ? '0' : gitnumberpart[1]
    commit = (ENV["BUILD_VCS_NUMBER"].nil? ? `git log -1 --pretty=format:%H` : ENV["BUILD_VCS_NUMBER"])

of which “gitnumber” and “commit” are used later on.

Now, doing something like the above in PowerShell isn’t that difficult, but I didn’t know at first how to get two values back to MSBuild from a single script, until I remembered the following construct in PowerShell.

    PS C:\Users\flq> $a = @{A="a";B="b"}
    PS C:\Users\flq> $a.A
    a
    PS C:\Users\flq> $a.B
    b
    PS C:\Users\flq>

It turns out that PowerShell constructs a Hashtable instance from the first line and then provides some syntax sugar to access the key-value pairs with a dot-notation. Armed with this knowledge I could teach rfb to support the following script: 

    Project "Default"

      Target "Default"
        @gitInfo <= GetGitInfo -Capture:number,commit
        $gitnumber = %(gitInfo.number)
        $commit = %(gitInfo.commit)
        Message "gitnumber $(gitnumber), commit $(commit)"

      PS:GetGitInfo <<END
        cd C:\dotnet\dev\github\rfb
        $gittag = git describe --long
        $gitnumberpart = [System.Text.RegularExpressions.Regex]::Match($gittag, "\.(\d+)").Groups[1].Value
        $commit = if ($env:BUILD_VCS_NUMBER -eq $null) { git log -1 --pretty=format:%H } else { $env:BUILD_VCS_NUMBER }
        Write-Host "$gitnumberpart and $commit"
        @{ number = $gitnumberpart; commit = $commit}
      END

Some people may see it as a hack to use an item group for getting a single line, however the item group has the notion of metadata which allows for a dot-notation to access several values, which makes it a nice container to retrieve numerous values from a single PowerShell script.