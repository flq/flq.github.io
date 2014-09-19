---
title: "How can I get rid of this goto?"
layout: post
tags: [programming, csharp]
date: 2009-09-24 22:01:33
redirect_from: /go/150/
---

Help! It's late and I don't see a good way to get rid of this goto construct:

`
private void advanceTheTimeCursor(
  Func<DateTime> nextTime, 
  Action uponSuccessfulAdvancement)
{
  loop:
    var t = nextTime();
    if (t > reference) return;
    uponSuccessfulAdvancement();
    pastToPresentCursor = t;
  goto loop;
}
`

I kinda like it, but somebody said somewhere gotos are considered harmful...