---
title: "Json and local storage with elm"
layout: post
tags: [web, programming, javascript]
date: 2017-08-29 13:00:00
---


In the quest of porting a react/redux-app named [remorse][1] to elm, once more I came across the requirement to store the current progress of the user to local storage.
Now, dealing with json was easily the least enjoyable part of the port. elm requires you to specify encoders and decoders in order to get from json to your elm code and back.
To me, it does seem repetitive. After all, e.g. in .NET, when I have some instance, reflection allows me to understand the instance and then lets me build a fast encoder / decoder at runtime.
This option isn't available in elm.

The one advantage this approach __does__ have is forcing you to think very carefully about what you will put out to json. Your json models will most certainly become independent of your programming models, which is actually a good thing. _Still_ ...

Let us start with the user interaction. [The user clicks][2]{:target="_blank"} on "Save current settings"...

```
a [onClick SaveAppState] [text "Save current settings"]
```

The message is handled in the __update__ function [by creating a Command][3]{:target="_blank"} which will do the job. Let us look at the [contents of the command][4]{:target="_blank"}.

```
saveAppState model = 
  let
      map m = 
        {
          userInput = m.userInput,
          lettersInScope = m.lettersInScope,
          morseSpeed = m.morseSpeed,
          trainCount = m.trainCount
        } 
  in
    storeObject (stateKey, encode <| map model)
```

The `map` function is a straightforward mapper that extracts just those values that I care about in terms of persisting. That value is passed through an encoder, whose output is then stored.

Here's the [encoder][5]{:target="_blank"}:

```
import Json.Encode as J exposing (object)
...
encode : Progress -> J.Value
encode p =
  object [
    ("userInput", J.string p.userInput),
    ("lettersInScope", J.list <| List.map J.string p.lettersInScope),
    ("morseSpeed", J.float p.morseSpeed),
    ("trainCount", J.int p.trainCount)    
  ]
```

You see, we have to encode all that what we know about the target model into the encoder as well. To an old-fashioned Newtonsoft user this seemed ludicrous, but yes, reflection isn't really a thing in functional programming, and looking at __Haskell__, one of the fathers of elm, to pull off something more comfortable than this, it requires the programmer to use certain metaprogramming directives to instruct the compiler to do certain work for us.

The __final__ piece in the Puzzle is the `storeObject`, which is an interop function, because elm doesn't have an in-built API to talk to local storage.

```
port storeObject : (String, J.Value) -> Cmd msg
```

and [its implementation][6]{:target="_blank"}:

```javascript
const storage = window.localStorage || {
  setItem(k, v) {
    this[k] = v;
  },
  getItem(k) {
    return this[k];
  }
};

function storeObject(key, object) {
  storage.setItem(key, JSON.stringify(object));
}
```
The end result being that the desired values are stored in the browser's local storage for later retrieval.

There is no explicit functionality to load the currently stored settings - this happens when the application starts up. How?

* The elm application is started, inside the init it is requested to load json from local storage
* Once loaded, the data is made available, decoded and sent into the `update` part of the application.
* If data is available and correctly loaded, the data is taken into the main application model.

Let's go in reverse this time, beginning with the [retrieval functionality][7]{:target="_blank"} implemented in javascript.

```javascript
export function initLocalStoragePort(elmApp) {
  elmApp.ports.storeObject.subscribe(function ([key, state]) {
    storeObject(key, state);
  });
  elmApp.ports.retrieveObject.subscribe(function (key) {
    const o = retrieveObject(key);
    elmApp.ports.objectRetrieved.send([key, o]);
  });
```

Elm is very strict with regard to values entering your application from the outside. Basically, you perform a request (_Command_) and then wait for a response (_Subscription_):

```
port retrieveObject : String -> Cmd msg
port objectRetrieved : ((String, J.Value) -> msg) -> Sub msg
```

Let us look at the [subscription][8]{:target="_blank"}.

```
import Json.Decode as D exposing (int, string, float, list, Decoder)

appStateLoaded : Sub Msg
appStateLoaded =
  let
    getModel json = case (D.decodeValue modelDecoder json) of
      Ok m -> Just m
      Err _ -> Nothing
    retrieval (key, json) =
      OnAppStateLoaded (getModel json)
  in
    objectRetrieved retrieval
```

Using [the decoder][9]{:target="_blank"} `modelDecoder`, it is attempted to retrieve the data from local storage. The decoder
may fail, which should usually mean that a value has never been stored. Once the decoded model instance is available, it is piped into the system through a message (`OnAppStateLoaded`).

Finally, the whole chain is triggered with the `loadAppStateCommand` inside the init function which is called right at the beginning
of the program.

```
init location =
    let
        currentRoute = Route.parseLocation location
    in
        (initialModel currentRoute, loadAppState)
```

with `loadAppState` being...

```
loadAppState : Cmd msg
loadAppState = retrieveObject stateKey  
```

With the end result being, that when the application starts, settings will be loaded from local storage right into the model if there are settings available.



[1]: http://realfiction.net/remorse
[2]: https://github.com/flq/elmorse/blob/8db340ed97ffe00ae075d7cca4236962b8336570/src/Navigation/View.elm#L25-L27
[3]: https://github.com/flq/elmorse/blob/8db340ed97ffe00ae075d7cca4236962b8336570/src/Update.elm#L33-L34
[4]: https://github.com/flq/elmorse/blob/8db340ed97ffe00ae075d7cca4236962b8336570/src/StateStorage.elm#L42-L52
[5]: https://github.com/flq/elmorse/blob/8db340ed97ffe00ae075d7cca4236962b8336570/src/StateStorage.elm#L54-L61
[6]: https://github.com/flq/elmorse/blob/8db340ed97ffe00ae075d7cca4236962b8336570/src/localStoragePort.js#L21-L23

[7]: https://github.com/flq/elmorse/blob/8db340ed97ffe00ae075d7cca4236962b8336570/src/localStoragePort.js#L10-L17
[8]: https://github.com/flq/elmorse/blob/8db340ed97ffe00ae075d7cca4236962b8336570/src/StateStorage.elm#L18-L26
[9]: https://github.com/flq/elmorse/blob/8db340ed97ffe00ae075d7cca4236962b8336570/src/StateStorage.elm#L64-L69