---
title: "Authenticate a user with MSAL from a React SPA"
tags: [typescript, azure, react]
date: 2020-10-12 11:30:00
---

> #### The acronyms, oh my!
> * MSAL: Microsoft Authentication Library
> * SPA: Single Page Application
> * AAD: Azure active directory

In the [fine tradition][1] of reducing Microsoft samples to a form that focuses on the feature it tries to explain and highlight, while removing cruft that isn't really necessary, here comes the next one.

The original sample this is derived from [resides in the azure-samples repo][2]. 12 years ago it was sort of enough to show a couple of classes and that's it - now that the sample entails a server and a react client with frontend, [it needs its own repository][3].

The original sample contains a lot of noise related to using a redux store and spreading out what is really happening over several components / actions / reducers / store. I translated this into more contemporary react (no, redux isn't and shouldn't be your default choice anymore). The actual authentication magic is handled by microsoft's own library [**msal-browser**][4] and mostly plays out in the ["useMsal" react hook][5]. Check out the sign in and how the token is then aquired.

This code will do absolutely zilch for you if you haven't done your homework registering the proper Applications connected to your AAD. Some instructions are given in the [main readme of the repo][6]. Screenshots from azure are omitted because they grow stale at a rate that makes it untenable, but if something's completely unclear, let me know.

[1]: /2008/01/30/the-no-frills-bare-bones-example-to-duplex-wcf
[2]: https://github.com/Azure-Samples/ms-identity-javascript-react-spa-dotnetcore-webapi-obo
[3]: https://github.com/flq/MsIdentityReactSpaBareBones
[4]: https://www.npmjs.com/package/@azure/msal-browser
[5]: https://github.com/flq/MsIdentityReactSpaBareBones/blob/main/client-spa/src/infrastructure/msal.ts
[6]: https://github.com/flq/MsIdentityReactSpaBareBones/blob/main/client-spa/README.md