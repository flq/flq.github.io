---
title: "Extracting useful types from a mapped action creator"
tags: [programming, typescript, react]
date: 2019-06-21 17:30:00
---

The context: **typescript, redux, react.**

You may or may not know that if you dispatch a thunk (those action creators that return a function that is then processed by the **redux-thunk** middleware), you can actually _await_ the dispatch and the return value from the dispatched thunk will also be returned...

```typescript
import { updateSomething } from "./relevantStore";

export type ComponentProps = ReturnType<typeof mapStateToProps> & 
                             typeof mapDispatchToProps &
                             { someId: string };

export class Component extends Component<ComponentProps> {
  ...
  update = () => {
    const { someId, someState } = this.props;
    this.props.update(someId);
  };
}

function mapStateToProps(state: State) {
  return {
    someState: state.someState
  };
}

const mapDispatchToProps = {
  update: updateSomething
};

connect(mapStateToProps, mapDispatchToProps)(Component);
```

In this example, **updateSomething** is an action creator producing a thunk. We then had the situation that we were interested in the return value of said thunk (A simple boolean that states whether the update was successful or not). However, such an async action creator looks something like that:

```typescript
export function updateSomething(id: string) {
  return async (dispatch: Dispatcher, getState: () => State) => {
    //Do fancy stuff
    return true;
  }
}
```

When this is mangled through the `connect` from **react-redux**, we can call the function and can await the return value of the thunk. That is, in Typescript terms this amounts to a function of the signature `(id: string) => Promise<boolean>`. Alas, the original async action creator has the signature 

```typescript
(id: string) => (d: Dispatch, getState: () => State) => Promise<bool>
```

_Ouf_, this is definitely not the return value we want to await! 

## What can we do?

Let's create some helper Typescript that will extract the type

```typescript
(id: string) => Promise<bool>
```

from

```typescript
(id: string) => (d: Dispatch, getState: () => State) => Promise<bool>
```

Let's define the **ThunkAction**, it is the signature of the function that is returned from an async action creator, alongside the type definition(s) of such
async action creators:

```typescript
export type ThunkAction<R, S, A extends Action> = 
  (dispatch: ThunkDispatch<S, A>, getState: () => S) => R;

export type AsyncActionCreator1<T1, R, S, A extends Action> = 
  (arg1: T1) => ThunkAction<R, S, A>;
export type AsyncActionCreator2<T1, T2, R, S, A extends Action> = 
  (arg1: T1, arg2: T2) => ThunkAction<R, S, A>;
export type AsyncActionCreator3<T1, T2, T3, R, S, A extends Action> = 
  (arg1: T1, arg2: T2, arg3: T3) => ThunkAction<R, S, A>;
```
Here, we just cater for async action creators that may accept more than one argument. A max of three ought to be enough 😁.

Next, we define a type that describes a function - its type argument is itself a function, namely an async action creator.

```typescript
// tslint:disable-next-line:ban-types
export type BoundAsyncAction<F extends Function> = 
  F extends AsyncActionCreator1<infer T11, infer R1, unknown, any>
  ? (arg: T11) => R1
  : F extends AsyncActionCreator2<infer T21, infer T22, infer R2, unknown, any>
  ? (arg1: T21, arg2: T22) => R2
  : F extends AsyncActionCreator3<infer T31, infer T32, infer T33, infer R3, unknown, any>
  ? (arg1: T31, arg2: T32, arg3: T33) => R3
  : never;
```

First we tell the linter to shut up about the function type - it is a good type constraint for the thing we want to check.
Then we define a conditional type - this caters for the different type definitions related to the differing number of input arguments.
Then, for each case we want to consider we produce the desired type definition, e.g.

```typescript
AsyncActionCreator1<T11, R1, unknown, any> /* => becomes */ (arg: T11) => R1
```

Based on this type definition we can create a utility function that will do the type conversion for us:

```typescript
// tslint:disable-next-line: ban-types
export function exposeReturnOfAsyncAction<F extends Function>(f: F): BoundAsyncAction<F> {
  return (f as any) as BoundAsyncAction<F>;
}
```

You may think that that `any` looks a bit dodgy but the correct function definition is passed to the type that is handling what type to produce from the input.
This means that if the passed function cannot be mapped to any of the known signatures of an AsyncActionCreator, the compiler will complain...

```typescript
const foo = exposeReturnOfAsyncAction(() => "Hello");
foo(); // TS2349: Cannot invoke an expression whose type lacks a call signature. Type 'never' has no compatible call signatures.
```

Now you can use the utility function in the example shown in the beginning to change the signature of the async action creator:

```typescript
const mapDispatchToProps = {
  update: exposeReturnOfAsyncFunction(updateSomething)
};

// and later inside the component

update = async () => {
    const { someId, someState } = this.props;
    return await this.props.update(someId);
}; // Signature of update: (id: string) => Promise<bool>
```

It is a bit of an involved type, but you only need to define it once and are then you're free to use it whenever it is needed.