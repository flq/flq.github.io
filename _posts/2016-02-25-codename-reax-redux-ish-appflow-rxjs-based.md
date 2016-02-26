---
title: "codename reax - redux-ish appflow, rxjs-based"
layout: post
tags: [software-development,javascript]
date: 2016-02-25 14:00:00
---

I have to admit: I have not done much [redux][0] yet. My colleague has and I was able to help him at times and look over his shoulder. Redux is possibly the (_currently_) most popular implementation of the pattern coined as **Flux** by facebook. I wouldn't be surprised if people would call it reactive loop or something along those lines. At least you'll see me using this term ;)

Whatever implementation you use, they will have in common the way in which the UI informs about user actions, a place to act upon those actions and a place to modify some kind of state which dictates the data and state of the UI on the next render pass.

    UI -> dispatch(a : Action) -> **logic e.g. in Stores etc.** -> New State -> UI

I have been a big friend of the concept of Observables and the utilities built around them in the form of the Rx libraries since I got to know it on .NET. In js we get the functionality via [rxjs][1].

For some time I wanted to see how I could use the power of observables to get a reactive loop going. I wanted to end up with the basic notion of an _application function_ which has the following signature:

    (state, action) -> new state

I have been working irregularly towards a prototype, at the end it got quite a bit more polished than that. You can find the current results at the **[reax repository at github][2]**.

The core of the idea is that there is a state observable as well as an action observable.

These two observables are zipped together and the resulting return value is fed back onto the state observable.

    var allSyncStates = map(app.appFuncs, (appFunc) => {
      return actionObservable
        .filter(createAppFuncFilter(appFunc.selector))
        .withLatestFrom(stateObservable,
          (action, state) => { return { state, action } })
        .map(wrapFuncWithErrorDispatch(appFunc.func, additionalContext));
    });

This is one of the hearts of the whole reax loop. Whenever a dispatch occurs (e.g. from within the UI), the action observable will produce a new element. It will be filtered depending on the action type (_simply its type property_) and then zipped with the latest element from the state observable. That is the one that provides the sequence of state changes, and to which e.g. react components are subscribed.

This zipping together happens for all application functions that you provide. Due to the way how action and state are joined and due to the call within the _map_ of the resulting observable, we can provide functions with exactly the signature I was desiring.

Since we now have as many state observables as application functions, we need to merge them together. Thanks to rxjs, a straightforward operation:

    const stateStream = Observable.merge(allSyncStates.concat(allAsyncStates));

The async state providers need to be treated differently. Hence, the application functions are also treated differently, but they are allowed to return a promise which will eventually provide a state.

To mitigate some of the problems that result in having functions providing state possibly after some other action may already have changed the state, the state parameter to the application functions is not the state object, but a function providing the state object.

An additional change for convenience was to allow application functions the access to the dispatcher function with which new actions can be dispatched. This makes for the nice signature:

    (s, a, d) => ... //State, Action, Dispatcher

A logical progression for this project is the ability to dispatch Observables that will produce actions:

    d(Observable
      .timer(200,200)
      .take(COUNTER_START - s().counter)
      .map(_ => ({ type: 'tick', increment: -1 })));

Finally there is the Observables-speciality that once an exception is thrown in some running observable, that particular instance is dead. There are ways to pick up but the easiest in the context of reax is to catch any exceptions arising from an application function and feed them back into the reactive loop in the form of an action with the type being **"error"** (See `wrapFuncWithErrorDispatch` above).

The first level of the API follows the builder pattern. It allows to
* set the initial state
* add application functions (sync and async)
* add action sources (observables whose output will be dispatched as actions)
* add state refiners: methods with the signature s => s, which allow you to look at the state resulting from the call of application functions, possibly refine it, or simply monitor it.

Here's an example from a test:

    const app = appBuilder()
      .addAppFunc('foo', (s,a) => ({ count: s().count + 1 }))
      .addStateRefinement(s => ({ count: s.count * 2 }))
      .setInitialState({ count: 1 })
      .build();

    let {dispatchAction,getCurrentState} = appInit(app);
    dispatchAction(fooAct);
    // s1 (1) -> refine -> s2 (2) -> foo -> s3 (3) -> refine -> s4 (6)
    assert.equal(getCurrentState().count, 6);

The second level of the API provides the possibility to pass in functions to the builder based on conventions. Here you have a very simple undo module that will work.

    function undoApp() {

      const stateStack = [];

      return {
        onUndo(s,a,d) {
          stateStack.pop(); // current
          var last = stateStack.pop();
          return last;
        },
        monitorState(s) {
          stateStack.push(s);
        }
      }
    }

    const app = appBuilder()
      .addApp(undoApp)
      .build();

The conventions are summarized quickly:

* Any function beginning with _"on"_, the remaining name will be camel-cased and the function will be registered for actions whose type-property equal the camel-cased name (_onUndo -> undo_).
* Any function that starts with _"refine"_ or _"monitor"_ will be registered as a state refiner.

Up to here we have no dependency to React (much like redux), but rather a way to listen to actions/messages and pushing changes to a tracked state object.

The second part of the project is heavily inspired by Redux in that we have

* A Connector React-component that is the home of the _app_ as constructed by the app builder and which makes sure that the state changes are communicated to the React API.
* A connect method that can be called on React components and provides them access to the dispatch function and which allows to influence what kind of state the connected component gets to see. The code used here really is a copy of the [react-redux][3] code, stripped of code which I assume to be hardening :)

A more complete example, inspired by the [launch][4] [example][5] provided by **Jean-Jacques Dubray** can be found [here][6].

Other things I would have to look at before I would say that this is definitely useful...

* Support for async app funcs, action providers and initial state in the high-level API.
* Support for a mount point for application functions belonging together (i.e. only seeing / updating a branch of the tree.)
* Looking into a compatibility layer to redux-based projects _(wouldn't it be nice to be able to use redux forms while still using reax for the reactive loop?)_

All in all I am relatively happy with the result. What I like is that the Observable powers are usually never too far away to be used. I am also happy with the way the reactive loop is set up, something that I find a little bit more daunting than it should be in redux. Lately I have been wondering whether the state that is used to render the UI is nothing more than a glorified global variable, but I suppose that this is a different story that should be told at another time.

[0]: https://github.com/reactjs/redux
[1]: https://github.com/Reactive-Extensions/RxJS
[2]: https://github.com/flq/reax
[3]: https://github.com/reactjs/react-redux
[4]: http://www.infoq.com/articles/no-more-mvc-frameworks
[5]: https://bitbucket.org/snippets/jdubray/9dgKp/sa-sample
[6]: https://github.com/flq/reax/blob/master/samples/launch.js
