---
title: "Use react's context to display an error message somewhere else"
tags: [programming, javascript, react]
date: 2019-03-11 19:30:00
published: false
---

> Honestly, the end result seems so trivial that I almost couldn't be bothered
> to write it up. Then again, it shouldn't take too much time to write it down. 🤷‍

## The problem

react components allow you to deal with all aspects of some interaction with the user.
But maybe you want some parts of the interaction to visually appear somewhere else?

_Example_: A form has a component that renders a delete button and also takes care of triggering the actual deletion. However, in case of an error you want the error to display in the error area of the whole form.

![example of problem](/assets/error-outlet-1.png)

## A solution

Let's have some functionality dedicated to allowing components to render an error to some other place. For this we define a react context and a component that makes it simple to use that context:

```javascript
const ErrorContext = React.createContext()

export function ErrorDisplayBoundary({ children }) {
  const [error, setError] = useState(null)
  const ctx = useMemo(() => ({ error, setError }), [error])

  return <ErrorContext.Provider value={ctx}>{children}</ErrorContext.Provider>
}
```

the context allows to change the error. In order to propagate rerenders every time that this component renders, we memoize the context. The `setError` callback remains stable throughout the lifetime of the component, hence we only check whether `error` changes.

Next comes a component which is used to show the error in the place where you want it.

```javascript
export function ErrorOutlet() {
  const { error } = useContext(ErrorContext)

  return (
    error && (
      <div role="alert">
        {error.message}
      </div>
    )
  )
}
```

If the error context provides an error, it will be rendered. How do we communicate errors to the context? You can think of one of two ways.

#### Component with error prop

```javascript
export function ErrorInlet({ error }) {
  const ref = useRef()
  const errorContext = useContext(ErrorContext)

  useEffect(() => {
    if (errorContext === ref.current) {
      // This render has not been triggered via the context
      errorContext.setError(error)
    } else {
      ref.current = errorContext
    }
  })
  return null
}
```

This component doesn't ever render anything. However, you can pass it an error property and will then communicate the error to the context. Just notice however that the error property is not necessarily in sync with the error stored in the error context. This should be a good thing, since the component will simply not overwrite any error in the context as long as it's not rerendered.

Also note the use of `useRef` - the `ErrorInlet` has exactly 2 reasons why it could be rendering: 

* Either by the parent component rendering it, or 
* by the error context changing. 

With the `useRef` we can track the context in use and hence decide whether the error inlet is being rendered - in which case the error passed in will be set.

Look e.g. at this component:

```javascript
function UsingErrorInlet() {
  const [someError, setTheError] = useState(null)
  return (
    <>
      <h2>Via component</h2>
      <ErrorInlet error={someError} />
      <button onClick={() => setTheError(new Error('Ouch, that hurts!'))}>
        Press to render an error message somewhere
      </button>
      <button onClick={() => setTheError(null)}>Get rid of it</button>
    </>
  )
}
```

Note that if `someError` is null and you'd try to overwrite by setting to null, react notices that the state is already null and won't rerender anything!

#### using "useErrorOutlet" hook

This hook is implemented as follows:

```javascript
export function useErrorOutlet() {
  const errorCtx = useContext(ErrorContext)
  return errorCtx.setError
}
```

And can be used e.g. like this:

```javascript
function UsingErrorHook() {
  const setError = useErrorOutlet()
  return (
    <>
      <h2>Via hook</h2>
      <button onClick={() => setError(new Error('Ouf, painful!'))}>
        Press to render an error message somewhere
      </button>
      <button onClick={() => setError(null)}>Get rid of it</button>
    </>
  )
}
```

`setError` may also be used in an effect when the error appears as a value relevant for rendering.

Finally, an App using this would look something like this:

```javascript
function App() {
  return (
    <ErrorDisplayBoundary>
      <p>Here be errors...</p>
      <ErrorOutlet />
      <hr />
      <UsingErrorInlet />
      <hr />
      <UsingErrorHook />
    </ErrorDisplayBoundary>
  )
}
```
