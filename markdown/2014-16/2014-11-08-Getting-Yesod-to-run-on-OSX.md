---
title: "Getting Yesod to run on OSX"
layout: post
tags: [programming,haskell]
date: 2014-11-08 22:53:13
---

Just so you know if you want to read on or not: [Yesod][5] is a web application framework written in Haskell, which obviously expects you to write stuff in Haskell.

Okay, um, there isn't much to say as the whole thing went pretty painless.

* Take some Haskell that runs on OSX. I chose [Haskell for OSX][1]. Follow the instructions until you can pop up a terminal and type ghci and are able to have some fun with haskell.
* Find the [quickstart guide][3] for yesod. It recommends to set up [stackage][2] for your system, which apparently is a safer version of hackage, the place where haskell packages live. Safe here means less likelihood of versioning issues i your package dependency chains.

And frankly, you can pretty much follow the quickstart guide word by word, there has been no apparent difference to setting this up on a Linux box.

While I was at it, I decided to install [SublimeHaskell][4] - For an optimal feature set it wants you to install a couple of Haskell packages. Take note that for some reason it couldn't find ghc-mod in the path even though I was able to call it from a terminal. However, there is a sublime package setting where you can provide additional paths to be considered...

```json
{
  "add_to_PATH": ["/Users/flq/.cabal/bin"]
}
```

Some of the steps surrounding cabal take quite some time, time will tell if this gets better considering that everything is now downloaded and built.

[1]: http://ghcformacosx.github.io
[2]: http://www.stackage.org
[3]: http://www.yesodweb.com/page/quickstart
[4]: https://github.com/SublimeHaskell/SublimeHaskell
[5]: http://www.yesodweb.com