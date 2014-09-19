---
title: "Useful Extension Methods for Points and friends in WPF"
layout: post
tags: [programming, libs-and-frameworks]
date: 2010-10-11 16:30:00
redirect_from: /go/185/
---

Every once in a while you may be down to low-level element calculation and placement of elements in WPF. For this situation, I have found the following extension methods quite useful:

### Translating a point
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:facf6c1b-2a27-4f03-8419-42e848242b43" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public static Point Translate(this Point p, Func&lt;Point,Tuple&lt;double,double&gt;&gt; translateFunction)
{
    var points = translateFunction(p);
    return new Point(p.X + points.Item1, p.Y + points.Item2);
}

public static Point Translate(this Point p, Vector translation)
{
    return p.Translate(po =&gt; Tuple.Create(translation.X, translation.Y));
}

public static Point Translate(this Point p, double xOffset, double yOffset)
{
    return p.Translate(po=&gt;Tuple.Create(xOffset, yOffset));
}

public static Point TranslateX(this Point p, double xOffset)
{
    return p.Translate(xOffset, 0);
}

public static Point TranslateY(this Point p, double yOffset)
{
    return p.Translate(0, yOffset);
}</pre></div>

The first method is a low level application of a double-tuple as offset to a given point. All others use this method to create a new point from an old point and some additional info. Some examples:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:e74055e9-3855-4599-b776-fe59dc3fabdc" class="wlWriterEditableSmartContent"><pre name="code" class="c#">var p = new Point(0,0);
p2 = p.TranslateY(10); //10 pixels to the right
p3 = p2.Translate(10); //New point at 10,10
p4 = p3.Translate(new Vector(10,10)); //New point at 20,20</pre></div>

### Point Sources

A point source is an object that implements IEnumerable&lt;Point&gt;. One type of Poiint Source I have used is one that takes a seed point and to which you can provide a function how to get from previous to the next point. the following example uses this class to be able to iterate over equal-spaced points along the vertical axis:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:49c08465-1cd6-49d0-8940-20a2871ef835" class="wlWriterEditableSmartContent"><pre name="code" class="c#">var psource = new PointSource(new Point(10, 10), p =&gt; p.TranslateY(10));
var points = psource.Take(5).ToArray() // 10,10 ; 10,20 ; 10,30 ...</pre></div>

By entering the IEnumerable realm, you open your code to all the shiny LINQiness there is out there.

### Arcs and the like

In WPF you can work with vectors and matrices. That gives you a nice base to implement a “Rotate” method:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:126bfd5d-6b0c-4fba-8415-c7fa77b0609f" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public static Vector Rotate(this Vector origin, double angle)
{
    var cos = Math.Cos(angle);
    var sin = Math.Sin(angle);
    var rotationMatrix = new Matrix(cos, -sin, sin, cos, 0, 0);
    return origin * rotationMatrix;
}</pre></div>

In combination with a different point source that takes an IEnumerable&lt;T&gt; and provides a conversion to an IEnumerable&lt;Point&gt; you can create arcs and circles of points quite easily:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:f9d7e2c5-f7d4-45d6-b08e-e5b2a151c766" class="wlWriterEditableSmartContent"><pre name="code" class="c#">var radius = new Vector(0.0, 10.0);
var angleToRadians = Math.PI / 180.0;
var midpoint = new Point(20,20);

var translationVectors =
  from step in Enumerable.Range(0, 360)
  let angle = step * angleToRadians
  select radius.Rotate(angle);

var ps = new PointSource&lt;Vector&gt;(translationVectors, v =&gt; midpoint.Translate(v));

ps.Take(45); // Gives 45 points over 45 degrees, each with a radius of 10</pre></div>

Note that above, you could also get the functionality by using the LINQ-Select on the list of vectors. Also note the lazy nature of all involved items. If you only need 45 items, that’s all that is calculated.

I am just thinking of putting this kind of stuff into a small library to help dealing with that low-level stuff, which can be useful for Custom arrangers and the like. I am wondering what else could be in that library…or maybe there is already one?