---
title: "Combat fatty WPF VMs - Controller"
layout: post
tags: programming dotnet WPF patterns
date: 2013-08-05 20:23:25
redirect_from: /go/227/
---

## TL;DR
Don't dismiss controllers in a MVVM scenario - they remain useful and are an easy target for certain responsibilities that would burden VMs. With some infrastructure they can look much like Web-style controllers.

## MVVM

I hear you groan - there is not much that can beat those 4 letters on the boredom scale. Model-View-ViewModel.
This pattern is meant to play well in WPF - You know, 

> Data binding, the promise of a reactive UI, 
> a puppet that dances according to your data-powered, notify property-infused _will_, 
> attached to thin (Dispatcher) threads.

Unfortunately some concerns are not addressed very well.

* Where does the model come from?
* Where does data you are showing come from?
* What with all the things the user wants to do?
* Questions / Validation / Navigation?
* What if you actually _don't have_ a Model to begin with?

All this can lead to fatty View Models - unwieldy behemoths, with fat constructors, a concoction of methods, properties with the cohesion that compares favourably only to a young star nebula.

## C

_Dude_, I hear MVC devs say, you want to sell us Controllers as something new? Why, of course not - they are an old concept, but nonetheless can be very useful. Controllers lend themselves nicely to **responding to user or programmatic events that request the activation of a new screen**, and to take **some of the burden of setting VMs up for display**.

In a web app the frameworks you use usually let you map Actions/Controllers easily to **urn**s. We don't have that nice simplicity in a WPF app - Here, **messages** can take the role of uniquely identifying a Route to which the Controller must respond.

This begins to look rather similar to Web-MVC-Style controllers if you consider that the input parameters of a Web request are often mapped to some object through the *might* of **Model Binding**.

In our current infrastructure we achieve this structural equivalence through the use of Membus. Instantiating some class that you designate as a controller and subscribing it to Membus allows you to write methods like these:

	public Activate<SomeNiceViewModel> Activate(ActivateSomething request)
	{
	    VMArguments args;
	    using (var session = _session())
	    {
			var tmp = session.Query<SomeModel>().FirstOrDefault()
	        var model = tmp ?? new SomeModel();
	        args = new VMArguments(model)
	        {
	            StartInEditMode = tmp == null
	        };
	    }
	    
	    var viewModel = _vmFactory.With(args).Instantiate<SomeNiceViewModel>();
	
	    return ActivationMessage.For(viewModel);
	}


_ActivateSomething_ is something that is published from some other area of the application. What you see as a reaction to the message is some light example on preparing the *model* and providing it to the view model through a set of arguments which may contain additional parameters. The return value of the method is treated as a message by Membus. Provided that you have a listener to that message (in our case a **Conductor with a single active item**, with only some modifications to what you get OOTB from Caliburn.Micro)

This example e.g. shows that for obtaining the underlying model, the VM does not require a dependency on some session provider or anything like that - this pattern allows you to make the basic **routing** in your application explicit - Just inspect your controllers and the messages they consume as well as the return values they provide. 

It does not have to stop there. Other things you could pass into it:

* Tasks that return some value based on a query or whatever else
* ViewModels meant for composition, e.g. a backend for a searchable, paginated Grid and the like
* The actual models, of course ;)
