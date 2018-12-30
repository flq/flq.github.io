---
title: "Lexing and parsing in F#"
layout: post
tags: [software-development,fsharp]
date: 2014-10-20 16:41:55
---

With the chance of spending some time on a software project of my choice I decided to finally do something about my ignorance on tooling for parsing a piece of text into something _computationally useful_.

There is a plethora of possibilities if you want to parse text following a specific grammar, I settled down for the [FsLexYacc][1]-toolchain which works in the context of F#. Like F#, the tooling is strongly inspired [by similar software on the OCaml programming language][3]. Another useful link relating to OCaml but which is nonetheless useful in the context of learning the F# tooling [can be found over here][4].

My intention was to write a parser for the programming language Cobol. There is [a grammar definition over here][5] - it turns out that Cobol is relatively complex in that it has a gazillion of keywords which often can be used interchangeably. It is no wonder that Dijkstra once said about Cobol

> The use of COBOL cripples the mind; its teaching should, therefore, be regarded as a criminal offence.

In order to reduce the potential time expenditure escalation that it would take to write a fully fledged Cobol parser, I decided to just be able to parse some simple examples - Interestingly, [I found some on github][6].

When it comes to how to put the tools into use, there is some explaining on the project home site as well as on the [F# wikibook][2] on how to use the lexer/parser combination, I just point you out where I got stuck - as usual it's the implicit assumption people have when writing tutorials in that somehow you know every step when using a new tool even if only half of the steps is shown.

## The project file

Your F# project should contain a file defining the lexer and one defining the parser. The process goes like

1. Your lexer file defines the tokens of which your parsed language consists. Those tokens are defined in the __parser file__.
1. Your parser file defines the valid combination of tokens and defines for those the __F# types__ that will result when such a combination is encountered. Hence the parser file uses types from a __third file__, which many name __Ast (Abstract Syntax Tree)__.

That means that in order to use the tooling, somewhere in your F# project file you should have something along the lines of this:

```xml
<!-- ... -->
<Import Project="..\packages\FsLexYacc.6.0.3\bin\FsLexYacc.targets" />
<!-- (assuming you are using the FsLexYacc Nuget) ... -->
<ItemGroup>
    <Compile Include="Ast.fs" />
    <Compile Include="parser.fs" />
    <Compile Include="lexer.fs" />
    <FsLex Include="lexer.fsl">
      <OtherFlags>--unicode</OtherFlags>
    </FsLex>
    <FsYacc Include="parser.fsy">
      <OtherFlags>--module TheParser</OtherFlags>
    </FsYacc>
</ItemGroup>

```

The files _lexer.fs_ and _parser.fs_ are generated from the _lexer.fsl_ and _parser.fsy_ files, respectively. The _Ast.fs_ file is made by you. The _FsLex_ and _FsYacc_ tasks are defined in the Import shown. 

## The lexer

To remind you: The lexer will tokenize your text into Tokens, which will be used by the parser to create the final Abstract Syntax Tree.

{% gist flq/d17f239e6a7e122adbb0 lexer.fsl %}

The somewhat difficult bit here is to figure out what went wrong when something is not working as intended. Hence, every matching bit has a logging part where one can output what is currently being matched. At this step of the process the most trouble for me was to correctly write the regular expressions, a bit like when you use sed for the first time, only different.

## The parser

Once you have your tokens you need to write down the allowed combinations of those and how they translate to the types you want to end up with. The declarative nature of some functional programming constructs as well as a good understanding of recursive programming will definitely help you here.

{% gist flq/d17f239e6a7e122adbb0 parser.fsy %}

I didn't go as far as analyzing what went wrong when the parsing step failed, which means that you need to do some good thinking if the parsing step goes wrong - the standard error while parsing is not terribly useful, as it just states that something went wrong. Such an error usually means that some token combination was encountered that has not been catered for in the parser definition file.

## The syntax tree

If all goes well, that is what you want to end up with once the parsing is complete. 

{% gist flq/d17f239e6a7e122adbb0 ast.fs %}

Always keep in mind that in F# you only have one forward-only compiler pass, hence any types you define can only use any previously defined types. A recursive type requires the "and" syntax as you can see in line 46.

## Conclusion

As with every new tool it needs some getting used to and especially in F#, where tools are making a transition as to how they should be obtained (modular Nuget packages instead of monolithic setups), some samples currently cannot be found. The wikibook is very helpful by defining a full example for parsing SQL. I have found a number of redundancies in my parser file, however I fear that my lack of knowledge is mostly responsible for that.

Apart from that the approach scaled pretty well and I would certainly pick up a lot of speed if I were to write a full Cobol parser.


[1]: http://fsprojects.github.io/FsLexYacc/fsyacc.html
[2]: http://en.wikibooks.org/wiki/F_Sharp_Programming/Lexing_and_Parsing
[3]: http://plus.kaist.ac.kr/~shoh/ocaml/ocamllex-ocamlyacc/ocamlyacc-tutorial/ocamlyacc-tutorial.html
[4]: http://caml.inria.fr/pub/docs/manual-ocaml/lexyacc.html
[5]: http://www.cs.vu.nl/grammarware/vs-cobol-ii/
[6]: https://github.com/jiuweigui/cobol
