---
title: "PI Revisited - again!"
layout: post
tags: [programming, geekdom, mathematics]
date: 2007-04-11 20:11:02
redirect_from: /go/80/
---

What Andre's link [caused](/go/92)...

One idea that came up from a former colleague of mine, Christoph was to rebase the number PI to 27, allowing for a presentation in the form of letters of the alphabet. His first tackle at this was written in ruby:

`
pi = 14159265358979323846264338327950288419716939937510582097
494459230781640628620899862803482534211706798214808651328230
664709384460955058223172535940812848111745028410270193852110
555964462294895493038196442881097566593344612847564823378678
316527120190914564856692346034861045432664821339360726024914
127372458700660631558817488152092096282925409171536436789259
0360011330530548820466521384146951941511609
alphabeth = []
"a".upto("z") { |x| alphabeth << x}
base = alphabeth.length
text = []

begin
  pi, rest = pi.divmod(base)
  text << alphabeth[rest]
end until pi.zero?
puts text.reverse.join
`

A nice way to express what is also presented [here at wikipedia](http://en.wikipedia.org/wiki/Hexadecimal#Converting_from_other_bases).

After doing some research as to how I could rebase arbitrarily large numbers, my search was suddenly halted by a uber-geek page. Once more I had to accept that whatever silly way to waste your time you come up with, someone has done it before you, and even added some icing to the cake. May I present to you [Dr. Mike's Math](http://ww
w.dr-mikes-maths.com/pisearch.html), where you can search for arbitrary strings within the first 31,415,929 digits of &Pi;. That's a good start, I'd say! This is so geeky, I would think it is correct.</p>

Consequently, this case is closed. Really. I swear by [e<sup>_i_&pi;</sup>](http://www.math.utoronto.ca/mathnet/questionCorner/epii.html)!