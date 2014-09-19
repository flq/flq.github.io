---
title: "Strengtening Caliburn.Micro conversion capabilities with Scal"
layout: post
tags: [programming, dotnet, libs-and-frameworks]
date: 2012-03-23 12:00:00
redirect_from: /go/217/
---

If one looks into how [Caliburn.Micro][2] performs binding between models and views, a number of methods must be considered that play a role.

* Conventions play a role how bindings are derived from naming and involved elements
* VM getter / setter situation plays a role about the supported Binding directions
* Does the VM implement anything Validation-specific?
* Is there a type mismatch between the binding source and target? (classic example: Boolean -> Visibility)

Especially for the last one Scal introduces a configuration hook to provide your own Value Converters. Check out the usage in the sample application:

    Converters.ApplyDefaults();
    ...
    public static ConverterConfiguration ApplyDefaults(this ConverterConfiguration config)
    {
        config
            .Add<bool, Visibility, BooleanToVisibilityConverter>()
            .Add<string, ImageSource, PathToImageSourceConverter>();
        return config;
    }

This is supported by replacing a certain method deep in the bowels of [Scal][1]:

    public class ValueConverterManagement
    {
        private readonly Dictionary<Tuple<Type, Type>, IValueConverter> _converters;
    
        public ValueConverterManagement(AppModel model)
        {
            ConventionManager.ApplyValueConverter = ApplyConverter;
            _converters =  model.Converters.ToDictionary(k => Tuple.Create(k.Item1, k.Item2), v => v.Item3);
        }
    
        private void ApplyConverter(Binding binding, DependencyProperty dProp, PropertyInfo vmProp)
        {
            var t = Tuple.Create(vmProp.PropertyType, dProp.PropertyType);
            _converters.Get(t).Do(v => binding.Converter = v);
        }
    }

The __ConventionManager__ is a Caliburn.Micro class that (_through the CM-typical override mechanism of replacing static Func-fields_) provides a hook into the binding operations. The key to a value converter is the pair of bound ViewModel-Type to the target UIElement type.

An additional way to leverage Caliburn.Micro's Binding routine is through the __ScalBinding__ markup extension:

`<TextBlock x:Name="Hello" Visibility="{svc:ScalBinding IsVisible}"></TextBlock>`

This markup extension will call into the relevant CM Binding-related methods beyond those that deal with the Convention-based binding. That way, the binding shown above will use Scal's knowledge of known value converters to map the __Visibility__ property to the __IsVisible__ bool.

  [1]: https://github.com/flq/scal
  [2]: http://caliburnmicro.codeplex.com/