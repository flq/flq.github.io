---
title: "Where is the house"
layout: post
tags: [fsharp,ionz]
date: 2016-02-04 21:55:02
---

After quite some time there were lifesigns from Eric Lippert, whose blog output
is usually a great pleasure to read and understand.
[He is embarking][1] an an adventure to write a so-called Z-machine with the following
constraints:

* Written in OCaml
* Embracing functional programming (e.g. immutability, side-effect-free functions,...)

As far as my understanding goes OCaml is F#'s mother, syntax-wise, and me, looking
for an excuse to have some fun with F#, thought _ok, I'll go along, see how far I get_.

For trodding along on my MBP I am using the atom editor with the [ionide plugin][2].

The page explains pretty well the steps you need to do. On OSX it is a good thing if you've got __brew__ such that you can do `brew install mono`.
This will also bring F# onto the system, which should then be available on the path (and to the plugin). Bear in mind that the main executables are called slightly different to their Windows counterparts. You get

* fsi -> fsharpi
* fsc -> fsharpc

If you have npm on your system it is also very nice that there is a project generator (_fsharp-project_) available under [yeoman][3] - it can generate you the basic structure of your project with all the goodies that the F# community has come up with, things like FAKE and Paket..

The code created will be available in [runnable form on github][4], and I will introduce a tag after every post in case anybody cares to go back to a specific commit associated with a blog post.

Coming to Eric's [second post][5], the method to get the top bits of a 16-bit word looks...very similar, just that
in F# we have operators that look a bit like their C-style counterparts.


~~~fsharp
let fetch_bits high length word =
  let mask = ~~~ (-1 <<< length) in
  (word >>> (high - length + 1)) &&& mask
~~~

[1]: http://ericlippert.com/2016/02/01/west-of-house/
[2]: http://ionide.io
[3]: http://yeoman.io
[4]: https://github.com/flq/ionized-z-machine
[5]: http://ericlippert.com/2016/02/03/north-of-house/#more-3446
