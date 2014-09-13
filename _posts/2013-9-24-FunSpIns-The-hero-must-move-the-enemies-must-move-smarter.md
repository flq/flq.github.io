---
title: "FunSpIns - The hero must move, the enemies must move smarter."
layout: post
tags: programming Haskell fun-spin
date: 2013-09-24 14:00:00
redirect_from: /go/235/
---

> Inspired by Rob Ashton's series "[Learn functional programming with me][1]"
It is time to feed things back to the actors! The actor signature did change a teeny bit:

	type Point = (Int,Int)
	data ItemColor = White | Red | Black
	data WorldItem = WorldItem Point ItemColor
	World -> (World,[WorldItem])

That way we will be able to tell the rendering what colour we want our rectangles to be.

So, our enemies actor becomes:

	enemiesActor :: World -> (World,[WorldItem])
	enemiesActor w = (newState, enemies)
	  where
	    newState = w { enemyPosition = changeX (+2) (enemyPosition w) }
	    enemies = enemyGrid (enemyPosition w) (3, 5)
	    enemyGrid (originX,originY) (rows, cols) = 
	      map enemy [ (x,y) | x <- take cols [originX,originX+60..], y <- take rows [originY,originY+30..]]
	    enemy p = WorldItem p White

changeX is a new method with a pretty simple implementation:

	changeX f (x,y) = (f x, y)

From which you can conclude that (+2) is actually a function, namely adding two to whatever supports adding twos to them.

Some changes where done on the loop. Indeed, there was no bail-out condition, which is introduced by checking whether 'x' is pressed.
Also, I don't want to react to any mouse events, hence it is sufficient to just pass on any key that is pressed by the gamer. The main and loop functions got some refactoring:

	main :: IO ()
	main = do
	  canvas <- init
	  loop $ initWorld canvas
	  where
	    init = FX.init [InitVideo] >> (FX.setVideoMode 640 480 32 []) >> FX.getVideoSurface

As you can see main is pretty much toned down to set up the SDL stuff and start looping with an initial version of our World. Loop became its own function:

	loop :: World -> IO ()
	loop world = do
	  FX.pollEvent >>= handleEvent
	  where
	    handleEvent x = case x of
	        KeyDown (Keysym SDLK_x _ _) -> FX.quit
	        KeyDown (Keysym key _ _) -> render key >>= loop
	        KeyUp _ -> render SDLK_UNKNOWN >>= loop
	        x -> render (lastKey world) >>= loop
	    render e = do
	      let c = canvas world
	      FX.fillRect c Nothing black
	      let (newWorld,items) = foldl runActor (world { lastKey = e }, []) $ actors world
	      mapM (\wi -> FX.fillRect c (getRect wi) (getPixel wi)) items
	      FX.flip c
	      FX.delay 40
	      return newWorld
	    runActor (wld, items) actor = (newWorld, items++moreItems)
	      where (newWorld,moreItems) = actor wld  

the value of **pollEvent** is bound to the **handleEvent** function. That one is responsible for our bailout (matching on a keydown event where **x** is pressed), as well as keeping the loop going in any other event. 

One speciality is that we extract the pressed key, and in case of any other event that may come through we do as if some unknown key would have been pressed. Hence, our World now does not keep the whole SDL event, but just the last key pressed. **Also**, while no KeyUp event is coming along, we moving the lastKey of the previous  world on to the next. This has the nice effect that our actors will react to the keydown event as long as the given key is pressed (*Your keyboard will thank me!*). **getRect** and **getPixel** functions are helpers to map from our **WorldItem** into the SDL data types.

Now that we have a nice key event hanging around in the *World*, let's get our hero into the equation:

	heroActor :: World -> (World,[WorldItem])
	heroActor w = (newState, (hero newState))
	  where
	    newState = case (lastKey w) of
	      SDLK_LEFT -> move (+(-10))
	      SDLK_RIGHT -> move (+10)
	      _ -> w
	    hero (World { heroPosition = p }) = [(WorldItem p Red)]
	    move f = w { heroPosition = changeX f (heroPosition w) }

Depending on whether the user pressed left or right cursor key, we define the position of our hero in the World and create the corresponding *WorldItem*. I also need to match any other key, otherwise a *non-exhaustive pattern match* error will occur at runtime -  in this case we leave the world unchanged.

### Enemy movement

Rob got somewhat ahead of me in that he has already sorted out the enemies moving from left to right and back, etc. - My enemies are currently edlessly wandering towards the left, leaving the screen and escaping the *righteous vengeance* of our world-defending hero.

For this I introduce a new state into the world:

    data World = World 
        {
	      ...
	      enemyMovement :: MovementPattern,
	      ...
	    }

where **MovementPattern** is defined as 

	type MovementPattern = [(Movement, [(Int, Int)] -> Bool)]
	data Movement = Rght | Dwn | Lft deriving Show

A pattern is therefore a number of Tuples consisting of a movement definition and a function that evaluates to true/false based on an input of Points. The way to use the pattern is as follows:

* Extract the points from whatever **WorldItem**s you want to consider
* If the function of the first element evaluates to True, leave things as they are
* If the function of the first element evaluates to False, roll over the pattern - first becomes last, second becomes first.

So I go ahead and express that code-wise:

	evaluateMovePattern :: [(Int,Int)] -> MovementPattern -> (Movement,MovementPattern)
	evaluateMovePattern items pattern = 
	  case (evaluate items) of
	    True -> next pattern
	    False -> next newPattern
	    where 
	      evaluate = snd $ head pattern
	      next p = (nextMove p, p)
	      newPattern = roll pattern
	      nextMove (m:ms) = fst m

where **fst**, **snd** are [Prelude][2] functions to extract the first and second value of a tuple, respectively. roll is just **roll (x:xs) = xs++[x]**.
Armed with the ability to evaluate a movement pattern, let's define one in the initialization of our World:

	initWorld canvas = World 
	  { 
	    ... 
	    enemyMovement = [(Rght,(<=620) . maxX),(Dwn,alwaysFalse),(Lft,(>=0) . minX),(Dwn,alwaysFalse)],
	    ...
	  }
	-- with ..
	getX :: Num a => (a,a) -> a
	getX (x,_) = x
	boundX f = getX . (f (comparing getX))
	maxX = boundX maximumBy
	minX = boundX minimumBy

Hence, the pattern is right, while the maximum X of our point cloud is smaller than 620, the one time down (alwaysFalse returns false for whatever input), then left while the smallest X of the point cloud is bigger than 0, the one time down.

We can use this in our enemy actor to make sure that it moves properly throughout the screen:

	enemiesActor :: World -> (World,[WorldItem])
	enemiesActor w = (newState, enemies)
	  where
	    enemies = enemyGrid (enemyPosition w) (4, 8)
	    newMovePattern = evaluateMovePattern (map getPoint enemies) (enemyMovement w)
	    requiredChange = case (fst newMovePattern) of
	      Rght -> changeX (+3)
	      Lft -> changeX (+(-3))
	      Dwn -> changeY (+10)
		newState = w { enemyPosition = requiredChange (enemyPosition w), enemyMovement = snd newMovePattern }
		...

Based on the current Movement, the enemy position is changed for the next iteration through our world.

At this point in the series we have...

* A bunch of enemies that move left to right, slowly coming down
* A red hero that can be moved to the left and the right

Doesn't sound terribly impressive, but the total LoC is about 117, and that from a FP noob, but we have still some way to go.


  [1]: http://codeofrob.com/entries/learn-functional-programming-with-me---keyboard-input-for-our-red-square.html
  [2]: http://www.haskell.org/ghc/docs/latest/html/libraries/base/Prelude.html