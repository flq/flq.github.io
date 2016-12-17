---
title: "Trying to LINQ it all together (Pt. I)"
layout: post
tags: [software-development, dotnet, libs-and-frameworks]
date: 2007-04-25 21:33:33
redirect_from: /go/82/
---

Yeah, yeah, we've all done our **_from thingy in stuff where thingy.Age > 26_**, etc., etc.

I wanted to try something else for starters. I fired up my March CTP Orcas and got myself a Person (as usual, I can relate to them). The list I create for testing looks as follows:

```csharp
public static Person[] CreatePeopleList() {
  return new Person[] {
    new Person { Name = "Arthur", Posn = Position.Boss, Salary=10000},
    new Person { Name = "Selma", Posn = Position.Middleman, Salary=6000},
    new Person { Name = "Buttocks", Posn = Position.Middleman, Salary=5500},
    new Person { Name = "Shawn", Posn = Position.Peasant, Salary=4000},
    new Person { Name = "Burgess", Posn = Position.Peasant, Salary=3800},
  };
}
```

Bog standard hierarchy in any company. My aim now was to get a total of the salaries grouped by the available positions. The new capabilities indeed allow to quickly express such a thing, albeit I suppose I am becoming a lambda fan, since that was my first result:

```csharp
Person[] pees = Person.CreatePeopleList();
var salaryDistribution =
pees.GroupBy(p => p.Posn)
  .Select(group => 
            new { 
              Position = group.Key, 
              TotalSalary = group.Sum(p => p.Salary) 
            });

salaryDistribution.ToList()
  .ForEach(entry => 
             Console.WriteLine("Position {0} earns {1} bucks",entry.Position,entry.TotalSalary));
```

Those funny **Select()** and **GroupBy()** all come from the **System.Linq** namespace and are extension methods to your well-known IEnumerable&lt;&gt; interface. In other words, all arrays, collections, etc. can benefit from LINQ functionality.

First question: Is the code understandable? I hope so. In this specific case 

* **GroupBy()** returns an Enumerable of Type `IGrouping<Position,Person>`.
* This thing has a Key and can again in turn be enumerated, here it results in returning all Persons grouped under that key.
* In other words, I can now apply the **Select()**. This one is quite similar to a `IEnumerable -> IEnumerable`mapping.
* The Select on the group by then returns the `IGrouping<Position,Person>` objects from which the key (Person's Position) can be extracted.
* Since it is in itself also enumerable we can now use the **Sum()** method (also a new LINQ method) which will generate a sum over all provided elements.
* From all this stuff I finally generate an anonymous type containing the position and the sum of salaries under that position.

So far, so nice. I spared myself of writing the same code with C#2.0 capabilities, but I would expect it to be roughly  5-8 lines more. We don't really need funny keywords to get the power of LINQ, ...[snip]

## Update from 29.04.07 - The following lines lead to wrong conclusions. For a better picture read the [next post]({% post_url 2007-4-29-Trying-to-LINQ-it-all-together-Pt-I-Epilogue %})

In fact in this case a bug stopped me in my attempt to express this query with the available keywords select, group, etc.

That is as far as I got:

    var salarySums =
      from p in pees
      group p by p.Posn into groups
      from grp in groups
      select grp.Key;

The error you'll get:

    'Popular.Person' does not contain a definition for 'Key' and no extension method 'Key' accepting a first argument of type 'Popular.Person' could be found 
    (are you missing a using directive or an assembly reference?)


Oops, did I miss something? Heck, no, you would expect groups to be an IEnumerable containing `IGrouping<Position,Person>`, just like what I did with the lambdas further up. That is in fact what the current documentation also expects and when I copy the doc's group by example into my source code it fails by the same reason: The compiler thinks that groups is an IEnumerable containing...Persons. This is plain wrong and I will see if I get it to Microsoft somehow, if it hasn't already happened.

To sum it up for today: I think the LINQ methods are very practical but I have the feeling that I will favour the lambda-based usage over the keyword-based one. In this case the keyword-based query would have gotten pretty convoluted. Time will tell what is more readable / maintainable/ powerful!
