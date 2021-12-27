# Installing and uninstalling components

Each component of a Mantra project should be installed specifically with the command *install-component*:

```bash
$ mantrad install-component mycomponent
```

When running this, Mantra will look for folder components (indicated in the property *"ComponentsLocations"* in mantraconfig.json file) with the name "mycomponent".

The component should define a mantra.json file and a Node.js module with the file mycomponent.js name as indicated in [Component Definition section](/docs/04-component-definition.md).

If the component defines *Install* property, then the optional method *onInstall* will be invoked.

*Remember:* if the component will be part of the project and this on should be installed later one in other environments, then the component is considered a *default component*, and, in this case, you should include its name in *"DefaultComponents"* property of *mantraconfig.json* file.

# Uninstalling a component

To uninstall a Mantra component for the current project, you should use *uninstall-component* command:

```bash
$ mantrad uninstall-component mycomponent
```

As indicated in [Component Definition section](/docs/04-component-definition.md), if the component defines *Install* property, then the optional method *onUninstall* will be invoked.