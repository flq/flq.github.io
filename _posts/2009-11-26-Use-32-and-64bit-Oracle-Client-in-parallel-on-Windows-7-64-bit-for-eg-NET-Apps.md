---
title: "Use 32 and 64bit Oracle Client in parallel on Windows 7 64-bit for e.g. .NET Apps"
layout: post
tags: dotnet TrivadisContent oracle haxz
date: 2009-11-26 19:46:56
redirect_from: /go/153/
---

Since you come here probably looking for an answer, let me give it first. After that, if you have time, I'll explain why it turned out to be that sort of hack, i.e. what other approaches didn't work.

## How

Download and install Oracle Clients 11g (which support lower DB versions) for 32 and 64 bits. I use the Instant clients which come with an install.bat for 32-bit and the OUI for 64-bit.

![](/files/images/oracle_folders.png)

Open an elevated console and in **%windir%\system32** create a soft link to the 64-bit oracle client installation, while in **%windir%\SysWOW64** you make a soft link to the 32-bit installation. making a soft link to a directory means using the **mklink** command as explained [here](http://www.howtogeek.com/howto/windows-vista/using-symlinks-in-windows-vista/). Visually it will display as such (I called my link _11g_):

![](/files/images/oracle_link.png)

Edit your **PATH** environment variable and add the following path to it: **c:\windows\system32\11g**. Please note that **%WINDIR%** will not be expanded in **%PATH%**.

![](/files/images/oracle_env.png)

## Background

Currently I have Windows 7 64-bit running and Visual Studio 2008 32-bit installed on top of it.

When I start our current large project since I make no restrictions on the compilation target of the projects the processes will fire up as 64-bit ones. These require a 64-bit oracle client when talking to a DB (otherwise you will get a **BadImageException**).

However, within Visual Studio, when I kick off the Unit Tests written in (sadly, but factly) MSTest, the test runner gets started within Visual Studio and hence inherits its 32-bitness. Here, tests using the DB (you have a problem with that?) require the 32-bit oracle client.

My first attempt revolved around using the **%ProgramFiles%** environment variable. Depending on the bitness of the process it points to either **Program Files** or **Program Files (x86)**. Unfortunately, you cannot reliably reference this variable in the **PATH** environment variable - neither in the system (where it remains unknown and does not get escaped) nor in the user variable (where it always escapes to the 64-bit version).

A darker and more powerful kind of magic was required which came in the form of the [**FileSystemRedirector**](http://msdn.microsoft.com/en-us/library/aa384187(VS.85).aspx). This son ensures that a process always gets the right dlls shown at windows\system32, depending on it being a 32 or 64-bit process.

This is the hack I hooked into with the symbolic links. That way I can have a constant path in my PATH variable that actually points to different locations depending on the process that looks at it.