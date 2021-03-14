---
title: "It's continued Pi Day - again!"
tags: [software-development, geekdom, mathematics]
date: 2021-03-14 19:30:00
---

Oh. My. Gawd - it's Pi Day, again! I've written a few times about Pi already. No idea why this number fascinates me so much. I even made a blog post [exactly 10 years ago][1]. Unfortunately, back then I used Silverlight. Had I just used Javascript, I would still have running code.

I have also written about continued fractions [once before][2]. They are a fascinating construct which can be used to build interesting numbers. One interesting number is...Pi. You can see on wikipedia [some examples for Pi expansions][3] in the form of continued fractions.

![My Mum's trusty Sony tape player](/assets/wikipedia-pi.png)
<figcaption>Continued fraction of Pi as taken from Wikipedia</figcaption>

If we take one of those and slap it into js, we get sth like this:

```js
function pi(steps) {
    const result = 3 + (1 / fraction(3, steps));
    return result;
}

function fraction(numerator, remainingSteps) {
    if (remainingSteps === 0)
      return 6;
    return 6 + ((numerator * numerator) / 
               fraction(numerator + 2, remainingSteps - 1));
}
```

The steps is the input as to how far you want to go down the rabbit hole on the continued fraction.

Let's give it a shot:

```sh
> pi(40)
3.1415960255684015

> pi(400)
3.1415926574380006

> pi(4000)
3.1415926535936936

> pi(8631)
3.141592653589_4045
```
**8631** was then incidentally the highest recursion depth before node on the cli would tell me... **RangeError: Maximum call stack size exceeded**. Checking against the number Pi as found on the internet I see that the **first 12 digits** after the decimal point **are correct**. Good enough for most calculations, I assume.

Happy Pi day everyone!


[1]: /2011/03/14/in-honour-of-the-pi-day-expansion-series-in-silverlight
[2]: /2007/06/03/road-to-reality-continued-fractions
[3]: https://en.wikipedia.org/wiki/Continued_fraction#Generalized_continued_fraction