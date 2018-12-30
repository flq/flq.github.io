---
title: "react/redux to elm feature comparison: playing morse sounds"
layout: post
tags: [web, programming, javascript]
date: 2017-08-21 19:56:00
---

This post is about how the feature of listening to morse sounds when pressing the button...

![ts auto-complete](/assets/play-morse-button.png)

...is implemented.

- [react/redux](#reactredux)
- [elm](#elm)

### react/redux

Let's start with the user interaction [in the UI][1]:

```html
<input
    type="button"
    className="soundButton"
    value="&#128266;"
    onClick={playSound} />
```

`playSound` is an action that is surfaced through react-redux' `connect`-functionality. The action [looks like that][2]:

```javascript
export function playSound() {
  return async (dispatch, getState) => {
    const { userInput, soundSpeed } = getState().typing;
    textAsMorseSound(userInput, soundSpeed);
  };
}
```

This type of function is supported by the [redux-thunk][3] middleware, which provides the dispatch and getState functions to be able to perform _side-effects_ within a user-UI interaction. [Digging deeper][4]: 

```javascript
export async function textAsMorseSound(input, soundSpeed) {
  for (let c of Array.from(input)) {
    var code = charToMorseCode(c);
    await asyncPlayMorse(Array.from(code), soundSpeed);
    await delay(DASH_LENGTH / soundSpeed); // Pause between chars
  }
}
//...
export function delay(millisecs, value = null) {
  return new Promise((res, rej) => {
    setTimeout(() => res(value), millisecs);
  });
}
```

The async/await, part of ES2017, but already available through babeljs-transpiling, allows you to work with promises much like you do with Tasks in the post .NET 4.5 world. 
This makes the code that performs the necessary time delays [much easier to read][5]. 

```javascript
// characters: Array of strings like "-" and "." and " "
export async function asyncPlayMorse(characters, soundSpeed = 1) {
  for (let c of characters) {
    switch (c) {
      case ".":
        startSound();
        await delay(DOT_LENGTH / soundSpeed);
        stopSound();
        await delay(DOT_LENGTH / soundSpeed);
        break;
      case "-":
        startSound();
        await delay(DASH_LENGTH / soundSpeed);
        stopSound();
        await delay(DOT_LENGTH / soundSpeed);
        break;
      case " ":
        await delay(PAUSE / soundSpeed);
        break;
      default:
        console.log(c);
        break;
    }
  }
}
```

Finally `startSound` and `stopSound` connect and disconnect the oscillator that [is set up][6] to the audio output of the browser.

### elm

As you can imagine, not every single browser API is surfaced to elm - hence the concept of defining ports, a subsystem that allows you to interop to plain javascript and its access to all of the browser's API.
Therefore, we go ahead and [define ports][7] to start and stop the sound:

```javascript
port audioOn : () -> Cmd msg
port audioOff : () -> Cmd msg
```

In javascript, we need to fill these ports [with life][8]:


```javascript
export function initAudioPort(elmApp) {
  let isConnected = false;
  elmApp.ports.audioOn.subscribe(function() {
    if (isConnected) return;
    oscillator.connect(audioCtx.destination);
    isConnected = true;
  });
  elmApp.ports.audioOff.subscribe(function() {
    if (!isConnected) return;
    oscillator.disconnect(audioCtx.destination);
    isConnected = false;
  });
}

// which is used like that:
const app = Main.embed(document.getElementById('root'));
initAudioPort(app);
```

Now that we have this in place, we can stay in elm to implement the functionality. Let's [start in the UI][9] again:

```javascript
input [
  type_ "button", 
  class "soundButton", 
  onClick OnListenToMorse,
  value "Play Morse" ] []
```

`OnListenToMorse`is a defined message that needs to be handled in the `update` function of your application.

```sql
update msg model = 
  case msg of
    -- stuff
    OnListenToMorse ->
      (model, Audio.playWords model.userInput model.morseSpeed)
```

Just like in the redux app, where I didn't show any reducer code, implying that nothing changes in the application's model, the only reaction here consists of initiating a _side-effect_.
[What happens in][10] `playWords` ?

```sql
playWords : String -> Float -> Cmd Msg
playWords words factor = 
  stringToMorseSymbols words
  |> List.map (convertSymbolToCommands factor)
  |> bringTogether

-- type of stringToMorseSymbols: String -> List MorseSymbol

convertSymbolToCommands: Float -> MorseSymbol -> List (Milliseconds, Msg)
convertSymbolToCommands factor symbol =
  let
    adapt (millisecs, msg) = (millisecs / factor, msg)
    adaptAll = List.map adapt
  in
    adaptAll <| case symbol of
      Dot -> playDot
      Dash -> playDash
      ShortPause -> playBetweenChars
      LongPause -> playBetweenWords
      Garbled -> playBetweenWords

-- example of the "play" functions:

playDot: List (Milliseconds, Msg)
playDot =  
  [
    (0, (SoundMsg StartSound)),
    (dotLength, (SoundMsg StopSound)),
    (pauseBetweenChars, NoOp)
  ]

-- from tuples to commands

bringTogether : List (List ( Milliseconds, Msg )) -> Cmd Msg
bringTogether = List.concat >> List.map toSequenceTuple >> sequence
```

In other words, first the user input is converted to a list of morse symbols.
This is then processed to a __list of list of tuples__ that state at 
which relative time in milliseconds which message should be piped into the update function (See e.g. `Dot -> playDot + applying speed factor`).

The final ingredient to this magic is the __sequence__ function from the elm package [delay][11]. [The code][12] is actually not super-complex,
it does the necessary plumbing to call out to __Process.sleep__ the elm equivalent to javascript's `setTimeout`.

What happens then, when the `SoundMsg StartSound` and `StopSound` messages are received?

```sql
update msg model = 
  case msg of
    -- stuff
    SoundMsg msg -> 
      Audio.update msg model

-- In audio update:

update : SoundMsg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    StartSound -> (model, audioOn ())
    StopSound -> (model, audioOff ())
```

And [here is where][13] you finally find the calls to the interop ports we defined to connect and disconnect the Oscillator :)

Which route do you prefer?


[1]: https://github.com/flq/remorse/blob/834762ec8185fa024160c397a07000e6cd7667fd/src/TypingScreen/TypingScreen.js#L37-L43
[2]: https://github.com/flq/remorse/blob/834762ec8185fa024160c397a07000e6cd7667fd/src/TypingScreen/Actions.js#L23-L28
[3]: https://github.com/gaearon/redux-thunk
[4]: https://github.com/flq/remorse/blob/834762ec8185fa024160c397a07000e6cd7667fd/src/components/SoundLib.js#L32
[5]: https://github.com/flq/remorse/blob/834762ec8185fa024160c397a07000e6cd7667fd/src/components/SoundLib.js#L40-L64
[6]: https://github.com/flq/remorse/blob/834762ec8185fa024160c397a07000e6cd7667fd/src/components/SoundLib.js#L14-L30
[7]: https://github.com/flq/elmorse/blob/ce330e70098106e988d92059c3762708c43646f5/src/Interop.elm#L5-L6
[8]: https://github.com/flq/elmorse/blob/ce330e70098106e988d92059c3762708c43646f5/src/Typing/audioPort.js#L23-L35
[9]: https://github.com/flq/elmorse/blob/ce330e70098106e988d92059c3762708c43646f5/src/Typing/View.elm#L36-L40
[10]: https://github.com/flq/elmorse/blob/8db340ed97ffe00ae075d7cca4236962b8336570/src/Typing/MorseAudio.elm#L37-L41
[11]: http://package.elm-lang.org/packages/andrewMacmurray/elm-delay/latest/Delay#sequence
[12]: https://github.com/andrewMacmurray/elm-delay/blob/2.0.2/src/Delay.elm
[13]: https://github.com/flq/elmorse/blob/8db340ed97ffe00ae075d7cca4236962b8336570/src/Typing/MorseAudio.elm#L17-L21