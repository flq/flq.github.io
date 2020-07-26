---
title: "FunSpIns - Drawing a Rectangle"
layout: post
tags: [programming, haskell]
date: 2013-09-18 14:00:00
topic: "fun-spin"
---

<TopicToc topicId="fun-spin" header="Functional space-invaders series" />

> Inspired by Rob Ashton's series "[Learn functional programming with me][1]"

It probably *is* a good idea to introduce to some basic syntax:

A Haskell function call:

    letme "die" "twice"

Here, *letme* would be the function, whereas the remaining parts would be arguments passed to it.

A Haskell function definition:

```haskell
letme:: String -> String -> String
letme x y = x ++ " " ++ y
```

In Haskell, Types are **sooper-important**. In this example we have specified the signature of the function explicitly. 
As a sidenote, we don't have to do that, in this case Haskell would have inferred the following signature:

```haskell
*Blog> :t letme
letme :: [Char] -> [Char] -> [Char]
```

*) <sup>btw, this is taken from the ghci the interactive way to talk with Haskell.</sup>

Huh, not as generic as we thought, how come? - Reason's the **" "** in the function definition. Anyway, on to other stuff.


Assuming you got Haskell ready to talk to SDL (see previous post in the fun spins series), we need to think about how to draw a rectangle.

Drawing a rectangle certainly is IO, hence that kind of thing will have to happen in Haskell's IO context. In that context it is a fairly OK thing
to have an entry point - leering a bit at animal machine's series, we can get us a nice lil' entry point:

```haskell
    module Game where
    
      import Graphics.UI.SDL as SDL
    
      main :: IO ()
      main = do
       SDL.init [SDL.InitEverything]
       SDL.setVideoMode 640 480 32 []
       SDL.setCaption "Draw Rectangle"
       eventLoop
       SDL.quit
       print "done"
     where
       eventLoop = SDL.waitEventBlocking >>= checkEvent
       checkEvent (KeyUp _) = return ()
       checkEvent _ = eventLoop
```
 
Woa, OK - main is a thing that runs in an IO context and returns nothing ( hence the **()** ). 
**>>=** has a type definition of

    Monad m => m a -> (a -> m b) -> m b

Which reads along the lines of

> Given some thing of type **a** running in a **context** and a function that accepts something of type a and returns some type **b** running in the **same context**, get me the result of said function, wrapped in that context we mentioned.


I doubt that this helps you, for now it doesn't help me a lot, but I think it is pretty clear what *effect* the code has. We have ourselves a nice event loop which I am sure will come in handy later on. 

So, what about that frikkin' rectangle?

```haskell
module Main where

    import Graphics.UI.SDL as FX

    main :: IO ()
    main = do
        FX.init [InitVideo]
        FX.setVideoMode 640 480 32 []
        canvas <- FX.getVideoSurface
        FX.fillRect canvas (Just (Rect 25 25 100 100)) (Pixel 0xFFFFFF)
        FX.flip canvas
        eventLoop
        FX.quit
    where
        eventLoop = FX.waitEventBlocking >>= checkEvent
        checkEvent (KeyUp _) = return ()
        checkEvent _         = eventLoop
```

Paints us a **white rectangle** at position **25,25** with a width and height of **100** pixels.

### A word on running the program

You can either

* start ghci and then type **:load game**, where your file is called game.hs, or 
* use the compiler like **ghc -o game game.hs** 


  [1]: http://codeofrob.com/entries/learn-functional-programming-with-me---drawing-a-square.html