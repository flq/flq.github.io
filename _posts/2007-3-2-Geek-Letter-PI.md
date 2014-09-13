---
title: "Geek Letter PI"
layout: post
tags: programming loosely-coupled dotnet geekdom mathematics TrivadisContent
date: 2007-03-02 20:34:29
redirect_from: /go/66/
---

My good man Andre N. pointed me to yet another geeky website:
[http://3.141592653589793238462643383279502884197169399375105820974944592.com/](http://3.141592653589793238462643383279502884197169399375105820974944592.com/),
claiming, my geek-o-meter would peak off the scale when looking at index1.html. There you have the great [transcendental number](http://en.wikipedia.org/wiki/Transcendental_number) &pi; up to 1'000'000 digits! Bless him!

Now, on a Friday evening, trying to come down from the tediousnes of implementing stuff with Oracle Forms technology, my very own geekiness comes alive - I was wondering whether I would find my name in the first million (and one) digits of PI. Of course you need to map the letters to numbers, e.g. starting from A: 0 to Z: 25.

A first search with Firefox brought nothing. Of course, the page is formatted, hence it is full of newlines that will shield you from numerous potential hits.

Therefore, the first step was to get the number in a usable format. The following code would do just that:

`
  class PiFromHtmlPage {
    public static void Extract() {
      using (StreamReader sr = File.OpenText(@"index1.html"))
        using (StreamWriter sw = File.CreateText(@"output.txt")) 
          while (!sr.EndOfStream) sw.Write(sr.ReadLine().Trim());
    }
  }
`

First you need to remove the html stuff though (pre tags and the like).
With that in hand I wrote the program to look for my name (and of course other words). The following class does that job:

`
namespace ConsoleApplication1 {
  delegate void InfoPrinter(int idx, int offset);

  class NameFinder {
    string numbers;

    public NameFinder(string numbers) {
      this.numbers = numbers;
    }

    public void FindMatch(string name, Action<string> namePrint, InfoPrinter print) {
      //unicode -> int gives 97 for a :: Level to 0 by subtracting that
      int[] nameArr = Array.ConvertAll<char,int>(name.ToLower().ToCharArray(), 
        delegate(char c) { return (int)c - 97; });
      // Improve probability of finding a name a bit
      // by offsetting each char as number of the name by what-have-you.

      for (int i = 0; i <= 100; i++) {
        StringBuilder b = new StringBuilder();
        Array.ForEach<int>(nameArr, delegate(int j) { b.Append(j + i); });
        namePrint(b.ToString()); // "ab" with offset 1 => "12"
        Regex r = new Regex(b.ToString());
        MatchCollection mc = r.Matches(numbers, 0);
        for (int k = 0; k < mc.Count; k++) print(mc[k].Index, i);
      }
    }
  }
}
`

The class is instantiated with the large number PI as a string. When _FindMatch_ is called, the word gets stored as an array of integers. Then several passes are done, every time each integer is offset by a fixed amount...That way one should have a slightly bigger chance of finding a word while preserving the alphabet characteristics of the word.

Finally, here's the program that wraps it all up for usability:

`
namespace ConsoleApplication1 {
  class Program {
    static void Main(string[] args) {
      PiFromHtmlPage.Extract();
      //pi.txt lies in bin/debug
      string pi = string.Empty;
      using (StreamReader sr = File.OpenText("pi.txt"))
        pi = sr.ReadToEnd();

      NameFinder n = new NameFinder(pi);

      while (true) {
        Console.Write("Give us a word (write x to break): ");
        string w = Console.ReadLine();
        if (w == "x") break;
        n.FindMatch(w,
          delegate(string name) { Console.WriteLine("Your word now looks like " + name); },
          delegate(int idx, int offset) {
            Console.WriteLine("name was found at index {0} with offset {1}", idx, offset);
          });
      }
    }
  }
}
`

Soo, **is my name in there?** ...Here some findings:

*   None of my names appear for any offset between 0 and 80. *SNIFF*...obviously the longer the word, the less chances there are. But with **Frank** I was hoping...
*   Monsieur **Andre**, you'll be glad to hear that your first name DOES appear in PI, for several offsets! Way to go!
*   The word **love** does not appear in PI for the first 80 offsets...unlike **hate**, which appears for numerous offsets. I find this depressing, and I'm kinda hoping, someone finds a bug in my code. I even ran a scan with deep offsets, ignoring the ridiculously small probability of finding love with an offset of 5000, but hey, never give up. Now I am relieved to see that the word **liebe **appears in PI.

And in fact, the 'word' lov3 was also found. Which brings us back to Geekdom...

PS...when I loaded the PI page, my processor suddenly shot up to 100% with firefox being the culprit. What was happening - the trusty ol' [process explorer](http://www.microsoft.com/technet/sysinternals/utilities/ProcessExplorer.mspx) pointed to the Skype Firefox plugin which tries to interpret numbers as phone numbers. It quite obviously became overpowered by all those numbers! :)