---
title: "Comfortable command line argument parsing"
layout: post
tags: [software-development, dotnet]
date: 2009-03-27 21:29:42
redirect_from: /go/141/
---

Once in a while you may want to write a command line tool which may have to accept commad line arguments. In comes a nice little bit of source code that is part of the great output of the Mono project. Documentation is available [here](http://www.ndesk.org/doc/ndesk-options/NDesk.Options/OptionSet.html) and the [source code](http://anonsvn.mono-project.com/viewvc/trunk/mcs/class/Mono.Options/Mono.Options/) can be taken, used directly, modified and it (obviously) compiles without any issues from .NET Framework 2.0 onwards.

An example is within the docs, in the following an example of how I intend to use it for a tool to be built that will extract information via the Team Foundation Server API:

```csharp
struct Args
{
  public bool ShowHelp;
  public bool IncludeBugs;
  public string FSId;

  public override string ToString()
  {
    return string.Format("show help: {0}, include bugs: {1}, passed fsid: {2}",
                         ShowHelp, IncludeBugs, FSId);
  }
}
```

This is a simple structure to capture the input from the arguments. Now comes the usage of the Options class:

```csharp
Args args = new Args();
var options =
  new OptionSet
    {
      {"h|help|?", "Prints out usage", v => args.ShowHelp = v != null},
      {"b|includeBugs", "Also consider bugs for scanning", v => args.IncludeBugs = v != null},
      {"fsid=", "Specify the functional spec ID, e.g. XYZ2", v => args.FSId = v}
    };
```

This tells the Options API which args can be accepted. Finally comes the parsing, with **input** being the string array containing any arguments passed in...

```csharp
try
{
  options.Parse(input);
  Console.WriteLine(args.ToString());
}
catch (OptionException)
{
  showHelp(options);
}

if (args.ShowHelp) showHelp(options);
```

Finally the showHelp method which uses the Options' **WriteOptionDescriptions** method...

```csharp
private static void showHelp(OptionSet options)
{
  Console.WriteLine("Intended usage:");
  options.WriteOptionDescriptions(Console.Out);
}
```

Based on this program, the showHelp method prints out the following:

```
Intended usage:
  -h, --help, -?             Prints out usage
  -b, --includeBugs          Also consider bug items for scanning
      --fsid=VALUE           Specify the functional spec ID, e.g. XYZ2
```

This style of parsing and obtaining the values allows the user to use the tool without thinking much about it. It will parse...

```
tool /h, tool --help or tool -?, tool /b /fsid:Bla or tool --includeBugs -fsid=Bla
```

Not bad, and readily available...