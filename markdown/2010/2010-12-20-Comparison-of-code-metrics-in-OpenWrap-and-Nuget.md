---
title: "Comparison of code metrics in OpenWrap and Nuget"
layout: post
tags: [tools, libs-and-frameworks]
date: 2010-12-20 20:49:00
redirect_from: /go/194/
---

.NET needs package management. As an example, can you imagine ruby without ruby gems? Now you know what programmers in .NET land have to put up with to build projects on top of (very valuable and well written) OSS.

After such a long time it seems the time was ripe for .NET package management because now we are getting two<sup>*)</sup> , [NuGet](http://nuget.codeplex.com/) and [OpenWrap](https://github.com/openrasta/openwrap/wiki) :) ( :(, :/ , ??? )

I leave the exact analysis and evaluation of how, why and the ramifications of that to the hordes of internet historians and Twitter data miners.

Today I’ll just perform a small comparison by numbers of the 2 projects by using NDepend and running the minimum set of rules I laid out in my [previous post](/go/193) against them. I’ll try to keep comments on the numbers down to a minimum and even though I have a certain bias, I’ll try not to judge on those numbers. Plus, I’ll use HTML tables for the first time in ages, and nostalgia is a good thing this time of the year.
 <div class="alert"> 

### Disclaimer

Code metrics never tell the full story. Don’t take these numbers as the sole measure of code quality. There are many factors that influence structure and behaviour of code, e.g. while NDepend can do that, code coverage of the tests isn’t considered here, this is pure static code analysis. Any debate relying solely on the results presented here is by virtue of simple logic irrelevant. 
</div> <table border="0" cellspacing="0" cellpadding="2" width="100%"> <tbody> <tr> <td valign="top"> 

### OpenWrap (OW)
</td> <td valign="top"> 

### NuGet (NG)
</td></tr> <tr> <td valign="top">&nbsp;![OW_overview](/assets/OW_overview.png "OW_overview") </td> <td valign="top">&nbsp;![NG_overview](/assets/NG_overview_1.png "NG_overview") </td></tr></tbody></table> 

The above is a dependency view on the assembly level of the analyzed assemblies. OW.Commands contain the set of commands available to the Commandline interface. NG also contains a console project but it doesn’t show up in NDepend. In fact NG appears to contain the relevant bits towards a command line. Even so, the _Visual_ Studio integration plays a more prominent role in NG which is why I included the relevant assembly. Both projects have more assemblies that help them reach their respective goals but I think that those shown pretty much represent the core of the systems. The reference to S.CM.Composition is already a good indicator that NG targets .NET 4, which is indeed the case, while OW targets 3.5. 

Next is the global summary of the assembly analysis
 <table border="0" cellspacing="0" cellpadding="2" width="100%"> <tbody> <tr> <td valign="top"> 

### OpenWrap
</td> <td valign="top"> 

### NuGet
</td></tr> <tr> <td valign="top"> 

# IL instructions&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 58 004
# lines of code (LOC)&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 3 970
# lines of comment&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 291
Percentage Comment&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 6%
# Assemblies&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 2
# Namespaces&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 28
# Types&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 532
# Methods&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 3 472
# Fields&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 1 787
</td> <td valign="top"> 

# IL instructions&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 43 747
# lines of code (LOC)&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 4 633
# lines of comment&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 2 072
Percentage Comment&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 30%
# Assemblies&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 4
# Namespaces&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 22
# Types&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 369
# Methods&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 2 591
# Fields&nbsp;&nbsp;&nbsp; :&nbsp;&nbsp; 957
</td></tr> <tr> <td valign="top"> 

### Extracted globals
</td> <td valign="top">&nbsp;</td></tr> <tr> <td valign="top"># Types not Generated by Compiler (!GBC): 287
# Methods !GBC (includes get_, set_):&nbsp; 1735
# above excluding properties : 987
# method / property ratio: 1.32</td> <td valign="top"># Types not Generated by Compiler (!GBC) : 276
# Methods !GBC (includes get_, set_): 2125
# above excluding properties : 1194
# method / property ratio: 1.28</td></tr> <tr> <td valign="top">Calculated</td> <td valign="top">&nbsp;</td></tr> <tr> <td valign="top"># LOC / !GBC Types&nbsp; : ~14</td> <td valign="top"># LOC / !GBC Types&nbsp; : ~17</td></tr></tbody></table> 

The line counts tell us that both projects are pretty young. As a comparison: In my last large project NDepend measured about 50k lines of code at the end. 

NG’s code appears to be better commented and while line counts aren’t too far away, it is interesting to note that OW has about 44% more types than NG. However, if you exclude the types generated by the compiler the type count is remarkably similar. This suggests that OW makes heavy use of generated classes by e.g. using the yield statement (which will create Enumerator implementations in the background) or by using closures. 

You can find the full run of the reduced set of CQL queries [here for NuGet](/assets/nuget.htm), [here for OpenWrap](/assets/openwrap.htm).

Next table is a pure number comparison of some markers. The percentages are relative to the Types less those generated by the compiler (!GBC) or !GBC Methods including properties.
 <table border="0" cellspacing="0" cellpadding="2" width="718"> <tbody> <tr> <td valign="top" width="288">&nbsp;</td> <td valign="top" width="263"> 

### OpenWrap
</td> <td valign="top" width="165"> 

### NuGet
</td></tr> <tr> <td valign="top" width="288">Types &gt; 300 LOC :</td> <td valign="top" width="263">0 :)))</td> <td width="165">0 :)))</td> <tr> <td valign="top" width="288">Types with poor cohesion: </td> <td valign="top" width="263">5 (1.7%)</td> <td valign="top" width="165">6 (2.2%)</td></tr> <tr> <td valign="top" width="288">Efferent (outgoing) coupling:</td> <td valign="top" width="263">6 (2.1%)</td> <td valign="top" width="165">7 (2.5%)</td></tr> <tr> <td valign="top" width="288">Non-Abstract Afferent (incoming) coupling: </td> <td valign="top" width="263">9 (3.1%)</td> <td valign="top" width="165">0</td></tr> <tr> <td valign="top" width="288">Methods too big:</td> <td valign="top" width="263">21 (1.2%)</td> <td valign="top" width="165">8 (0.3%)</td></tr> <tr> <td valign="top" width="288">Methods too complex: </td> <td valign="top" width="263">18 (1 %)</td> <td valign="top" width="165">8 (0.3%)</td></tr> <tr> <td valign="top" width="288">Methods too many params: </td> <td valign="top" width="263">1</td> <td valign="top" width="165">2</td></tr> <tr> <td valign="top" width="288">Too many overloads: </td> <td valign="top" width="263">0</td> <td valign="top" width="165">7</td></tr> <tr> <td valign="top" width="288">Potentially unused methods: </td> <td valign="top" width="263">15 (0.9%)</td> <td valign="top" width="165">104 (4.9%)</td></tr></tbody></table> 

Jut by looking at those numbers I was surprised some people where sniffing at NuGet code quality. It sure also has ugly places, but the top method offender in terms of length in OpenWrap also is a nasty son to look at. Some consolation is offered by the corresponding class summary from Sebastien: 
 > “I publicly apologize to the procedural nature of this class. It is evil and as with all things evil should be redesigned at some point.” 

– OK! A known evil is not quite as bad as an unknown one!

Ironically, the most complex OpenWrap function deals with NuGet package versioning.

Btw, NuGet will be offering internationalization, methinks. Let me state it publicly: I have a hard time with localized programming tools. Every time I get a localized error message I cringe, because Google will not be able to help me. Anyway, it’s probably something personal. There must be a market for that.

What I cannot gather by numbers is the relationship of _good design vs. most important parts_. The numbers give you an overall feeling how code quality is going in the respective projects, but if important bits are designed badly while all the rest looks good, the project is pretty useless in itself.

In terms of trying to understand what goes on I have only looked into OpenWrap so far. The code feels alright in many parts. It would be interesting to hear about NuGet experiences.

&nbsp;

*) I also delved into the subject with [bin4net](/go/157) but abandoned the POC, considering a popular name went into the task. Still like the idea of using torrents to have a fully decentralized repository, though :)