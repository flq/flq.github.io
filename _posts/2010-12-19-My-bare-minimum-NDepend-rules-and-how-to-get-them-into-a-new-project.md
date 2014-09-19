---
title: "My bare minimum NDepend rules (and how to get them into a new project)"
layout: post
tags: [software-development, tools]
date: 2010-12-19 21:37:00
redirect_from: /go/193/
---

When you run an Ndepend anylsis over a project you will notice a certain tendency of the Code Queries (CQL) to overwhelm you. By default NDepends comes with a lot of queries against your code that can help you to have an eye on code quality metrics.

After having used NDepend for some like, I like to keep a bare minimum of rules around that I deem really important…

![Capture](/public/assets/Capture.png "Capture") 

*   A large type (currently LOC &gt; 400 or IL Instruction&gt; 2500) is most likely doing too much.Doing too much?
It means there are too many reasons why a type may change
*   A cohesive type is ideally one where all instance fields are used by all methods. If we are getting poor cohesion it is again a sign that a type is doing too much.
*   Outgoing (or efferent) coupling is a metric that states how many other types a type is using. Coupling is in general a pretty bad thing. While without any coupling obviously nothing happens, excessive coupling does what it also does in nature: It reduces degrees of freedom. I n programming those are usually needed for the ability to change code without breaking too much.
*   Afferent (or in coming) coupling is the opposite direction. How many types are using this type? Having a high number here doesn’t necessarily mean a bad thing. Which is why the version here is weakened and will not look at afferent coupling in abstract types and interfaces.
*   Next one only starts warning after a certain point. This is less of a pain point but more of a having things clean type of attitude.
*   Things that can be private should be private. You can’t couple from the outside to things that are private. Even when you don’t, a maintainer may not know if somebody is using that which could be private from the outside. 

![Capture2](/public/assets/Capture2.png "Capture2") 

*   A large method is bad news in terms of maintainability. Probability of a bugs increase with method size, and most likely not linearly.
*   A complex method is even worse. Many methods will actually appear in both metrics, as a large one is probably complex. Complexity refers to cyclomatic complexity: if, switch, else foreach…
*   Methods with many parameters are unwieldy, difficult to use, refactor and is a sure sign of procedural programming
*   The next one is debatable but my personal experience is that too many overloads cause problems. Extending becomes difficult, you can have strange side-effects and some parameter class may be missing.
*   Potentially unused methods is something to be aware of. They may be used in a refactoring / dynamic scenario, but some of them may be remnats of other times.
*   Again, things that can be private should be. Not many things manage to make me frown as well as excessive use of get; set on properties where the set is only used in private. This is bad, don’t do it!
*   Afferent and efferent coupling also exist on a method level. While big and complex methods are most likely going to have high efferent coupling, afferent gets its own metric. It may not be a bad thing that a method has high afferent coupling, but it could mean that there is a type missing or something else that can break apart the pile of coupling that is mounting up. 

![Capture3](/public/assets/Capture3.png "Capture3") 

*   I love readonly fields. They tell me straight away that they are immutable things, invariants of some instance. This really helps keeping complexity under control
*   Public fields are definitely strange and should be looked at 

&nbsp;

I haven’t seen a simple way to get my own set of CQL queries into an NDepend project, so here’s what I do to get them into a new project.

*   An NDepend project file is an XML file. I extract the node containing the CQL Queries and store it in its own file.
*   The following Powershell function will then inject that file into some other NDepend project: <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:5a7b9c19-23ca-47bc-b1db-44e5b14a8073" class="wlWriterEditableSmartContent"><pre name="code" class="js">function ReplaceNode([string]$projectName) {
  $here = pwd
  $xml = New-Object -TypeName System.Xml.XmlDocument
  $xml.Load("$here\$projectName.ndproj")
  $oldNode = $xml.SelectSingleNode("/NDepend/CQLQueries")

  $xml2 = New-Object -TypeName System.Xml.XmlDocument
  $xml2.Load("C:\dotnet\bin\NDepend Support\CQL.xml")
  $newNode = $xml2.SelectSingleNode("/CQLQueries")
  $imported = $xml.ImportNode($newNode,$true)
  $oldNode.ParentNode.ReplaceChild($imported,$oldNode)
  $xml.Save("$here\$projectName.ndproj")
}</pre></div>

It assumes you are in the directory that contains your new NDepend project, requires you to enter the name and has the location of your CQL queries hard coded.