# Component Updating

Following [Mantra Development Paradigm](/docs/01-mantra-development-paradigm.md), the updating of a component to a new version should be an easy task.

If the functionality of the component and its entity models are easy and simple as well, then the update process should be trivial.

On the other hand, Mantra expects to update components incrementally, to simplify this task even more.

Mantra detects if a compoment should be updated if its version indicated in mantra.json file has changed and if it is different than the version of the component currently installed.

As an example, if the mantra.json file for the current component changes from:

```json
{
    "name" : "mycomponent",
    "version" : "1.0.0",
}
```

, to:

```json
{
    "name" : "mycomponent",
    "version" : "1.0.1",
}
```

Then, this component should be updated. This update can involve model updates or not, depending of the nature of the component.

Mantra will not run the application until the components needed to updated are updated with success.

To update the component, *update* command is used:

```bash
$ mantrad update
```

By running this command, Mantra will look for components to be updated.

If found, then Mantra will call [onUpdate](/docs/05-mantra-component-definition.md#onupdate-optional) method of the Install property of the component.

Any activity needed for the updating, should be placed in onUpdate method.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).