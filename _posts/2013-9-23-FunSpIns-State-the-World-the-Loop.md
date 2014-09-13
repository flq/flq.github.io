---
title: "FunSpIns - State, the World, the Loop"
layout: post
tags: programming Haskell fun-spin
date: 2013-09-23 14:00:00
redirect_from: /go/234/
---

> Inspired by Rob Ashton's series "[Learn functional][4] [programming with me][6]"
Recreating this episode *really* had me on the brink of giving up the whole thing. I am not a games programmer, **FFS**, what am I *doing* here?

When it comes to things that look mildly imperative or indeed involve mutating state, Haskell keeps doing my head in. Of course Haskell has no troubles with state and its tendency to change, but while other languages have state baked in, in Haskell it is pretty much just another abstraction.

So, I was searching for the right solution, and [looked at timers][2], based on [Lazy Foo tutorials on SDL][3]. I looked at how to do [Co-routines in Haskell][1], as I thought that this could be an interesting approach to having, well, coroutines spit out logic that gets rendered. This [surely is possible][5], but right now, the level of abstraction really explodes my current time budget.

To my relief, I did manage to construct a loop that would produce moving rectangles and should allow more interesting things later on. For this, we have the definition of a World:

### The world

	data World = World 
	  {
	    canvas :: Surface,
	    lastEvent :: Event,
	    enemyGridOrigin :: (Int,Int),
	    actors :: [World -> (World,[Rect])]
	  }
	initWorld canvas = World 
	  { 
	    enemyGridOrigin = (5,5), 
	    lastEvent = NoEvent, 
	    canvas = canvas, 
	    actors = [moveEnemyGrid] 
	  }

This object will play the role of keeping the state of our subsequent loops, as well as hosting what I have called *actors*. These guys must accept the World as input and return the World alongside a number of Rects. Returning the world allows to actually change it within the implementation of an actor

### Records

A few words to Haskell's record-style syntax are probably in order right now. initWorld shows you how to create such a record. You can

* read out values as if the items of the record are functions and their parameter the record type. (e.g. *canvas world* would return the Surface stored within)
* match on the record type in a function declaration, thereby extracting value from it, e.g. foo (*World { canvas = c } --binds the canvas value to c*)
* replace one or more values of a record, example just follows...

### The enemies

Our enemy grid function now looks like this:

	moveEnemyGrid :: World -> (World,[Rect])
	moveEnemyGrid w = (newState w, enemies)
	  where
	    newState w = w { enemyGridOrigin = newOrigin (enemyGridOrigin w) }
	    newOrigin (x,y) = (x+5,y)
	    enemies = enemyGrid (enemyGridOrigin w) (3, 5)
	    enemyGrid (originX,originY) (rows, cols) = 
	      map enemy [ (x, y) | x <- take cols [originX,originX+60..], y <- take rows [originY,originY+30..]]
	    enemy (x,y) = Rect x y 20 10
 
You may see that so far this is pretty much just a proof of concept. We change the enemy origin's x-value by 5 and otherwise output
the enemies as we already did in the previous post.

Line 4 shows how we can replace a single value of our world-record. It looks a bit unwieldy, but truth be spoken records don't seem to be Haskell's strongest suit.
The signature of *moveEnemyGrid* is very characteristic of a method that mutates something - indeed, anything that should be different after a function has run must be returned by that function.

Let us have a look at the loop...

	loop world = do
	  event <- FX.pollEvent
	  FX.fillRect c Nothing black
	  let (newWorld,rects) = foldl runActor (world { lastEvent = event }, []) $ actors world
	  mapM paint rects
	  FX.flip c
	  FX.delay 50
	  loop newWorld
	  where
	    c = canvas world
	    paint r = do
	      FX.fillRect c (Just r) white
	    runActor (wld, rects) actor = (newWorld, rects++moreRects)
	      where (newWorld,moreRects) = actor wld

The interaction with our World happens in line 4, everything else is render implementation details. What happens is that the list of actors is folded by successively passing in the World and giving the potentially mutated world to the next actor, meanwhile collecting all Rectangles from the actors that should be drawn to the canvas. At the end of the run we call *loop* again with the new world.


  [1]: http://random.axman6.com/blog/?p=231
  [2]: https://github.com/snkkid/LazyFooHaskell/tree/master/lesson20
  [3]: http://lazyfoo.net/SDL_tutorials/
  [4]: http://codeofrob.com/entries/learn-functional-programming-with-me---mutating-lots-of-state.html
  [5]: http://jshaskell.blogspot.de/2012/09/breakout.html
  [6]: http://codeofrob.com/entries/learn-functional-programming-with-me---improving-our-data-structure-with-maps.html