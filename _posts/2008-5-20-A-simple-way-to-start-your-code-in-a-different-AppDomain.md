---
title: "A simple way to start your code in a different AppDomain"
layout: post
tags: [programming, dotnet, TrivadisContent, software-architecture]
date: 2008-05-20 16:50:13
redirect_from: /go/124/
---

You may know that AppDomains in the .Net Framework are comparable to processes in that they provide an isolated execution context for the instructions executed by the CLR. However, they are also quite lightweight and what is more, you can have more than one inside an actual OS process in which a given CLR Host is running. Usually our code gets executed in a default AppDomain and we do not care about additional ones. Why should you care about AppDomains at all?

Well, 

*   Do you have a system complex enough that you want to have subsystems with defined responsibilities and clear interfaces to the outside?
*   Can your subsystems churn away on their work without them having to interfere with each other beyond what would be a typical service-style interface?
*   Do you want to be able to let parts of the application run under different Security contexts?
*   Could any of the subsystems hang up so badly that you need to completely destroy the context that was running said part of the code?
*   Are you considering to deploy more than one executable as part of the complete application?
*   ...

If you can answer any or all of the questions with yes, chances are that AppDomains may be useful to you.

Especially if question 3 gets a yes, you may just want want to start an AppDomain as if it were some other executable. This is easily done with the following code:

`
AppDomain dmn = AppDomain.CreateDomain("mydomain");
dmn.ExecuteAssembly("MyExe.exe");
`

Your executable will need an entry point as e.g. a Console application would have. This scenario does not give you a lot of advantage towards just starting the executable. If you want to e.g. instantiate a WCF ServiceHost in the other domain, you may still need to block the entry point in order for your executable to stay alive.
The following code allows you to specify a hook, an entry point much like an application entry point, however, you do not need to deal with the following:

*   Your entry point stays alive as long as the AppDomain in which it lives is alive.
*   Your entry point is called whenever the AppDomain it lives in unloads.
*   Your entry point does not have to live in a different assembly than the one from which you create a new AppDomain.

The AppDomainExpander does that...

`
class AppDomainExpander<T> where T : DomainLifetimeHook, new()
{
    public void Create()
    {
        Create(Guid.NewGuid().ToString());
    }

    public void Create(string domainName) {
        AppDomain dmn = AppDomain.CreateDomain(domainName);
        string typename = typeof(DomainCommunicator).FullName;
        string assemblyName = typeof(DomainCommunicator).Assembly.FullName;
        var inner = (DomainCommunicator)dmn.CreateInstanceAndUnwrap(assemblyName, typename);
        inner.Create();
    }
}
`

You can see that the code refers to a DomainCommunicator, which is a private inner class of the Expander. I will come to this type in a minute.

When you instantiate the Expander you need to provide a type argument that specifies something that derives from the DomainLifetimeHook. That type looks as follows:

`
abstract class DomainLifetimeHook
{
  internal abstract void Start();
  internal abstract void Stop();
}
`

Those methods will already be called inside the new AppDomain, namely when it fires up and when it Unloads.
The DomainCommunicator then is the class that gets instantiated in the new AppDomain. Since it is an inner class of the Expander it can easily refer to the type argument provided during its instantiation. The generic constraint that T has a default constructor allows the communicator to create an instance of it and call its start method in the beginning.

By attaching the event handler to the AppDomain Unload event two things are achieved: There is a defined point when Stop is called on the instantiated Hook and the DomainCommunicator instance is being referenced by the newly created AppDomain. Since T is an instance variable of the Communicator, Ts lifetime is now driven by the AppDomain:

`
    class DomainCommunicator : MarshalByRefObject
    {
        T domainHook;

        public void Create()
        {
            domainHook = new T();
            // Attaching the handler is enough to keep a reference to ourselves
            // which in turn keeps T alive...
            AppDomain.CurrentDomain.DomainUnload += new EventHandler(OnDomainUnload);
            domainHook.Start();
        }

        void OnDomainUnload(object sender, EventArgs e)
        {
            domainHook.Stop();
            // ...until the Domain dies: dereference myself to be more explicit
            AppDomain.CurrentDomain.DomainUnload -= new EventHandler(OnDomainUnload);
        }
    }
`

Now, letting code run in a different AppDomain is as easy as writing this:

`
var expander = new AppDomainExpander<DataPointMSMQHook>();
expander.Create();
`