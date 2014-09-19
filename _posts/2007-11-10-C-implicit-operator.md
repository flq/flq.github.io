---
title: "C# implicit operator"
layout: post
tags: [programming, dotnet]
date: 2007-11-10 12:38:04
redirect_from: /go/104/
---

You know you love a programming language when it still manages to surprise you with something you didn't know about. 

One of the comments on [Eric Lippert's blog](http://blogs.msdn.com/ericlippert/) used a funny looking method signature I hadn't seen before...suppose you start a little Console application and write something like that:
`
class Program {
    static void Main(string[] args) {
      Person p = new Person(23);
      // Of course: 
      // "Cannot implicitly convert type 'TestImplicit.Person' to 'TestImplicit.Animal'"
      Animal a = p; 
      Console.WriteLine(a.Age);
      Console.ReadLine();
    }
  }

  class Person {
    public readonly int Age;
    public Person(int age) {
      Age = age; 
    }
  }

  class Animal {
    public readonly int Age;
    public Animal(int age) {
      Age = age;
    }
  }
`

Fine...what happens, if you extend the Animal class in the following fashion, though?

`
  class Animal {
    public static implicit operator Animal(Person p) {
      return new Animal(p.Age);
    }
    public readonly int Age;
    public Animal(int age) {
      Age = age;
    }
  }
`

The effect is that the line...

`
Animal a = p;
`

now compiles without any trouble. 

Well, that's something I didn't know! I would think that there are actually some valid reasons why this operator is fairly unknown: As the operator name already hints, it adds implicit behaviour. Implicitness, however, can really trouble the mind of a developer, which can be good, but certainly not always.

In other words, there are explicit ways to do such a conversion. Provide a method that does the step, etc. One scenario where such a conversion could be interesting is when switching from a base class to a specialized class. You get a nice place in your code where you could provide a specialized instance with information that goes beyond the one of the base class. In order to write this code, though, the base class would have to know about specialized classes that inherit from said class...hm. Fair enough, applying appropriate patterns would alleviate the issue.

At the end of the day, programming has quite a bit to do with creativity. There may be scenarios out there where the implicit operator would be just the right thing to use, but for now, I don't know any. Me, I just like the fact to learn about another obscure facet of C#...

**Update:** I wrote some more about the implicit operator [here](http://realfiction.net/go/159).