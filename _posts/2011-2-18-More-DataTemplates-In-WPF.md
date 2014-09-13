---
title: "More. DataTemplates. In. WPF."
layout: post
tags: programming dotnet TrivadisContent WPF
date: 2011-02-18 20:57:00
redirect_from: /go/198/
---

Imagine you want to fill a toolbar through its ItemsSource and appropriate DataTemplates and not all commands are created equal. Some commands should be shown as Buttons, or ToggleButtons or whatever Visual tree you may come up with. In such a situation you can use a DataTemplateSelector. How to implement one (not exceedingly complicated) is [described here](http://www.switchonthecode.com/tutorials/wpf-tutorial-how-to-use-a-datatemplateselector). Alas, it requires you to leave the realms of XAML. One idea is then to have a XAML-friendly template selector. The idea isn’t new, one implementation [can be found here](http://zhebrun.blogspot.com/2008/09/are-you-tired-to-create.html). However I wanted something even simpler: A XAML-based template selector that is only driven by the DataType specified on the template. The API shown makes it possible to have the XAML look like this:
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:7014f158-1942-4ec6-9851-02ce592ddd47" class="wlWriterEditableSmartContent"><pre name="code" class="xml">&lt;ToolBar ItemsSource="{Binding Path=Control.Commands}"&gt;
    &lt;ToolBar.ItemTemplateSelector&gt;
        &lt;local:DataTemplateChoice&gt;
            &lt;DataTemplate DataType="{x:Type cmd:CommandA}"&gt;
                &lt;Button Height="30" Width="30" Command="{Binding Command}"&gt;
                    &lt;Image Source="{Binding SymbolResourceName, Converter={StaticResource imgConv}}" /&gt;
                &lt;/Button&gt;
            &lt;/DataTemplate&gt;
            &lt;DataTemplate DataType="{x:Type cmd:CommandB}"&gt;
                &lt;ToggleButton Height="30" Width="30" 
                                Command="{Binding Command}" 
                                IsChecked="{Binding IsActive, Mode=OneWayToSource}"&gt;
                    &lt;Image Source="{Binding SymbolResourceName, Converter={StaticResource imgConv}}" /&gt;
                &lt;/ToggleButton&gt;
            &lt;/DataTemplate&gt;
            &lt;StaticResourceExtension ResourceKey="BasicCommandInfoDisplay" /&gt;
        &lt;/local:DataTemplateChoice&gt;
    &lt;/ToolBar.ItemTemplateSelector&gt;
&lt;/ToolBar&gt;</pre></div>

The DataTemplateChoice is a container for an unlimited number of DataTemplates. The implementation is rather simple:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:a6b59ce7-3b38-4c47-b957-5a1b84b44cd8" class="wlWriterEditableSmartContent"><pre name="code" class="c#">[ContentProperty("Templates")]
public class DataTemplateChoice : DataTemplateSelector
{
    public DataTemplateChoice()
    {
        Templates = new DataTemplates();
    }

    public DataTemplates Templates { get; private set; }

    public override DataTemplate SelectTemplate(object item, DependencyObject container)
    {
        var dt = Templates.GetMatchFor(item.GetType());
        return dt ?? base.SelectTemplate(item, container);
    }
}</pre></div>

Rather important for comfort is the specification of the _ContentPropertyAttribute_. That way the XAML compiler knows which property to target per default, thereby allowing to write straight into the _DataTemplateChoice_ and ensuring that the content ends up in the _Templates_ property.

Finally we need the _DataTemplates_ class, which is pretty much just a list with a method to pick out a _DataTemplate_:

&nbsp;

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:bca66926-db95-4d03-a319-1aafa78354a8" class="wlWriterEditableSmartContent"><pre name="code" class="c#">public class DataTemplates : List&lt;DataTemplate&gt;
{
    internal DataTemplate GetMatchFor(Type objectType)
    {
        var dataTemplate = this.FirstOrDefault(t =&gt; MatchViaDataType(t, objectType));
        return dataTemplate;
    }

    private static bool MatchViaDataType(DataTemplate arg, Type objectType)
    {
        var type = arg.DataType as Type;
        return type != null &amp;&amp; type.IsAssignableFrom(objectType);
    }
}</pre></div>

And that’s that! Make sure to specify the _DataType_ on the DataTemplates you add. Via the StaticResourceExtension you can add DataTemplates specified elsewhere. The selection is similar to the catch blocks of a try: Move down from specific to more general. And finally, specifying an interface as DataType will work without problems due to usage of _IsAssignableFrom_.

[![Shout it](http://dotnetshoutout.com/image.axd?url=http%3A%2F%2Frealfiction.net%2Fgo%2F198)](http://dotnetshoutout.com/realfiction-More-DataTemplates-In-WPF)