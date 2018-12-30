---
title: "C# 6 language features? 5 cents."
layout: post
tags: [csharp]
date: 2013-12-10 14:00:00
redirect_from: /go/239/
---

## C#6
It looks like C# designers are beginning to fire their engines with regard to what language features would bring benefit to programmers. Apparently there was a [presentation on NDCLondon][1], followed by [a reaction over here][2].

Apart from the fact that every new language feature also complicates the programming (more choices, more ways that programmers misunderstand each other), there is always a call for reducing boilerplate code.

There is some useful stuff in there, I would think. I especially like the idea to be able to import a static class such that its methods become available as first-class citizens.

What I do miss is some way to define **records** as they are known in **F#**.

For your reference, an example how it could look in C#:

    class Customer = { 
      First : string; 
      Last: string; 
      SSN: uint32; 
      AccountNumber : uint32; 
    }

this gives you

* A class with a constructor which accepts all fields to fill the defined properties
* All properties being read-only
* Equality implementations based on the properties defined inside.

I would find this useful in many cases.

## Constructors are methods

One thing I find annoying is that I cannot treat a constructor as a method group. If C# had chosen a ctor syntax  + instantiation somewhat like ruby...

    class Customer {
      public new(string name) { ... }
    }
    
    var c = Customer.new("Arthur")

Then this syntax would lend easily to a statement like that

    DB.Query<Name>().Select(Customer.new) // instead of (s => new Customer(s))
    
Not sure what the right approach would be for C# but it sure would help in my code ;)

**PS**
*Yes, I know you can fake it with statics, but it would become a guidebook definition for what boilerplate code is.*

## Structural typing

Apparently this is *"on the radar"* - many people probably mean different things with that, my personal interpretation is something like
    
    class Event1 = {
      long CorrelationId;
    }
    
    class Event2 = {
      long CorrelationId;
    }
    
    // Structural Typing:
    public void DoCorrelationStuff<T>(T thing) where T : { long CorrelationId; } 
    {
      Debug.WriteLine(thing.CorrelationId);
    }
    
    //Can be used like
    DoCorrelationStuff(new Event1(12334343));
    DoCorrelationStuff(new Event1(15334746));

We shall see how far off I am ;)

## dot-Ask
to me the whole thing of *customer.?address.?street* feels a bit like a Hack to live with nulls. Granted, it doesn't look like we can get rid of them in the C# world, but a pure API solution introducing a Maybe type can have a positive impact on your programming style and is more powerful than the proposed operator. 
The reason being that with null things you don't only want to access it, but do stuff with it, cast it, etc. - If you introduce that operator I think it could open a can of worms.

# Pure functions

This is something I've never heard off but which could be interesting from optimization perspectives (mark it experimental).

    private double _foo;
    
    public pure double Bla(double val) {
      //Compute something out of val.
      Debug.WriteLine(_foo); //Error: Cannot read state outside of a pure scope.
    }

The idea is something borrowed from Haskell. However, while in Haskell purity is opt-out, I would define it as opt-in. This would mean for a method, that

* It can only use stuff that gets passed into the method (no instance vars or any other state)
* It can only call methods that are also declared as pure.
* [It cannot return null].

This could lead to 

* simpler parallelism primitives as pure functions make strong guarantees about their idempotency, reentrability, etc.
* Maybe things like memoizations..?

This concludes today's trip to fantasyland, off to the nitty-gritty of finding a new job!

  [1]: http://channel9.msdn.com/Forums/Coffeehouse/Mads-Torgersen--NDC-London--The-Future-of-C
  [2]: http://damieng.com/blog/2013/12/09/probable-c-6-0-features-illustrated