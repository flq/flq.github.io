---
title: "How to type a React form onSubmit handler - addendum"
tags: [react, typescript]
date: 2021-05-20 14:00:00
---

Yesterday I read Kent's post on how [you can have Typescript help you type the onSubmit handler][kent]. Have a read by all means - Kent makes a point of providing content that explains concepts from the ground up, so it's perfect preparation for my ramblings on Typescript types. 

When I watched the introduction to [Remix v1 beta][remix-video], one thing that didn't make me happy was to see how little Typescript would be able to help me with sending form data. Kent's article already brings in some typing goodness to improve the situation.

The type that makes available concrete, named form elements to the submit handler can be generalized so that you can reuse it in other situations:

```typescript
type TypedFormEvent<T> = React.FormEvent<
  HTMLFormElement & {
    elements: T & HTMLFormControlsCollection;
  }
>;

interface MyForm {
  userNameInput: HTMLInputElement;
}

function Test() {
  function handleSubmit(event: TypedFormEvent<MyForm>) {
    event.preventDefault();
    const { elements } = event.currentTarget;
    console.log(elements.userNameInput); //It's there!
  }
  <render.stuff/>
}
```

The `TypedFormEvent` is the same as the React event, but adds the elements you specify through some interface that describes the elements you intend to use. 

<Info>

Please excuse my use of single-lettered type arguments. I know Kent's position on that one 😅. I've been using generics in C# since roughly 2008 and some old habits die hard, I sometimes _get confused_ when I read full type names as generic type arguments. I do add more info at times, but when the type in question is actually irrelevant, I use single-lettered types. I'll be using **T** as "some type" and **K** as "type of some type's keys".

</Info>

So far, so good.

What I tried next is whether the description of elements can help to write the form itself. To do this, I introduce a function that gives me an object which I can use to write JSX elements but whose relevant properties (e.g. `htmlFor`, `id`) are not typed to string, but to the properties you specified as relevant form elements.

```typescript
function formElementProvider<T, K extends keyof T = keyof T>() {
  return {
    label: ("label" as any) as ComponentType<React.LabelHTMLAttributes<HTMLLabelElement> & { htmlFor?: K }>,
    input: ("input" as any) as ComponentType<React.InputHTMLAttributes<HTMLInputElement> & { id?: K }>,
  };
}

// This can happen outside any component
const myFormElements = formElementProvider<MyForm>();
```
Remember that for intrinsic elements, if you wouldn't have JSX, you would write `React.createElement("input", ...)`, i.e. your react element "function" in this case is simply a string. The provider's job is restricted to massaging the typing of the elements in a way that they become more useful to you.

Next, instead of using the elements as provided by the usual react typings, we use it via the new element provider:

```typescript
function Test() {
  function handleSubmit(event: TypedFormEvent<MyForm>) {
    event.preventDefault();
    const { elements } = event.currentTarget;
    console.log(elements.userNameInput);
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <myFormElements.label htmlFor={"userNameInput"}>Username:</myFormElements.label>
        <myFormElements.input id={"userNameInput"} type="text" defaultValue="Arthur" />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
```

The effect is that for `htmlFor` and `id` you can only use strings that are derived from the properties that you defined in the `MyForm` interface, and the compiler will complain if you use anything else.

I haven't used this approach to handling forms in react myself yet in a production scenario, as it was directly inspired by Kent's work but I could imagine this to be useful when you don't need a fully controlled form but still want to retain some help in typing from typescript.

[kent]: https://epicreact.dev/how-to-type-a-react-form-on-submit-handler
[remix-video]: https://youtu.be/4dOAFJUOi-s