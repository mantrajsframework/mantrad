# Mantra Core Components

In current version of Mantra (1.x), some core modules are installed in any Mantra project.

Are these ones:

# "core" core component 
Defines some middlewares needed by Mantra and the basic cron jobs for "croncleanupevent" and "cronbackupevent" events.

This is the default configuration for "core" component you can overwrite in your project:

```json
"core": {
    "croncleanupevent": "*/5 * * * * *",
    "cronbackupevent": "0 */5 * * * *",
    "minifyhtml": false,
    "compressresponses": false,
    "translatejsapi": "",
    "translatecssapi": "",
    "baseurl": "http://localhost:8080/"
}
```

* croncleanupevent: defines a cron configuration to launch "system.cleanup".
  
* cronbackupevent: defines a cron configuration to launc "system.backup".
  
* minifyhtml: if true, then html content is rendered minified. Optional.
  
* compressresponses: if true, then requests are reponsed compressed. [Compression module](https://www.npmjs.com/package/compression) is used. Optional.
  
* translatejsapi: if used, then should indicated an API name of a component (with the format "component name.api name") which will manage the process of set js files added to the render request. Optional.

This API should point to a function like this:

```js
async (MantraAPI, jsFiles )
```

Where jsFiles is an array of all js files that should be included in the rendering process.

The result of this function will be rendered in "mantra-js-files" Mustache tag in the html root document.

* translatecssapi: if used, then should indicated an API name of a component (with the format "component name.api name") which will manage the process of set css files added to the render request. Optional.

This API should point to a function like this:

```js
async (MantraAPI, cssFiles )
```

Where cssFiles is an array of all css files that should be included in the rendering process.

The result of this function will be rendered in "mantra-css-files" Mustache tag in the html root document.


# "static" core component 
Manages all cached files for static content when this property is defined to true in mantraconfig.json configuration file.

The default configuration for this component is this:

```json
"static": {
    "cached": false
}
```

# "scheduler" core component 

This is the component that runs all cron jobs defined in the project. This component only works if "cron" service is enabled in the application (see [Mantra Services](/docs/mantra-services.md) for more information about how to enable or disabled services in an application).

# "logs" core component 

Implement logs in Mantra, used when MantraAPI.LogInfo, MantraAPI.LogWarning and MantraAPI.LogError are used.

This is its default configuration:

```json
"logs": {
    "logToConsole": true,
    "daystoremoveoldlogs": 1
}
```

# "corecommands" core component

This component implements default mantra commands.

Remember that to have a list of all commands available, you just need to type "mantra" in the terminal:

```
$ mantra
```

See [Mantra commands](/docs/mantra-core-commands.md) to see default commands and [Component Commands](/docs/component-commands.md) to know how to implement your own commands in your components.