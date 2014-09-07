---
title: "FunSpIns - a recap of Rob Ashton's lessons - Das Intro"
layout: post
tags: programming Haskell fun-spin
date: 2013-09-17 21:49:28
redirect_from: "/go/230"
---

A few weeks ago I was considering following [Rob Ashton's footsteps][1] in learning functional programming by programming a game (Space Invaders, or **Fun**ctional **Sp**ace **In**vader**s** or **FunSpIns**, right? *le sigh*)
However, since I am currently digging deeper into Haskell, that would obviously become my weapon of choice. Looking at possibilities to get Haskell somehow produce something that would do something against an HTML Canvas led me to the [Haskell to JavaScript compiler][2]. However, the easy path stated that it would ideally need the GHC version 7.8. Let's have a look at my version...

![My version](http://i.imgur.com/XKfuMNi.png)

So I would be leaving Haskell mainstream. A bit much, and I laid the case to rest, even though the idea is not as [absurd as you may think][7]. Then I heard that a [Version 2.0 of a libsdl][3] would be coming out, apparently a full blown library to support game development on a number of platforms, and that Haskellians could now update their bindings. Then I also came across a [guy who had done a whole series on programming a game with haskell][4] and [SDL, (Simple DirectMedia Layer)][5]. 

Surely, I felt safe enough to get on with the idea, now that I would be able to concentrate on the programming and less on the fringes of getting **xyz** to run in context *a*. *Yes*, I also shower with warm water and prefer to smoke Cohibas. And yes, of course I am not the [first guy][8] to use SDL with Haskell, and not the [second guy][9] either. Either way, using a different rendering target than envisaged would be a nice motivator to try and get the game logic separated from the rendering. For potential future portability. You know, *theoretically speaking*.

The necessary incantations, provided you already have Haskell on your Linux, are

    sudo apt-get update
    sudo apt-get install libsdl1.2-dev libsdl-image1.2-dev libsdl-mixer1.2-dev libsdl-ttf2.0-dev
    cabal update
    cabal install SDL
    cabal install SDL-image

([cabal][6] is Haskell's package manager)

And with that, we are pretty much ready to tackle the stuff that comes...

> You will be able to follow the series through the [fun-spin][10] tag...

## Disclaimer

I am a functional programming noob. I may be more successful at doing a *GUI interface using visual basic to track the killers IP address*. I have years of imperative languages under my belt, and while we all know what delegates are, that LINQ are actually operations in the monad of Enumeration, that F# preferred to call them computational expressions, and how functional Javascript is, this Haskell stuff, even though it sometimes looks eerily imperative, has completely different underpinnings in terms of theory, philosophy and utter spoon bending, so *bear with me*.

  [1]: http://codeofrob.com/entries/learn-functional-programming-with-me---but-rob,-it-needs-to-be-more-composable.html
  [2]: https://github.com/ghcjs/ghcjs#haskell-to-javascript-compiler
  [3]: http://lists.libsdl.org/pipermail/sdl-libsdl.org/2013-August/089854.html
  [4]: http://www.animal-machine.com/blog/2010/04/getting-started-with-sdl-in-haskell/
  [5]: http://www.libsdl.org/
  [6]: http://www.haskell.org/cabal/
  [7]: http://jshaskell.blogspot.de/2012/09/pong.html
  [8]: http://abstractabsurd.blogspot.ch/2008/04/intro-to-sdl-with-haskell.html
  [9]: http://www.animal-machine.com/blog/2010/04/getting-started-with-sdl-in-haskell/
  [10]: http://realfiction.net/tag/fun-spin