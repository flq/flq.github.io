---
title: "Update to Drupal 5.1 - Check!"
layout: post
tags: site drupal virtualization
date: 2007-02-19 21:50:26
redirect_from: "/go/59"
---

Well, that's done. It took a moment or two to update the site from drupal 4.7 to 5.1. The administration looks good, it has been cleaned up for the better, and the update process was fairly straightforward. 

Basically all modules I was using have already been ported to the 5x platform - apart from the code formatting module. I had to fall back to a simpler one available, which may be just sufficient for the few lines of code I provide here & there.

I ran into a small problem regarding the functionality of attaching files to given content. The functionality was provided by the **disknode **module, but now there is actually a drupal core module doing pretty much what I need, the **upload **module. Both modules basically work with the same drupal table, _files_. But my old attachments were not visible anymore. Only when adding a line in the_ file_revisions_ table, associating the file with its actual visibility, was I able to let my old entries reappear. Ace!

Well, the site looks a tad different. The theme is bluntly based on the Zen-theme available from Drupal, but theme development requires some time, which I wasn't able to invest this weekend, so this'll have to do for now (and darn it looks _simple_, so I like it!)

The actual upgrade procedure was extremely pain free, thanks once more to the superb virtual machine, [Granma's Lamp](http://canned-os.blogspot.com/2006/10/grandmas-lamp-its-easy-enough-for.html "LAMP so easy, even your grandma can do it!"). This xubuntu-based machine comes with PHP, MySQL, all running on apache. Installing my site on the machine was quickly done, and from there I could do all the upgrading. Once I was done, I went on exporting my DB, zipping up the drupal folder, and drop it in my webspace. In 5 minutes everything was set up and running again. Did I mention I love this virtual machine stuff? Did I mention I quite like drupal?...