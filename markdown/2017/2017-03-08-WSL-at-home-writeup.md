---
title: "WLS at home writeup"
layout: post
tags: [loosely-coupled]
date: 2017-03-08 21:00:00
---

This is mainly a writeup for myself, so don't worry if you feel like context is missing. There will also be new entries coming up over here

* bash runs fine in conemu in current versions.

### change home to the same home as windows

* `sudo vim /etc/passwd` - [change entry](http://superuser.com/questions/1132626/changing-home-directory-of-user-on-windows-subsystem-for-linux) of your user to your home drive (/mnt/...)

### Git branch display etc. on bash

Based on [info here](http://stackoverflow.com/a/29020276/51428)

* add a .git-promp.sh
* source it (.bashrc)
* add color infos and change prompt