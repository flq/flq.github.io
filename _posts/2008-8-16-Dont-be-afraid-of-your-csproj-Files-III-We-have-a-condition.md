---
title: "Don't be afraid of your csproj-Files (III): We have a condition"
layout: post
tags: dotnet TrivadisContent msbuild visual-studio
date: 2008-08-16 08:22:23
redirect_from: "/go/130"
---

# Project references

Consider the following situation: You want to test an application that uses plugins. The dependencies look as such:

`
RF.CsProjTests.Console
  - RF.CsProjTests.PluginA
  - RF.CsProjTests.PluginB
`

Maybe you want to be able to test Console either with A or B. You can do that with Visual Studio's configuration manager. Here you will find **Debug** and **Release** configurations by default, but nobody stops you from adding your own configuration. It can usually be found on the toolbar as a dropdown list, which also contains the entry "**Configuration Manager...**"

Select it and the manager appears that will let you create a new configuration...

![](/files/images/msbuildconfmgr.png)

The next dialog allows you to provide a name and copy settings from a different configuration.

![](/files/images/msbuildnewconf.png)

And presto, a new configuration has been created for you. For this example configuration I choose not to compile PluginB.

![](/files/images/msbuildpluginaconf.png)

However, after having done that, and considering that you never ever compiled Plugin B, you will get an unfriendly error message from Visual Studio:

`
Metadata file 'C:\dotnet\...\RF.CsProjTests.PluginB.dll' could not be found
`

Which may never be found, since it will never be compiled. This situation can be remedied, if we have a look into the csproj file and see that project references enter the game via the item group mechanism:

<xmlcode>
  <ItemGroup>
    <ProjectReference Include="..\RF.CsProjTests.PluginA\RF.CsProjTests.PluginA.csproj">
      <Project>{7D3042B7-F44A-496B-9C51-07DC1D202D8D}</Project>
      <Name>RF.CsProjTests.PluginA</Name>
    </ProjectReference>
    <ProjectReference Include="..\RF.CsProjTests.PluginB\RF.CsProjTests.PluginB.csproj">
      <Project>{F275963D-9314-4C95-A4E3-EBF93FAC7414}</Project>
      <Name>RF.CsProjTests.PluginB</Name>
    </ProjectReference>
  </ItemGroup>
</xmlcode>

After inhaling some of msbuild's capabilities and indeed just by looking some way up inside the csproj file one notices that item groups may be defined or not depending on a condition defined on them. Putting this together with the fact that the name of the configuration is available within the csproj-msbuild context, one can redefine the above Item group in the following way:

<xmlcode>
  <ItemGroup Condition=" '$(Configuration)' == 'WithPluginA' ">
    <ProjectReference Include="..\RF.CsProjTests.PluginA\RF.CsProjTests.PluginA.csproj">
      <Project>{7D3042B7-F44A-496B-9C51-07DC1D202D8D}</Project>
      <Name>RF.CsProjTests.PluginA</Name>
    </ProjectReference>
  </ItemGroup>
  <ItemGroup Condition=" '$(Configuration)' == 'WithPluginB' ">
    <ProjectReference Include="..\RF.CsProjTests.PluginB\RF.CsProjTests.PluginB.csproj">
      <Project>{F275963D-9314-4C95-A4E3-EBF93FAC7414}</Project>
      <Name>RF.CsProjTests.PluginB</Name>
    </ProjectReference>
  </ItemGroup>
</xmlcode>

While Visual Studio still shows both project references in the solution explorer, the compilation will indeed only consider the item group that is available by comparing the **$(Configuration)** variable to the appropriate configuration name. 

# Assembly & file references

The same may work for assembly references. Here you may choose to reference either a debug or a release build depending on your configuration. It even works for project file references.

One possible scenario came up in the Ninject discussion group. How could one have a different DI-configuration depending whether I am doing Debug or Release?

Here the configuration is a compiled class and one way is probably to use the #if DEBUG directive. I don't know why, but I don't like it (Actually, I hate it. I know, it's a personal issue which I will have to surpass in order to advance in my karmic equilibrium). Slightly better, but not quite as powerful would be the **[Conditional("DEBUG")]** attribute on a method.

A different way altogether is to create two identical types (same name), put them into different files and separating out the file reference in the csproj file accordingly:

<xmlcode>
  <ItemGroup Condition=" '$(Configuration)' != 'ProdBuild' ">
    <Compile Include="Modules\DebugModule.cs" />
  </ItemGroup>
  <ItemGroup Condition=" '$(Configuration)' == 'ProdBuild' ">
    <Compile Include="Modules\ProdModule.cs" />
  </ItemGroup>
</xmlcode>

Visual Studio will adhere. Indeed when you switch the configuration the syntax highlighting will disappear shortly afterwards for the file that is currently not part of the active build. It is up to you whether you like this or not, but it's an interesting tool in the box