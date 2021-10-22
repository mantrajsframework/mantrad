# Component definition

A Mantra components is a standard NodeJS module which defines a configuration file named *mantra.json*.

This json file is quite simple:

```json
{
    "name": "<name of the component>",
    "version": "<version of the component>",
    "mantraversion": "<Mantra compatible version>",
    "description": "<description of the component (optional)">,
    "dependencies":  [<array with the name of the component (optional)>],
    "defaultconfig": { <json object with component configuration (optional)> }
}
```

Properties *name*, *version* and *mantraversion* are mandatories.

When Mantra looks for components, check *"ComponentsLocations"* property in mantraconfig.json and iterates for all folders indicated in it.

If a folder contains a file with the name *mantra.json* file, then Mantra considers it as a Mantra component:

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

Mantra, in this case, expects to find a js file with the name of the folder (main.js), which is a NodeJS module with the following properties.

This module should exposed two properties:
* Start: defines some properties described below.
* Install (optional): used by Mantra when the component is installed or uninstalled
  
Following the example, main.js is a NodeJS module which exposes some Mantra properties:

```js mantra.js file
"use strict";

class MainStarter {
    async onStart( MantraAPI ) { }
    async onStop( MantraAPI ) { }
    async onCheckStartupHealth( MantraAPI ) { }
    async onCheckHealth( MantraAPI ) { }
    async onServerStarted( app, mantraAPI ) { }
    async onSystemStarted( MantraAPI ) { }
}

class MainInstaller {
    async onInstall( MantraAPI ) { }
    async onInitialize( MantraAPI ) { }
    async onUninstall( MantraAPI ) { }
    async onUpdate( MantraAPI, oldVersion, currentVersion ) { }
}

module.exports = () => {
    Start: new MainStarter(),
    Install: new MainInstaller()
}
```

In the following sections are described when these methods are called by Mantra bootstrap process.

# Start methods
## onStart
This method is called by Mantra when the application starts.

It is used by the component to register its hooks and perform some specific component tasks.

Mantra don't call this method for each component in any specific order.

## onStop (optional)

This method is called by Mantra when the application gets stop.

## onCheckStartupHealth (optional)

This method is called by Mantra to check if any specific component dependencies are up & running. The method should returns true | false indicating the result of the checks.

If returns false, Mantra will log the situation and the application will not be started.

## onCheckHealth (optional)

This method is called when *check-health* Mantra command is performed:

```
$ mantra check-health
```

This this command, Mantra looks for all components which implements *onCheckHealth* and calls them.

The implementation of this method should check if its dependencies (whatever they are) are up & running, similary to *onCheckStartupHealth*.

## onServerStarted (optional)

This method is called if the application activates views, post or get services. In this case, Mantra starts Express underlying server.

Useful if a component need to configure some sepecific feature on Express instance.

Receives the instance of [Application Express object](https://expressjs.com/es/4x/api.html#app) as first parameter.

## onSystemStarted (optional)

Finally, this method is called when all components are loaded and have being started (all its *onStart* called by the framework).

Usefull to perform some system level tasks if needed.


# Install methods
## onInstall (optional)

Called when the command *install-component* is used:

```
$ mantra install-component <my component name>
```

It should perform some installing operations, like instantiate model entities.

## onInitialize (optional) 

This method is intended for some kind of initialization of the component. Is called once the first time the system starts after installing the component.

## onUninstall (optional)

Called when the command *uninstall-component* is used:

```
$ mantra uninstall-component <my component name>
```

It should perform some uninstalling operations, like removing model entities.

## onUpdate (optional)

Called when the command *update-components* is used:

```
$ mantra update
```

It should perform some updating operations, like updating model entities.