---
title: "A HTTP file server in 130 lines of code"
layout: post
tags: programming dotnet web
date: 2010-04-17 16:32:00
redirect_from: /go/166/
---

...of which 20 deal with mapping file extensions to MIME types. 

For an integration test I want to be able to set up an HTTP server that serves files from a directory. While I was at it I ensured that a proper directory listing and links are provided by the web server so I can browse the contents of a directory from my browser. With the aid of the [HttpListener](http://msdn.microsoft.com/en-us/library/system.net.httplistener.aspx) this is quite easy to do.

The whole thing is wrapped inside a class HttpFileServer, implementing disposable.
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:dc577a0e-949c-4180-8762-62094bf06400" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public HttpFileServer(string rootPath)
{
  this.rootPath = rootPath;
  http = new HttpListener();
  http.Prefixes.Add("http://localhost:8889/");
  http.Start();
  http.BeginGetContext(requestWait, null);
}

public void Dispose()
{
  http.Stop();
}</pre></div>

Careful with the selection of your port. You’ll get an Exception if it is registered to another application, even if that application is not running. The _requestWait_ method is a callback that allows you to react to incoming requests asynchronously. It should be implemented with the well known pattern introduced to .NEt almost a decade ago:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:42f290aa-16a0-4453-a63a-bd105a4de8f8" class="wlWriterEditableSmartContent"><pre name="code" class="c#">if (!http.IsListening) return;
var c = http.EndGetContext(ar);
http.BeginGetContext(requestWait, null);</pre></div>

c is of type [HttpListenerContext](http://msdn.microsoft.com/en-us/library/system.net.httplistenercontext.aspx). The callback will also be called when the HttpListener is stopped, hence make sure that you only do stuff when you really seem to have a legitimate request.

As long as you keep your method re-entrant (i.e. you do not try to keep any request-specific state in some instance variable) you should be fine with multiple requests leading to multiple threads handling those.

As a file server, I only need to differ between a file being requested, a directory or something I don’t know:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:e648ff6e-d1a1-4880-8be9-b9f46606717a" class="wlWriterEditableSmartContent"><pre name="code" class="c#">var url = tuneUrl(c.Request.RawUrl);
var fullPath = string.IsNullOrEmpty(url) ? rootPath : Path.Combine(rootPath, url);

if (Directory.Exists(fullPath))
  returnDirContents(c, fullPath);
else if (File.Exists(fullPath))
  returnFile(c, fullPath);
else 
  return404(c);</pre></div>

The dir contents just serves some HTML. Here, especially on a computer where German umlauts are inside directory and file names, you should not forget to put the proper encoding into the HTML header:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:a8078900-a5a0-4969-9133-e9b2a381f6e1" class="wlWriterEditableSmartContent"><pre name="code" class="c#">context.Response.ContentType = "text/html";
context.Response.ContentEncoding = Encoding.UTF8;
using (var sw = new StreamWriter(context.Response.OutputStream))
{
  sw.WriteLine("&lt;html&gt;");
  sw.WriteLine("&lt;head&gt;&lt;meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"&gt;&lt;/head&gt;");
  sw.WriteLine("&lt;body&gt;&lt;ul&gt;");</pre></div>

When links contain spaces, umlauts etc. modern browsers should take care about escaping them correctly into a URL request sent to the server (at least Chrome does). On the server side you need to ensure that this is converted back into things understood by the classes in System.IO, which happily deal with UTF-8 encoded strings. Thankfully there is a class in .NET, the [HttpUtility](http://msdn.microsoft.com/en-us/library/system.web.httputility.aspx) in System.Web that will be able to do that for you:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:fc5c0022-cf2b-4409-9829-a1e6ad34012c" class="wlWriterEditableSmartContent"><pre name="code" class="c#">private static string tuneUrl(string url)
{
  url = url.Replace('/', '\\');
  url = HttpUtility.UrlDecode(url, Encoding.UTF8);
  url = url.Substring(1);
  return url;
}</pre></div>

When actually hitting a file, you need to read it and write it to the appropriate output stream. Just to be on the safe side regarding file size, I chose a chunked approach:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:5e1d94f6-1388-4b3a-a44d-2ba626c8a7a5" class="wlWriterEditableSmartContent"><pre name="code" class="c#">context.Response.ContentType = 
  getcontentType(Path.GetExtension(filePath));
using ( var fs = File.OpenRead(filePath))
{
  context.Response.ContentLength64 = fs.Length;
  int read;
  while ((read = fs.Read(buffer, 0, buffer.Length)) &gt; 0)
    context.Response.OutputStream.Write(buffer, 0, read); 
}</pre></div>

Don’t forget in all cases to **close the Output Stream**. In the case of using a StreamWriter, it’s disposal will close the underlying stream, in the case of serving the file directly, you’ll need to do it yourself.

To make things a bit more comfortable for e.g. a browser, it is useful to provide an appropriate MIME type. This is pretty boring code and goes along the lines of this example. A fairly nice list [can be found here](http://www.feedforall.com/mime-types.htm):

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:3e69c679-f01c-4aa4-9228-15380626d000" class="wlWriterEditableSmartContent"><pre name="code" class="c#">private static string getcontentType(string extension)
{
  switch (extension)
  {
    case ".avi":  return "video/x-msvideo";
    case ".css":  return "text/css";
    ...</pre></div>

And for those who want to play with this, here’s the full monty:
<script src="http://gist.github.com/369432.js?file=HttpFileServer.cs"></script>[![Shout it](http://dotnetshoutout.com/image.axd?url=http%3A%2F%2Frealfiction.net%2Fgo%2F166)](http://dotnetshoutout.com/A-HTTP-file-server-in-130-lines-of-code)