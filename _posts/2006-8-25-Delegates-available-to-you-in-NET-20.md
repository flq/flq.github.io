---
title: "Delegates available to you in .NET 2.0"
layout: post
tags: programming dotnet TrivadisContent
date: 2006-08-25 08:45:38
redirect_from: /go/51/
---

With the introduction of anonymous methods, using delegates has become a lot more straightforward. Even so, delegate definitions are still required to which an anonymous method can map. Thankfully there are a few delegates already defined in the framework so that you can reuse them in your own methods, saving you the hassle to define a delegate yourself in a number of situations.

*   **Action&lt;T&gt;** : delegate void MyAction&lt;T&gt;(T obj)
Useful to write a void method accepting one arbitrary parameter. No need to define a delegate for that, use this one instead.
*   **Predicate&lt;T&gt;** : delegate bool MyPredicate&lt;T&gt;(T obj)
Also represents a method taking a parameter of type T, returning a boolean.
*   **Converter&lt;TIn,TOut&gt;** : delegate TOut MyConverter&lt;TIn, TOut&gt;(TIn obj);
Pretty generic, huh? It will require an input parameter of type TIn and will have to return an object of type TOut.
*   **Comparison&lt;T&gt;** : delegate int MyComparison(T obj1, Tobj2)
Not that useful outside its intended use as a piece of code to compare two objects, but who knows really...
*   **MethodInvoker** : delegate void MyInvoker()
Execution of a paremeterless void method, kind of the programming representation of an autistic person. _Sadly_, this delegate is defined in the System.Windows.Forms namespace, which is silly, because such a delegate is useful all the time, considering that an anonymous method has access to its surrounding scope. So, if you&#39;re not programming a Windows Forms application, you&#39;ll have to define your own Invoker. But, hang on, what about...
*   **ThreadStart** : delegate void MyInvoker()
Indeed the same signature, but the naming is rather misleading - not really recommendable in the light of programming that can be understood 3 months later.*   The following two delegates are mostly used in Windows Forms apps, but are actually available in the System namespace...

*   **EventHandler** : delegate void MyEventHandler(object o, EventArgs arg)
The well known pattern for event handling, but nobody stops you from reusing the pattern. Even more so with its fresh generic brother...
*   **EventHandler&lt;T&gt;** : delegate void MyHandler&lt;T&gt;(object o, T args) where T : EventArgs
Not bad, however, T is restricted to objects inheriting from EventArgs, which limits the delegate&#39;s usefulness beyond its intended scope.I sure have missed some but I&#39;d love to hear from them, in order to complete this list for a quick reference...