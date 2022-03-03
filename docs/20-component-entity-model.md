# Entity Component Model

Usually, a component needs some kind of data persistance.

According to [Mantra Development Paradigm](/docs/01-mantra-development-paradigm.md), the tasks associated to instantiate, access and managing data models should be as transparent as possible.

Thus, given the component should implement functionality as granular as possible too, then the models should be quite small, no more than a few numbers of entitites with few properties.

In current version of Mantra, [RedEntities](https://github.com/mantrajsframework/redentities) object mapper is used as data mapper, supporing some flavours of MySql databases like MariaDB and Aurora, PostgreSql and Sqlite databases.

*Remember:* in the same project, each component can instantiate its own data models in differents databases, given to the system a high scalability, this is one of the abilities that makes Mantra a different framework.

According to Mantra Development Paradigm, accessing data (given CRUD basic operations) should be transparent and extremely easy to manage: this is what it does RedEntities.

## Defining a model

Mantra expects to find the data model in the "/model" component model folder, described as a json object (as expected by RedEntities library). This is: that json is exactly the same that RedEntities expects to manage data models.

Given a component named as *mycomponent*, then Mantra expects its model to be defined in "/model/mycomponent.schema.json" file. Refer to [RedEntities](https://github.com/mantrajsframework/redentities) project for more information about how to define models.

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

The model is created when the component is installes when you use *install-component* command or install the project with *install* command:

```bash
$ mantrad install-component mycomponent
```

Mantra will look for *onInstall* method of the component as defined in [Component Definition](/docs/05-mantra-component-definition.md).

This method will use [Mantra.InstallSchema](/docs/33-mantra-API-reference.md#mantraapi.installschema) to create the database defined by the model.

## Uninstalling a model

Similarly to installing a model, uninstalling it follows de same process.

By running the Mantra command *uninstall-component*, the model will be removed (in addition to the component):

```bash
$ mantrad uninstall-component mycomponent
```

Mantra will look for *onUninstall* method of the component as defined in [Component Definition](/docs/05-mantra-component-definition.md).

This method will use [MantraAPI.UninstallSchema](/docs/33-mantra-API-reference.md#mantraapi.uninstallschema) to remove from the database that model.

## An example

Here there's a real example of a component implementing onInstall and onUninstall methods:

```js
"use strict";

class MarketplaceInstallation {
    async onInstall( Mantra ) {
        return Mantra.InstallSchema( "marketplace" );
    }

    async onUninstall( Mantra ) {
        return Mantra.UninstallSchema( "marketplace" );
    }
}

module.exports = () => {
    return { Install: new MarketplaceInstallation() };
}
```

In this case, Mantra will look for the model at "/components/marketplace/model/marketplace.schema.json".

## Databases connection properties

As indicated in this documentation, when using a model, Mantra looks for its database connection properties indicated in [*Entities*](/docs/36-mantraconfig-json-file.md) properties of mantraconfig.json file.

If there is not specific configuration for the component, then *"Default"* will be considered.

## Accessing data from dal js file

As explained in [Mantra Data Access Layer](/docs/21-mantra-data-access-layer.md), you can place a component name like "dal.[component name].js" inside /model folder of the component.

In that case, the instance of the model (RedEntities instace) will be loaded by Mantra at Mantra.dal.[component name].[entity name].

## Getting RedEntities instance

The component can get an instance of its model calling [Mantra.ComponentEntities](/docs/33-mantra-API-reference.md#mantraapi.componententities) API method, like this example, given "mantrademos" component with this model:

```json
{
    "entities" : [
        {
            "name" : "mantrademositems",
            "fields": [
                { "name": "userid", "type": "string" },
                { "name" : "projectname", "type" : "string" },
                { "name" : "description", "type" : "longtext" },
                { "name" : "url", "type" : "string" },
                { "name" : "created", "type" : "datetime"}
            ],
            "indexes": [ ["projectname"] ]
        }
    ]
}
```

```js
const db = Mantra.ComponentEntities("mantrademos").mantrademositems;
```

*db* is a RedEntities object with all shortcuts to run CRUD operations, as defined in [RedEntities](https://github.com/mantrajsframework/redentities) documentation.

Here another simple example, given a file named dal.mantrademos.js

```js
"use strict";

module.exports = {
    AddNew: async (Mantra, userId, projectName, url, description ) => {
        const db = Mantra.ComponentEntities("mantrademos").mantrademositems;

        return db.I().V( {
            userid: userId,
            projectname: projectName,
            url: url, 
            description: description
        }).R();
    },

    Exists: async (Mantra, mantrademodId ) => {
        const db = Mantra.ComponentEntities("mantrademos").mantrademositems;

        return db.S().W("ID=?",mantrademodId).Exists();
    },

    GetById: async (Mantra, mantrademoId) => {
        const db = Mantra.ComponentEntities("mantrademos").mantrademositems;

        return db.S().W("ID=?", mantrademoId).Single();
    },

    GetCountAll: async (Mantra) => {
        const db = Mantra.ComponentEntities("mantrademos").mantrademositems;

        return db.S().Count();
    },

    GetAll: async (Mantra) => {
        return Mantra.model.mantrademos.mantrademositems.S().OB("created", false).R();
    },

    GetPagedAll: async (Mantra, start, end ) => {
        const db = Mantra.ComponentEntities("mantrademos").mantrademositems;

        return db.S().L(start,end).OB("created", false).R();
    },

    Remove: async (Mantra, mantrademoId) => {
        const db = Mantra.ComponentEntities("mantrademos").mantrademositems;

        return db.D().DeleteById(mantrademoId);
    },

    Update: async (Mantra, mantrademoId, projectName, url, description ) => {
        const db = Mantra.ComponentEntities("mantrademos").mantrademositems;

        return db.U()
                 .W("ID=?", mantrademoId)
                 .V( ["projectname", "url", "description"], [projectName, url, description]).R();
    }
}
```

With RedEntities, the persistance of data for the components that needs to persist data models, is extremely easy and allows writing CRUD functions very fast.

More examples in the following section.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).