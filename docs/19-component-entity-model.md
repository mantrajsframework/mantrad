# Entity Component Model

Usually, a component needs some kind of data persistance.

According to Mantra paradigm, the tasks associated to instantiate, access and managing data models should be as transparent as possible.

Thus, given the component should implement functionality as granular as possible too, then the models should be quite small, no more than a few numbers of entitites.

In current version of Mantra, [RedEntities](https://github.com/gomezbl/redentities) object mapper is used as data mapper, supporing some flavours of MySql databases and Sqlite databases.

*Remember:* in the same project, each component can instantiate its own data models in differents databases, given the system high scalability.

## Defining a model

Mantra expects to find the data model for the component in *model* folder described as a json object (as expected by RedEntities library).

Given a component named as *mycomponent*, then Mantra expects its model to be defined in "/model/mycomponent.schema.json" file. Refer to RedEntities project for more information about how to define models.

Due to Mantra paradigm, models should be simple, like this example.

```js
{
    "entities" : [
        {
            "name" : "articles",
            "fields": [
                { "name" : "userid", "type" : "string" },
                { "name" : "title", "type": "string" },
                { "name" : "subtitle", "type" : "string" },
                { "name" : "type", "type": "string" },
                { "name" : "content", "type": "json" },
                { "name" : "published", "type": "boolean" },
                { "name" : "created", "type" : "datetime" }
            ],
            "indexes": [ ["userid"], ["created"], ["published","created"] ]
        }
    ]
}
```

## Installing a model

The model is created when the component is install when you use *install-component* command:

```
$ mantra install-component mycomponent
```

Mantra will look for *onInstall* method of the component as defined in [Component Definition](/docs/04-component-definition.md).

This method will use MantraAPI.InstallSchema( "<component name>" ) to create the database defined by the model.

## Uninstalling a model

Similarly to installing a model, uninstalling it follows de same process.

By running the Mantra command *uninstall-component*, the model will be removed:

```
$ mantra uninstall-component mycomponent
```

Mantra will look for *onUninstall* method of the component as defined in [Component Definition](/docs/04-component-definition.md).

This method will use MantraAPI.UninstallSchema( "<component name>" ) to create the database defined by the model.

## Databases connection properties

As indicated in this documentation, when using a model, Mantra looks for its database connection properties indicated in *"Entities"* properties of *mantraconfig.json* file.

If there is not specific configuration for the component, then *"Default"* will be considered.

## Accessing data from dal js file

As explained in [Mantra Data Access Layer](/docs/mantra-data-access-layer.md), you can place a component name like "dal.[component name].js" inside /model folder of the component.

In that case, the instance of the model (RedEntities instace) will be loaded by Mantra at MantraAPI.dal.[component name].[entity name].