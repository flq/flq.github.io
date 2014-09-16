---
title: "Resharper 5.0 Outgoing calls analysis: Example from NHibernate"
layout: post
tags: [programming, dotnet, NHibernate]
date: 2010-08-13 15:43:00
redirect_from: /go/173/
---

The following is a screenshot when you start off from NHibernate’s default OnLoad listener (called e.g. when you say **session.Load&lt;Cat&gt;(23)**).

![NhibernateLoadEntity](http://realfiction.net/assets/NhibernateLoadEntity_3.png "NhibernateLoadEntity") 

I’ve cut out other outgoing calls to show you the level of abstraction between loading an Entity and hitting the ExecuteReader() method of ADO.NET’s low-level API.

You can access this functionality in Resharper 5 by pressing Ctrl+Alt+Shift+A, giving you a small menu to show you the type hierarchy, incoming and outgoing calls. A nice tool to find your way around an unfamiliar codebase.

[![Shout it](http://dotnetshoutout.com/image.axd?url=http%3A%2F%2Frealfiction.net%2Fgo%2F173)](http://dotnetshoutout.com/realfiction-Resharper-50-Outgoing-calls-analysis-Example-from-NHibernate)