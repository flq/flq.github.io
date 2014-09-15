---
title: "Functional Programming and Quantum Computing"
layout: post
tags: [programming, quantum-mechanics, Haskell]
date: 2007-05-24 12:33:10
redirect_from: /go/89/
---

Some effort goes into simulating a Quantum computer on a classical one, omitting the fact that such a simulation becomes arbitrarily slow due to the fact that a qubit encodes more information than a bit.

As so often the entry point was an arxiv article from Peter Nyman, [Simulation of Quantum Algorithms with a Symbolic Programming Language](http://arxiv.org/abs/0705.3333). All these articles constantly assume that you belong to the few select people who know exactly what all this is about (*sigh* there really is a _large _gap between popular science books and current research).

Then I followed one of references to Thorsten Altenkirch's and Jonathan Grattage's [A functional quantum programming language](http://www.cs.nott.ac.uk/~txa/publ/qml.pdf). Still not comprehensible for me. 

Here I followed another reference: Shin-Cheng Mu and Richard Bird, [Functional quantum programming](http://web.comlab.ox.ac.uk/oucl/work/richard.bird/online/MuBird2001Functional.pdf) from end of 2001. Lo and behold! _There _some basics are undertaken to simulate quantum computing in...Haskell!

Sweet, I thought, maybe this is understandable for me. There is probably the chance for that, but it takes time. Still, numerous function definitions can be found which are very interesting in themselves for a beginning Haskell programmer.

Just as an example from the first pages, the following Haskell code provides the basis to obtain a list of all possible segments of a list of values:

`
	type Set a = [a]
	singleton x = [x] 
	union = (++)

	prefixes :: [a] -> Set [a]
	prefixes [] = singleton []
	prefixes (a : x) = singleton [] `union` map (a :)(prefixes x)

	suffixes :: [a] -> Set [a]
	suffixes [] = singleton []
	suffixes(a : x) = singleton (a : x) `union` suffixes x

	segments :: [a] -> Set [a]
	segments = concat . map suffixes . prefixes
`

O..M..G . I will probably die a stupid man.