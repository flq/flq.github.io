---
title: "I for one welcome my new Split overload"
layout: post
tags: programming dotnet TrivadisContent
date: 2007-08-14 15:07:51
redirect_from: /go/100/
---

It is amazing, it is incredible.

I have been programming C# / .NET for about 6 years and yet I have persistently spent too much time writing my **string.Split** method calls. I plea to forgive my rash hard-wiring of everyday code. Maybe I have lost an hour's worth of work over the years and some wear & tear on my hands!

For years I have believed that I have to pass in a char array to the string's Split method. Such code may look like this:

`
string s = "item 1,item 2,item 3";
string[] sArr = s.Split(new char[] { ',' });
`

It looks clumsy, I know. Alas, other developers are acting equally inefficient, sometimes alternating to this type of code:

`
string[] sArr = s.Split(",".ToCharArray());
`

Does it look better? Well, what about Split's signature then?

`
String.Split(params char[] separator)
`

The funny word is the **params** keyword. It simply means that you can feed the method as many arguments of type char as you wish, and the compiler will essentially do the work for you and put them all into an array of chars. In other words, it is absolutely sufficient to write code like this:

`
string s = "item 1,item 2,item 3";
string[] sArr = s.Split(',');
`

_Most ironic_ is the fact that I have been using exactly that method call all along, since the other overload of Split (checking on Framework 1.1) requires an additional int to state how many elements should be returned at maximum. Just that I spared the compiler the work of making an array for me.

Use the commenting for any bashing or indeed, consolation. I _know_ I'm not the only one out there acting that weird...

[![kick it on DotNetKicks.com](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://realfiction.net/?q=node/134)](http://www.dotnetkicks.com/kick/?url=http://realfiction.net/?q=node/134)