---
title: "Getting FubuMVC from github and building it from the command line"
layout: post
tags: [ruby, dotnet, web, libs-and-frameworks]
date: 2010-02-06 09:46:00
redirect_from: /go/155/
---

Documentation on new and upcoming projects is sometimes a bit sparse, here a first contribution to [FubuMVC](http://fubumvc.com/): The bare beginnings.

*   Get some git environment running. [This](http://www.lostechies.com/blogs/jason_meridth/archive/2009/06/01/git-for-windows-developers-git-series-part-1.aspx) is a good introduction  
* you can start a git folder with git init and then e.g. get a readonly version of fubumvc with “git clone [git://github.com/DarthFubuMVC/fubumvc.git](git://github.com/DarthFubuMVC/fubumvc.git "git://github.com/DarthFubuMVC/fubumvc.git")”. Note that git will create a fubumvc folder.  
* Get ruby from [http://rubyinstaller.org/download.html](http://rubyinstaller.org/download.html)
    * It should be irrelevant which version you use (1.8.x or 1.9.x). 
* Once installed, ensure you have the necessary dependencies:
    * from your fubumvc folder, run [InstallGems.bat](http://github.com/DarthFubuMVC/fubumvc/blob/master/InstallGems.bat). 
    * When all the gems have been installed successfully, you can run “[rake](http://github.com/DarthFubuMVC/fubumvc/blob/master/rakefile.rb)” for the project 

If you have ruby 1.9.x you [should ensure](http://groups.google.com/group/fubumvc-devel/browse_thread/thread/45b29f5bc390c953) that rubyzip 0.9.4 is installed.

and

If you are e.g. logged in with a domain user at home it can be that your **HOMEDRIVE** and **HOMEPATH** environment vars point to a non-existing path. Even though ruby installs nothing there by default, it bombs out nonetheless if the home drive cannot be reached. Bail-out here is to define a **HOME** variable and let it point to e.g. %USERPROFILE%