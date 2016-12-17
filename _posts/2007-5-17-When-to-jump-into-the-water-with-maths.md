---
title: "When to jump into the water - with maths"
layout: post
tags: [loosely-coupled, mathematics]
date: 2007-05-17 20:32:05
redirect_from: /go/88/
---

I once heard that with the following problem dogs had less of an issue than many distinguished people of the human race.

Consider the following: There is an object in the water at some distance from you. You have a number of choices of how to get there. You could jump straight into the water and swim all the way, or you could run along the shore until the distance to the object is shortest and then jump in. What would you do? Well, as always the truth is somewhere in between! The following pic should illustrate the setup that will be used for this brief Mathematical analysis:
![](/public/assets/watermath1.gif)  

You can see that the distance to the object is given as K1 and K2 while the respective velocities with which you can manage those distances are v1 and v2. I will express the point where you jump into the water as x (such that the distance travelled along the shore is x*K1). Furthermore I will use some ratios, namely z and r as the ratio of the velocities on land and in the water and the ratio between the distance along the shore and the distance from the shore straight to the object in the water, respectively.
![](/public/assets/watermath3.gif)  

Since velocity is distance travelled over time, we will get the time as distance travelled divided by velocity. Now we are equipped to express the total time it takes from your position to get to the object in the water:
![](/public/assets/watermath2.gif)  

The function that gives us the total time does indeed provide us with a position x somewhere between your origin posn. and the point that faces straight the object in the water where you will reach said spot quickest. Thing is, since on land you're usually much quicker than in the water, the shortest distance (jumping right into the water) isn't necessarily the quickest route. Now, when we hear that the function giving us the total time spits out the point at which the total time is lowest, we think local minimum and we have to think of a derivation. After all, when the derivative is 0, the function has a minimum or maximum at that point. So, differentiating (with the aid of the chain rule) gives us:
![](/public/assets/watermath4.gif)  

Such that we can find the least amount of time spent on the way with this equation:
![](/public/assets/watermath5.gif)  

After some fiddling (and man, I've gone bad in Maths, took me 3 attempts to get it right) you get the following polynomial:
![](/public/assets/watermath6.gif)  

For this sort of thing, maths has a simple equation that for a polynomial of the form a*x<sup>2</sup>+b*x+c you can get values for x where the equation gives us a 0 result:
![](/public/assets/watermath7.gif)  

When we stick in the values of the found polynomial in this equation and after more fiddling (*sigh* I told you I was better with this once..?) you arrive at this one here:
![](/public/assets/watermath8.gif)  

So roughly, the quicker you are on the land, the more you should walk along the shore, but it depends on the distance, really. In such a situation it is probably best to fire up your Internet and visit the small Javascript calculation form down here. If you have a slow connection and the guy in the water is drowning, do a good guess. Even better, though, would be to check out what your dog does!

<script language="javascript">
function calculate() {
  var inputs = {
    k1 : parseFloat(document.getElementById('k1').value),
    k2 : parseFloat(document.getElementById('k2').value),
    v1 : parseFloat(document.getElementById('v1').value),
    v2 : parseFloat(document.getElementById('v2').value),
    x : parseFloat(document.getElementById('x').value),
    z : function() { return this.v2/this.v1; },
    r : function() { return this.k2/this.k1; }
  }

  var results = {
    ttotal : function(i) {
      return ((i.k1*i.x)/i.v1)+(i.k1/(i.v1*i.z()))*Math.sqrt(Math.pow(1-i.x,2)+Math.pow(i.r(),2));
    },

    bestx : function(i) {
      return 1+(i.z()*Math.sqrt(Math.pow(i.r(),2)*(1-Math.pow(i.z(),2))))/(Math.pow(i.z(),2) - 1);
    }
  }

  document.getElementById('result').innerHTML = 'In this scenario, it takes ' + 
  results.ttotal(inputs) + 
  ' seconds to get to the object. Ideally you would jump in at an x of ' + 
  results.bestx(inputs);
}
</script> <table border="0"> <tbody> <tr> <td valign="top" width="10%">K1 in metres:<input id="k1" value="12">
K2 in metres:<input id="k2" value="12">
</td> <td valign="top" width="10%">v1 in m/sec:<input id="v1" value="2">
v2 in m/sec:<input id="v2" value="1.2"> </td> <td valign="top">x (x*k1 between 0 and 1):<input id="x" value="0.8">
<input onclick="calculate();return false;" value=" calculate " type="button">  

<h2 id="result">result</h2>
</td></tr></tbody></table>