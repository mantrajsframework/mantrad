# Mantra Data Access Layer

One of the nice features of Mantra applications (and [Mantra Development Paradigm](/docs/01-mantra-development-paradigm.md), consists of the total abstraction of the data access needs and data repositories of components.

Said before, Mantra uses [RedEntities](https://github.com/mantrajsframework/redentities) as object mapper, currently supporting MySql flavours, PostgreSql and Sqlite.

As a general rule, the data repository (this is, databases) of a component, should not be accesible *outside* the component. If the data managed by a component and defined in its entity model are needed by other components (as usual), then that data should be exposed using the API defined by the component. To do that, th ecomponent should define [its own API](/docs/09-component-apis.md).

As another rule following good development practices, there's only one entry point for data access of the component, and that entry point should be one module which only purpose is that: to provide all methods needed to access the data of the component.

All details of accessing at low level to data from databases (RedEntities queries), should be placed only inside the methods of that module.

On the other hand, to simplify this common task, Mantra provides a mecanism to do all this with minimal code. This is the reason because RedEntities object mapper is used in Mantra, cause reduces the building of queries at the minimal expression.

You can define a module to access the data repository like this (real example extracted from logs component of Mantra):

```js module logsRepository.js
"use strict";

module.exports = {
    Add: async (Mantra, type, key, counter, description, data ) => {
        let db = Mantra.ComponentEntities("logs").logsitems;

        return db.I().V( { logtype: type, logkey: key, logcounter: counter, logdescription: description, logdata: data } ).R();
    },

    GetCount: async (Mantra) => {
        let db = Mantra.ComponentEntities("logs").logsitems;

        return db.S().C();
    },

    GetPaged: async (Mantra, start, end) => {
        let db = Mantra.ComponentEntities("logs").logsitems;

        return db.S().OB("created",false).L(start,end).R();
    },

    RemoveById: async (Mantra, logId ) => {
        return Mantra.ComponentEntities("logs").logsitems.D().DeleteById(logId);
    },

    GetByKey: async (Mantra, logKey) => {
        return Mantra.ComponentEntities("logs").logsitems.S().W("logkey=?",logKey).OB("created",false).R();
    }
}
```

You get an instance of the object mapper RedEntities using MantraAPI:

```js
let db = Mantra.ComponentEntities("logs").logsitems;
```

or...

```js
let db = Mantra.model.logs.logsitems;
```

## Method #1 to define the module accessing the repository of a component

Given the above module logsRepository.js, then you can access the these methods loading it as usual from any of the assets of the module:

```js
const LogsRepository('./logsRepository.js);

//...

let logsEntries = await LogsRepository.GetByKey(Mantra, "mykey");
```

## Method #2 (and recommended) to define the module accessing the repository of a component

If you place the example module logsRepository.js inside "/model" folder of the component with the name "dal.logs.js", then Mantra will load it in the startup process and will place it accessible from Mantra.dal.logs property withoud the need of loading the component:

```js
let logsEntries = await Mantra.dal.logs.logsitems.GetByKey(Mantra, "mykey");
```

In the example, "logsitems" is the name for the entity model provided by "logs" component in logs.schema.json file:

```json
{
    "entities" : [
        {
            "name" : "logsitems",
            "fields": [
                { "name" : "logtype", "type" : "key" },
                { "name" : "logdescription", "type" : "string" },                
                { "name" : "logdata", "type": "string" },
                { "name" : "created", "type" : "datetime"}
            ],
            "indexes": [ ["logtype"], ["logtype","created"], ["created"] ]
        }
    ]
}
```

Refer to [RedEntities](https://github.com/mantrajsframework/redentities) documentation to learn how easy it is to write CRUD operations in Mantra operations.

## No joins!

Yes, read this again: Mantra is a *no join* framework, and this is one of the key to develop maintenable applications with easy migrations that will evolve with minimal technical debt.

I promise...

As defined in [Mantra Development Paradigm](/docs/01-mantra-development-paradigm.md), components should define simple data models with simple entities, and their needs are reduced to create, read, update and delete entities (CRUD operations).

Mantra doesn't want their applications depend on complex data models (difficult to migrate and manage), and the price to pay for is that, precisely: components only defines simple models, so, components will be small and easy to maintain.

Each component manages its own data models. That's the point. Difficult to see the benefits of this approach in the long run.

If in the context of a Mantra application, you need to make some *join* operations, you need to do them programatically, but, if you have decomposed the application correctly, the need for this will be small.

But, what about application analytics calculations, complex metrics, etc.?

With Mantra approach, when a complex application needs some kind of analytics, then components should export the data needed to a third party agent for that purpose.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).