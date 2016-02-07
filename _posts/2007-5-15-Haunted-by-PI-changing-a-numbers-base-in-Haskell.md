---
title: "Haunted by PI - changing a number's base in Haskell"
layout: post
tags: [software-development, geekdom, mathematics, haskell]
date: 2007-05-15 21:15:28
redirect_from: /go/86/
---

I was looking back at [Christoph's ruby code](/go/113) and was thinking that by now I should be able to implement that algorithm in Haskell. Indeed, one of my solutions looks like that:

~~~haskell
out x
    | x >= base = foldl (++) [] $ map (\f -> out $ f x base) [mod,div]
    | x < base = digit
    where
        range = ['a'..'z']
        digit = [range!!(fromIntegral x)]
        base = fromIntegral $ length range
~~~

The digit to be output is a letter of the alphabet, so we are changing PI to a base 26 number system. Let's check it briefly: The **map** function maps one array to another. In this case the array consists of two functions, **mod** and **div**. mod returns the remainder of a division while div returns how often the divisor fits in the dividend.

In other words, the right-hand side of the dollar-sign (which is a symbol in Haskell to influence the binding power of functions and often simply aids in removing the need to put an expression in brackets) returns an array like `[out(mod x base),out(div x base)]`. **foldl** then gobbles it all up coming from the left. It kicks off with an empty array ([]), takes the first element and concatenates it (++) to said array, then takes the second element in the array and (++) it to what it already has, and...you get it. Btw, !! is the indexer operation to an array [1,2]!!1 gives us 2.

You may be wondering about two things:

1.  What is this **fromIntegral** stuff?
2.  Isn't the number that comes out backwards?


To the first: fromIntegral's type is

~~~
Main> :t fromIntegral
fromIntegral :: (Num b, Integral a) => a -> b
~~~

It's input is therefore an Integral. An integral, on the other hand, is an integer with "infinite" length. Yeah! I finally stumbled across a language that can do looong integers out-of-the-box.

Hence, using fromIntegral in that context gives the following signature for the function:

~~~
Main> :t out
out :: (Integral a) => a -> [Char]
~~~

It will get an arbitrary length integral and returns a String. Nice!
As to the second point...Let's marry the whole thing with some IO:

~~~
main = do
  myPi <- readFile "c:/pi/pismaller.txt"
  writeFile "c:/pi/tmp.txt" (out $ read myPi)
  piBackwards <- readFile "c:/pi/tmp.txt"
  writeFile "c:/pi/output.txt" (reverse piBackwards)
~~~

The **out** looks a bit lost there, but it does its job. You can see that at the end I turn around the string. Indeed, **out** spills out the rebased Pi backwards. Why? Well, the calculations for the last digits are finished first and so could in theory already be written out to the file. And you know what? That's just what Haskell does! Yeah, I know, you wouldn't really expect this, but on the other hand you think it could and it most probably will start to bind it all together.
Even so, all this is not desperately efficient. The program took about 35 mins on my T43 (inside a VM) for the 1MB version of PI. Even so, the memory footprint was relatively small and stayed constant, but dividing that darned large number so many times just took a while.

Well, _**I**_ am impressed! Not something you need every day, but a task that had me finished in C#.
