---
title: "Serving the well-known webfinger from github pages"
layout: post
tags: [web]
date: 2023-01-15 20:00:00
---

My website is built with gatsby. Serving a generic webfinger as described on [Andrew Shell's blog][1] or [Maarten Balliauw's blog][2] (in order to simplify user discovery in the Fediverse) is easy enough by providing a static file. However, since the relevant file is served under a directory starting with a dot, thias causes some additional troubles:

* I deploy the output of the gatsby build with the CLI tool `gh-pages`. Here, you need to make sure that you pass the `--dotfiles` option to ensure that the `.well-known` directory is also pushed to the relevant branch
* Now it is the github pages serving that is not playing nicely. [This Stackoverflow answer][3] explains what has to be done: A `.nojekyll` file needs to be present in the github pages directory for dotfiles to also be served.

With these two additional twists, my webfinger file is now correctly served, and you'll find me when you search on a Mastodon server e.g. for `frank@realfiction.net`


[1]: https://blog.andrewshell.org/webfinger-for-activitypub-feed-discovery/
[2]: https://blog.maartenballiauw.be/post/2022/11/05/mastodon-own-donain-without-hosting-server.html
[3]: https://stackoverflow.com/a/59011444/51428