---
title: "Intermezzo: XSL 2.0 on .NET"
layout: post
tags: [software-development, dotnet, tools]
date: 2009-08-07 22:28:53
redirect_from: /go/148/
---

I was up to updating some old stuff that I had previously written in JAVA to the .NET world. It has been a while since I worked with JAVA - I had forgotten that the XSL I once built used [version 2.0](http://www.w3.org/TR/xslt20/) features. To my dismay .NET 3.5 allows you to control your coffee machine with a workflow, but once you want to calculate a duration directly in xsl you will quickly notice that .NET's in-built support only covers XSL 1.0 (and XQuery not at all).

[Saxon](http://sourceforge.net/projects/saxon/) to the rescue. Probably well known to JAVA people, a .NET port exists and can be used when you find yourself in the same corner as I did. 

Once you download, the funny packaging that includes a _netmodule_ (when have you seen such a thing the last time?) resulted in my [SharpDevelop](http://www.icsharpcode.net/OpenSource/SD/) IDE here at home to fail completely at recognizing the API. Visual Studio may do a better job at it.

Thanks to the docs and this [very helpful code example](http://onlamp.com/lpt/wlg/9272) I was able to get my Xsl Transformation up and running.

You do have to get used to the API, though, which may be pretty modular, but could be a lot better. Here is my current version (takes an input xml, an xsl and an out file as strings):

```csharp
using Saxon.Api;
...
var p = new Processor();
var cmp = p.NewXsltCompiler();
var b = p.NewDocumentBuilder();
// Here comes the uber-fake. 
// What is it good for to set the Base Uri?
b.BaseUri = new Uri("http://" + inputFile);

using (var fsXsl = File.OpenRead(xslFoFile))
using (var fsXml = File.OpenRead(inputFile))
using (var fsOut = File.Create(outFile))
{
  var exec = cmp.Compile(fsXsl);
  var t = exec.Load();
  var input = b.Build(fsXml);
  t.InitialContextNode = input;
  var s = new Serializer();
  s.SetOutputStream(fsOut);
  t.Run(s);
}
```

Plenty of code, you may say, but it gets the job done.