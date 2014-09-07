---
title: "cycling through a number range"
layout: post
tags: programming dotnet geekdom mathematics TrivadisContent C#
date: 2009-03-11 21:36:30
redirect_from: "/go/140"
---

What I really wanted to do was to play a round of quakelive. But right now, [quakelive](http://www.quakelive.com/) is down (well, it's Beta, isn't it?). Quakelive pointed me to their [twitter feed](http://twitter.com/quakelive). 

Next I wondered what other people are suffering from this outage and went to [twitterfall](http://twitterfall.com/), doing a search on "quake" and "quakelive". I found a completely unrelated entry on some Quake Engine [code review of their networking code](http://fabiensanglard.net/quakeSource/quakeSourceNetWork.php) (sweet) and at the end a cute little piece of code which I wanted to try in C# straight away. 

I hesitated, for my home PC has no Visual Studio. Alas, the trusty ol' csc is part of the .NET Framework runtime on Windows and after adding the relevant path to the %PATH% I was happily programming away with Notepad (by now you don't need syntax completion, do you? ;)

With the following code you can count up an index and let it roll over once it hits a limit and start with 0 again. Once you "get" the code you will understand that _limit_ can be any number of the form 2<sup>n</sup>-1...

`
int limit = 1; int count = 0;

while (true) {
  System.Threading.Thread.Sleep(300);
  Console.WriteLine(count);
  count = (count + 1) & limit;
}
`

It really isn't a big deal, but it's a nice reminder of binary arithmetics and if you are a performance geek (insert statement of premature optimization etc. here) you will like the fact that this counter is consistently faster than doing it with a modulo (%) operation. In fact, up to 4ms...repeating it 10'000'000 times. ;)