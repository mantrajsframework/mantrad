
# Red Entities
![RedEntities logo](./docs/logo/redentities-logo-320.png)

<p><small>(<a href='https://www.freepik.es/vectores/marco'>Logo attribution</a>)</small></p>

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![License](https://img.shields.io/npm/l/express.svg)](https://github.com/jprichardson/node-fs-extra/blob/master/LICENSE)

## What it is?

Red Entities is a simple but flexible and fast object-mapper & sql query builder.

This is a subproject of [Mantra Framework](https://www.mantrajs.com) you can use freely in your own projects.

Red Entities is focused on minimal typing when accesing data and the definition of database models using schemes (simple json objects).

A model is defined in a json object, called *schema*.

Data access (inserts, selects, removes and updates), are done by *selectors* for a fast an simple writing of the sentences.

## Database engines supported

Tested with:

* PostgreSQL 8.x
* Mysql 5.x
* Mysql 8.x
* Amazon Aurora
* AWS RDS databases based on Mysql
* Sqlite3
* (future integration of Redis, MariaDB, Sql Server, Sql Azure Tables, DynamoDB, etc.)
  
Thus, has been fully tested with:

* Node.js 10.x
* Node.js 12.x
* Node.js 13.x
* Node.js 14.x
* Node.js 15.x
* Node.js 16.x
* Node.js 17.x

## Install

```bash
$ npm i redentities --save
```

## Test

Change database configuration [providers](/docs/02-providers.md) in file located at:

```
/test/providersconfig.json
```

Testing will create many databases and tables.

Then, just run (mocha required): 

```bash
$ npm run testmysql
$ npm run testsqlite
$ npm run testpostgresql
```

## Basic sample

As a basic introduction, consider this self-explained schema: 

```js
const sampleSchema = {
    entities: [
        {
            name : "users",
            fields: [
                { name : "mail", type : "string" },
                { name : "password", type : "string" },
                { name : "created", type : "datetime"}
            ],
            indexes: [ ["mail"], ["created"] ]
        }
    ]
}
```

Load this schema in an Red Entities object with:

```js
const RedEntities = require("redentities")({
    provider: "mysql",
    host: "localhost",
    user: "myuser",
    password: "mypassword"
});
```

Create the schema in database with:

```js
await RedEntities.Entities(sampleSchema).CreateSchema();
```

From now on, you can use Red Entities powers with fast sentences like this:

```js
const db = await RedEntities.Entities(sampleSchema);

const newUserId = await db.users.I().V( { 
    mail: "re@redentities.com",
    password: "12345" ).R();
```

Retrieve an entity with simple sentences like:

```js
const userEntity = await db.users.S().SingleById(userId);
```

## Documentation
- [#01 Introduction](/docs/01-introduction.md)
- [#02 Providers config](/docs/02-providers.md)
- [#03 Defining schemas](/docs/03-schemas.md)
- [#04 Supported types](/docs/04-types.md)
- [#05 Indexes](/docs/05-indexes.md)
- [#06 Rows ids](/docs/06-ids.md)
- [#07 Sample schema](/docs/07-sampleschema.md)
- [#08 Creating schemas](/docs/08-schemascreation.md)
- [#09 Query shortcuts](/docs/09-queryshortcuts.md)
- [#10 Inserting values](/docs/10-insert.md)
- [#11 Selecting values](/docs/11-select.md)
- [#12 Updating values](/docs/12-update.md)
- [#13 Deleting values](/docs/13-delete.md)
- [#14 Iterating over values](/docs/14-iterating.md)
- [#15 Advanced topics](/docs/15-advanced-topics.md)

## Demos

You can find some demos at /demos folders.

To run them, just

```js
node /demos/<demo name.js>
```

[01-inserts-sample](/demos/01-inserts-sample.js) : Insert and retrieve basic values
[02-insert-and-iterate](/demos/02-insert-and-iterate.js) : Insert a bulk of values and iterates over them
[03-insert-and-deleteall](/demos/03-insert-and-deleteall.js) : Insert a bulk of values and removed them
[04-json-type](/demos/04-json-type.js) : Insert a bulk of json objects and retrieve them
  
#### Credits

`RedEntities` has been fully written by  [Rafael Gómez Blanes](https://github.com/gomezbl)

Professional site at [Rafablanes.com](https://www.rafablanes.com)

Have a look to my books at [Rafa G. Blanes books](https://www.rafablanes.com/mislibros)

## License

Licensed under MIT terms.

Copyright (c) 2019-2021:

* [Mantra Framework &copy;](https://www.mantrajs.com)
* [Rafael Gómez Blanes](https://www.rafablanes.com) 

## Contact an support

You can contact us by GitHub, accesing [Mantra web site](https://wwww.mantrajs.com) or at support@mantrajs.com.