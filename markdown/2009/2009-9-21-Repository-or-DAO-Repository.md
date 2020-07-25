---
title: "Repository or DAO?: Repository"
tags: [programming, libs-and-frameworks, csharp, patterns]
date: 2009-09-21 20:20:51
---

Fine, fine, the title is a blatant copy from [Fabio Maulo](http://fabiomaulo.blogspot.com)'s equally titled [blog post](http://fabiomaulo.blogspot.com/2009/09/repository-or-dao-repository.html).

Then again, this was the direct inspiration for understanding how the data access should look like in the mini-Blog engine I am cooking up. I decided to implement a repository just like Fabio recommends (but doesn't follow himself if you watch the comments) and see how far it gets me while already pointing out some shortcomings and how to overcome them. 

The basic idea is to have a repository that looks like this: 

```csharp
public interface IRepository<T> : 
  ICollection<T>, IQueryable<T>;
```

Fabio already showed us how to implement the queryable - by exposing the LINQ to NHibernate capabilities through your repository. LINQ to NH is available in a version 1.0 provider. It may not support all things that could be thought about when writing LINQ queries but so far it has not disappointed...here's a simple query from one of my tests...

```csharp
var repC = new Repository<Content>(factory);

var result =
(from content in repC
 where content.Comments.Any(cn => cn.CommenterName == "Foo")
 select new { content.Id, content.Title }).ToArray();
```

Any code that uses a repository is ridiculously easy to unit test. Fleshing out a test repository means e.g. writing the following class:

```csharp
public class TestRepository<T> : List<T>, IRepository<T>
```

which leaves you implementing the queryable interface. For this we have the extension method _AsQueryable_, e.g.:

```csharp
public Expression Expression
{
  get { return this.AsQueryable().Expression; }
}
```

What Fabio did not show was the implementation of the ICollection interface. Here's the signature of ICollection as a reminder:

```csharp
public interface ICollection<T> : IEnumerable<T>, IEnumerable
{
  void Add(T item);
  void Clear();
  bool Contains(T item);
  void CopyTo(T[] array, int arrayIndex);
  bool Remove(T item);
  int Count { get; }
  bool IsReadOnly { get; }
}
```

Hence, the _ICollection_ gives you semantics to add and remove items from it and know the count. What it doesn't give you is List semantics which adds capabilities based on an index.

Implementation of _ReadOnly_ is pretty clear: **return false**. Implementation of _CopyTo_ and _Clear_ is also pretty straight forward in my implementation:

```csharp
public void Clear()
{
  throw new InvalidOperationException("Repository does not allow truncate");
}

public void CopyTo(T[] array, int arrayIndex)
{
  throw new InvalidOperationException("An anachronistic remnant that is not implemented");
}
```

_Add_ maps pretty well to a Save operation, thus the implementation uses the Session's save. However, the Session's save has the nice notion of returning the Primary key that was given to the newly saved entity while _Add_'s return signature is **void**.

Getting to know the Id is quite practical, if only to reference the same entity again in Unit Tests involving DB interaction. Therefore, the IRepository&lt;T&gt; interface gets the following addition:

```csharp
new int Add(T item);
```

Note that the generic type argument of Repository is restricted to my base class for persisted objects, _Entity_, which comes along with an _Id_-property of type int. Hence, it should be safe to limit myself to int as the primary key.

As a result, the implementation looks as follows:

```csharp
public int Add(T item)
{
  return (int)sessionFactory
    .GetCurrentSession().Save(item);
}

void ICollection<T>.Add(T item)
{
  int i = Add(item);
}
```

Making the _ICollection_ implementation explicit makes the two _Add_s distinguishable for the compiler. Usually the _void Add_ will be hidden and Add will return you with the id assigned to your object. If something depends purely on the ICollection interface, only the collection semantics will be available

Implementing _Contains_ is somewhat trickier - possibly a reason why NHibernate's LINQ Provider does not support LINQ's _Contains_ method. Since you are looking p a dehydrated object on the DB, what does Contains mean when you enter the collection with a fresh instance? 

One possible answer would be to check whether the object passed in is associated with the current session...

```csharp
return sessionFactory.GetCurrentSession().Contains(item)
```

I have opted for a simple Id-comparison - here _Contains_ states whether an item is contained that has the same primary key as the one of the item passed in (remember that the type argument of the Repository is restricted to be an Entity):

```csharp
public virtual bool Contains(T item)
{
  //LINQNH does not do contains. 
  //Implement whether the Id exists in DB
  return (from e in this 
          where e.Id == item.Id 
          select e.Id).Count() > 0;
}
```

_Remove_ maps quite logically to a Delete:

```csharp
public bool Remove(T item)
{
  sessionFactory.GetCurrentSession().Delete(item);
  return true;
}
```

This time NH's return value is void, while the Collection supposedly wants you to state whether a Remove did happen or not. In this simple implementation I do not want to bother.

Finally we may return a _Count_ which maps quite nicely to SQL's count:

```csharp
public int Count
{
  get { 
    return sessionFactory
      .GetCurrentSession().Linq<T>().Count(); 
  }
}
```

As a final touch, simple retrieval by Id is not as simple as it should be. I include the following into the IRepository interface:

```csharp
T this[int id] { get; }
```

With an equally brief implementation:

```csharp
public T this[int id]
{
  get
  {
    return sessionFactory
      .GetCurrentSession().Get<T>(id);
  }
}
```

There is the first version of a Repository that _mostly_ acts like an in-memory collection of objects. It can be queried with LINQ and objects can be added or removed.

Hang on...Mostly?

Yes. It is still up to powers beyond the repository to ensure that e.g. in mutating operations the NHibernate Session that is used gets its stuff written to the DB. That is, it is the responsibility of repository users to ensure transactional security, flushing, etc.

Remember those nasty Stored Procs written by demented people that would commit after doing some stuff, not caring about the bigger picture? Same applies here.

For now it seems that the repository will cover a number of common DB needs for the targetted project - thanks goes to Fabio for the nice inspiration!