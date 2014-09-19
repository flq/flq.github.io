---
title: "Road to Reality - Continued Fractions"
layout: post
tags: [software-development, mathematics, Haskell]
date: 2007-06-03 17:34:26
redirect_from: /go/92/
---

Saturday my new book arrived - [The Road to Reality](http://www.amazon.de/Road-Reality-Complete-Guide-Universe/dp/0679454438/ref=pd_bbs_sr_2/303-4282147-1446639?ie=UTF8&amp;s=books-intl-de&amp;qid=1180890923&amp;sr=8-2) by [Roger Penrose](http://en.wikipedia.org/wiki/Roger_penrose). This is a much appraised book. The saying goes that it is somewhat too complex to be understood by the minds that, let's say, usually deal with stuff that has not much connection to the thought processes that lead to a mathematical understanding of our reality. Either way, it is meant to be a thorough introduction (it clocks in at roughly 1000 pages), does not shy away from maths, and is quite current when it comes to what we know about how the world is composed. I am still in the starting tracks and now came across the way that the ancient Greeks dealt with irrational numbers. You can obtain those by doing _continued fractions_.

A continued fraction looks e.g. like this:

1 + (2 + (2 + (2)<sup>-1</sup>)<sup>-1</sup>)<sup>-1</sup>

Knowing that x<sup>-1</sup> = 1 / x, one can see why this is a continued fraction. However, we have stopped here after 3 steps, while a true representation of the squareroot of 2 would be to carry on with the sequence indefinitely.

The great thing about maths is that interesting patterns emerge...to cite Penrose's book (related to how to calculate quadratic irrationals, i.e. those squares whose roots are irrational numbers):

> The sequence of natural numbers that defines it as a continued fraction has a curious characteristic property. It starts with some number A, then it is immediately followed by a 'palindromic' sequence (i.e. one which reads the same backwards) [...] followed by 2*A, after which the sequence [...] repeats indefinitely.

We can express this in Haskell (those Greeks would probably have loved my laptop. What a good life I could have lead. And yet, I'd have had to sleep lightly, who knows who'd have&nbsp;wanted to steal my magic screen. Not to speak that I don't know where I could get electricity at that time. But I'm deviating)

`
depth = 20
-- Create a sequence of the form 1/(a + 1/(b + 1/(c + 1/a)), etc. where a,b,c come from 
-- an infinite sequence where those 
-- a b c's repeat. "no" denotes how often you want to perform the recursion, which affects accuracy of the result
-- See Penrose pg 56, continued fractions
ctF x 1 = 1.0 / (head x)
ctF (x:xs) no = 1.0 / next
  where next = x + (ctF xs (no-1))

useSeq :: (Fractional a) => a -> [a] -> a
useSeq start x = start + ctF (makeSequence mySeq) depth
  where 
    makeSequence = concat . repeat
    mySeq = x ++ [2*start]

-- e.g. sqrt(2) = useReq 1 [2] 
-- sqrt(14) = useSeq 3 [1,2,1]
-- sqrt(15) = useSeq 3 [1]
-- sqrt(24) = useSeq 4 [1]
-- sqrt(23) = useSeq 4 [1,3,1]
-- sqrt(24) = useSeq 4 [1]
`

Haskell is just cool when it comes down to using infiniteness. We have inifinite lists, sequences, what have you. Naturally we have to ensure that at some point we get a result back, however the bail-out condition in the above code is the depth value that states how often we will perform a division.

By the way, one pattern appears obvious: (useSeq x [1])<sup>2</sup> = (x+1)<sup>2</sup> - 1 . You have got to love maths for that kind of stuff. Infiniteness reduces getting square roots of integers to a game of division.