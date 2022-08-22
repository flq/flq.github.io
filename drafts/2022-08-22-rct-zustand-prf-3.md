---
title: "Using zustand in react - performance gains (Pt. 2)"
layout: post
tags: [tools, typescript, react]
date: 2022-08-23 15:00:00
topic: "zustand-perf"
---

<TopicToc topicId="zustand-perf" header="Performance Gains Pt II" />

In the last post we managed to give snappiness back to editing the header - but when using the checkbox on one of the 4'000 child items, the observant, _um_, observer notices a tiny bit of lag. Indeed, since the items array of the data store is rebuilt, the `<Items>` component renders and subsequently all children.

In order to limit the rendering to a single item, in the context of using Zustand we will use the second parameter to the store hook that we are using, the **comparer**.

The comparer is a function that allows you to override the comparison behavior, which ultimately decides whether a consumer of the store hook will re-render or not. With this in mind we change the `<Items>` component as follows:

<GHEmbed repo="zustand-playground" branch="items-o12n" file="src/Items.tsx" start={5} end={17} />

In the comparer we basically encode some domain knowledge about our app - there is no action that would mutate the array in such a way that the UI cannot recognize as a trigger for rendering a new state. We completely delegate the responsibility of rendering to each item of the array. We also do not pass the item into the child component anymore but rather rely on said component to obtain the data with the passed in index through the store.

Let's change the `<Item>` component to adapt to this new responsibility:

<GHEmbed repo="zustand-playground" branch="items-o12n" file="src/Items.tsx" start={19} end={39} />

as you can see from line 20 onwards, we now extract the item from the store **and** provide a comparer that will check whether the item is still the same or not.

With this in place, checking a checkbox feels pretty snappy again, and looking into the profiler looks the way we expect it to behave:

![Neither Header or Items renders anymore, only a single Item component renders](/assets/zustand-pg5.png)
<figcaption>Only a single item renders now</figcaption>

Yes, there are certainly other ways to control selective rendering (memoizing comes to mind), but in the context of using Zustand you should know now how to **split** the data of a store into different components via **selectors** and how you can influence selective rendering by overriding the default **comparison** behavior of equalling the output of the selector.