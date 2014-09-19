---
title: "WCF: Externalize Binding Configuration Only"
layout: post
tags: [libs-and-frameworks, csharp]
date: 2010-07-30 15:00:00
redirect_from: /go/171/
---

In one of our current objects we are using WCF as Client-Server communication. Contracts and endpoints are easily defined: We are using a common interface assembly from which the contracts are derived and setting the endpoint URLs is a matter of providing an address root. Currently the ABC of WCF is set up programmatically: The targetted architecture allowed it and it ensures a set up of WCF clients and servers with a minimum of configuration.

Where shortcomings in a programmatic, low-config approach have come up is in the binding configuration: It defines the transport mechanisms and things like maximum message sizes, receive and send timeouts and the like - Things that are likely to change between a test, development and production system. In WCF examples out there you will usually see an all-or-nothing approach when it comes to configuration. Set up addresses, contracts, bindings, behaviours, etc.

However, the following code will allow you to obtain bindings configuration from the config file while setting up the rest programmatically:

    public static class BindingFactory
    {
        public static Binding GetFromConfig(string configurationName)
        {
            var bingingsSection = BindingsSection.GetSection(ConfigurationManager
              .OpenExeConfiguration(ConfigurationUserLevel.None));
            var bindingType = (from b in bingingsSection.BindingCollections
                            where b.ConfiguredBindings.Count > 0 && b.ContainsKey(configurationName)
                            select b.BindingType).FirstOrDefault();
            var binding = bindingType != null ? 
              Activator.CreateInstance(bindingType, configurationName) : 
              null;
            return (Binding)binding;
        }
    }

It obtains the Bindings section from the configuration file of the current executable. Such a file may look as follows:

    <?xml version="1.0" encoding="utf-8" ?>
    <configuration>
      <system.serviceModel>
        <bindings>
          <netTcpBinding>
            <binding name="netTcp" sendTimeout="00:05:00" />
          </netTcpBinding>
        </bindings>
      </system.serviceModel>
    </configuration>

The BindingFactory gives you access to bindings defined in the application config file and you can use it in a programmatic scenario as follows:

    serviceHost.AddServiceEndpoint(
      typeof (IServerWithCallback),
      BindingFactory.GetFromConfig("netTcp"),
      "net.tcp://localhost:9080/DataService");

There is an issue right now in that the Binding Factory is Binding-agnostic, while the endpoint address provided is not (Why, btw? – What about binding-agnostic endpoint addresses which may be mapped to actual addresses somewhere else?), but changing the whole channel probably merits some other code changes here & there.