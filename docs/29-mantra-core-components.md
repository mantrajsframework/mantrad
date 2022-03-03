# Mantra Core Components

Some core modules are installed in any Mantra project.

Are these ones:

# "core" component 

Defines some middlewares needed by Mantra and the basic cron jobs for "croncleanupevent" and "cronbackupevent" events.

This is the default configuration for "core" component you can overwrite in your project:

```json
"core": {
    "croncleanupevent": "*/5 * * * * *",
    "cronbackupevent": "0 */5 * * * *",
    "logapi": "",
    "minifyapi": "",
    "translatejsapi": "",
    "translatecssapi": ""
}
```

These are the properties description for "core" component configuration:

* croncleanupevent: defines a cron configuration to launch "system.cleanup".
  
* cronbackupevent: defines a cron configuration to launc "system.backup".
    
* translatejsapi: if used, then should indicate an injection key indicating the API to be called which will manage the process of set js files added to the render request. Optional.

This injection should point to an API function like this:

```js
async (MantraAPI, jsFiles )
```

Where jsFiles is an array of all js files that should be included in the rendering process.

The result of this function will be rendered in "mantra-js-files" Mustache tag in the html root document.

* translatecssapi: if used, then should indicate an injection key indicating the API to be called which will manage the process of set css files added to the render request. Optional.

Again, this injection should point to an API function like this:

```js
async (MantraAPI, cssFiles )
```

Where cssFiles is an array of all css files that should be included in the rendering process.

The result of this function will be rendered in "mantra-css-files" Mustache tag in the html root document.

* logapi:  if used, then should indicate an injection key indicating the API to be called which will manage how to log messages when Mantra application calls Mantra.LogInfo(), Mantra.LogWarning() and Mantra.LogError() method: 

* [Mantra.LogInfo](/docs/33-mantra-API-reference.md#mantraapi.loginfo)
* [Mantra.LogWarning](/docs/33-mantra-API-reference.md#mantraapi.logwarning)
* [Mantra.LogError](/docs/33-mantra-API-reference.md#mantraapi.logerror)


This injection should point to an API function like this:

```js
async (Mantra, params )
```

Where params, is an object like containing these properties:

* type: <type of log, value in 'info', 'error', 'warning'>
* key: <key for the log entry, specific id for the log, optional>,
* counter: <counter for the key used, used for order entries by concept, optional>,
* description: <description of the log entry>
* data: <detail data of the log, can be a string of an object>

* minifyapi:  if used, then should indicate an injection key indicating the API to be called which will manage the minify process of html content. Optional.

This injection should point to an API function like this:

```js
async (Mantra, htmlContent)
```

The method should returned the htmlContent minified.

# "static" core component 

Manages all cached files for static content when this property is defined to true in mantraconfig.json configuration file.

The default configuration for this component is this:

```json
"static": {
    "cached": false
}
```

# "scheduler" core component 

This is the component that runs all cron jobs defined in the project. This component only works if "cron" service is enabled in the application (see [Mantra Services](/docs/25-mantra-services.md) for more information about how to enable or disabled services in an application).

# "corecommands" core component

This component implements default Mantra commands.

Remember that to have a list of all commands available, you just need to type "mantrad" in the terminal:

```bash
$ mantrad
```

See [Mantra commands](/docs/28-mantra-core-commands.md) to see default commands and [Component Commands](/docs/17-component-commands.md) to know how to implement your own commands in your components.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).