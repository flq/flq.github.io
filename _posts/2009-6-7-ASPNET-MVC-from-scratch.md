---
title: "ASP.NET MVC from scratch"
layout: post
tags: [dotnet, libs-and-frameworks, web]
date: 2009-06-07 19:01:05
redirect_from: /go/145/
---

Yesterday I thought that it would be a good idea to check out ASP.NET MVC (MVC) on my "on-the-edge" rig with Visual Studio 2010 running on Windows 7.

It shouldn't have surprised me then, that ASP.NET MVC support is currently unavailable for this combination. According to [Phil Haack](http://haacked.com/articles/AboutHaacked.aspx) it was something like bad timing that ASP.NET MVC didn't make it into the Visual Studio Beta. Anyway...

What happens when you try to play with ASP.NET MVC on your machine? Well, you can install ASP.NET MVC which will work alright. MVC is placed in Program Files (without me being able to change the location, GRR...) and into the Global Assembly Cache (which is really not very accessible on the system anymore...). However, the complete Visual Studio Support with Project Template and all is missing. Since all tutorials etc. expect you to be able to just start a new MVC project from the in-built template you are slightly stuck.

My route was to get a not too complex and up-to-date example application. [Nerddinner](http://www.codeplex.com/nerddinner) fits this bill quite well. If you have ever developed something with ruby on rails you will feel right at home. When you download and open it up you will stumble over the fact that the project type is unknown to Visual Studio which will stop the project from being loaded. In such cases you usually have to remove the GUID that identifies the type of project. [This blog entry here](http://weblogs.asp.net/leftslipper/archive/2009/01/20/opening-an-asp-net-mvc-project-without-having-asp-net-mvc-installed-the-project-type-is-not-supported-by-this-installation.aspx) describes the procedure in sufficient detail.

What follows are the necessary bits that were required to get an ASP.NET MVC App running:

*   Start with the Web project template. Ensure that you target framework 3.5, because otherwise MVC's dependencies cannot be satisfied. Alternative routes should be some assembly redirecting or actually getting the source code of MVC and compiling it against framework 4.0. If anybody attempts, I'd love to hear!
*   Get your web.config beefed up. I am not fully certain yet what is definitely required since nerddinner's web.config looks seriously complicated. I already removed half of the stuff contained therein and things still work :)
*   Set up your global.asax and ensure that you have at least the standard URL route of controller/action/value with a suitable default (Most projects have a HomeController with an Index-Action)
Example:
<csharp>
void RegisterRoutes(RouteCollection routes)
{
    routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
    routes.MapRoute(
        "Default",
        "{controller}/{action}/{id}",
        new { controller = "Home", action = "Index", id = "" }
    );
}

protected void Application_Start(object sender, EventArgs e)
{
    RegisterRoutes(RouteTable.Routes);
}
</csharp>

*   Set up a Default.aspx that is pretty much empty, but has the following code in the Page.Load event handler:
<csharp>
public void Page_Load(object sender, System.EventArgs e) {
    HttpContext.Current.RewritePath(Request.ApplicationPath, false);
    IHttpHandler httpHandler = new MvcHttpHandler();
    httpHandler.ProcessRequest(HttpContext.Current);
}
</csharp>

This apparently ensures that calling the home of a web site kicks off the MVC stuff.

Armed with this my MVC Hello World was up and running without the need for a suitable project template.