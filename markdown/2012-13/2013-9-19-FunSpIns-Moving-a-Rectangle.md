---
title: "FunSpIns - Moving a Rectangle"
layout: post
tags: [programming, haskell]
date: 2013-09-19 14:00:00
topic: "fun-spin"
---

<TopicToc topicId="fun-spin" header="Functional space-invaders series" />

> Inspired by Rob Ashton's series "[Learn functional programming with me][1]"

Last time a square got drawn, this time moving it would be nice. Rob's approach was based on a recursive function call,
one of the basic tools in FP to essentially do loops.

Another way to consider the movement would be to look at it as a list of numbers, or coordinates, that dictate at which position
the rectangle should be drawn. One weapon of choice in Haskell for sequences of things are [list comprehensions][2].

> Incidentally I learned about list comprehensions in Erlang, which look very similar to Haskell's 

Hence, from a given sequence I would create Rectangles that were ready to be drawn onto a screen:

```haskell
    [(Just (Rect x 25 50 50)) | x <- [1..450]]
```

and for each one of those I would want to draw it on the screen, hence I prepared myself this function:

```haskell
	fillDo canvas rect = do 
	 FX.fillRect canvas Nothing (Pixel 0)
	 FX.fillRect canvas rect (Pixel 0xFFFFFF)
	 FX.flip canvas
```

## The do-notation

all SDL operations happen in the IO monad, which can be seen nicely when we look at the type of the involved functions:

```haskell
    FX.fillRect :: Surface -> Maybe Rect -> Pixel -> IO Bool
    FX.flip :: Surface -> IO ()
```

If we want to work with them, we will need to work in that context ourselves. Haskell has a number of functions to work with Monads, one of them being **(>>)**. Its type is

```haskell
    (>>) :: Monad m => m a -> m b -> m b
```

<sup>*) Within the same monad, given a one-in, one-out function, return the output of the function</sup> 

It looks and sounds trivial, but actually allows to chain functions together that happen in the same context. i.e. something like

```haskell
-- putStr :: String -> IO ()
putStr "Hello" >> 
putStr " "
--becomes
do
	putStr "Hello"
	putStr " "
```

## List + fillDo = ...

My initial attempt was to take my list of Rectangles and map the fillDo over it:

	map (fillDo canvas) [(Just (Rect x 25 50 50)) | x <- [1..450]]

Note the use of currying - (fillDo canvas) returns a function that takes a rect as a parameter and returns **IO ()**.

Alas, it wouldn't compile. After some thinking and googling, the issue dawned on me: every function inside a do block
must return into the same context with which we started off. Alas, the last line of code did not return an **IO sth**, but
rather **[IO sth]**, an array of things in the IO context. What I wanted was actually **IO [sth]**.

> Once you get the hang out of it, Haskell errors can be quite understandable. This one was...

```cli
Couldn't match expected type `IO a0' with actual type `[b0]'
In the return type of a call of `map'
In a stmt of a 'do' block:
... 
 ```

Thankfully there is a version of **map** with the kind of signature that we need:

	mapM :: Monad m => (a -> m b) -> [a] -> m [b]

<sup>*) Given a function taking a's and returning b's within m and an array of a's, give me the resulting array of b's, within the m context</sup>

Bingo, small change and here's the full program:

```haskell
module Main where

	import Graphics.UI.SDL as FX

	main :: IO ()
	main = do
	init
	canvas <- FX.getVideoSurface
	mapM (fillDo canvas) [Rect x 25 50 50 | x <- [1..450]]
	delay 1000
	FX.quit
	where
		fillDo canvas rect = do 
		FX.fillRect canvas Nothing (Pixel 0)
		FX.fillRect canvas (Just rect) (Pixel 0xFFFFFF)
		FX.flip canvas
		init = do
		FX.init [InitVideo]
		FX.setVideoMode 640 480 32 []
```

So far I do not want to go full steam ahead and implement the **logic/render/repeat** thing, since, to be honest, I don't quite see where this is heading. Even so,  there is some potential looming for separating logic from rendering as the production of the rectangle *"path"* can be looked at independent of *IO*. 

### PS
we saved ourselves the "white smear" stage by adding that canvas cleaning code in the **fillDo** (*FX.fillRect canvas Nothing (Pixel 0)*)

  [1]: http://codeofrob.com/entries/learn-functional-programming-with-me---moving-the-square.html
  [2]: http://learnyouahaskell.com/starting-out#im-a-list-comprehension