# Component Configuration

Each component can define a json object with its own specific configuration.

There are two places where to locate a component configuration:

* Inside "ComponentsConfig" property in [mantraconfig.json](/docs/36-mantraconfig-json-file.md) with the name of the component.
* In the mantra.json file for the component in the property "defaultconfig".

As an example, consider this mantra.json file for the component "resourceminifier":

```json
{
    "name": "Resource minifier component",
    "version": "1.0.0",
    "defaultconfig": {
        "minify": false,
        "obfuscate": false,
        "compactjsfiles": false,
        "compactcssfiles": false
    },
    "dependencies": ["files"]
}
```

The json property "defaultconfig" will be considered as the default configuration for the component; to overwrite this default configuration, then this json should be placed at "ComponentsConfig" property in the project configuration file [mantraconfig.json](/docs/36-mantraconfig-json-file.md):

```json
{
    // ...
    "ComponentsConfig":
        "resourceminifier": {
            "minify": false,
            "obfuscate": false,
            "compactjsfiles": false,
            "compactcssfiles": false
    }
    // ...
}
```

With this capacity of overwritten the default component configuration, the component can be reused in other projects or adapt its behaviour for specific needs.

## Accessing component configuration from Mantra API

There are two ways to access programatically to the configuration of a component:

* Calling the method [MantraAPI.GetComponentConfig](/docs/33-mantra-API-reference.md#mantraapi.getcomponentconfig) will return all json object:

```js
const config = Mantra.GetComponentConfig("resourceminifier");
```

* Get an specific value for the component configuration with the syntax "[name of the component].[property]" directly from Mantra API object with [Config](/docs/33-mantra-API-reference.md#mantraapi.config) method:

```js
const shouldMinify = Mantra.Config("resourceminifier.minify")
```

Components configuration can not be changed at run time.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).