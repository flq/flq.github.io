---
title: "FunSpIns - No attributes, No vectors, A tiny Workflow and more squares"
layout: post
tags: [software-development, haskell, fun-spin]
date: 2013-09-20 14:00:00
redirect_from: /go/233/
---

> Inspired by Rob Ashton's series "[Learn][1] [functional][2] [programming with me][3]"

This post kind of covers 3 of Rob's posts, as, frankly, I can't say much about attributes - in Rob's case it refers to the DOM, which we don't have here.
Why he would mention Vectors? I don't know, maybe to sound fancy ;)  

When it comes to the working workflow in Haskell, my tool of choice right now is the interactive haskell (*ghci*) - saying ***:load game*** (provided I have a game.hs lying around) will either tell me that all is cool or throw relevant compiler errors at me, which usually is some form of elaborate type mismatch (*90%*) or a syntax error (*9%*) with an error margin of &#177;1%.

As to drawing lots of enemies, functional approaches should be somewhat similar. The permutation thing that Rob does with the **(for [x [...]] [y [...]])** is also achieved with list comprehensions, just that you have to specify two ranges to feed the output. Here is a function to give us a grid of squares:

	enemyGrid (originX,originY) (rows, cols) = 
	  map toRect [ (x, y) | x <- take cols [originX,originX+60..], y <- take rows [originY,originY+30..]]
	  where
	    toRect (x,y) = Rect x y 20 10

Providing two comma-separated values to the Haskell range (the **[n..m]** thing, or here, the **[n, n+s, ..]**) defines the step of the range. Due to the lazy nature of Haskell,
I can leave the range open ended. The *breaking condition* is that I just **take** as many values as I want (columns and rows, respectively).

These little buggers need to be fed into the drawing API, which we can do as such:

	canvas <- FX.getVideoSurface
	mapM (\r -> FX.fillRect canvas (Just r) white) $ enemyGrid (10,10) (5, 10)
	FX.flip canvas

**mapM** is again the monadic version of map<sup>*)</sup>, required to create something wrapped in IO context. The **(\r ->** denotes the start of a lambda, while **$** influences associativity such that I spare myself surrounding the **enemyGrid** call with brackets.

<sup>*) or Select, for the LINQ folks crazy enough to have followed this so far)</sup> 

  [1]: http://codeofrob.com/entries/learn-functional-programming-with-me---attributes-and-vectors.html
  [2]: http://codeofrob.com/entries/learn-functional-programming-with-me---improving-my-workflow.html
  [3]: http://codeofrob.com/entries/learn-functional-programming-with-me---adding-lots-more-state.html