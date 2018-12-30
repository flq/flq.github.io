---
title: "Getting into react part 2"
layout: post
tags: [react, programming, web, javascript]
date: 2017-07-22 17:00:00
---

### "react" series
1. [Getting into React Part 1][3]
1. Getting into React Part 2
1. [Create react app with typescript][4]

One thing should be clear right from the start: There is no single path to get your react application up and running. This is simply due to the fact that there is a huge array of alternatives with regard to tooling, runtime dependencies etc. etc.
If you are really just about to start, it seems that facebook's own [create-react-app][1] is a good starting point. It will hide the scary amount of configuration and wiring together but will let you _materialize_ all that once you want to introduce your own opinions with regard to building your client-side application.

```bash
npm install create-react-app
.\node_modules\.bin\create-react-app cra
cd cra
npm start
```

This creates a rather compact `package.json` file:

![package json](/assets/create-react-app-package.json.png)

All magic is hence delegated to the `react-scripts` package. Let's have a look at the starting code. Running `npm start` brings up a server
and starts the browser pointing at the right location:

![start page](/assets/create-react-app-start.png)

So, is hot reloading enabled?

![package json](/assets/cra-edit.png)

Looks like it:

![package json](/assets/cra-edit2.png)

What about the testing story? Everything seems to be prepared, so we'll just add [enzyme][2] the way it is required:

```
npm i --save-dev react-test-renderer react-dom enzyme chai
```

And write a little test with it:

```js
import { mount } from 'enzyme';
import { assert } from 'chai';

it('renders the title', ()=> {
  const wrapper = mount(<App />);
  const titleText = wrapper.find("h2").text();
  assert.include(titleText, "Welcome");
});
```

And we get

![package json](/assets/cra-testing.png)

__Awesome!__

See, I still haven't provided you with a real reason for javascript fatigue, or have I?

You get a nice starting point with all the goodness of a transpiler that will take care of your ES2016 syntax, CSS modules, hot reloading and a way to build a production bundle. As facebook states itself in the readme to the project, there are many opinions out there how a react client application should be set up and lists numerous alternatives to this approach. As it is, as long as you don't have an opinion formed yourself, this seems a pretty nice starting point that lets you get right into the code straight away and also helps you get your code into a production-ready format.

Personally, I'd be ready to go, but I know that some of my colleagues ❤ Typescript, so in the next post we'll try and see if we get into a similarly comfortable starting point, but with the Typescript compiler in the loop.


[1]: https://github.com/facebookincubator/create-react-app
[2]: https://github.com/airbnb/enzyme
[3]: /2017/07/21/getting-into-react-part-1
[4]: /2017/07/23/create-react-app-with-typescript