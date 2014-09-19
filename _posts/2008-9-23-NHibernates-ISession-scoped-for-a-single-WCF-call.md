---
title: "NHibernate's ISession, scoped for a single WCF-call"
layout: post
tags: [libs-and-frameworks, dotnet]
date: 2008-09-23 07:52:10
redirect_from: /go/133/
---

I am working at a project that uses the .NET 3.5 communication stack between client & server (WCF) and they have decided to be Domain driven. In this case NHibernate (NH) is the persistence framework of choice.

The abstraction chosen for persistence are repositories (See Evans' relevatory book "Domain-Driven Design: Tackling Complexity in the Heart of Software").

When you look at NH's architecture, you will find the thread-safe Session Factory and the thread affine Session. A repository will need a session to operate against the underlying Database. According to [Ayende](http://ayende.com/Blog/archive/2008/07/24/How-to-review-NHibernate-application.aspx), there are a number of bad patterns surrounding NH usage, one of which is starting a NH session per Repository, or even worse one Session per Repository call. For once, you are unable to do a transaction spanning several repositories. There, that should be enough as deterrence.

What scope to choose then for the session and how can we ensure the correct scope of a Session?

I am certainly not the first one to write about this, only recently Jimmy Bogard blogged about "[Integrating StructureMap and NHibernate with WCF](http://www.lostechies.com/blogs/jimmy_bogard/archive/2008/09/16/integrating-structuremap-and-nhibernate-with-wcf.aspx)"

So, why do I write about it again? Because there aren't enough good practice posts surrounding NHibernate, and that way I can contribute to that matter.

I chose a slightly different route...I stated to my Customer that we will have WCF services that work **per call**. It means that:

*   There is no Session (That is, some sort of client session)
*   A service implementation is created and destroyed for every call
*   The scope of a service instance is the same as the scope of a request is the same as the scope we chose for the NHibernate Session.

Those assumptions allow you to simplify the procedure somewhat. Since we already use a Custom Instance Provider in order to do Dependency Injection at the service level, that Custom Instance Provider is the perfect place to set things up for a NH Session per call. Let us look at the Instance Provider:

<csharp>
class ServiceInstanceProvider<CONTRACT> : IInstanceProvider {
  ...
  public object GetInstance(InstanceContext instanceContext, System.ServiceModel.Channels.Message message)
  {
    var nhSessMgrExtension = instanceContext.Extensions.Find<NHibernateContextManager>();
    if (nhSessMgrExtension == null)
      instanceContext.Extensions.Add(new NHibernateContextManager());
    return kernel.Get<CONTRACT>(); //Ninject Kernel in this case, but irrelevant for this post
  }
  ...
  public void ReleaseInstance(System.ServiceModel.InstanceContext instanceContext, object instance)
  {
    var nhSessMgrExtension = instanceContext.Extensions.Find<NHibernateContextManager>();
    if (nhSessMgrExtension != null)
      instanceContext.Extensions.Remove(nhSessMgrExtension);
  }
}
</csharp>

Strictly speaking, we have a Session / service instance, however, see the above assumptions.

What is used here is one of the several contexts that WCF provides, Off hand you will see the OperationContext, InstanceContext as well as a RequestContext. Since technically I am scoping the NH Session to an instance, I will make an Extension to the InstanceContext with the provided Extension Mechanism ("**Extensions.Add(...)**").
Let us have a look at that NHContextManager:

<csharp>
class NHibernateContextManager : IExtension<InstanceContext>
{
  public ISession Session { get; set; }

  public void Attach(InstanceContext owner)
  {
    //We have been attached to the Current operation context from the 
    // ServiceInstanceProvider
  }

  public void Detach(InstanceContext owner)
  {
    if (Session != null)
    {
      Session.Flush();
      Session.Close();
    }
  }
}
</csharp>

Attach/Detach need to be implemented by contract. They are called when your extension is added / removed to the Extensions list.

The only thing left in the puzzle is to ensure proper session instantiation and reuse. Let us delegate this to a bit of infrastructure that NHibernate provides to us. We can register a class in the NH configuration that does the job of determining a Session when somebody calls sessionFactory.GetCurrentSession().

<csharp>
string currentSessionContextImplTypeName = 
  typeof(NHWCFSessionContext).FullName + ", " + 
  typeof(NHWCFSessionContext).Assembly.FullName;
props.Add("current_session_context_class", currentSessionContextImplTypeName);
...
var cfg = new NHibernate.Cfg.Configuration().AddProperties(props)
...
sessionFactory = cfg.BuildSessionFactory();
</csharp>

That class we register here needs to implement an interface and provide a constructor to which the sessionFactory will be passed. Now we can pull the bits together:

<csharp>
public class NHWCFSessionContext : ICurrentSessionContext
{
  public NHWCFSessionContext(ISessionFactory factory) : base()
  {
    this.factory = factory;
  }

  public NHibernate.ISession CurrentSession()
  {
    // Get the WCF InstanceContext:
    var contextManager = OperationContext.Current
      .InstanceContext.Extensions.Find<NHibernateContextManager>();
    if (contextManager == null)
    {
      throw new InvalidOperationException(
@"There is no context manager available. 
Check whether the NHibernateContextManager is added as InstanceContext extension. 
Also, this Session Provider only makes sense in a WCF context.");
    }

    if (contextManager.Session == null)
      contextManager.Session = factory.OpenSession();
    return contextManager.Session;
  }
}
</csharp>

That is pretty much it. If you have a DI container in use you can now add the bonus of registering some kind of instance provider for the ISession interface. In Ninject this would look like:

<csharp>
m.Bind<NHibernate.ISession>().ToProvider<NHSessionProvider>();
</csharp>

And the SessionProvider does nothing but say:

<csharp>
return sessionFactory.GetCurrentSession();
</csharp>

If you now instantiate a repository from the DI Container, and that repository has a dependency to ISession, it will get the Session correctly scoped for your WCF call.

A last disclaimer. The lifetime of services and such in WCF is not trivial. There are numerous options and depending on your target application the choices made here may not be your choices and the answer how your NH Session should be scoped is possibly not obvious either. But I hope that with the links provided and the info in here you can do a well-grounded choice.

[![kick it on DotNetKicks.com](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http%3a%2f%2frealfiction.net%2f%3fq%3dnode%2f167&bgcolor=0000CC)](http://www.dotnetkicks.com/kick/?url=http%3a%2f%2frealfiction.net%2f%3fq%3dnode%2f167)