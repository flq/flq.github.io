---
title: "Removing some of DataRow's ugliness through .NET 4.0’s dynamic"
layout: post
tags: [programming, TrivadisContent, patterns, DLR, oracle]
date: 2011-04-20 12:37:00
redirect_from: /go/201/
---

If you do test your stuff, not having static compilation _at all times_ doesn’t seem too daunting. In such cases (and when you can use .NET 4.0) you can consider using the dynamic capabilities to give yourself a somewhat nicer API to deal with a DataRow (something you may end up with if you don’t want to take on a dependency to_ insert-your-favourite-ORM-tool-here_ for _insert-whatever-reasons-you-have-here_).

First we need the type construction to transpose from _DataRow_ to _dynamic_:
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:6ecd7d11-598f-4665-bd98-0af8e3f56e98" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public static class DataRowReaderExtensions
{
    public static dynamic AsDynamic(this DataRow row)
    {
        return new DataRowReader(row);
    }
}</pre></div>

&nbsp;

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:a454cc15-7ad5-4015-b4cc-95cc16080049" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public class DataRowReader : DynamicObject
{
    private readonly DataRow _dataRow;

    /// &lt;summary&gt;
    /// ctor
    /// &lt;/summary&gt;
    public DataRowReader(DataRow dataRow)
    {
        _dataRow = dataRow;
    }
    ...
}</pre></div>

The _DataRowReader_ inherits from _DynamicObject_, which allows us to react to runtime calls to methods, properties, etc. we have **NOT** defined. For example, when somebody accesses a property which does not exist...

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:868e99a1-b843-4747-8764-a0ae955540d0" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public override bool TryGetMember(GetMemberBinder binder, out object result)
{
    try
    {
        result = _dataRow[binder.Name];
    }
    catch (Exception x)
    {
        Debug.WriteLine(x.Message);
        result = null;
    }
    return true;
}</pre></div>

…or tries to write to a property…

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:f7c626c7-3359-4666-825c-30164d33e03a" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public override bool TrySetMember(SetMemberBinder binder, object value)
{
    try
    {
        _dataRow[binder.Name] = value;
    }
    catch (Exception x)
    {
        Debug.WriteLine(x.Message);
    }
    return true;
}</pre></div>

…or calls some method on it…

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:268a457c-bd5e-468e-8297-a9b3ed35c0c2" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public override bool TryInvokeMember(InvokeMemberBinder binder, object[] args, out object result)
{
    result = null;
    if (binder.Name.StartsWith("Get"))
        HandleGetCase(binder.Name, out result);
    if (binder.Name.StartsWith("Has"))
        HandleHasCase(binder.Name, out result);

    return true;
}

private void HandleHasCase(string name, out object result)
{
    var columnName = name.Replace("Has", "");
    result = _dataRow.Table.Columns.Contains(columnName);
}

private void HandleGetCase(string name, out object result)
{
    var relation = name.Replace("Get", "").Replace("Childs", "");
    result = _dataRow.GetChildRows(relation).Select(r =&gt; new DataRowReader(r)).ToArray();
}</pre></div>

What you can do now is the following:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:ad609e4f-f8f2-4b4e-9b38-91d33f34a86a" class="wlWriterEditableSmartContent"><pre name="code" class="c#">var _drReader = myRow.AsDynamic();
var name = _drReader.LastName;
_drReader.LastName = name;
//Loads childs through relation "CustomerSystem"
_drReader.GetCustomerSystemChilds() ;
//CheckIfAColumnExists
_drReader.HasLastName;
</pre></div>

Sure, the current implementation is pretty crude and can be foiled easily, but you get the idea. 

If you think this further, you may arrive to a point that you consider accessing a DB dynamically in much the same fashion, something like…

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:ffd27179-8360-4af9-85d0-41540ab81cb7" class="wlWriterEditableSmartContent"><pre name="code" class="c#">var customers = _db.Customers.FindByLastName("Brannigan")</pre></div>

Without ever having to generate code, set up mappings or dance 3 times around the grand DBA Master totem. Luckily, [this is already happening](https://github.com/markrendle/Simple.Data).