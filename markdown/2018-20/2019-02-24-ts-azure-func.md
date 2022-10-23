---
title: "Writing azure functions with typescript"
tags: [web, azure, typescript]
date: 2019-02-24 19:00:00
---

Even though there is [some prior art to this][1], I wanted to document my own findings when wanting to code an azure function in TypeScript. The next commands assume a powershell cli.

```bash
mkdir ts-func-demo; cd ts-func-demo
npm install func
npx func init
``` 

Make sure your selected worker runtime is `node`. You now are sort of on the _"function host"_ level of things. Let's create an _actual_ function.

```bash
npx func new --language JavaScript --template HttpTrigger --name Ping
cd Ping
rm sample.dat
```

We are now in the "Ping" directory, containing an `index.js` and a `function.json` containing the binding definitions for your function. Function bindings are the Alpha and Omega of azure functions. Based on the template the index.js generated is set up to accept HTTP requests and respond to them.

The next steps make sure that typescript is around as well as some more stuff that you'll need which you can read while npm is downloading parts of the internet.

```bash
npm init
npm i --save typescript tslib
npm i --only=dev @azure/functions
npx tsc --init
```

* We downloaded `tslib` - `tsc` compiles the typescript generated by you and tslib contains numerous helpers that are used by the generated js. E.g., as soon as you write an async function in Typescript, **tslib** will be required. 
* The package `@azure/functions` contains type definitions for those things that the azure runtime provides to your code. It is [still in beta][2]
* Now you should have a `tsconfig.json` at your disposal which controls what the typescript compiler (tsc) will be doing.

Here's one tsconfig.json in use for a function:

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "target": "es5",
    "strict": true,
    "outDir": ".",
    "forceConsistentCasingInFileNames": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "rootDir": "./src",
    "typeRoots": ["../node_modules/@azure"],
    "lib": ["es2017"],
    "importHelpers": true,
    "sourceMap": true
  },
  "exclude": ["bin", "node_modules"]
}
```

Defining the `rootDir` will let you keep your ts files away from the root directory. Of interest is also `module`, and possibly `moduleResolution` which should be compatible to a node environment. The `outDir` will see to the output being dropped where the `index.js` is that was generated by the template, while the `typeRoots` should also include the `@azure/functions` package. Make sure that `lib` does not include `dom` since we are programming a backend system.

Now, in `src` you can implement the body of the function as `index.ts`:

```typescript
import { HttpRequest, Context, Response } from "@azure/functions";

export default async function(context: Context, req: HttpRequest): Promise<Response> {
  context.log("Demo function being called");
  const name = req.query["name"];
  if (name) {
    return {
      res: {
        status: 200,
        body: `Hello there ${name}`
      }
    };
  } else {
    return {
      res: {
        status: 400,
        body: "You need to provide a name"
      }
    };
  }
}
```

The Return Type of the function is defined by us - you can set up additional typings to the `@azure/functions` package that support you in your coding. For example, since `function.json` sets up an output HTTP binding named "res", we can return to that binding as a return value of the function.

We set this up by defining an own `az-function.d.ts` file, which could look like this:

```typescript
export * from "@azure/functions";
declare module "@azure/functions" {
  export interface Response {
    res?: {
      status: number;
      body: string;
    };
  }
}

```
Now, when you run

```
npx tsc -w
```

It should overwrite the index.js that was generated by the template with the one compiled from typescript and run in **watch mode**. Once you start the func host from the root of the functions project (`npx func start`), you should be in business to try out your function!

----

> when this gets older and things change, be aware that this post uses
> ```
> npm --version:     6.4.1
> npx tsc --version  3.3.3333
> npx func --version 2.3.317
> ```

[1]: https://medium.com/@amr.farid140/awesome-typescript-azure-functions-part-1-project-setup-1f5950e7a704
[2]: https://github.com/Azure/Azure-Functions/issues/483