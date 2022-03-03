# Component Definition

A Mantra components is a standard Node.js module which defines a configuration file named *mantra.json*.

This json file is quite simple:

```json
{
    "name": "<name of the component>",
    "version": "<version of the component>",
    "mantraversion": "<Mantra compatible version (optional)>",
    "description": "<description of the component (optional)">,
    "dependencies":  [<array with the name of the components dependencies (optional)>],
    "defaultconfig": { <json object with the default component configuration (optional)> }
}
```

Only properties *name* and *version* are mandatories.

When Mantra looks for components, check *"ComponentsLocations"* property in [mantraconfig.json](/docs/36-mantraconfig-json-file.md) and iterates for all folders indicated in it where components should be located.

If a folder contains a file with the name *mantra.json* file, then Mantra considers it as a Mantra component.

The name of the component is considered the name of the folder which contains it.

As an example, for *mycomponents* folder, Mantra will look up *main* component:

```
+ mycomponents
+   main
+      | main.js
+      | mantra.json
+      | ... other component assets (files and folder)
+ ---
```

Mantra, in this case, expects to find a and optional js file with the name of the folder (main.js), which is a Node.js module exposing the following properties:

* Start (optional): defines some properties described below.
* Install (optional): used by Mantra when the component is installed or uninstalled
  
Following the example, main.js is a Node.js module which exposes some Mantra properties:

```js mantra.js file
"use strict";

class MainStarter {
    async onStart( Mantra ) { }
    async onStop( Mantra ) { }
    async onCheckStartupHealth( Mantra ) { }
    async onCheckHealth( Mantra ) { }
    async onServerStarted( app, Mantra ) { }
    async onSystemStarted( Mantra ) { }
}

class MainInstaller {
    async onInstall( Mantra ) { }
    async onInitialize( Mantra ) { }
    async onUninstall( Mantra ) { }
    async onUpdate( Mantra, oldVersion, currentVersion ) { }
}

module.exports = () => {
    Start: new MainStarter(),
    Install: new MainInstaller()
}
```

"Mantra" is an object created by the framework in all its interactions with the components. This object represents the core Mantra API and it is used by the components to interact with the framework and with other components.

In the following sections are described when these methods are called by Mantra bootstrap process and their purposes.

# Start methods

## onStart (optional)

This method is called by Mantra when the application starts.

It is used by the component to register its *hooks* and perform some specific component tasks.

In Mantra context, a *hook* is a definition of an asset that a component implements (APIs, gets, posts, middlewares and the like). As we'll see along this documentation, components assets can be defined registering these *hooks* of by definition in files.

Mantra don't call this method for each component in any specific order.

onStart is called once when the application is started.

## onStop (optional)

This method is called by Mantra when the application gets stop.

## onCheckStartupHealth (optional)

This method is called by Mantra to check if any specific component dependencies are up & running. The method should returns true | false indicating the result of the checks.

If returns false, Mantra will log the situation and the application will not be started.

## onCheckHealth (optional)

This method is called when *check-health* Mantra command is performed:

```bash
$ mantrad check-health
```

With this command, Mantra looks for all components which implements *onCheckHealth* and calls them.

The implementation of this method should check if its dependencies (whatever they are) are up & running, similary to *onCheckStartupHealth* or any other kind of check.

## onServerStarted (optional)

This method is called if the application activates views, post or get services. In this case, Mantra starts Express underlying server.

This method is useful if a component needs to configure some sepecific feature on Express instance.

Receives the instance of [Application Express object](https://expressjs.com/es/4x/api.html#app) as first parameter.

## onSystemStarted (optional)

Finally, this method is called when all components are loaded and have being started (all its *onStart* called by the framework).

Usefull to perform some system level tasks if needed.

# Install methods

This object contains methods to manage the creation of data models using Mantra API.

## onInstall (optional)

Called when the command *install-component* is used:

```bash
$ mantrad install-component <my component name>
```

It should perform some installing operations, like instantiate model entities.

## onInitialize (optional) 

This method is intended for some kind of initialization of the component. Is called once the first time the system starts after installing the component.

## onUninstall (optional)

Called when the command *uninstall-component* is used:

```bash
$ mantrad uninstall-component <my component name>
```

It should perform some uninstalling operations, like removing model entities using Mantra API.

## onUpdate (optional)

Called when the command *update* is used:

```bash
$ mantrad update
```

It should perform some updating operations, like updating model entities.

Mantra detects if a component should be updated if the version value of its mantra.json file has changed.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).