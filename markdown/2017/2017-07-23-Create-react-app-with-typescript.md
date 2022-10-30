---
title: "Create react app with typescript"
layout: post
tags: [programming, typescript, react]
date: 2017-07-23 19:00:00
topic: "react-intro"
---

<TopicToc topicId="react-intro" header="Getting into react" />

When I set out to use Typescript in the context of a react application, I was thinking of using some minimal boilerplate
like [this one here][1] to get going, but then figured out that create-react-app probably has a way to plug in. Io and behold, the analog to create-react-app for typescript can be found [here][2] and is used as follows:

```bash
npm install -g create-react-app
create-react-app my-app --scripts-version=react-scripts-ts
```

This essentially gives you the same starting point as the standard __create-react-app__, but with Typescript.

This often means that you will require type definitions to properly work with libraries. That is, e.g. to introduce enzyme for testing we would then do:

```
npm install --save-dev react-test-renderer react-dom enzyme chai @types/enzyme @types/chai
```

> I usually don't get VS Code refreshed when downloading types. 
> A quick restart of the app helps me out. Not sure if it is normal.

Something that you may come to appreciate to push down the number of open tabs in the browser is the auto-completion that is now available to you...

![ts auto-complete](/assets/cra-ts-autocomplete.png)

So, we're off to a good start and we may finally be able to leave the realm of hello'ing each other until boredom kicks in and destroys our brain cells.

[1]: https://github.com/Glavin001/react-hot-ts
[2]: https://github.com/wmonk/create-react-app-typescript