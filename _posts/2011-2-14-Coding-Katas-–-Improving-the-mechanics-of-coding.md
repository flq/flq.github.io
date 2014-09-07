---
title: "Coding Katas – Improving the mechanics of coding"
layout: post
tags: programming dotnet TrivadisContent C#
date: 2011-02-14 11:13:00
redirect_from: "/go/197"
---

If only one could code straight from the brain – Alas, we aren’t there yet. If you want to reduce the impedance between a programming idea in your mind and the act of coding you can do exercises that concentrate on reducing that impedance. This is what [Code Katas](http://codekata.pragprog.com/) are: [exercises](http://en.wikipedia.org/wiki/Kata) whose problem domain are understood by you, and which by repetition you can concentrate on the mechanics of coding. After all, you don’t expect a musician to only ever play her instrument on a gig, right?

The past day I’ve gone through [this small coding Kata](http://www.osherove.com/tdd-kata-1/) posted by Roy Osherove, the String Calculator.

One important aspect of improving the mechanics is knowing well the tools you’re using. I must admit that I’d never attempt this exercise without resharper. In preparation for a [Katacast](http://www.katacasts.com/) I also had to improve some of the tooling that I commonly use:

*   Using Alt+ArrowUp, ArrowDown to move between members of a type
*   Defining two live templates

*   one “test” file template that defines a test class as Test fixture with a setup and a first test
*   one “test” template to use inside a test class to define the correctly attributed method for a test*   In VS Under Tools/Options/Environment/Keyboard, define a shortcut for the command **Resharper.ReSharper_UnitTest_ContextRun**. That will allow you to use the shortcut in a test class to run the test in the current context. Depending on cursor position it will run all tests in a test class or the one test the cursor is in.
*   If the solution explorer is necessary e.g. to create a new file, you can Press Alt+V,P (View Menu –&gt; Explorer) to jump into the solution explorer. 

In combination with the shortcuts I’m already using + the awesome resharper functionality it allows for pretty long runs of mouseless development in red-green-refactor cycles.