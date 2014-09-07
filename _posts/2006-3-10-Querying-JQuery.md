---
title: "Querying JQuery"
layout: post
tags: programming javascript download TrivadisContent
date: 2006-03-10 21:42:00
redirect_from: "/go/15"
---

Today I came across JQuery via the infamous digg. It comes along as a neat JScript library that will facilitate your coding needs in many ways. (For more, check out [JQuery](http://jquery.com/ "jquery") ). What intrigued me most for now was the DOM querying facilities that it promises to deliver (probably because I was doing a PL/SQL course these days!). Again, I refer you to the website. Either way, in order to figure out more about the possibilities listed there (since I did not understand them all) I built a small page, which will not win any fancy web2.0 beauty contest, but contains enough DOM elements to get querying.</p>

It allows you to type a string in the querying syntax supported by the Jquery library and the code will add a border to the newly selected element. It will also allow you to click an element, which will make it the current context. The query that you now type in will be within the context of the selected element. That’s all for now.

<p>Anyway, all in all it turns out to work pretty well, so, respect for this lovely library…However, a tiny amount of the queries that are said to be supported didn’t work for me, or not in the way I first thought. I didn’t get to work the CSS-based query with **nth-of-type(n)**. The selection of parents works, but if you want to choose the div enclosing the div.unify you need to write **div.unify/../../div** and not  **//div.unify/../div**.

Right, go querying!