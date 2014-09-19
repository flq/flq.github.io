---
title: "How much Haskell can I squeeze out of C#?"
layout: post
tags: [programming, dotnet, Haskell]
date: 2007-05-10 10:52:25
redirect_from: /go/84/
---

You know all this talk about a new language every year and that it should be something different, etc. Since functions are playing a more & more important role in C#, I thought that it would make sense to have a look at a language that has been functional all along: [Haskell](http://www.haskell.org/haskellwiki/Haskell). Well, I do not want to bore you with introductory details, of which there are enough on the web.

I should make clear that my understanding of Haskell at this point is pretty limited. The notion of immutable things and no program flow as you'd normally expect really tickles my philosophic nature but considerably reduces the applicability of my programming wisdom learned out there in the field.

Still, I have played enough with Haskell now to see a dim light at the end of the tunnel - I will try and grog some more of Haskell's secrets but already the playing around has inspired me to see how something that is like sliced-bread in Haskell could be brought to C#.

In Haskell you can do something like this:

`
scaleBy2 = concat . map (\x -> [x]++[x])
`

Well, it certainly isn't the greatest accomplishment of all time. What it does is this:

`
*Main> scaleBy2 [2.3,1.2]
[2.3,2.3,1.2,1.2]
*Main> scaleBy2 "hello world"
"hheelllloo  wwoorrlldd"
`

It takes an array and creates a new array that is doubled in length and contains every previous element twice in the same order (Note that a string in Haskell is an array of chars). We could debate about its usefulness, but the seriously nice think is the **dot **operator that combines any two functions, in this case the **concat **and **map **function. Let's look at their types...

`
*Main> :t concat
concat :: [[a]] -> [a]
*Main> :t map
map :: (a -> b) -> [a] -> [b]
*Main> :t scaleBy2
scaleBy2 :: [a] -> [a]
`

In each check, the resulting type of the last mapping is essentially the function's return type.

Hence **concat **takes an array of arrays, while **map **takes a function (a->b) that maps an array of a's to an array of b's. Having those totally generic symbols for types is Haskell's way of telling us that it doesn't particularly care what those As and Bs are, as long as it's all consistent. So, the **.** operator works because the output of the first function (**map**) equals to relevant input to the **concat **function. 

Also note that the Compiler understands the **scaleBy2** function well enough that it infers that the output type is the same as the input type even though the map function could map an array of one type to an array of another type. Wicked, man!

In the case of scaleBy2 for a <u>string</u>, the anonymous function provided obtains a **Char **for every x (every element in the array), which it encapsulates in an array (making it a string with length 1) and combines it with itself. The function therefore looks like that typewise: **Char->[Char]**. Therefore, once the function is applied to all elements, we have a new array of type **[[Char]]**, which works just fine for the concat that according to its type definition will return **[Char]**.

Haskell's elegance just shines through a bit here, how we can plug functions together to form more complex relations, and how wicked Haskell's type inference is in that it is clear about the fact that scaleBy2 can be applied to any array, be it  an array of chars, integers, tomatoes or pixels.

**&lt;Now, Can I have this in C#?&gt;**

Well, yeah, just now we have to build some infrastructure for it. In the light of the c# improving in every release when it comes to type inference I tackled this in the Beta1 of VS9 with .NET 3.5. However, the solution I came up in the relatively brief amount of time probably also works in C# 2.0, you'd just have to downscale the syntax a bit.

Attached you will find a zipped up solution which shows the code. The usage of the code looks as follows:

`
SimpleFuncCombiner<int> z = SimpleFuncCombiner<int>.Combine(DivideBy5, MultiplyByTwo, AddThree);
Console.WriteLine(z[5]);
`

This is the cheap version that combines functions that all have the same input and output value. Please note the despicable use of the indexer to make it look like you're calling a function. The type argument defines of what type in- and output are. There is also the _luxurious _version of combining functions where the output of one method call provides the input to the next call, which is more similar to Haskell's capabilities. Check out this example:

`
var newCombo = 
  new FuncCombination<string, int>()
    .Add<char[]>(StrToArray)
    .Add(ca => ca.Sum(c => (decimal)c))
    .AddFinal(d => (int)d);
Console.WriteLine(newCombo.Call("hi"));
Console.ReadLine();
`

The nice thing about this is that it is fully type-safe. Subsequent calls to **Add **will only allow to define a function whose input corresponds to the output of the previous add. The **AddFinal **returns the object which can then be called type-safe. The two type arguments on the **FuncCombination **sets up between which types this construction maps. Here I also used the **var **keyword - The classes involved make judicious use of generics and it would be silly not to let the compiler provide all the typing.

Sometimes you read unqualified comments on the web comparing this sweet var to VB6 horrid Var. They have absolutely nothing in common. var just means that you have to type the Type less. Or did you never think that lines like Customer c = new Customer() just accelerate RSIs?

Also interesting that in the case of using the **StrToArray** function, the compiler could not infer the relevant type arguments so that I had to explicitly specify it, which was not necessary for the lambdas. I would expect that this works better once the final version is out.

Anyhow, regenerating some of Haskell's behaviour has taught me quite a bit on Haskell's power. Providing said infrastructure did cost quite some effort and at one point which you will find easily in the code through the comments the infrastructure must leave the type safe scenario. I think the code explains it better but basically it is related to the fact that at any point you don't know the input type of the previous method (Well, of course you do, but you can't code it statically with this strategy [prove me otherwise]). While some object already exists, certain parameters, be it type or otherwise, only spring to life _afterwards_. They are unknown at the point of object creation. This makes a number of things that look almost simplistic in a functional notation rather tedious in the world of imperative programming in which C# undeniably lives. In Haskell, on the other hand, the complete problem domain is known in its completeness at any point in time. Can't quite believe it myself yet, but this small example tells some of that story.

However, there is a new way in C# to alleviate the issue of not knowing enough about the problem at a given point in time. The buzzword is _deferred execution_ and the [next post](/go/118) will show how this brilliant stuff makes implementing the infrastructure for the FuncCombinator as easy as Lego.

(Attachment in the next post...)

[![kick it on DotNetKicks.com](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://realfiction.net/go/117)](http://www.dotnetkicks.com/kick/?url=http://realfiction.net/go/117)