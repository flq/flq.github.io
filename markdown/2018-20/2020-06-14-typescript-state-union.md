---
title: "How to typescript in react: I can haz better component states!"
tags: [programming, typescript, react]
date: 2020-06-14 17:30:00
---

After a crazy long hiatus in getting something written I would like to give you an update on how Typescript and react is being used while building the [ahead](https://aheadintranet.com) UI. The example here is inspired by an upcoming feature of the ahead
intranet which is always nice to have around - a simple poll to get quick feedback on a question.

Given these helpers here:

```typescript
type SimpleAction<K, V = void> = V extends void ? { type: K } : { type: K } & V;

function switchDefaultGuard<S>(state: S, action: never): S {
  return state;
}
```

You can define a [Typescript Union Type](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types) to be used in a reducer of your choice:

```typescript
type PollAction =
  | SimpleAction<"POLL_LOADING", { pollId: string }>
  | SimpleAction<"POLL_LOADED", { poll: Poll }>
  | SimpleAction<"VOTE_PLACED", { choice: PollChoice }>;
```

What this means is that in a reducer you can define a switch statement that is compile-time safe with regard to the structure of handled actions as well as whether you're handling all cases:

```typescript
function pollStateReducer(state: PollState, action: PollEvent): PollState {
  switch (action.type) {
    case "POLL_LOADING":
      return {
        ...state
        mode: "POLL_LOADING",
        pollId: action.pollId
      }
    case "POLL_LOADED":
      return {
        ...state,
        mode: "POLL_NOT_VOTED",
        ...poll
      }
    case "VOTE_PLACED":
      return {
        ...state,
        choice: action.choice
      }
    default:
      return switchDefaultGuard(state, action);
  }
}
```

so far, so _been there, done that_. But, why not using a union type for the UI state as well? After all, a certain piece of UI is often in one of several states in which different values may be relevant at a time. Let's try this out - The Poll component may be in one of two different states: **loading** and **unvoted state**.

```typescript
type PollState = { question: string } & (
  | {
    mode: "POLL_LOADING";
    pollId: string;
  }
  | {
    mode: "POLL_NOT_VOTED"
    choices: Choice[]
    choice: null | PollChoice
  })
```

What does the state tell us?

* In any mode, a question is available
* In the loading mode, there is a poll id
* In the mode where the user hasn't voted, there is a list of choices and the current choice taken

This is only a subset of the set of possible states that a poll component will sensibly display, but it should be enough for the sake of this post.

In our react component we can render the UI based on the mode-property of the state:

```typescript
function PollComponent({}) {
  /* Stuff like useReducer or similar */
  return (() => {
    switch (state.mode) {
      case "POLL_LOADING":
        return <p>Here we have the {state.pollId}</p>
      case "POLL_NOT_VOTED":
        return <p>Here we have {state.choices.length} and our current choice: {state.choice}</p>
      
    }
  })()
}
```

Sadly, we [do not have switch expressions in js/ts](https://esdiscuss.org/topic/proposal-switch-expressions), so we create a function and call it straight away to get a value. 
You can see that based on the discriminating mode-property, we get access to those parts of the state that are properly defined in a given mode. This gives you less runtime failure modes and more type-checking.

This is all fairly nice, but there's always a sour taste - I jumped some problems in this kind of setup. Let's revisit the reducer that handles the **VOTE_PLACED** action. There, the type of the `state` argument will be `PollState` - this isn't enough to specify the return value from your function. In order to be able to define it, Typescript must know which part of the union type you are defining, therefore you need to respecify the mode:

```typescript
case "VOTE_PLACED":
  return {
    ...state,
    mode: "POLL_NOT_VOTED",
    choice: action.choice
  }
```

so far, so cute - but we're still not there yet. The `state` is not constrained enough to be usable as a spread, because there are valid PollState sub-states that may have the `choices`-property missing, but which is nonetheless mandatory in the state object we are constructing. What we want is telling the compiler that our state is already of the type where **mode = "POLL\_NOT\_VOTED"**. How can we achieve that? `Extract` to the rescue!

Extract is a built-in type which we can use to extract the proper sub-type from the discriminated union. It's signature is remarkably simple, the explanation also:

```typescript
/**
 * Extract from T those types that are assignable to U
 */
type Extract<T, U> = T extends U ? T : never;
```

We can use it e.g. like such:

```typescript
type PollNotVoted = Extract<PollState, {mode: "POLL_NOT_VOTED"}>
```

which gives us the final version that compiles of the case-branch in the reducer above:

```typescript
case "VOTE_PLACED":
  return {
    ...(state as PollNotVoted),
    choice: action.choice
  }
```

Note that the cast has now removed the need to specify the mode in the return explicitly. The casted spread ensures that you stay in the proper sub-type of the discriminated union.

The basic idea that this code expressed is:

* Think about the different modes that your UI can be in
* Think about what the state encompasses in each mode

These are things that you'd probably do anyway - but now, if you feel like it, encode it in your type :)