---
title: "Having fun in irb"
layout: post
tags: programming ruby download TrivadisContent
date: 2006-03-14 19:06:00
redirect_from: /go/16/
---

Check out this piece of interactive ruby:

`
irb> create(:Car).with(:model, :bhp, :driver)
=> Car
irb> pos2 = Car.new("Ferrari 248 F1", 700, "Michael Schumacher")
=> #...
irb> "#{pos2.driver}'s new #{pos2.model} possibly has #{pos2.bhp} BHPs!"
=> "Michael Schumacher's new Ferrari 248 F1 possibly has 700 BHPs!"
`

I am really starting to love this sort of freedom!

I built the little create method to have a very quick way to get some objects with a couple of properties in interactive ruby. The day that I can extract my constructed objects out of irb will be met with Cocktail drinking at my flat.

The file to download contains the source code to the sweet lil’ create method put into use up there