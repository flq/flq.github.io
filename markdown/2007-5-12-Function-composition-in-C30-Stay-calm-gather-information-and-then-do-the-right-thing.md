---
title: "Function composition in C#3.0 (Stay calm, gather information and then do the right thing)"
layout: post
tags: [software-development, download, dotnet]
date: 2007-05-12 21:11:20
redirect_from: /go/85/
---

In the [last post](/go/117) I was talking about how we could create the natural Haskell function composition operator into C# and my first solution (also contained as the _Functional_ assembly in the attached solution) was one based on the possibilities provided by the 2.0 Version of the .NET framework. It worked, but it was clumsy, with a lot infrastructure to support a single requirement.

Luckily I am already delving a bit into LINQ and the technologies behind it and respective implementations in different domains, e.g. [DLINQ](http://www.google.de/search?hl=en&q=DLINQ+overview&btnG=Search) for doing strongly typed queries against DBs. If creating the query would already do anything against the DB, all hell would break loose considering that (D)LINQ allows for joins between objects. It would be bad news if you'd have to do the join in your application and not your DB.

Therefore, what rather happens is that a so-called [expression tree](http://www.interact-sw.co.uk/iangblog/2005/09/30/expressiontrees) is generated. It conveys all the information that is expressed through writing down said query. Once the application really wants to perform a query, the frameworky bits of DLINQ can look at the created expression tree and create a decent SQL statement to get just that information without any excessive roundtripping.

Alas, expression trees are much more powerful than just being LINQ's backbone. They allow you to create new expressions, compile and use them at runtime. This is what is meant by deferred execution. You don't execute e.g. the LINQ query but rather gather the execution into an abstraction in order to be executed later. Now, that almost sounds like Haskell's lazy evaluation, doesn't it? Well, not quite, but the greatness of expression trees is that you can create new expressions, compile and use them at runtime. There, I just repeated myself. Why do I think that this is important? Go back to the [last post](/go/117). In imperative programming sometimes information is missing at a given point in time. A LINQ is finished and ready to be executed when the programmer says so. In my case the function composition is only finished when the programmer says so. Only then I have all necessary information to create the correct function composition.

**&lt;Stop blurbing, how does it work then?&gt;**

Let me just remind you the syntax of the function compositor. It stayed almost the same, as all the generics fun and method chaining makes for great type safety:

```csharp
Func<int, decimal> func =
        new FunctionalExpress.FuncCombination<int, decimal>()
        .Add<string>(int2StringStatic)
        .Add(s => s.ToArray())
        .AddFinal(char2Decimal);
decimal d = func(23);
```

Now, however, I don't really have to store a reference to the passed delegate. I extract the info contained in the delegate and store it in a list that will be passed along the instances on which Add are called:

```csharp
public delegate V Digestif<T, V>(T input);
...
private List<MethodInfo> infos;
...
public FuncAddendum<START, FINAL, OUT, NEWOUT> Add<NEWOUT>(Digestif<OUT, NEWOUT> pluck)
{
  infos.Add(pluck.Method);
  return new FuncAddendum<START, FINAL, OUT, NEWOUT>(infos);
}
```

Once AddFinal is called, something else happens:

```csharp
public Func<START,FINAL> AddFinal(Digestif<OUT, FINAL> pluck)
{
  infos.Add(pluck.Method);
  return GetFunction();
}
```

At this point in time all information is available to combine the functions in an optimal fashion.
What we would do when chaining the functions in a normal fashion (i.e. when writing our source code) is essentially this:

```csharp
type myFuncComposition(type value) {
  return last_method(before_last_method(...(first method(value))..);
}
```

Only, we are already at runtime! Let's create the expression that looks like above instead. At the current state of the .NET framework 3.5 we use static methods of the Expression class to create different expressions (method calls, parameters, comparisons, additions, multiplications, etc., etc....).

```csharp
private Func<START, FINAL> GetFunction()
{
  ParameterExpression pe =
    Expression.Parameter(infos[0].GetParameters()[0].ParameterType, infos[0].GetParameters()[0].Name);
  MethodCallExpression mce = BuildExpression(infos.GetEnumerator(), pe);

  Expression<Func<START, FINAL>> myFunc =
    Expression.Lambda<Func<START, FINAL>>(mce, new ParameterExpression[] { pe });
  return myFunc.Compile();
}
```

For once we can make good use of the Enumerator as an object to pass along a recursive chain (Which is what I do, since the expression created from the first method is the input to the second method which is the input to the third...you get it).
The difference between the first and all other methods is that its input is the very same parameter that is the input to the function that will be generated once we compile the whole caboodle - which is why **pe** appears twice here. The last piece in the puzzle is the **BuildExpression** method:

```csharp
private MethodCallExpression BuildExpression(IEnumerator<MethodInfo> mis, Expression ex)
{
  while (mis.MoveNext())
  {
    MethodCallExpression intermediate =
      Expression.Call(mis.Current.DeclaringType, mis.Current.Name, null, new Expression[] { ex });
    return BuildExpression(mis, intermediate);
  }
  return (MethodCallExpression)ex;
}
```

And that's this. Once the recursion is finished, the Visual Studio shows us the ToString(), which gives a nice confirmation of what I was trying to achieve:

![](/assets/func_expression.gif)

You can see, soon there are even more tools in the ever growing .NET toolbox. In some situations you may want to resort to create and compile some small-scale code at runtime - namely when you have all necessary information available to create just the right code to answer your requirement.

A final word to the function compositor provided in the attachment: It is currently able to call lambdas as well as static methods but no instance methods.
