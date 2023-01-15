---
title: "Getting all files containing a failed test from a jest run"
layout: post
tags: [tools, javascript, react]
date: 2022-08-04 23:00:00
---

The past 2 days has seen 2 of us at ahead upgrading from react router 5 to version 6 (or remix router v1 as I like to call it, because it is _considerably_ different to version 5). 

Once we did all possible preparations while still being on V5, we could either 

* use a package that helps in a migration
* pull the plug, upgrade the dependencies and let **Typescript** guide us in the process of fixing the app

Of course we underestimated the effort somewhat, even so after 2 days we can conclude that the upgrade was successful. At one point, however, we were looking at **85 failing tests** across numerous test files. If you know jest, and have searched around a bit you will find that it is not even _that_ simple to get a simple straightforward list of file names in which failing tests reside.

<Info>
we were working as a pair, sometimes splitting up repetitive work, so the idea was to have a list of files containing some failed test and split it up between the two of us.
</Info>
The following approach is _one way_ to get a list of file names with failed tests after all.

You can run jest such that it will output a json file containing all outcomes of the tests:

```bash
jest --json --outputFile=testrun.json
```

A typical output looks like that:

```json
{
  "numFailedTestSuites": 0,
  "": "...",
  "snapshot": {
    "added": 0,
    "": "...",
  },
  "testResults": [
    {
      "assertionResults": [
        {
          "ancestorTitles": ["features/stories/StoryRoutes"],
          "": "...",
          "title": "unmounts story on onmount"
        },
      ],
      "name": "/.../StoryRoutes.spec.tsx",
      "": "...",
    },
```
Once you have the test, you can download/install the [json query tool jq](https://stedolan.github.io/jq/) which will help extract the information that is relevant for us. Since I am on OSX I did

```bash
brew install jq
```

jq has many ways to extract, aggregate and even manipulate json from the command line with a fairly elaborate syntax. With that in mind, we can use a query to obtain the relevant info:

```bash
cat testrun.json | jq '[.testResults[] | select(.status == "failed") | .name | split("/") | .[-1:]] | flatten'
```


The above query will
*  find all elements inside the `testResults` array whose `status` property matches failed
* take the `name` property, split it on slashes (the output may vary according to your OS), and take the last element of the resulting array
* the above is packed into one big array which is subsequently flattened.

That way you get a simple list that contains the file names of all test files that contain at least one failed test.