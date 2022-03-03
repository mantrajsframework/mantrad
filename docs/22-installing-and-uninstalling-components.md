# Installing and Uninstalling Components

Each component of a Mantra project should be installed specifically with the command *install-component*:

```bash
$ mantrad install-component mycomponent
```

When running this, Mantra will look for folder components, indicated in the property *"ComponentsLocations"* in [mantraconfig.json](/docs/36-mantraconfig-json-file.md) file with the name "mycomponent".

The component optionally can define a mantra.json file, a Node.js module with the file mycomponent.js name as indicated in [Component Definition section](/docs/05-mantra-component-definition.md), if need, to register all *hooks* it implements (we've seen in this documentation that all of them can be defined implicity by definitions).

If the component defines *Install* property, then the optional method *onInstall* will be invoked.

*Remember:* if the component will be part of the project and this on should be installed later one in other environments, then the component is considered a *default component*, and, in this case, you should include its name in *"DefaultComponents"* property of *mantraconfig.json* file.

# Uninstalling a component

To uninstall a Mantra component for the current project, you should use *uninstall-component* command:

```bash
$ mantrad uninstall-component mycomponent
```

As indicated in [Component Definition section](/docs/05-mantra-component-definition.md), if the component defines *Install* property, then the optional method *onUninstall* will be invoked.

# Reinstalling a component

You can perform the uninstalling and installing actions at once when needed, for example, when you need to install changes in a component model during development when no update needed:

To do that, you can use *reinstall-command*:

```bash
$ mantrad reinstall-component mycomponent
```

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).