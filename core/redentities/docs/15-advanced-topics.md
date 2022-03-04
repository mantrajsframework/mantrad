# 15 Advanced topics

Here you can found some *advanced* topics.

## Renaming tables

To rename one specific entity (table):

```js
await db.RenameSchemaEntity( "users", "users_temp" );
```

To rename all entities of schema at once given a *sufix*:

```js
await db.RenameSchemaEntities( "_temp" );
```

This will rename all tables to "<table_name>_temp".

## Getting final sql query formatter

All selectors ( S(), I(), D(), U() ) provides the selector Q() to get the string of the query formatted, according, obvilusly, to the provider indicated in the configuration:

```js
let sqlQuery = db.users.S().W("mail=?", "rd@redentities.com").Q();
```

With its synonimous .Query():

```js
let sqlQuery = db.users.S().W("mail=?", "rd@redentities.com").Query();
```