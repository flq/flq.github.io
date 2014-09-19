---
title: "Exploring Haskell's type system - A Roman number type"
layout: post
tags: [software-development, Haskell]
date: 2013-07-26 20:50:57
redirect_from: /go/224/
---

Once in a while I need a break from my day-to-day job in C# land. Don't get me wrong, I like the language, but it doesn't cover _all_ of my intellectual needs.
More specifically, if I

* Need some functional, imperfect chaos, which gets much done nonetheless, or in [Scott Hanselman's words][1], if I want to do some assembly language, I go and visit __JavaScript__
* Need purity, the most amazing compiler that ruthlessly cracks down on any typing (in the computing sense) error you do, the serenity of a perfect universe that simulates dirt only if it has to, then I visit __Haskell__.

This time it was Haskell's turn - the [last time][2] I delved into Haskell, I hadn't really touched its type system, only used those already in place. This time I wanted to rectify that.

## Behold - the Roman number

<script src="https://gist.github.com/flq/6087387.js"></script>

**Disclaimer:** *I may have only implemented a subset of the proper rules of how to write Roman numbers. If you use this type to calculate the altitude of your plane, and it doesn't work, don't sue me, because I give no guarantees as to the 100% correctness of the code*

The Roman number _cough_ system _cough_ had no extraordinary mathematical capabilities - I am not aware of any systematic approach that would let you add two Roman numbers. Their only purpose must have been to attach a word to a number.

The interesting parts with regard to the type system are **lines 8-22**. What is defined here is

* What a *Roman* is : It has two constructors that take a String or an Int
* That a *Roman* can be shown, which makes it interesting e.g. in the interactive mode of Haskell
* That two *Romans* can be compared
* That a *Roman* behaves like a *Num* type

The rest is really just a fair enough implementation of how to get from something like **MCMLXXXIV** to **1984**.

The (probably quite inaccurate) conclusions I take away from this quick splash into Haskell-land

* Haskell classes can be compared somewhat to interfaces, but they can carry default implementations
* Haskell data can have what could be compared to multiple constructors, but later on we can actually match on how data was constructed
* Not used here, but Haskell has a decent record syntax (yes, I am pointing at you, [Erlang][3]) 
* The capabilities, or traits, or contracts or whatever you like to call them are much cleaner defined. Not every _thing_ is by default equatable. Not every _thing_ is by default displayable.

All in all, once again, refreshing, and purifying ;)

[1]: http://www.hanselman.com/blog/JavaScriptIsAssemblyLanguageForTheWebSematicMarkupIsDeadCleanVsMachinecodedHTML.aspx
[2]: http://realfiction.net/go/92
[3]: http://learnyousomeerlang.com/a-short-visit-to-common-data-structures