---
title: "Revisiting the Alphabet Range with the latest .NET"
layout: post
tags: programming dotnet TrivadisContent LINQ
date: 2008-01-19 22:58:48
redirect_from: "/go/112"
---

While Richard Bushnell was showing off how old problems can be [implemented very concise with LINQ](http://richardbushnell.net/index.php/2008/01/18/using-linqpad-to-create-a-time-selector-drop-down-list/) he also made use of an extension method to the int Type.

It has been quite some time since I did an update to the [.NET goodies](/?q=node/54). In there there was an implementation to be able to iterate over the letters of the alphabet.

Extension methods and LINQ allow the provision of a concise implementation that can be easily used to obtain character ranges over the alphabet.

`
static class CharStuff
{
    static char[] content =
        new char[] {
            'a','b','c','d','e','f','g',
            'h','i','j','k','l','m',
            'n','o','p','q','r','s',
            't','u','v','w','x','y','z'
        };

    public static char[] To(this char start, char end)
    {
        char[] space = content;
        char[] boundaries = new char[] { start, end };
        if (start > end)
        {
            space = content.Reverse().ToArray();
            // start, end = end, start; GRR, why not like in Ruby?
            boundaries = boundaries.Reverse().ToArray();
        }

        var result = from c in space
                     where c >= boundaries[0] && c <= boundaries[1]
                     select c;
        return result.ToArray();
    }
}
`

Most code deals with the ability to get an array with alphabet elements ordered backwards. I.e. you can use this extension like that:

`
Array.ForEach('f'.To('l'), Console.WriteLine);
Array.ForEach('l'.To('a'), Console.WriteLine);
`

Far from being feature complete, all those examples just show that Microsoft is doing something right: We are writing less lines of code that are more readable in order to get things done.