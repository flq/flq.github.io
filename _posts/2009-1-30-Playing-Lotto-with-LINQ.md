---
title: "Playing Lotto with LINQ"
layout: post
tags: dotnet geekdom TrivadisContent LINQ lotto
date: 2009-01-30 23:12:16
redirect_from: /go/138/
---

You know, they are once again going _craazy_ in Germany - The Lotto jackpot has swollen to a whopping 35 million. That's a lot of money, certainly enough to devote some of my time to the subject.

I was looking around the Internet whether I could get my hand on all the lotto drawings that happened in Germany. I found a file [here](http://home.snafu.de/mcs/lzorder.htm), which seems to contain all Saturday drawings. I cross-checked a few drawings with a different source [here](http://www.dielottozahlen.de/LOTTO/6aus49/zahlen.html) and it looks like these could really be the numbers. You can find other statistical analysis [here](http://www.tipptreffer.de/lotto/lottolangfrist.htm) as well. 

I took the file since it was quickly readable by a machine. I read each line into a structure called **Drawing**, containing the Date of Draw and an array of int containing the numbers. **Drawing** itself implements **IEnumerable&lt;int&gt;** which enumerates the contained numbers.

Once the file is read I have an array of Drawings. The first analysis I did was to see whether all Drawings had all 7 numbers (the **6 out of 49** and the _Zusatzzahl_, the additional number).

The used LINQ query looks like this:

<csharp>
var result = from d in drawings
             group d by d.Numbers.Count()
             into g select g;

foreach (var a in result)
  Console.WriteLine("{0} entries have {1} numbers", a.Count(), a.Key);
</csharp>

Which gave me...

`
36 entries have 6 numbers
2519 entries have 7 numbers
`

Ergo, a few entries had the _Zusatzzahl_ missing, but I can live with that. Next was a quick check which number is drawn most (and least)...

<csharp>
var result =
  from d in drawings
  from n in d
  group d by n
  into numbers
    orderby numbers.Count() descending
    select numbers;
</csharp>

The most popular number so far has been 32 (420 times), the least popular 13 (313 times).

Next question: Given your numbers, how lucky would you have been so far if you would have played every Saturday with the same numbers since 1955?

This query is a little bit lengthy because it contains the following information:

*   I want to see the numbers that were drawn
*   I do not want to see where I only would have had one or two correct numbers
*   If the combination was drawn only once I want to see which date that happened (better matches are more likely to have happened only once)

It's late, so maybe there is a more elegant solution, but I came up with this (please note that **nums** are the numbers typed in to be matched):

<csharp>
var result =
  from drawing in drawings
  let matches = drawing.Where(d => nums.Contains(d))
  where matches.Count() > 2
  let matchedNums = 
    string.Join(",",
      matches.OrderBy(i => i).Select(i => i.ToString()).ToArray())
  let elem = new {matches, matchedNums, drawing.DayOfDraw}
  group elem by elem.matchedNums
  into m
    orderby m.Key.Length descending
    let date = m.Count() > 1 ?
      "Various" : 
      m.FirstOrDefault().DayOfDraw.ToString("dd.MM.yyyy")
    select new
             {
               Numbers = "[" + m.Key + "]",
               Hits = m.Count(),
               DrawDate = date
             };
</csharp>

That provides a bit more fun. The output looks e.g. like this:

`
Enter your numbers:7,13,16,19,32,43
Numbers: [7,13,16,32,43] were drawn 1 times on 28.10.1978
Numbers: [13,16,19,32] were drawn 1 times on 20.08.1977
...
`

For the seriously awesome numbers 5,7,23,42 I can say that they were never drawn together. My wife played Lotto on Wednesday (**1: 140'000'000** ain't deterring her) with 7,13,16,19,32,43 . That one had 5 hits once...even so, it's 31 years ago.

I didn't get further today but I may try to pull off some other LINQies, see what else those numbers can tell us ;) So far, I can only say that if you win the Jackpot you are one lucky guy!