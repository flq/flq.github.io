---
title: "Dealing with primitive obsession (this time: Measurements)"
layout: post
tags: programming dotnet TrivadisContent software-architecture patterns C# NMeasure
date: 2010-11-30 09:00:00
redirect_from: /go/192/
---

Jeremy Miller on Twitter pointed out a blog post that aged well, because it is valid information: “[Dealing with primitive obsession](http://grabbagoft.blogspot.com/2007/12/dealing-with-primitive-obsession.html)”. Have a go through. The basic thing is: Value Objects make your code expressive! ([Book of Greg, psalm 11](http://realfiction.net/go/191)).

Instead of having doubles and what-have-you floating around, introduce Zipcodes, or Money, or…Measures. This subject came up at a customer whose software has to deal with measurements. While they may not be moving towards this way to express measurements, I could not resist pushing the idea a bit.

Measures are essentially numbers with Units attached to it. Units are things like Kilometers, Meters, Seconds, and many many more. Try typing in “1 yard/second in miles/fortnight” in Google and you will find that “**1 (yard / second) = 687.272727 miles / fortnight**” 

Here you have already learned one interesting concept. Units can be compatible such that a Measure in one Unit is convertible to a measure in another unit without losing its meaning. Compatibility means that the **Physical Units **are the same. In the above example the physical unit of yard / second and mile / fortnight is **Length / Time**.

Basic mathematical operations are also applicable to Units. While addition and subtraction have no impact on Units (they are invariant under addition and subtraction), multiplication and division change a Unit:

*   If you multiply meter by meter you get a new Unit, m².  <li>If you divide meter by second, you get a new Unit with its own significance: velocity in m/sec 

Divisions may cancel out Units:

*   m * (inch / m) gives you the unit **Inch**  <li>m/sec * sec/m would give you no unit. 

The rules governing measures and units can also be expressed in software. The current result of this can be found at github as [NMeasure](https://github.com/flq/NMeasure). Let me give you some examples of how to use the stuff.

Any double is explicitly convertible to a Measure:
  <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:77cf52c5-f56a-4f1b-9dc8-98aabe850052" class="wlWriterEditableSmartContent"><pre name="code" class="c#">var m = (Measure)100;
m.Unit.IsDimensionless; //true</pre></div>

Any measure can be multiplied with Units:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:133db494-49ac-4229-a172-2c10da8e6cbd" class="wlWriterEditableSmartContent"><pre name="code" class="c#">var m = (Measure)100 * U.Meter;
m.Unit.Equals(Unit.From(U.Meter)); // true</pre></div>

U is a special Enum that contains numerous Unit names, while Unit is our actual Unit class.

Basic mathematical operations cause no troubles for NMeasure. Well, almost. For instance, it won’t let you add apples to oranges if you try:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:48db11c1-5d02-4fbc-bf58-842c63a83e7f" class="wlWriterEditableSmartContent"><pre name="code" class="c#">var m1 = new Measure(1, U.Foot);
var m2 = new Measure(1, U.Gram);
//"These measures cannot be sensibly added to a single new measure"
Assert.Throws&lt;InvalidOperationException&gt;(() =&gt; { var m3 = m1 + m2; });</pre></div>

But multiplication (and division) works:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:9a02b615-e422-4ac0-bb54-9cdb7d2d7479" class="wlWriterEditableSmartContent"><pre name="code" class="c#">var m1 = new Measure(6.0, U.Meter);
var m2 = new Measure(2.0, U.Second);
var m3 = m1 / m2;
 m3.Value.IsEqualTo(3.0);
 m3.Unit.IsEqualTo(U.Meter.Per(U.Second));</pre></div>

Of course, the nice stuff is converting, and especially converting without having to write a conversion function between every conceivable conversion. Check out this Unit test that shows part of the Technical DSL to describe Units, their specifics and their conversions:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:1bef7c26-36c3-4cf2-a64e-0b295f3db265" class="wlWriterEditableSmartContent"><pre name="code" class="c#">AdHocConfig.Use(c =&gt; c.Unit(U.Millimeter)
    .IsPhysicalUnit(U._LENGTH)
    .StartScale()
    .To(U.Centimeter, 10)
    .To(U.Meter, 100)
    .To(U.Kilometer, 1000));
var m = new Measure(1.0, U.Kilometer);
var m2 = m.ConvertTo(U.Millimeter);
m2.Value.IsEqualTo(1000000);</pre></div>

The conversion bit is still work in progress, but as you can see, the rules of calculating with measurements are becoming transparent and explicit!