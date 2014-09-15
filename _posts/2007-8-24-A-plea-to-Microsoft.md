---
title: "A plea to Microsoft"
layout: post
tags: [dotnet, windows]
date: 2007-08-24 17:54:57
redirect_from: /go/101/
---

<quote>
Keine Überlast für OnVisibilityChanged stimmt mit dem Delegat System.Windows.DependencyPropertyChangedEventHandler überein.	...
</quote>

Microsoft, please stop translating exception messages for a programming language that is otherwise completely English, especially if you let it be done by a machine. The above is an error from the compiler! Never ever meant to be seen by an end user, but a person proficient in programming with the .NET framework. This is annoying, it hinders searching for solutions on the Internet, in short, it is crap! Please, **stop it**!

#### PS

**Überlast **here refers to **method overloading**, i.e. the method I was passing to a delegate was wrong in signature.