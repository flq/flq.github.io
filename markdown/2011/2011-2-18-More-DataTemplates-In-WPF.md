---
title: "More. DataTemplates. In. WPF."
layout: post
tags: [dotnet, libs-and-frameworks, WPF]
date: 2011-02-18 20:57:00
redirect_from: /go/198/
---

Imagine you want to fill a toolbar through its ItemsSource and appropriate DataTemplates and not all commands are created equal. Some commands should be shown as Buttons, or ToggleButtons or whatever Visual tree you may come up with. In such a situation you can use a DataTemplateSelector. How to implement one (not exceedingly complicated) is [described here](http://www.switchonthecode.com/tutorials/wpf-tutorial-how-to-use-a-datatemplateselector). Alas, it requires you to leave the realms of XAML. One idea is then to have a XAML-friendly template selector. The idea isn’t new, one implementation [can be found here](http://zhebrun.blogspot.com/2008/09/are-you-tired-to-create.html). However I wanted something even simpler: A XAML-based template selector that is only driven by the DataType specified on the template. The API shown makes it possible to have the XAML look like this:

```xml 
<ToolBar ItemsSource="{Binding Path=Control.Commands}">
    <ToolBar.ItemTemplateSelector>
        <local:DataTemplateChoice>
            <DataTemplate DataType="{x:Type cmd:CommandA}">
                <Button Height="30" Width="30" Command="{Binding Command}">
                    <Image Source="{Binding SymbolResourceName, 
                        Converter={StaticResource imgConv}}" />
                </Button>
            </DataTemplate>
            <DataTemplate DataType="{x:Type cmd:CommandB}">
                <ToggleButton Height="30" Width="30" 
                                Command="{Binding Command}" 
                                IsChecked="{Binding IsActive, Mode=OneWayToSource}">
                    <Image Source="{Binding SymbolResourceName, 
                        Converter={StaticResource imgConv}}" />
                </ToggleButton>
            </DataTemplate>
            <StaticResourceExtension ResourceKey="BasicCommandInfoDisplay" />
        </local:DataTemplateChoice>
    </ToolBar.ItemTemplateSelector>
</ToolBar>
```

The DataTemplateChoice is a container for an unlimited number of DataTemplates. The implementation is rather simple:

```csharp
[ContentProperty("Templates")]
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
}
```

Rather important for comfort is the specification of the _ContentPropertyAttribute_. That way the XAML compiler knows which property to target per default, thereby allowing to write straight into the _DataTemplateChoice_ and ensuring that the content ends up in the _Templates_ property.

Finally we need the _DataTemplates_ class, which is pretty much just a list with a method to pick out a _DataTemplate_:

```csharp
public class DataTemplates : List<DataTemplate>
{
    internal DataTemplate GetMatchFor(Type objectType)
    {
        var dataTemplate = this.FirstOrDefault(t => MatchViaDataType(t, objectType));
        return dataTemplate;
    }

    private static bool MatchViaDataType(DataTemplate arg, Type objectType)
    {
        var type = arg.DataType as Type;
        return type != null &amp;&amp; type.IsAssignableFrom(objectType);
    }
}
```

And that’s that! Make sure to specify the _DataType_ on the DataTemplates you add. Via the StaticResourceExtension you can add DataTemplates specified elsewhere. The selection is similar to the catch blocks of a try: Move down from specific to more general. And finally, specifying an interface as DataType will work without problems due to usage of _IsAssignableFrom_.

[![Shout it](http://dotnetshoutout.com/image.axd?url=http%3A%2F%2Frealfiction.net%2Fgo%2F198)](http://dotnetshoutout.com/realfiction-More-DataTemplates-In-WPF)