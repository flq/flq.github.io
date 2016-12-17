---
title: "The funny 8s and 9s in javascript"
layout: post
tags: [software-development, javascript]
date: 2007-06-19 15:02:21
redirect_from: /go/94/
---

This may be a known fact to those that have mastered javascript in real life scenarios, but just today I came across this:

<script language="javascript">
function parse() {
  var i = parseInt(document.getElementById('num').value);
  print(i);
}
function parseRight() {
  var i = parseInt(parseFloat(document.getElementById('num').value));
  print(i);
}
function print(txt) {
  document.getElementById('parsedOutput').childNodes[0].nodeValue = txt.toString();
}
</script>

<input type="text" value="01" id="num"><input type="button" value="Parse" onclick="parse();return false;"><input type="button" value="Parse right" onclick="parseRight();return false;"> :: <span id="parsedOutput">1</span>

Type in values like 02,03, etc. The underlying script will try to parse the input as an integer, and it appears that it ignores the leading zero, as you would expect.Alas, something else is going on and you will notice when you type in '08'...Huh?

You get 0. Same with 09. Weird...some of you may already see what is going on when they type '010'. Well, turns out we are not seeing a bug but a 'feature': A leading zero tells Javascript to treat the following number as written in the octal number system. This can put you in trouble so beware.

What is the workaround? The second button makes a call to parseFloat before calling parseInt. parseFloat doesn't suffer from the weird urge to interpret a number with leading zero as octal...

Here the source behind the buttons, so you do not have to rummage around the ugly source code that this CMS produces:

```javascript
function parse() {
  var i = parseInt(document.getElementById('num').value);
  print(i);
}
function parseRight() {
  var i = parseInt(parseFloat(document.getElementById('num').value));
  print(i);
}
function print(txt) {
  document.getElementById('parsedOutput').childNodes[0].nodeValue = txt.toString();
}
```