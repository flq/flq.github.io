---
title: "State design pattern, simplified?"
layout: post
tags: [software-development, download, dotnet]
date: 2007-01-22 15:03:53
redirect_from: /go/57/
---

While at a client, who is doing the transition from Procedural to OO, I constantly challenge them to get rid of their if-statements. One of them asked me how to solve a problem without an if in the case of a scenario where they load a control into their windows forms which is placed centrally on the form - It looks a bit like MDI with the difference that only one control is displayed at any time. What they do is bog-standard procedural: Check whether the control count on the panel in question is greater zero, which provides the answer what to do.

My answer to that was based on the state design pattern. A special 'SingleControlPanel' keeps an internal state object. One of it represents the situation where the panel is empty, the other one where the panel already carries a control. Subsequent actions are then delegated to the internal state objects. Another example of polymorphism, really. No if-statements to be seen anywhere. What is important,though, is defining the transition.

Based on that I sat down for two hours drawing up a Generic State Machine that could be configured and that provides the mechanism of delegating actions to the internal state object as well as performing the transition.

What I came up with was an abstract Machine class and an abstract State class.

    public abstract class Machine {
      protected State currentState;
    }

    public abstract class State {
      protected Machine machine;
    }

Hm, now people that inherit from this stuff must cast when they want to access their own machine from their own state classes and vice versa. But now we have generics, don't we? So what I now come up with looks like this:

    public abstract class Machine<S,M> where S : State<S,M> where M : Machine<S,M>  {
        protected S state;
    }

    public abstract class State<S,M> where S : State<S,M> where M : Machine<S,M> {
        protected M machine;
    }


Looks weird, I know, but it works excellently. When you derive from these classes the type orguments are your derived State Machine and your own Base State class and off you go with pretty cast-free access to all of your code. Additionally you get a ton of type-safety - which you will see when you configure your state machine...

After some hacking a first version was done. The first example I tried was of course dead simple (You need to motivate yourself with easy wins!) - A tape player which cannot even rewind (Your songs are gone, sorry). It knows a Start and a Stop state. It can change from Stop to Start and from Start to Stop. What follows is how you would implement your State Machine object with the aid of my state thingies:


    class TapePlayer : Machine<PlayerState,TapePlayer>, IPlayerOperations {

      protected override void ConfigureTransitions(
        ITransitionConfig<PlayerState,TapePlayer> config) {
          config.AddInitialState<StopState>();
          config.AddTransition<StopState, StartState>("Play");
          config.AddTransition<StopState, StopState>("Stop");
          config.AddTransition<StartState, StopState>("Stop");
          config.AddTransition<StartState, StartState>("Play");
      }

      public void Play() {
        Handle("Play");
      }

      public void Stop() {
        Handle("Stop");
      }
    }

The `IPlayerOperations` interface is a helper. In this simple scenario it gets implemented by all of your concrete States as well as your machine to get the method stubs quickly.

So what's the deal? You can add transitions. The Type arguments specify the From-State and To-State, respectively, while the string denotes the action on which the transition is to occur. So if you call "Play", and your From-State is the StopState, the To-State is the PlayState. All clear?
The funny thing is then that in the Interface methods implemented by the TapePlayer, the action is delegated via the Handle-method. That one ensures that the correct method is being called on your State object and that the transition is done according to your configuration. The definition of the States in the configuration is type-safe: You can only provide States that derive from your own State Base class. Only the darned strings should be hated. But so far (.NET 2.0) I see no way to avoid them.
Anyway, your state objects then look e.g. like this:


    class PlayerState : State<PlayerState,TapePlayer> {
    }

    class StopState : PlayerState, IPlayerOperations {

      public void Play() {
        Console.WriteLine("Beginning to play");
      }

      public void Stop() {
        Console.WriteLine("Already Stopped");
      }
    }

    class StartState : PlayerState, IPlayerOperations {
      public void Play() {
        Console.WriteLine("Already playing");
      }

      public void Stop() {
        Console.WriteLine("Stopping Player");
      }
    }

    interface IPlayerOperations {
      void Play();
      void Stop();
    }

Simple, sweet...and relatively useless so far. But wait. The two hours brought out more code to play with, so let's check out a more different example - The Bankaccount.
Let's look at the implemetation...


    class BankAccount : Machine<AccountState,BankAccount>, IAccountOperations {
      protected override void ConfigureTransitions(
        ITransitionConfig<AccountState,BankAccount> config) {

        config.AddInitialState<Standard>();
        config.AddTransition<Standard>("Transaction")
          .AddBranch<Premium>(ConditionToBePremium)
          .AddBranch<Overdrawn>(ConditionToBeOverDrawn);
        config.AddTransition<Premium>("Transaction")
          .AddBranch<Standard>(ConditionToBeStandard)
          .AddBranch<Overdrawn>(ConditionToBeOverDrawn);
        config.AddTransition<Overdrawn>("Transaction")
          .AddBranch<Standard>(ConditionToBeStandard)
          .AddBranch<Premium>(ConditionToBePremium);
      }

      public int Balance = 0;

      private bool ConditionToBePremium(BankAccount ba) {
        return ba.Balance > 10000;
      }
      private bool ConditionToBeStandard(BankAccount ba) {
        return ba.Balance <= 10000 && ba.Balance >= 0;
      }
      private bool ConditionToBeOverDrawn(BankAccount ba) {
        return ba.Balance < 0;
      }

      public void Transaction(int amount) {
        Handle("Transaction", amount);
      }

      public void AddInterest() {
        Handle("AddInterest");
      }
    }

You can see that the configuration allows for more complex transitions. AddTransition allows to define a From-State as type argument for a given action and then provides sweet method chaining to add branches where one can specify the To-State for a given condition. The conditions must be provided as Predicate-based delegates, where the input parameter of those is your own derived machine. In the case here the methods fulfilling the Predicate signature are defined on the machine itself, so the parameter is not necessary, but that way you are not really forced to define your conditions that way.

What about the States that are required? There they go...


    class AccountState : State<AccountState,BankAccount> {
      public virtual void Transaction(int amount) {
        machine.Balance += amount;
      }
    }

    class Standard : AccountState, IAccountOperations {

      public void AddInterest() {
        machine.Balance += (int)(machine.Balance * 0.05);
      }
    }

    class Premium : AccountState, IAccountOperations {

      public void AddInterest() {
        machine.Balance += (int)(machine.Balance * 0.1);
      }
    }

    class Overdrawn : AccountState, IAccountOperations {

      public override void Transaction(int amount) {
        if (amount < 0) {
          Console.WriteLine("You just cant substract any more money!");
          return;
        }
        base.Transaction(amount);
      }

      public void AddInterest() {
        // Acts as debt 'interest'!
        machine.Balance += (int)(machine.Balance * 0.1);
      }
    }

    interface IAccountOperations {
      void Transaction(int amount);
      void AddInterest();
    }

Enough of that. What's the point? Well, I was trying to see how nice you can go...once more I am doing a bit of Ruby and there you have things like acts_as_state_machine, a plugin that allows your Ruby class to act as ...well...a state machine. C# can't go quite as pretty, but with some reflection and generics you can spruce up a relatively useful thing.
Anyway, [grab the solution over here](/assets/StateMachine.zip), containing the Machine code as well as the two examples. If you find it useful, please let me know.
