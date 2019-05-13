---
title: "CraftConf Budapest 2019 - Day 1"
tags: [software-development]
date: 2019-05-12 17:30:00
---

My mind is, as usual, quite fragmented after a conference, which is why I jot down a few points on the sessions I attended at the [CraftConf][1] in Budapest so I can remember better later.

## Keynote by Pamela Gay: When the Universe calls

[Dr Pamela L. Gay][2] is an astronomer, technologist, and creative focused on using new media to communicate astronomy and space science.

She talked about where machine learning has entered cosmology: In classifying things! Examples are different galaxy types, or recognizing craters on the moon surface, which is necessary information e.g. for landing there.

It turns out that the models don't work out too well. For once, craters can look very different depending on the angle they were photographed or from where the sun is shining. So a website was set up where people can have a go at identifying craters on the moon surface. On average, the crowd performs fairly good, and this in turn helps creating good training sets for ML algorithms.

The other point where ML fails miserably is identifying things that we don't know of - current models are trained to identify things we already know - but what about objects out there in the universe that we have never seen before? Astronomers are gathering Gigabytes of data every day, who knows what miracles are hidden in there unknowingly, because we don#t have the resources to look through it?

Pamela introduced us to her next challenge, a mission that aims to land on an asteroid, pick up a rock and bring it back home! The challenge is now to find the right landing spot and identify what rock to select. For this a website will be going live where people can help classifying the rocks.

## Dan Terhorst-North and Jezz Humble on the beginning of DevOps

This was a replacement session for a speaker which got ill - DevOps is a fairly new thing and just came from optimizing _the last mile_ to getting software shipped, a thing that not too long ago could involve complex server setups, hairy releases with planned downtime and things like that. Key take-aways for me:

* Conan the Deployer!
* Automate all the things
* Separating Deployment from release is something that had to be invented

In 2019, working in a cloud infrastructure, all this seems natural. 10 years ago, it wasn't.

## State of the art User Interfaces with state machines.

I have done a lot of UI work recently which meant that the session was quite relevant to me. [David Khourshid][3] presented the application of state machines inside UI work. When he presented a declarative codification of a state machine it striked me as looking eerily similar to xstate, to which I had a look [over here][4]. I felt kinda silly, but also happy when I realized that XState is actually David's brain child!

## Why software architects fail – and what to do about it 

[Stefan Tilkov][5]

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Why architects fail &amp; what to do about it <a href="https://twitter.com/CraftConf?ref_src=twsrc%5Etfw">@CraftConf</a> thanks <a href="https://twitter.com/stilkov?ref_src=twsrc%5Etfw">@stilkov</a> for the fun talk I can completely agree with. Be aware there is some sarcasm involved. <a href="https://twitter.com/hashtag/architecture?src=hash&amp;ref_src=twsrc%5Etfw">#architecture</a> <a href="https://twitter.com/hashtag/craftconf?src=hash&amp;ref_src=twsrc%5Etfw">#craftconf</a> <a href="https://t.co/CIN5mCjl43">pic.twitter.com/CIN5mCjl43</a></p>&mdash; Marco Ravicini (@marcoravicini) <a href="https://twitter.com/marcoravicini/status/1126477138339803139?ref_src=twsrc%5Etfw">May 9, 2019</a></blockquote>


## Speeding Up Innovation by Adrian Cockcroft

I have to admit, this session didn#t stick at all with me as it sounded like an ad how fast one can ship stuff on the AWS platform rather than anything else - sorry!

## Unleash Your Play Brain - Playing Your Way Towards a Happier Adulthood 

[Portia Tung][6]

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Unleash your play brain presented by <a href="https://twitter.com/portiatung?ref_src=twsrc%5Etfw">@portiatung</a> <a href="https://twitter.com/CraftConf?ref_src=twsrc%5Etfw">@CraftConf</a> playful session releasing our monkeys. <a href="https://twitter.com/hashtag/CraftConf?src=hash&amp;ref_src=twsrc%5Etfw">#CraftConf</a> <a href="https://t.co/SJUx6GaK9z">pic.twitter.com/SJUx6GaK9z</a></p>&mdash; Marco Ravicini (@marcoravicini) <a href="https://twitter.com/marcoravicini/status/1126510963778150400?ref_src=twsrc%5Etfw">May 9, 2019</a></blockquote>

## Cultivating Architecture

[Martin Fowler][7]
[Birgitta Böckeler][8]

## Deliberate Advice from an Accidental Career 


[1]: https://craft-conf.com
[2]: http://twitter.com/starstryder
[3]: http://twitter.com/davidkpiano
[4]: /2019/01/30/xstate-a-typescript-state-machine-with-a-lot-of-features
[5]: https://twitter.com/stilkov
[6]: https://twitter.com/portiatung
[7]: http://twitter.com/martinfowler
[8]: http://twitter.com/@birgitta410
[9]: http://twitter.com/tastapod