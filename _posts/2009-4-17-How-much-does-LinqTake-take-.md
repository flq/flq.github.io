---
title: "How much does Linq.Take take?"
layout: post
tags: [dotnet, libs-and-frameworks]
date: 2009-04-17 14:23:47
redirect_from: /go/143/
---

I wasn't 100% certain how much the "Take" would take from a list with less elements than the number you want to take. It probably says in the docs, but let me assure you that this test succeeds:

<csharp>
[Test]
public void TakeTakesAsMuchAsThereIs()
{
  string[] stuff = {"hi"};
  var l = stuff.Take(3).ToList();
  Assert.That(l, Has.Count(1));
}
</csharp>