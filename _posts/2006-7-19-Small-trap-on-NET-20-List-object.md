---
title: "Small trap on .NET 2.0 List object"
layout: post
tags: programming dotnet TrivadisContent
date: 2006-07-19 19:54:06
redirect_from: "/go/46"
---

Consider the following small c# 2.0 program:

`
  class Program {
    static void Main(string[] args) {
      List<int> l = new List<int>();
      int i = 0;
      bool truth = l.TrueForAll(delegate(int z) { i++; return false; });
      Console.WriteLine("i is {0} and truth is {1}", i, truth);
      Console.ReadKey();
    }
  }
`

The delegate passed into the _TrueForAll_ method has to return either true or false and is called for each element of the list. If all calls return true, the _TrueForAll_ method will itself return true.

As you can see, the list contains no elements, so you can probably guess what the value of **i** will be. But can you guess the value of **truth**? Well, here's the output:

_i is 0 and truth is True_.

Indeed, what is it supposed to return, since after all no answer can be given, and in a way any statement applied to nothing can be true. Even so, I would think that it could also be considered false, and that the way this method may be used, returning False may have been a better option.

In my concrete trap, I was asking whether a list HasData, which in turned was supposed to ask each of its elements if it contains any data...

`
class Program {

    static void Main(string[] args) {
      DataHolderSet set = new DataHolderSet();
      Console.WriteLine("set has data? {0}", set.HasData);
      Console.ReadKey();
    }
  }

  interface IDataHolder {
    bool HasData { get; }
  }

  class DataHolder : IDataHolder {
    public bool HasData {
      get { return false; }
    }
  }

  class DataHolderSet : List<IDataHolder>, IDataHolder {
    public bool HasData {
      get { 
        return TrueForAll(delegate(IDataHolder z) 
        { return z.HasData; }); 
      }
    }
  }
`

Obviously we get true, although I have lured myself into expecting that the response should be false. Anyway, just something to be aware of...