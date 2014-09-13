---
title: "Things I learned about VM Machines today"
layout: post
tags: programming virtualization TrivadisContent
date: 2006-12-11 20:58:04
redirect_from: /go/56/
---

There is no doubt, virtual machines are very useful, considering the constant increase in resources available even on a laptop (Yeah, alright, I got a mobile 100GB harddisk now). Today, while trying to set up a simple FreeDOS-based machine I learned the following:

*   For machines which don&#39;t have access to a USB stick or shares readily available, you can always mount a virtual harddisk into your host OS (much like a network share) with the freely downloadable [workstation disk mount](http://www.vmware.com/download/ws/drivers_tools.html). Then you can just copy files right into the virtual machine&#39;s hard-disk. Only nag is that you can only mount while the appliance is powered off. If you want to power it again, you must first unmount the disk. Still, it came in handy.
*   A nice collection of VMWare related tools can be found at [VM Back](http://chitchat.at.infoseek.co.jp/vmware/). Seriously cool is the virtual floppy mount. Especially on my laptop, which doesn&#39;t have a floppy drive, I can mount whatever bootable floppy I wish. I quickly made myself a bootable floppy for partition magic as well as Norton Ghost (see next point).
*   Changing a machine&#39;s virtual harddisk is as easy as moving around files. Using the following approach, changing the disk size of your virtual appliance becomes a pretty safe task: You can create a virtual machine with a harddisk having the size you are targetting. Then you simply attach the harddisk containing your source files as a second hard disk. Finally you can simply boot that VM with e.g. a Norton Ghost floppy (see last point). Here you can now simply duplicate the disk (you have an empty disk and the attached source disk. Once you&#39;re done you can simply exchange the harddisks on your original virtual appliance. This is all..just..neat!