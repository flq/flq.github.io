---
title: "C# 3.0 - Hair extensions for wanna-be rubyists"
layout: post
tags: [programming, ruby, dotnet, TrivadisContent]
date: 2007-04-01 13:55:52
redirect_from: /go/77/
---

Metaprogramming and cool syntax aside, there is something in ruby that is quite sexy and will be available to the .NET world once C# 3.0 is out: Check out this sweet ruby code:

`
2.upto 5 do |x|
  puts x
end
`

Or here (works within your Rails environment):

`
3.weeks.ago
`

While the first code snippet will iterate from 2 up to 5, the second will provide you the time 3 weeks in the past from this moment in time. **Now **this is something we can provide as well in C#. For that we will have extension methods. Those are simply static methods that due to their syntax will attach themselves to the object specified. This is best explained by the following example: 

`
  public static class TimeExtensions {
    public static TimeSelector Weeks(this int i) {
      return new WeekSelector { ReferenceValue = i };
    }
    public static TimeSelector Days(this int i) {
      return new DaysSelector { ReferenceValue = i };
    }
    public static TimeSelector Years(this int i) {
      return new YearsSelector { ReferenceValue = i };
    }
  }
`

The trick is the **this **keyword in its umpteenth meaning: It specifies that the method (and this only works for methods) will be attached to the specified type. In other words, as soon as you reference the namespace in which the extension is defined, three methods will be added to your _int_ definition. This is the same trick how bog standard arrays and collections suddenly know how to behave within LINQ expressions.

Btw, another thing shown off is the new way to initialize properties of a newly instantiated object. This is a true code-lines saver, since in this simple case it means that I do not have to inherit a constructor three times if I want to allow a developer using the class to instantiate it with relevant values in a one-liner. An effective enhancement, if there ever was one.

Let me show you the TimeSelector class to finalize this treat:

`
  public abstract class TimeSelector {
    protected TimeSpan myTimeSpan;

    internal int ReferenceValue {
      set { myTimeSpan = MyTimeSpan(value); }
    }

    public DateTime Ago { get { return DateTime.Now - myTimeSpan; } }
    public DateTime FromNow { get { return DateTime.Now + myTimeSpan; } }
    public DateTime AgoSince(DateTime dt) { return dt - myTimeSpan; }
    public DateTime From(DateTime dt) { return dt + myTimeSpan; }
    protected abstract TimeSpan MyTimeSpan(int refValue);

  }

  public class WeekSelector : TimeSelector {
    protected override TimeSpan MyTimeSpan(int refValue) { return new TimeSpan(7 * refValue, 0, 0, 0); }
  }

  public class DaysSelector : TimeSelector {
    protected override TimeSpan MyTimeSpan(int refValue) { return new TimeSpan(refValue, 0, 0, 0); }
  }

  public class YearsSelector : TimeSelector {
    protected override TimeSpan MyTimeSpan(int refValue) {
      return new TimeSpan(365 * refValue, 0, 0, 0);
    }
  }
`

Btw, this cannot be used to open up the innards of a foreign type definition: The type to be extended is only visible through its public / internal face, respectively.

Now, in your code you can do this:
`
using RF.Extensions.Time;
...
            Console.WriteLine(3.Weeks().Ago);
            Console.WriteLine(5.Years().FromNow);
            Console.WriteLine(19.Days().From(new DateTime(2007,1,1)));
`

The second example was the ability to iterate between two integers. This is also an extension to the integer type and it usage will be simplified by the concise syntax that can be used for providing inline expressions. First comes the code that enables it:

`
  public static class IterationExtensions {
    public static void IterateTo(this int start, int end, Func<int, int> modify, Action<int> action) {
      int prefix = end < start ? -1 : 1;

      for (int i = prefix * start; i <= prefix * end; i = modify(i))
      {
        action(prefix * i);
      }
    }

    public static void IterateTo(this int start, int end, Action<int> action) {
      IterateTo(start, end, i => i + 1, action);
    }
  }
`

This version not only allows you to iterate up and down, but also defines an overload where you can specify your own stepping in the form of a lambda expression.

This stuff is used as such:

`
using RF.Extensions.Iteration;
...
  2.IterateTo(5, i => Console.WriteLine(i));
  (-10).IterateTo(-12, i => Console.WriteLine(i));
  2.IterateTo(20, c => c + 2, i => Console.WriteLine(i));
`

Sadly, the usage is not quite as cool as in the Ruby version, yet we have another way to express concise code. I can't wait for nice extension libraries that will provide extensions to well known objects for given scenarios. I'll probably start my own. If anyone has a nice idea that should find its way in the RF extension library, let me know.