---
title: "A docker image for github's jekyll"
layout: post
tags: [site]
date: 2016-09-25 19:15:00
---

Well, so there is that thing that I get really scared to upgrade my jekyll stuff to edit this website. ruby gems and all that.
Then, some time ago, I had a twitter exchange with Hadi Hariri, and he kindly provided me with a docker file to create a docker image. Which would run the jekyll thing.

The file I show here is slightly different in that the only gem I need to install is the github-pages one, since I am deploying to github (YMMV).

{% gist flq/0293a9bbb6835430029dbc52162f9784 Dockerfile %}

The whole things is built and then started with

{% gist flq/0293a9bbb6835430029dbc52162f9784 build.ps1 %}

