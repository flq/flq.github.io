---
title: "Using typed action creators with react's useReducer hook"
tags: [programming, javascript, react]
date: 2019-03-12 19:30:00
published: false
---

With the advent of react hooks we now have very fast access to CQRS in our UI - dispatch actions (_Command_) and create a new read state (_Query_) for the UI based on the previous state and the action. If you follow e.g. Dan Abramov on twitter you will have seen plenty of examples à la:

```javascript
...
const [state, dispatch] = useReducer(reducerFunction, initialState);
...
dispatch({type: "DoSomething"});
...
<p>{state.resultFromDoingSomething}</p>
...
```

In the world of Typescript we can provide quite a bit of type safety around dispatching actions and defining reducers for those functions. These libraries are usually used in combination with [redux][1], but since the dispatch and the reducer function from `useReducer` are kind of the same thing™, such libraries that help defining action creators and reducers should work with `useReducer`, too, right?

Personally I know of two libraries that fit the bill, [typesafe-actions][2] and [unionize][3]. For the example I'll go with the canonical react app, the counter :)

## Using typesafe-actions

Let's define the action creators, state and the reducer:

```typescript
import {
  createAction,
  getType,
  createStandardAction,
  ActionType,
} from 'typesafe-actions'

const Actions = {
  increment: createAction('INCR'),
  decrement: createAction('DECR'),
  reset: createAction('RESET'),
  setValue: createStandardAction('SET')<number>(),
}

type State = { counter: number }

const reducer = (s: State, a: ActionType<typeof Actions>) => {
  switch (a.type) {
    case getType(Actions.increment):
      return { counter: s.counter + 1 }
    case getType(Actions.decrement):
      return { counter: s.counter - 1 }
    case getType(Actions.reset):
      return { counter: 0 }
    case getType(Actions.setValue):
      return { counter: a.payload }
  }
}
```

What we get at this point is compile-time safety around

- the state (what goes in and comes out)
- an exhaustive match in the switch statement, resulting from the union of all valid actions

While this is undeniably more code than the javascript version, using this in an editor like VS Code is quite a joy.

Let's improve the experience and create a hook that instead of the `dispatch` will give use the action creators already bound to the dispatcher.

```typescript
import { Reducer, useReducer, useMemo } from 'react'
import { ActionType } from 'typesafe-actions'

export function useTypesafeReducer<
  S,
  Actions extends { [key: string]: (...args: any[]) => any }
>(
  reducer: Reducer<S, ActionType<Actions>>,
  initialState: S,
  actions: Actions
): [S, Actions] {
  const [state, dispatch] = useReducer(reducer, initialState)
  const boundActions = useMemo(() => {
    function bindActionCreator(
      actionCreator: (...args: any[]) => any,
      dispatcher: typeof dispatch
    ) {
      return function(this: any) {
        return dispatcher(
          actionCreator.apply(
            this as any, (arguments as unknown) as any[])
        )
      }
    }

    const newActions = Object.keys(actions).reduce(
      (ba, actionName) => {
        ba[actionName] = bindActionCreator(
          actions[actionName], dispatch)
        return ba
      },
      {} as { [key: string]: (...args: any[]) => any }
    )
    return newActions
  }, [dispatch])
  return [state, boundActions as Actions]
}
```

The function `bindActionCreator` is pretty much taken from [`bindActionCreators`][4] which can be found in the redux codebase. It constructs a function that passes the arguments provided to the action creator and dispatches the result.
The `Object.keys(actions).reduce` code constructs an object that has the same shape like the actions passed in but instead provides functions bound to the `dispatch` function returned by `useReducer`. All of this is wrapped in a `useMemo` hook since dispatch and actions will not change throughout the lifetime of the component using this hook.

How, is this used then? Based on the previous code that introduced the actions and the reducer, we can write the following component:

```typescript
function App() {
  const [state, actions] = useTypesafeReducer<State, typeof Actions>(
    reducer,
    { counter: 0 },
    Actions
  )

  return (
    <>
      <button onClick={actions.increment}>Increment</button>
      <button onClick={actions.decrement}>Decrement</button>
      <button onClick={actions.reset}>Reset</button>
      <button onClick={() => actions.setValue(7)}>Set to 7</button>
      <h2>Counter is {state.counter}</h2>
    </>
  )
}
```

## Using unionize

The major differences in usage in this particular scenario are the definition of the action creators and the reducer. Here they are for completeness' sake.

```typescript
import { unionize, ofType, UnionOf } from "unionize";
const Actions = unionize({
  increment: {},
  decrement: {},
  reset: {},
  setValue: ofType<{ value: number }>()
});

const reducer = (s: State, a: UnionOf<typeof Actions>) =>
  Actions.match(a, {
    increment: () => ({ counter: s.counter + 1 }),
    decrement: () => ({ counter: s.counter - 1 }),
    reset: () => ({ counter: 0 }),
    setValue: a => ({ counter: a.value }),
    default: () => s
  });
```

As you can see, there are neat ways to leverage the redux ecosystem for the new react hooks world. In terms of type-safety and code completion this is a fairly interesting way to work with the new `useReducer` hook.

[1]: https://redux.js.org/
[2]: https://www.npmjs.com/package/typesafe-actions
[3]: https://www.npmjs.com/package/unionize
[4]: https://github.com/reduxjs/redux/blob/master/src/bindActionCreators.js
