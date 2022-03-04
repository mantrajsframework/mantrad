# 03 Red Entities schemes

A *schema* is a json object describing the data you need to persist.

The intend of Red Entities is that components or applications can define simple *data table models* for their data persistance needs.

One json schema object can contain different entities (that finally will be translated to tables), each one with different propeties (fields).

Each entity consists of a number of properties (fields with their types).

Red Entities maps the schema to sql table dialects, depending on the provider (PosgreSQL, Mysql, Sqlite, etc.), according to configuration.

In the scope of your application, create your Red Entities instances with your schemes *once*, because the process of mapping and creation of shortcut functions is heavy load.

## Defining a schema

You define a schema with this sort of json object:

```js
const schema = {
    entities: [
        {
            name : <name of the entity>,
            fields: [{ 
                name : "<name of the property>", 
                type: "<type of the property>", 
                default: <default value> }
                ...
            ],
            indexes: [ [<name of the property>], [<name of the property 1>, <name of the property 2>] ],
            restrictions: {
                unique: [ [<name of the property>] ]
            }
        }
        ...
    ]
}
```

Each entity is mapped to a sql table. See next sections to check types currently supported and how they are mapped to specific engines supported.