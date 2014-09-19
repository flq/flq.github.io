---
title: "Atrocious Learnings of Haskell for Make Benefit of solving Math Problem"
layout: post
tags: [software-development, Haskell]
date: 2013-07-30 22:36:29
redirect_from: /go/225/
---

Monday evening's _original_ plan was to read up on [Concurrency stuff][1] in Haskell. Alas, the site was down. My focus shifted towards twitter and then to this tweet:
<blockquote class="twitter-tweet"><p><a href="https://twitter.com/search?q=%23Ruby&amp;src=hash">#Ruby</a> or <a href="https://twitter.com/search?q=%23Python&amp;src=hash">#Python</a>? If I could learn only one, which one would it be? <a href="https://twitter.com/search?q=%23twestion&amp;src=hash">#twestion</a></p>&mdash; Dennis Traub (@DTraub) <a href="https://twitter.com/DTraub/statuses/361919012088709120">July 29, 2013</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

So I did a Google Search on ruby vs. python and stumbled across [The Josephus problem, implemented in Perl, ruby and Python][2].

The Josephus problem is also [described in wikipedia (WP)][3] and boils down to a mathematical problem of permutation. If you don't feel like following the links, here's a short definition taken from WP:

>There are people standing in a circle waiting to be executed. The counting out 
>begins at some point in the circle and proceeds around the circle in a fixed 
>direction. In each step, a certain number of people are skipped and the next person
>is executed. 
>The elimination proceeds around the circle 
>(which is becoming smaller and smaller as the executed people are removed), 
>until only the last person 
>remains, who is given freedom.

### Challenge accepted

The following gist contains my attempt at finding a Haskell-based solution, followed by an implementation as found on the aforementioned Wikipedia-article.

<script src="https://gist.github.com/flq/6112258.js"></script>

As you can see, my solution is basically _atrocious_. It works, but it is wordy and has some troubles regarding getting the next person in line. To my defence, it was late Monday evening, and my first attempts did look somewhat similar to the clean solution, but I didn't manage the final leap.

What the shown solution does is **providing a function that, through _unfolding_ generates a list of survivors until the list of dead people has grown to the original total of people minus 1 - the remaining survivor must be the final one**

Compare that to the solution provided from **line 32** onwards. The key to the understanding is the function
	
	killnext :: Int -> [a] -> [a]
    killnext k people = take (length people - 1) (drop k (cycle people))

let's try it with k = 4 and 5 people...

	k = 3
	people = [1,2,3,4,5]
    take 4 (drop 3 (cycle [1,2,3,4,5])) => 
	take 4 [4,5,1,2,3,...] 	=>
	[4,5,1,2]

So, in the next run, it gets called with the list of people that were obtained through the previous run:

	k = 3
	people = [4,5,1,2]
    take 3 (drop 3 (cycle [4,5,1,2])) => 
	take 3 [2,4,5,1...] 	=>
	[2,4,5]

Still 3 guys left...another go!

	take 2 (drop 3 (cycle [2,4,5])) => 
	take 2 [2,4,5,2,4,...]
	[2,4]

Phew, almost there...

	take 1 (drop 3 (cycle [2,4])) => 
	take 1 [4,4,4,4,4,...]
	[4]

Finally the breaking condition of the recursion kicks in and **head [4] => 4**. Did our manual solving go correctly?

    *Josephus Data.List> lastSurvivor 5
    4
    *Josephus Data.List> josephus 5 3
    4

Hence, we have **4 lines of code** to solve the Josephus problem of which one line takes some work to be understood.

Trying to program in a functional language means that whatever experience you have in an *imperative language* (yes, C# is an imperative language) will only get you so far. Effective functional programming must be learned as much as any other form of programming. While I still don't have a systematic approach to solving a problem functionally, the process already feels quite different. 

In C# I lay out a structure of things that will collaborate towards a goal, a process which helps you and your brain drag along, happily converging towards a solution. Every line of code in a functional solution seems to require more effort, as it appears to convey more behaviour.

The next time I think I will try some testing framework in Haskell and see if I can also manage a piecewise approach towards a solution functionally. 
 

[1]: http://www.haskell.org/haskellwiki/Applications_and_libraries/Concurrency_and_parallelism
[2]: http://danvk.org/josephus.html
[3]: http://en.wikipedia.org/wiki/Josephus_problem