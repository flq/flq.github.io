---
title: "Making a WinRT component out of Membus – Pt.1, making Membus compile"
layout: post
tags: [programming, dotnet, TrivadisContent, membus, metro]
date: 2011-09-19 19:51:58
redirect_from: /go/204/
---

After last week’s [//BUILD](http://www.buildwindows.com/) conference we have learned (amongst other things) of a new class of apps that are touch-centric and use a new .NET Framework profile in order to be run on top of the new Windows Runtime. A nice way to learn about what is different in this new stack is to port some existing code. Membus is a nice contender since I know the codebase(o rly?), it has a fair number of unit and integration tests, it is (apart from some tests) unaware of UI stuff, but I use it extensively in WPF UI Apps, so let’s move in.

I installed git on my new, um, [PC](http://www.waleg.com/techgadgets/archives/024320.html) to download the current version of Membus. First thing to note is that you can’t just open class library projects like that, you will need the correct project type. What I did is add a new sln file “Membus.Metro” that points to new csproj files “Membus.Metro” and “Membus.Metro.Tests” (from the “Unit Test” template). I then added all relevant files to the projects and compiled. Note that I am not touching the test project yet as it uses NUnit. Here’s a rundown of the issues I encountered

### Some minor changes

*   The interface **_ICloneable_** just disappeared. Not a big deal for this codebase.
*   The **_Serializable_** attribute is gone. Interesting – I don’t know for now if it just moved or what that means, but I do imagine that this has implications for other code bases.
*   The class **_List&lt;T&gt;_** does not have a “ForEach” method anymore. The correct thing to do here is to use the **_Each_** extension method from System.Linq (fi-na-lly!) 

&nbsp;

### Reflection changed more than moving mirrors around

The reflection API has changed considerably. Let’s face it, it’s a bit of a mess anyway, hence there was scope for improvement. Since Membus uses some reflection, a number of classes were affected. The one major change is that the **_Type_**-class has been streamlined to just a few essential features – reflection info like members, interfaces and the like are accessed by using the **_GetTypeInfo_** extension method that works e.g. on Types. It returns a TypeInfo instance that allows access to the information one usually needs when reflecting. MemberInfos, interfaces etc. are now returned as **_IEnumerable&lt;T&gt;_**&nbsp; and things have in general been cleaned up.

Membus already had a **_ReflectionExtensions_** static class which has been expanded to simplify access for other parts of the codebase. Other things could be deleted, e.g. there are now extension method like GetAttribute&lt;T&gt; available, so you don’t need to reintroduce them all the time.

Here’s an example of the change:
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:e213396c-cb32-4edd-828a-4e3fed9b681c" class="wlWriterEditableSmartContent"><pre name="code" class="c#"> public static bool ImplementsInterface&lt;T&gt;(this Type type) where T : class
{
-         return Array.Exists(type.GetInterfaces(), t =&gt; t == typeof(T));
+        return type.GetTypeInfo().ImplementedInterfaces.Any(t =&gt; t == typeof(T));
}</pre></div>

Incidentally, the **_Array.Exists_** method does not, er, exist anymore.

### Delegate.CreateDelegate is gone

I am not sure about the exact reason of this change, but it could be roughly the same direction as the fact that [Reflection.Emit is not available](http://jasonbock.net/JB/Default.aspx?blog=entry.55fa01c966fa4e839a5675f5b70d06df). Membus uses this method to build delegates from suitable methods that can act as a target of messages.

In this case I had to move the code creation to what the Expression-class makes available to us. The correct way to create an arbitrary **_Action&lt;T&gt;_** delegate from a suitable **_MethodInfo_** looks like this:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:6a0c2a62-35b4-421a-bccf-34ab37138d04" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public static ISubscription ConstructSubscription(this MethodInfo info, object target)
{
  var parameterType = info.GetParameters()[0].ParameterType;
  var fittingDelegateType = typeof(Action&lt;&gt;).MakeGenericType(parameterType);
  var p = Expression.Parameter(parameterType);
  var call = Expression.Call(p, info);
  var @delegate = Expression.Lambda(fittingDelegateType, call, p);

  var fittingMethodSubscription = typeof(MethodInvocation&lt;&gt;).MakeGenericType(parameterType);
  var sub = Activator.CreateInstance(fittingMethodSubscription, @delegate.Compile());

  return (ISubscription)sub;
}</pre></div>

All in all the necessary changes to make Membus compile again were done in roughly 2 hours. The commit of the changes documented in this post [can be seen here](https://github.com/flq/MemBus/commit/53d74a7c70ddd250b8b9e22a71a48adaec0ad5fb) on github as a diff.