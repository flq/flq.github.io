---
title: "NMeasure and the global warming"
layout: post
tags: [physics, own-software, dotnet, site]
date: 2015-12-30 22:43:09
---

About 5 years ago I started work on a library that helps in dealing with measurements because a client 
was falling for [primitive obsession][1]. Follow the link to read what it's all about. Some details
are not 100% correct anymore but in general it still serves well.

After figuring out with MemBus that producing nuget packages has become an incidental activity, I wanted
to revive that dormant library, give it some love and dogfooding it a bit to myself.

The result is [NMeasure][2], which has been used for the following example calculation.

You may have heard about the global warming summit and that scientists have basically agreed with each other
that we should try really hard to avoid the atmosphere to heat up an additional 2 degrees on average. It doesn't sound much,
but I was curious what this number means in terms of additional energy that the atmosphere would contain.

Before we carry on...

### Disclaimer:

* The produced number is pretty much a ballpark figure, because
* We assume Earth to be a flat sphere (not too bad)
* We only consider the volume from 0-2km above sea level
  * at constant density (that will introduce an error in the 2-digit percentage range)
* We deal purely with averages (coming from a uniform temperature to a new uniform temperature)
* The calculated energy is not freely available as such, it is just to give you a feel for what is at stake.

### On we go

The calculation has been kept pretty straightforward:

* We take the volume of the low atmosphere
* We look up the [specific heat of air][3] in the proper temperature range (assuming today's average temperature of 14°C) with constant volume. 
* We multiply it all through and get a number.

The calculation is shown in the following gist with the aid of NMeasure:

{% gist flq/aaf315d162e7394865b4 Program.cs %}

NMeasure profits *a lot* from C# 6's ability to use static members of a type (see line 4). The units used
are static properties of the type *U* (e.g. U.KiloMeter) and it is really tasty to be able to use the units as shown in the 
program.

Line 13 ensures that a lot of conversions dealing with SI and Imperial units are known to NMeasure. Yes, Units and conversions
are not hard-coded, you need to set them up before you start using NMeasure. That way, you are free to introduce your own
measurement units<sup>*)</sup>.

With regard to the available operators: Only when I found some odd behaviour around operator precedence did it occur to me
that the *^*-operator is a bitwise operator in C# and has usually nothing to do with the mathematical operation 
*x to the power of y* - I've left it in, though, since it is used like that in numerous other languages. The disadvantage
is that in C# the operator has even lower precedence than addition/subtraction, which makes some silly brackets necessary.

Once the calculation is performed we arrive at this number:

    1.795E+12 GJ
  
of additional energy available in the atmosphere. 
Sounds quite a lot, and it is. If we compare this to the [World's energy production][4] we see that in order to make
this amount of energy available, our current energy production would have to run for about *21 years*.

Of course this energy isn't freely available in full, but it adds a lot more dynamics to any transient phenomena occurring
in the atmosphere, i.e.

* changes are quicker
* frequencies get higher
* amplitudes grow

Here we are, one incoherent blog post further, probably none the wiser - but at least I could scratch two itches at once!

### *)

A long time ago I was crazy enough to construct a unit system for a species appearing in some of my Sci-Fi stuff. I extracted
it from an old Excel-sheet of mine into a test harness:

{% gist flq/aaf315d162e7394865b4 IiUnitTests.cs %}

[1]: /2010/11/30/dealing-with-primitive-obsession-this-time-measurements
[2]: https://www.nuget.org/packages/NMeasure/
[3]: https://www.google.de/search?q=specific+heat+air
[4]: https://en.wikipedia.org/wiki/List_of_countries_by_electricity_production
