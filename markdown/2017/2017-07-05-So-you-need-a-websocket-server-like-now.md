---
title: "So you need a websocket server, like, now"
layout: post
tags: [programming, web]
date: 2017-07-05 10:00:00
---

So, you need a websocket server, like, now. Well, fear no more, here comes __[websocketd][1]__ to the rescue!

As it says

> WebSockets the UNIX way
  Full duplex messaging between web browsers and servers

And it's awfully simple to use. STDIN becomes your input, STDOUT is your output. In other words, any old console application can become a Websocket server.

I did my testing on the Windows Linux Subsystem (WLS). Just download the correct zip
from the website (Note that you also get the executable for Windows, but for WLS you need the 64-bit Linux variant).

Then I did

```bash
sudo-apt-get install fortune cowsay
```

and adapted the example bash script from the websocketd website a little bit:

```bash
#!/bin/bash
for ((COUNT = 1; COUNT <= 10; COUNT++)); do
  fortune | cowsay
  sleep 2
done
```

Just note that if you use an editor in Windows, you will have to make sure that your line endings are UNIX-style (in Sublime e.g. `View->Line Endings->Unix`).

Finally, write a little test website. Mine got a little more code, I'll tell you in a minute

{% gist flq/642eb18a1b205eccf64a62837c0b7fa4 test.html %}

The `gather` function collects the output from the socket server - this is because __websocketd__ sends and separates on newlines. Therefore every cow becomes a number of messages sent to the browser. Finally `append` writes out a `<pre>` block.

![](/assets/cowsay_websocketd.png)

What is presented as a bit of a joke nonetheless means that you can set up a websocket server _veeery_ quickly. Bear in mind that each connection spawns a process. That is, you have straightforward isolation, but this approach may not exactly scale to the millions of connections.

## PS

If you try this out on MS Edge, it will not work OOTB connecting to localhost. [This answer on SO][2] helped me out.


[1]: http://websocketd.com/
[2]: https://stackoverflow.com/a/32767256/51428