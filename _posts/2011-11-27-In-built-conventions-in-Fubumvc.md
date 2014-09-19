---
title: "In-built conventions in Fubumvc"
layout: post
tags: [programming, dotnet, web, libs-and-frameworks]
date: 2011-11-27 21:30:00
redirect_from: /go/208/
---

Fubumvc not only allows you to define your own conventions, i.e. the ways in which your code gets wired up into your web app,
it comes with its own set of conventions. Before you start re-inventing some wheels, check out what the framework has up its sleeve.

When you like checking out the source code, the bootstrapping of _in-built_ conventions is found in the [FubuRegistry][1].

Without further ado, let us list it:

* If you mark an action with the _HtmlEndpointAttribute_, the model returned will be rendered as HTML by calling _ToString()_ on the model.
* If you return a string from an action and the action's method name end on __Html__, it will be used as the response assuming it is HTML.
* If you return a string __without__ having the action name end on HTML, it will be rendered out with MIME-type _text/plain_.
* When your output model implements the interface _JsonMessage_, it will be rendered out as Json.
* When you like using the API from the [HtmlTags library][2], you can output either a _HtmlDocument_ or _HtmlTag_ from your action and it will be output as HTML.
* When your action outputs a value from the [System.Net.HttpStatusCode][3], Fubumvc ensures that the code is used as response status code.
* Your actions can cause a redirect / transfer to a different Url/Action. This happens either by returning a _FubuContinuation_ or a model implementing _IRedirectable_.
* If your output model implements _IHaveHeaders_, you can provide a collection of header values which will be added as HTTP Header to the response.

There are a couple of other conventions in a number of areas, however, I haven't followed the underlying code enough to be able to write down a summary. Even so,
I hope that knowledge about the conventions above helps you in writing less code.

  [1]: https://github.com/DarthFubuMVC/fubumvc/blob/master/src/FubuMVC.Core/FubuRegistry.DefaultConventions.cs
  [2]: http://htmltags.fubu-project.org/
  [3]: http://msdn.microsoft.com/en-us/library/system.net.httpstatuscode.aspx