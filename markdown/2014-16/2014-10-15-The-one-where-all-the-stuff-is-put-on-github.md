---
title: "The one where all the stuff is put on github"
layout: post
tags: [meta]
date: 2014-10-15 08:27:56
---

Putting my website on github through the process of creating a static website based on [jekyll][1] marks the 9th version of my online presence.
10th would have been better to justify a little retrospective, but then I never considered myself a numerologist.

## The first. 1997.

Interestingly the site already contained a component of slapping on a date + title as a headline, accompanied by some content. I'm sure quite a few people did it that way, someone just decided to give it a name at some point: blog. That's how it goes with humans. Business is just a natural extension of what we like to do. I wish we could be relaxed about it at some point.

![Website One](/assets/site1-1997.png)

The design is definitely very nineties. It's interesting how all images look pretty blurry, but back then it looked pretty crisp. I guess that's the price you pay for retina, the past starts to look ugly. I like the fact that the little javascript snippets (hover over images, counter) work to this very day.

## 1999

Apparently I had too much time on my hands and I thought, _for maintainability reasons, wouldn't it make sense to have all common layouting elements like colours, or sections, be encoded in javascript? That surely would lead to a more maintainable and flexible website?_. A new site was born, where everything was described in javascript. Considering that CSS was already around, this is a classic case of a bad technology choice for the problem at hand.

![Website Two](/assets/site2-1999.png)

## 2000 - CGI.

This was a page on [virtualave][2] that allowed free hosting while being able to use some cgi stuff, includes in the html and the like. Fancy stuff, sadly I cannot generate a screenshot of that one anymore ;)

## 2001 - The first page under realfiction.net

Around 2000-2001 I finally bought realfiction.net and installed my first website, which, if I remember correctly, I maintained with Dreamweaver. This had no blog-style concept but was more like a personal website with things I deemed presentable to a small (_possibly very small_) audience.

![Website Four](/assets/site3-2001.png)

I had that page for quite some time, with only small variations.

![Website Four](/assets/site4-2005.png)
![Website Five](/assets/site5-2006.png)

As you can see, the latest instalment of the static website had a link to a _"weblog"_, which pointed to a Drupal-Installation.

## 2005,2006 - Drupal-based page

Around this time I really started to create _some_ content for my website, and I decided to have everything running on the [CMS Drupal][4] (as my web provider would allow running PHP and MySQL). I reckon that the final switch to everything running on Drupal coincides with this [post here][3].

## 2009 - Custom-made website

With my skills growing in SW development, I felt the need to stay in the game with web technologies as my daytime programming was pretty thick client-heavy. Still my roots were in the .NET tech stack, hence I was looking to find a hosting provider which would allow me to run .NET, which I found in [WinHost][5]. Also, I wanted to use git, as it was all the rage - [My first commit][6] for this website is dated Oct 10, 2009.

![Website Four](/assets/site6-2011.png)

The first version of this site was based on NHibernate + FluentNHibernate and ASP.NET MVC. Some 2 years later I switch to the (know unfortunately defunct) [FubuMVC][7]. The last incarnation allowed to [drop markdown into a dropbox folder][8] which the website would pick up and publish. Not too bad, but somehow I am once more in a phase were I want to reduce any maintenance burden there is for my website. 

## 2014 - Jekyll on github

The github pages striked me as a viable option to keep writing markdown, with pushing as easy as writing _git push_. 

And there I am, looking back at 17 years of personal web pages. A myriad ways to the same conclusion: Sending a web page to a browser.

*Still liking it!*


[1]: http://jekyllrb.com
[2]: https://www.virtualave.net
[3]: /2006/05/27/a-warm-welcome!
[4]: https://www.drupal.org
[5]: http://www.winhost.com
[6]: https://github.com/flq/Rf.Sites/commit/95bac01dabc9f34379687d2de52177c42d019dc2
[7]: http://mvc.fubu-project.org
[8]: /2013/03/24/a-new-beginning