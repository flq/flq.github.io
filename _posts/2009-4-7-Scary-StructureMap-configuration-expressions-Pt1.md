---
title: "Scary StructureMap configuration expressions Pt.1"
layout: post
tags: [csharp, libs-and-frameworks]
date: 2009-04-07 18:51:51
redirect_from: /go/142/
---

"Most scary StructureMap Configuration Expression"&trade; so far...
<csharp>
ForRequestedType<ISession>()
  .InterceptConstructionWith(wcfCachePolicy)
  .AddInstances(instanceExpression =>
                instanceExpression.Conditional(
                  cond =>
                    {
                      cond.TheDefault.Is.ConstructedBy(
                        ctx => 
                          ctx.GetInstance<ISessionFactory>()
                          .OpenSession(
                          new IsisNHInterceptor(ctx.GetInstance<IRequestContext>())));
                      cond.If(ctx => ctx.ParentType.Name.Contains("ReadOnly")).ThenIt.Is.
                        ConstructedBy(
                        ctx =>ctx.GetInstance<ISessionFactory>().OpenSession());
                    }));
</csharp>

The idea: In order to correctly talk to a decidedly legacy-i Database correct, write operations need to set a number of session variables for the used connection. This is done by an NHibernate Session interceptor. The convention is then that the Repository using the NHibernate session does not contain the text "ReadOnly" in its class name. If it does, the repository promises to only read the database which is unlikely (I hope) to trigger any..err..triggers. In this case the Interceptor isn't necessary.