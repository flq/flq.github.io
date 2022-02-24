---
title: "Interface versus generic constraint with regard to structs"
layout: post
tags: [csharp, dotnet]
date: 2022-02-20 22:00:00
---

The other day I asked the following on Twitter:

<Tweet tweet={`<blockquote class="twitter-tweet"><p lang="en" dir="ltr">A question to the .NET perf buffs out there - am I right to assume that in the following code, no boxing is occuring on the lines 13,14? <a href="https://t.co/7XTtAjF1zy">pic.twitter.com/7XTtAjF1zy</a></p>&mdash; Frank ⚫ (@fquednau) <a href="https://twitter.com/fquednau/status/1492616149980389376?ref_src=twsrc%5Etfw">February 12, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`} />

Of course, with my minuscule follow count, I couldn't really expect an answer (no, I'm not bitter, it's not that I put any energy into growing that count), so I had to answer the question myself, or rather, confirm what I thought was correct. I wrote the following 2 methods:

```csharp
public interface IPrimitive<T> { T Value { get; } }
readonly record struct UserId(string Value) : IPrimitive<string>;
readonly record struct ProductId(string Value) : IPrimitive<string>;

static string SwitchOnValue1<T>(T value) where T : IPrimitive<string> =>
  value switch
  {
    UserId { Value: "user-123" } => "It's you, Ralph",
    ProductId { Value: "product-123" } => "It's Ralph's product",
    _ => throw new NotSupportedException()
  };

static string SwitchOnValue2(IPrimitive<string> value) =>
  // identical to the first version
```
Notice the different argument type and the first version being generic while the second isn't.
With the wonderful [BenchmarkDotNet][1], I set up two benchmarks that would call each version with the same structs...

```csharp
[Benchmark]
public void CallingTheSwitch1()
{
  var result = SwitchOnValue1(new UserId("user-123"));
  result = SwitchOnValue1(new ProductId("product-123"));
}

[Benchmark]
public void CallingTheSwitch2()
{
  var result = SwitchOnValue2(new UserId("user-123"));
  result = SwitchOnValue2(new ProductId("product-123"));
}
```

Once the benachmark program did its job, I was rewarded with a great confirmation:

```
|            Method |      Mean |     Error |    StdDev |  Gen 0 | Allocated |
|------------------ |----------:|----------:|----------:|-------:|----------:|
| CallingTheSwitch1 |  4.977 ns | 0.1570 ns | 0.3172 ns |      - |         - |
| CallingTheSwitch2 | 20.872 ns | 0.4560 ns | 0.5068 ns | 0.0102 |      48 B |
```

The generic method will not do any boxing, **T** really is the struct and the fact that
you used an interface for constraining the value is irrelevant.
In the second case however, using the Interface requires a boxing operation of the struct
with allocation and a significant performance penalty.

[1]: https://benchmarkdotnet.org/articles/overview.html