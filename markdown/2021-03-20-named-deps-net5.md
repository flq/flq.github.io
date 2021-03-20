---
title: "Named injected dependencies in .NET 5 / Core"
tags: [dotnet, software-development, programming]
date: 2021-03-20 17:30:00
---

At [ahead intranet] we like to keep the number of moving parts low in our code. This would also mean to come back to the default dependency injection container that comes with .NET Core / .NET 5 applications (right now we're using [Autofac]). So far, however, we are using some container features that have no direct translation to the default one, most notably having named or keyed dependencies.

In some research I came across Steve Collins' blog post on ["Getting named dependencies by Name or Key using the .NET Core Container"][1]

<Info>

Steve will be doing a webinar in the context of Jetbrains' work in the .NET ecosystem. See https://info.jetbrains.com/dotnet-webinar-april-2021.html (8th April)

</Info>

There he shows how to inject a named delegate of the form

```csharp
delegate IDependency UseMeToGetNamedDependency(string key);
```

go and have a read!

## Attempt N<sup>o</sup> 1

Yesterday I tried to adapt his approach into a more generic fashion in that, given the following API:

```csharp
IServiceCollection svcs;
svcs.AddAll<IDependency>(
  naming: type => type.Name.Replace("Dependency", ""), 
  lookupDelegate: typeof(UseMeToGetNamedDependency)
);
```

It would not only register all implementations of `IDependency` but register the referenced delegate which
could then be injected and used in the code to get access to `IDependency` instances by name. The idea was to compile a switch expression that would perform the lookup that Steve coded manually in the blog post. Alas, what looks so _"easy"_ in the post actually involves a closure over a `IServiceProvider` instance. You might recall that the C# compiler does [plenty of things to support closures][eric]. This added difficulty was doing my head in and I really didn't want to start recreating compiler code, so I gave up on it and was thrown back to good ol' classes.

## Attempt N<sup>o</sup> 2

Introducing an interface like this:

```csharp
public interface INamedLookup<out T>
{
  T this[string name] { get; }
}
```

It is possible to implement this interface, where the implementation has a dependency on `IServiceProvider` - there is our closure 😅.

```csharp
IServiceCollection svcs;
svcs.AddAll<IDependency>(
  naming: type => type.Name.Replace("Dependency", "")
);
```

The `AddAll` code already already knows what `IDependency` are available. Providing the optional naming function triggers it to create a dictionary of names against concrete implementations:

```csharp

var candidates = assemblies.SelectMany(a => a.DefinedTypes)
    .Where(t => t.InstantiableAndImplementing<T>())
    .ToList();
// ...
// naming is the function of type Func<Type,string> that we passed in.
var namingDictionary = candidates.ToDictionary(naming);
NamedLookupInfo.RegisterMap(targetType, namingDictionary);
```
Then the code will also register all concrete implementations of `IDependency`. The implementation of `INamedLookup` can now use the stored dictionary to instantiate concrete implementations based on the provided name:

```csharp
public class NamedLookup<T> : INamedLookup<T>
{
    private readonly IServiceProvider serviceProvider;
    private readonly IReadOnlyDictionary<string, TypeInfo> serviceMap;

    public NamedLookup(IServiceProvider serviceProvider)
    {
        this.serviceProvider = serviceProvider;
        if (!NamedLookupInfo.TryGetValue(typeof(T), out serviceMap))
            throw new ArgumentException(
              $"There is no service map for return type {typeof(T).Name} registered");
    }

    public T this[string name] => serviceMap
        .TryGetValue(name, out var serviceType)
        ? (T) serviceProvider.GetService(serviceType)
        : default;
}
```

This named lookup type is also registered in the container against the `INamedLookup<T>` interface.
Any classes can now take a dependency on `INamedLookup<IDependency>` and access named dependencies like so:

```csharp
var someNamedDependency = lookup["CoolName"] 
  ?? throw new ArgumentException("No dependency named CoolName");
```

The relevant interface is still easy enough to mock in some test should you wish to do so, and it is also straightforward to find in the code which was an excellent point in Steve's point that one should support in solving looking up dependencies by name. 

[1]: https://stevetalkscode.co.uk/named-dependencies-part-2
[eric]: https://stackoverflow.com/a/14586368/51428
[ahead intranet]: https://aheadintranet.com
[Autofac]: https://autofac.org/