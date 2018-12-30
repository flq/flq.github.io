---
title: "An outsider's guide to gerrymandering"
layout: post
tags: [loosely-coupled, mathematics]
date: 2017-01-18 20:00:00
---

> <strong><em>(partisan)</em> gerrymandering</strong><br>
> manipulate the boundaries of 
> (an electoral constituency) so as to favour one party or class.

In case you've been wondering why a German starts trying to understand
US politics: It's a long story. Suffice to say that at this point I am 
not enjoying the current political situation in the West _at all_. The majority
of people is making it far too easy for those in power to stay there. 
Here's my attempt to understand one aspect of it: How a US law put into 
the Consitution in good will has been subverted by new capabilities in modeling,
statistics and data analysis.

To gain a first insight into **redistricting** I looked [into the writings][1] of
[Professor Justin Levitt][2].

Here is a list of concepts I required clarification about:

* **Federal** vs. **State** powers / laws.<br>
  Federal powers are those given to the US as a whole, while State powers refer to those
  given to each state. E.g. only federal powers allow to maintain an Army. The Federal Bureau
  of Investigation is an agency transcending states.
* The **US congress** is a federal institution consisting of
  * **The senate**: 2 representatives from each state, appointed for 6 years
  * **House of representatives**: 435 people, representing the states in proportion to their
    population. Each representative comes from a single **district** (For the concept of _gerrymander_ I will focus on 
    congressional districts).

For now it is enough to know that in order to drive legislation in the US, you need the congress.

Going back to **redistricting for congressional districts** there is one hard rule: 
The population should be **evenly distributed over all districts**.

Here is a very small example that nonetheless explains how it works: 
[Rig the election - with Math][3]. I have copied the layout over here.

![](/assets/gerrymander_setup.jpg)

Each square has the same amount of population, namely 1. 
The striped ones are in the minority. The aim is now to set up the districts 
of 5 people each in a way that the striped squares get the majority of disricts.
(When you get the district you get to send your representative to the Congress).
Not sure whether there are more solutions, but here is mine:

![](/assets/gerrymander_solution.jpg)

Now compare the popularity versus the congressional districts won:

![](/assets/gerrymander_result.jpg)

Pretty impressive! As [described here][4] I have used the following techniques 
to favor the striped party.

* packing: Try to put the opponent's majority centres into single districts.
* cracking: spread a voting block over many districts

Other helpful strategies seemed to be:

* Spreading out - Combine parts of voting blocks by making your district thin.
* Multiplying - Divide a strong voting block of yours such that you can win
more than one district with it.

The above article also presents a number of measures that attempt to highlight
whether a district has been tampered with.

As a final note I would like to point [out a text from 2012][5] which outlines that
gerrymandering has been done a lot more by the Republican party than the 
Democrats.

I am looking forward to seeing whether the US will be able to deal 
with this unfair advantage, since popular vote majorities by the Democratic party
will otherwise mean nothing in upcoming elections.

[1]: http://redistricting.lls.edu/where.php
[2]: https://en.wikipedia.org/wiki/Justin_Levitt
[3]: https://fivethirtyeight.com/features/rig-the-election-with-math/
[4]: http://www.ams.org/samplings/feature-column/fc-2014-08
[5]: http://election.princeton.edu/2012/12/30/gerrymanders-part-1-busting-the-both-sides-do-it-myth/