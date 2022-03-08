# Updating Components Data Models

During the development of any software project, data model changes are frequent.

Mantra has been design to allow easy data models updates.

Unlike *data centric* applications with big and complex relational databases (expensive to maintain and evolve), one of the principles of [Mantra Development Paradigm](/docs/01-mantra-development-paradigm.md) consists of that each component defines its own simple data model.

By doing so, a Mantra project consists of a number of components and each of them is responsible to maintain its data model and expose its data to others component defining an API.

A component can only define one data model. This restriction makes your life easy as developer... trust in me.

[Mantra API](/docs/33-mantra-API-reference.md) exposes a number of methods to update a data model from one version to the new one in a very easy way.

Basically, the steps involves during the update are this ones:
* Current model schema in the database is renamed to "temporal".
* New model schema is created in the database.
* All entities from the temporal data model are moved to the new one.
* Temporal data model is removed.

That's all. With these simple steps, most of the needs of model updates can be performed, and Mantra can do it for you.

Two main function of Mantra API are in charge of this:
* [UpdateSchemaWithCurrentEntities](/docs/33-mantra-API-reference.md#mantraapi.updateschemawithcurrententities), for automatic model updates. 
* [UpdateSchema](/docs/33-mantra-API-reference.md#mantraapi.updateschema), for custom model updates.

Let's see those two cases in the following sections.

## Update current schema to a new version

Given component "users", and its simple schema, say version 1.0.0, located at users.schema.json file under /model folder of the component:

```json 1.0.0 version (users.schema.json)
{
"entities" : [
    {
        "name" : "users",
        "fields": [
            { "name" : "mail", "type" : "string" },
            { "name" : "password", "type" : "string" },
        ],
        "indexes": [ ["mail"], ["activated","created"] ]
    }]
}
```

, we need to make an update to a new version (1.0.1), with the addition of a new field named "fullname":

```json 1.0.1 version (users.1.0.1.schema.json)
{
"entities" : [
    {
        "name" : "users",
        "fields": [
            { "name" : "mail", "type" : "string" },
            { "name" : "password", "type" : "string" },
            { "name" : "fullname", "type" : "string" },
        ],
        "indexes": [ ["mail"], ["activated","created"] ]
    }]
}
```

Notice that the name of the schema file has changed to "users.1.0.1.schema.json", Mantra obviously needs to know the new version to catch the right file from the component. Mantra knows that you need the component because the property "version" at file mantra.json file of the component has changed to 1.0.1. This is, mantra.json has chagen from:

```json 1.0.0 mantra.json for users component
{
    "name": "users",
    "version": "1.0.0"
}
```

, to:

```json 1.0.1 mantra.json for users component
{
    "name": "users",
    "version": "1.0.1"
}
```

So, currently, we got users.schema.json installed in the database and we need to update to users.1.0.1.schema.json version, which adds a simple new property ("fullname").

To do that, you only need to implement onUpdate() method in the definition of the component:

```js users.js
module.exports = () => {
   Install: {
       onUpdate: async ( Mantra, componentName, currentVersion, versionToUpdate ) => {
           // Update to the new model here
       }
   } 
} 
```

Then, run *update* command:

```bash
$ mantrad update
```

, Mantra will detect that the version of the component "users" has changed to "1.0.1" (as it says in its mantra.json file), and it will call to onUpdate of the component.

Mantra makes this updating easy.

You got two options to update: firstly, say to Mantra to copy all current data entities to the new data model (automatic update), or, secondily, implement yourself this copy of the entities to the new model (custom update).

## Automatic update of the new data model

To leave Mantra in charge of all stuff to copy all current entity models in the database to the new schema, you only need to run this version of onUpdate() method, invoking UpdateSchemaWithCurrentEntities() of Mantra API: 

```js users.js. Automatic update
module.exports = () => {
   Install: {
       onUpdate: async ( Mantra, componentName, currentVersion, versionToUpdate ) => {
           await Mantra.UpdateSchemaWithCurrentEntities( componentName, currentVersion, versionToUpdate );
           
           Mantra.Utils.Console.info( "users updated!" );
       }
   } 
} 
```

You can do this because the changes of the new model are minimal, like;

* New property added.
* Some property removed.
* Changes in indexes.
* New kind of entities (tables) added.

## Custom update of the new data model

In the case you need to write some kind of transformations of the current entities existing in the database, you can be in charge of change and insert them in the new data model. To do that, you need to define a callback function that will be called by Mantra by each existing entity in the database. updateUserEntityFnc() method of Mantra API is used in this case:

```js users.js. Custom update
module.exports = () => {
   Install: {
      onUpdate: async ( Mantra, componentName, currentVersion, versionToUpdate ) => {
         let count = 0;

         const updateUserEntityFnc = async ( entityName, entity, newdb ) => {
            if ( entityName == "users" ) {
                // Custom transform entity to adapt it to the new model

               await newdb.users.I().V(entity).R();
            }

            if ( (++count)%10 == 0 ) Mantra.Utils.Console.info(`${count} users entities updated`);
         }

         await MantraAPI.UpdateSchema( "users", currentVersion, versionToUpdate, updateEntityFnc );
      }
   } 
} 
```

In most cases, if you evolve your data models to simple models with just a few properties and entities, you'll be able to use the automatic process of updating your models. In any other cases with some specific changes, you will need to use custom update.

In either case, the task of updating components data models are extremely easy to do.