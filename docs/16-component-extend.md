# Mantra Extends Registering

Mantra has a number of default *hooks* to register some kind of assets (views, blocks, apis, etc.), as described in previous sections, but you can register your own for different purposes.

To do this, you can use "Extend" hook onStart() method:

```js
Mantra.Hooks(["component name"])
    .Extend([{
        Type: "[name for your extend]",
        ... extend properties ...
    }]);
```

You can add any properties for each "Extend" you define.

You can use [MantraAPI.GetExtendsByType](/docs/33-mantra-API-reference.md#mantraapi.getextendsbytype) to get all "extends" by type define by all components.

This is a real example for this *hook*:

```js
Mantra.Hooks("forms")
        .Extend([{
            Type: "formvalidator",
            Name: "email",
            Handler: FormsValidatorHandlers.IsEmail
        }, {
            Type: "formvalidator",
            Name: "notempty",
            Handler: FormsValidatorHandlers.NotEmpty
        }]);
```

With this mecanism, you can extend any component with new assets that other components can implement.

This is one of the most powerfull features of Mantra.

## List extends defined by a component

You can get the list of extends defined by a component with *show-extends* Mantra command:

```bash
$ mantrad show-extends <component name>
```

This is useful to verify that you have defined your extends well.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).