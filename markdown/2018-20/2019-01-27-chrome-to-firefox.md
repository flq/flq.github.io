---
title: "I'm a Chrome-using frontend dev, but want to use Firefox more"
tags: [web, programming]
date: 2019-01-27 15:00:00
---

You like to use Chrome, and you value the in-built development aids. However, you feel increasingly uneasy about the market dominance of Chrome as the portal to the web. You'd like to give Firefox a chance, but are uncertain if some general and dev-related features will be available on Firefox. This list is geared towards the team I'm working in, but maybe others will find it useful, too.

#### I sync stuff across a plentitude of devices

Firefox has [a syncing service][1]. I use it to sync, my home and work laptop alongside my phone and iPad. According to this, the people at Firefox [only ever see your data encrypted][2].

#### I still search through Google, what the heck!

Yes it's true, [Mozilla gets money from Google][3] since they do generate search traffic towards them. At least, it's pretty easy to switch the default search engine (under **about:preferences#search**). You can give [DuckDuckGo][4] a try.

#### When I develop, I impersonate a number of accounts. On Chrome I use profiles for that. What do I do in Firefox?

Firefox has a profiles feature, too! The easiest is to enter **about:profiles** in the url input ( <kbd>Ctrl</kbd> + <kbd>L</kbd> ).

![firefox location bar](/assets/about_profiles.png)

Here you can manage profiles you define, and, most importantly, let several ones run in parallel. You can also start firefox in a specific profile with <kbd>Win</kbd> + <kbd>R</kbd> and then `firefox.exe -P profilename`. Unfortunately this only works if Firefox is not running. If you want several parallel sessions, you'll go through the location bar as described.

#### What about devtools?

Firefox has _plenty_ of devtools that also come up with <kbd>F12</kbd>, here just quickly those that we use a lot:

* mobile view can be switched on the very right
![firefox location bar](/assets/firefox-mobileview.png)
* Modify css and layout, look at the computed fields (also mapped down to the causing source code if map files are present)
* Sources are found under _Debugger_, with map files, also use <kbd>Ctrl</kbd> + <kbd>P</kbd> to locate a file.
* The _network analysis_ tab allows you to toggle the cache and throttle the network. For some crazy reason **you cannot turn off the network**, only very clumsily by going into offline mode, which affects the whol browser session. Looking for a good solution here!
* React and Redux devtools are also available and look and behave pretty much the same way as in Chrome.

Give it a shot. If anything, you can have Chrome and Firefox in parallel, who knows, you might even like the new Firefox!

[1]: https://www.mozilla.org/en-US/firefox/accounts/
[2]: https://hacks.mozilla.org/2018/11/firefox-sync-privacy/
[3]: https://www.cnet.com/news/google-firefox-search-deal-gives-mozilla-more-money-to-push-privacy/
[4]: https://duckduckgo.com