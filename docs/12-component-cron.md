# Component Cron Jobs Definitions

A component can define a job to be executed recurrently.

As other kind of Mantra assets, you have two ways to define a cron job in a component: using the *hook* "Cron" of implicity in a file.

## Defining a cron using the hook "Cron"

You just need to add the hook "Cron" like this:

```js
Mantra.Hooks("mycomponent")
    .Cron({
        CronConfig: "standard cron configuration",
        CronHandler: async () => {}
    });
```

Where:

* CronConfig: standard cron configuration based on Linux crontab, for instance: "0/1 * * * * *"
* CronHandler: asyncronous function to be called to perform some action periodically according to the cron configruration.

## Defining a cron implicity 

The same than above, can be indicated in a file named as "cron.<componentname>.js" that should be inside "/controllers" folder of the component.

In this case, the properties of the hook "Cron" are indicated as properties to be exported by that module:

* <cron name>: name of the cron job.
* <cron name>_config: cron configuration

Here there's an example:

```js
module.exports = {
    newtick_config: "*/1 * * * * *",
    newtick : async ( ) => {
        const Mantra = global.Mantra.MantraAPIFactory();

        await Mantra.LogInfo( `New tick! at ${new Date().toISOString() }`)
    }
}
```

## Cron aliases

Cron configuration can be set by some Mantra aliases, easy to understand and write.

Are these ones:

* "1s": equivalent to "*/1 * * * * *"
* "5s": : equivalent to "*/5 * * * * *"
* "30s": : equivalent to "*/30 * * * * *"
* "1m": : equivalent to "0 */1 * * * *"
* "5m": equivalent to "0 */5 * * * *"
* "30m": equivalent to "0 */30 * * * *"
* "1h": equivalent to "0 0 */1 * * *"
* "5h": equivalent to "0 0 */5 * * *"
* "1d": equivalent to "0 0 0 */1 * *"

For example, to define a cron to be called efery five minutes:

```js
module.exports = {
    newtick_config: "5m",
    newtick : async ( ) => {
        const Mantra = global.Mantra.MantraAPIFactory();

        await Mantra.LogInfo( `New tick! at ${new Date().toISOString() }`)
    }
}
```

## Cron config by component property

Another method to define the configuration of the cron, consists of use a property of the component.

A component can have any number of properties, defined at "defaultconfig" value at mantra.json of the component. These default properties can be overwritten at [mantraconfig.json](/docs/36-mantraconfig-json-file.md) project file at "ComponentsConfig" section.

Read about [component configuration](/docs/18-component-configuration.md).

Mantra check the value of the cron configuration in this order:

* Checks if it is a valid crontab value.
* If not, checks if it is an alias as described above.
* If not, checks if it is a component configuration propert.

In the example:

```js
module.exports = {
    newtick_config: "tickcronconfig",
    newtick : async ( ) => {
        const Mantra = global.Mantra.MantraAPIFactory();

        await Mantra.LogInfo( `New tick! at ${new Date().toISOString() }`)
    }
}
```

, Mantra expects to find the property configuration "tickcronconfig" at the component configuration.

## Mantra API instance in cron jobs

Mantra creates itself a Mantra API instance en each interaction with the compoments.

However, due to the nature of cron jobs, if the cron handler needs to get a Mantra API instance, the it should create it itself with:

```js
const Mantra = global.Mantra.MantraAPIFactory();
```

## List crons defined by a component

You can get the list of crons defined by a component with *show-crons* Mantra command:

```bash
$ mantrad show-crons <component name>
```

This is useful to verify that you have defined you *crons* well.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).