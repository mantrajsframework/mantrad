# Mantra Data Access Layer

One of the nice features of Mantra applications (and Mantra Development Paradigm), consists of the total abstraction of the data access needs and data repositories of components.

*Remember*: Mantra uses [RedEntities](https://github.com/mantrajsframework/redentities) as object mapper, currently supporting MySql flavours, PostgreSql and Sqlite.

As a general rule, the data repository (this is, databases) of a component, should not be accesible *outside* the component. If the data managed by a component and defined in its entity model are needed by other components (as usual), then that data should be exposed using the API defined by the component.

As another rule following good development practices, there's only one entry point for data access of the component, and that entry point should be one module which only purpose is that: to provide all methods needed to access the data of the component.

All details of accessing at low level to data from databases (RedEntities queries), should be placed only inside the methods of that module.

On the other hand, to simplify this common task, Mantra provides a mecanism to do all this with minimal code. This is reason because RedEntities object mapper is used in Mantra, cause reduces the building of queries at the minimal expression.

You can define a module to access the data repository like this (real example extracted from logs component of Mantra):

```js module logsRepository.js
"use strict";

module.exports = {
    Add: async (MantraAPI, type, key, counter, description, data ) => {
        let db = MantraAPI.ComponentEntities("logs").logs;

        return db.I().V( { logtype: type, logkey: key, logcounter: counter, logdescription: description, logdata: data } ).R();
    },

    GetCount: async (MantraAPI) => {
        let db = MantraAPI.ComponentEntities("logs").logs;

        return db.S().C();
    },

    GetPaged: async (MantraAPI, start, end) => {
        let db = MantraAPI.ComponentEntities("logs").logs;

        return db.S().OB("created",false).L(start,end).R();
    },

    RemoveById: async (MantraAPI, logId ) => {
        return MantraAPI.ComponentEntities("logs").logs.D().DeleteById(logId);
    },

    GetByKey: async (MantraAPI, logKey) => {
        return MantraAPI.ComponentEntities("logs").logs.S().W("logkey=?",logKey).OB("created",false).R();
    }
}
```

You get an instance of the object mapper RedEntities using MantraAPI:

```js
MantraAPI.ComponentEntities("logs").logs
```

## Method #1 to define the module accessing the repository of a component

Given the above module logsRepository.js, then you can access the these methods loading it as usual from any of the assets of the module:

```js
const LogsRepository('./logsRepository.js);

//...

let logsEntries = await LogsRepository.GetByKey(MantraAPI, "mykey");
```

## Method #2 (and recommended) to define the module accessing the repository of a component

If you place the example module logsRepository.js inside /model folder of the component with the name "dal.logs.js", then Mantra will load it in the startup process and will place it accessible from MantraAPI.dal.logs property withoud the need of loading the component:

```js
let logsEntries = await MantraAPI.dal.logs.GetByKey(MantraAPI, "mykey");
```

In the example, "logs" is the name for the entity model provided in logs.schema.json file:

```json
{
    "entities" : [
        {
            "name" : "logs",
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
