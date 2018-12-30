---
title: "Patching in Drupal"
layout: post
tags: [site, tools]
date: 2006-06-06 20:44:12
redirect_from: /go/26/
---

This is the second update to drupal that I go through...that many security issues..?..oh my...anyway, had to figure out how to **patch** on me olde Windows machine, here are my findings:

1.  Get the patch exe from [e.g. here](http://gnuwin32.sourceforge.net/packages/patch.htm "patch.exe v 2.5.9")
2.  make sure you have it accessible from within your command line (%PATH%, anyone?)

3.  Get the issued patches from the drupal site
4.  Change the files from the **UNIX **format to the **DOS **format (you know, the old carriage return linefeed stuff), otherwise patch.exe will fail _miserably_. For me, [metapad ](http://www.liquidninja.com/metapad/ "Metapad")does this job just fine.
5.  Copy the patch you want to apply to the root dir of drupal
6.  Open the command line and issue the following command: **patch -p 0 &lt;thepatch.patch** with _thepatch.path_ being the patch filename

7.  Once you have done this, you can do a search throughout your drupal dir, get the latest changes and FTP those to your sitethis helped me and I hope it may help others.