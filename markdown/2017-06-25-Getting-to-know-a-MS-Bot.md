---
title: "Separating MS Bot's soul from its body"
layout: post
tags: [dotnet, programming, software-development, cloud]
date: 2017-06-25 20:00:00
---

For [my new gig][1] I had the chance to look into [Microsoft's Bot framework][2]. Said framework exists to

* provide the foundation of setting up chat _Dialogs_, similarly to how you would set up screen flows.
* Through its mechanisms of (de)serialization provide a suspendable state machine to keep a conversation with the user going and wire up necessary services like pre-canned dialogs or intention revealing services like [LUIS][3]
* Through the registration in the bot portal provide the basis of having bots serve multiple channels (think web, but also slack, Skype, Skype for Business, etc.)

The bot API comes in two flavours:

### The IDialog<T> interface

This is the basic building block of bots. Based on this interface you can package your functionality like MS has done it for example with the in-built Form dialog that will ask questions dictated by the shape of a provided object or the [location dialog][4], a pre-canned dialog to collect location data within a conversation with the help of Bing Maps. The type argument of a Dialog refers to its return value. In the case of the location dialog this is e.g. a __Place__ object.

### The Chain fluent API

This API allows to chain those callbacks, switches and similar things that you would usually place into a Dialog as lambdas and such construct a bot without having to explicitly define Dialogs yourself.

My main quarrel with the API is that back in your mind you always need to consider that your Dialog must be serializable. This puts a few restrictions on your design, e.g. how you treat your injected services. Also, with the default serializer you will run into trouble when in your continuations, which you usually express as lambdas, you try to access an instance field of the dialog. In this case the serialization system will just complain bitterly that you simply cannot do that. To get out of that problem, your continuations get access to the state data through an interface passed in.

Another thing is that the API does not make it easy for you to separate the _"soul"_ of your Dialog, the business logic, from the necessary plumbing of the Dialog API, nor is there any guidance on how to do that.

Granted, all dependencies are accessible through interfaces, such that an `IDialog` implementation is in theory testable. However, you'll still have the issue of having a class whose structure is predominantly shaped by the technicalities of the Bot API while containing the logic of your conversation.

What follows is one way to get that separation done. The idea is to define a _Saga_, where I am using the word in the sense as it is [introduced e.g. by NServiceBus][5].

### the bot's body

Let us introduce an IDialog implementation that supports kicking off a so-called __Customer Saga__.

```csharp
[Serializable]
public class CustomerSagaDrivenDialog<T> : IDialog<object> where T : ICustomerSaga
{
    public Task StartAsync(IDialogContext context)
    {
        var customerSaga = Conversation.Container.Resolve<T>();
        context.SetSaga(customerSaga);
        context.Wait(WaitForUserToStart);
        return Task.CompletedTask;
    }
    ...
}

public interface ICustomerSaga
{
    Task<ProcessResponse> Start(string input);
}
```

The container (which btw is an AutoFac container, i.e. thank the decent engineers working on this that it's not Unity) resolves our Saga and is directly put into the __context__. Context is an object which also implements `IBotData`, an interface which abstracts away the access to data which consitutes the state of your conversation and user interaction. Then we wait for the user to talk to our bot. Once this happens...

```csharp

private async Task WaitForUserToStart(IDialogContext context, IAwaitable<IMessageActivity> result)
{
    var r = await result;
    context.ConversationData.TryGetValue("saga", out T saga);
    var whatNext = await saga.Start(r.Text);
    HandleWhatNext(context, whatNext);
}

```
We await the result that contains amongst other info the user's input, obtain/deserialize the saga from the bot's state, and call the __Start__ method of the saga with the user's input. __whatNext__ is just a sloppy name for an object that will help us to dispatch what should happen next in the dialog.

```csharp
private async void HandleWhatNext(IDialogContext context, ProcessResponse whatNext)
{
    whatNext.Being<ContinuedResponse>(context.SetContinuation);

    switch (whatNext)
    {
        case TerminateDialog td: ...
        case AskForAddress afa: ...
        case PromptResponse pr:
            PromptDialog.Text(context, async (dialogContext, result) =>
            {
                var response = await result;
                var continuation = await dialogContext.CallContinuation<T>(response);
                HandleWhatNext(dialogContext, continuation);
            }, pr.Prompt);
            break;
        default: ...
    }
}
```

`ProcessResponse` is the name of the abstract class from which all actions emanating from the Saga inherit. With the new switch enhancement we can now also pattern-match on the actual return type halfway decently even in C#. Also of note is the first line that will store the continuation of said action __if__ the action is a `ContinuedResponse`. All `ProcessResponse` types are a `ContinuedResponse` apart from those that, well, end the dialog and hence have no continuation, e.g. the `TerminateDialog` type.

The code above shows one example how the Saga's action is handled. Here, a Bot Dialog helper is used to prompt the user with some text, then, with the user's response the continuation is called that had previously been stored in the context.

What happens in `CallContinuation`?

```csharp
public static async Task<ProcessResponse> CallContinuation<T>(this IDialogContext ctx, object input) 
    where T :  ICustomerSaga
{
    ctx.ConversationData.TryGetValue("saga", out T saga);
    if (ctx.ConversationData.TryGetValue("continuation", 
        out ContinuedResponse continuation))
    {
        var value = await continuation.Call(saga, input);
        // The saga may have changed its internal state and 
        // wants back into the bag
        ctx.SetSaga(saga);
        return value;
    }
    return ProcessResponse.NoOp;
}
```

Here the saga is taken from the context as well as a previously stored continuation. Once both are obtained, the continuation is called with the current input that has been provided by the bot framework. This could be a simple text from the user, or some complex object from some child dialog that has just completed. Also of importance is that after having obtained the next action from the Saga, the saga is put back into its box, as it may have changed its internal state (which is kind of the whole point of a Saga).

In the continuation call we get a little bit dirty:

```csharp
public Task<ProcessResponse> Call(object saga, object input)
{
    var method = saga.GetType().GetMethod(Continuation, 
      BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
    if (method == null)
        return Task.FromResult<ProcessResponse>(
            new TerminateDialog { 
                Text = $"Failure to identify a continuation from {Continuation}" 
            });
    var result = method.Invoke(saga, new [] { input });
    return (Task<ProcessResponse>)result;
}
```

A sprinkle of reflection helps us break the chains of serialization. My first attempt had been to store an actual delegate
as continuation, but since those continuations need to be serializable, the default serializer was in deep trouble with those.
Hence the necessary weakening of compile-time safety.

Now that we have covered the _body_, let's look at the bot's _soul_.

### the bot's soul

Let us look at the setup of the Saga:

```csharp
public class SomeSaga : ICustomerSaga
{
    private IIntentRecognition _intentRecognition;

    public SomeState State { get; set; }
    
    [UsedImplicitly]
    public AddressChangeSaga(IIntentRecognition intentRecognition)
    {
        _intentRecognition = intentRecognition;
    }

    [OnDeserialized]
    private void OnDeserialized(StreamingContext context)
    {
        _intentRecognition = Conversation.Container.Resolve<IIntentRecognition>();
    }
    ...
}
```

The deserialize hook is where things are ugly. The bot framework does not seem to use AutoFac to pull a bot state item
back into life, hence we cannot trust our dependencies to be correctly injected in this situation. That is where the deserialize hook comes into play and _"injects"_ the dependencies into the Saga. Thankfully this doesn't cause much problems in testing since there we can create the Saga as usual through its constructor.

Finally, let us look into the Saga's Start method:

```csharp
public async Task<ProcessResponse> Start(string input)
{
    var intent = await _intentRecognition.FigureOutIntent(input);
    switch (intent)
    {
        case UserIntent.Greeting:
            return new PromptRespons
                Prompt = BotTexts.GreetingText, 
                Continuation = nameof(Start) 
            };
        case UserIntent....:
            return new PromptResponse { 
                Prompt = BotTexts.QuestionForNameText, 
                Continuation = nameof(FindCustomer) 
            };
    }
    return new TerminateDialog { Text = "Woa, you got me there \U0001F937." };
}
```

As you can see the _soul_ of the dialog is now decoupled from the Dialog's mechanics. The `nameof` helps us to alleviate the pain of necessary reflection by keeping refactoring support going and helping us pick the right method to continue to.

Where we still need to keep an eye on is that the type of the argument to the continuation matches the requirements, e.g. here, after a user has provided us with an address:

```csharp
private async Task<ProcessResponse> AddressObtained(Place place)
{
    try
    {
        ...
        await _someService.UpdateAddress(place);
        return new TerminateDialog { Text = BotTexts.AddressUpdatedAndProcessFinishedText };
    }
    catch (Exception)
    {
        return new TerminateDialog { Text = BotTexts.FailedToStoreAddressText };
    }
}
```

It seems like quite a bit of work, considering that `IDialog` implementations are indeed testable by virtue of all dependencies being interfaces. But consider this: A conversational interaction with a user will be full of branching, fallbacks, a lot of dispatching and state keeping. I am farily convinced that it makes sense to decouple conversation logic
from the bot infrastructure, because stuff will get __complicated quite quickly__ and what better way to tame complexity than to separate concerns. 

[1]: http://www.isolutions.ch/Seiten/default.aspx
[2]: https://dev.botframework.com/
[3]: https://www.luis.ai/home/index
[4]: https://github.com/Microsoft/BotBuilder-Location
[5]: https://docs.particular.net/nservicebus/sagas/