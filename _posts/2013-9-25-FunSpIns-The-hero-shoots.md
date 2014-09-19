---
title: "FunSpIns - The hero shoots."
layout: post
tags: [software-development, Haskell, fun-spin]
date: 2013-09-25 14:00:00
redirect_from: /go/236/
---

> Inspired by Rob Ashton's series "[Learn functional programming with me][1]"

Before getting down to the additions necessary to get great space defender to shoot, a few refactorings that occurred along the way...

	data WorldItem = Enemy Point Int | Hero Point | Shot Point
	...
	getRect (Enemy (x,y) _) = Rect x y 20 10
	getRect (Hero (x,y)) =  Rect x y 25 15
	getRect (Shot (x,y)) = Rect x y 5 6
	getPixel (Enemy _ _) = Pixel 0xFFFFFF
	getPixel (Hero _) = Pixel 0xFF0000
	getPixel (Shot _) = Pixel 0xFFFF00

Here, you can see pattern matching in action:  A world item may either be an **enemy**, the **hero** or a **shot**. Based on this information I can now choose different rectangle sizes and different colours for the three different kinds of world items - adding new kinds of world items would be a trivial task. As a mostly OO programmer this does look quite a bit like a visitor pattern, only that this sort of pattern is pretty much first class in Haskell. 


Since I already found an abstraction to actors in this little game world, adding the shooting is a rather straightforward affair.

	shotsActor :: World -> (World,[WorldItem])
	shotsActor w = (newState, (heroShots newState))
	  where
	    newState = case (lastKey w) of
	      SDLK_SPACE -> w { heroShots = (move (heroShots w)) ++ [newShot], lastKey = SDLK_UNKNOWN }
	      _ -> w { heroShots = move (heroShots w) }
	    move = map (\(Shot (x,y)) -> Shot (x, y-10))
	    newShot = Shot ((+10) $ getX $ heroPosition w,430)

The world data now has an additional property : **heroShots :: [WorldItem]**. 
The new state is derived from whether the space key was pressed or not. In either case, the shots need to keep moving through the world, with the only difference that when pressing space, another shot is added to the list of existing shots. Finally, the last key value is erased to ensure that pressing space only fires a single shot. 

> Just now while I am writing this I come to realize that I have no code to delete shots that are not inside the viewport anymore - 
> funny enough I never noticed any detrimental effect on performance while playing and frantically hitting the space key...

While I am leaving the thing as it is, one can see implementation detail leakage in action: Deriving where a shot should appear assumes the size of our defender as well as his position. Nothing that couldn't be rectified, but I can live with that for now. 

  [1]: http://codeofrob.com/entries/learn-functional-programming-with-me---adding-items-to-a-sequence.html