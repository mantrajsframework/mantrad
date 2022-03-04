# 02 Red Entities providers

(Remember: best documentation in software should be found at... tests)

When creating a Red Entities instance, you need to set the provider configuration (currently PostgreSQL, Mysql, Sqlite, Aurora, etc).

This provider info is a json object with some credentials (if needed) of data that the provider needs.

## Mysql provider config

For Mysql based engines, json configuration object is like this:

```json
{
    provider: "mysql",
    host: "<mysql host, localhost, ip, domain, etc.>",
    user: "<user name>",
    password: "<user password>"
}
```

## Sqlite provider config

For Sqlite instances, the json configuration is simple:

```json
{
    provider: "sqlite",
    databasepath: "<relative or full path to the database file>"
}
```

## PostgreSQL provider config

For PostgreeSQL instances, the json configuration is as simple as above:

```json
{
    provider: "postgresql",
    host: "<host location / IP>",
    user: "<user role to access to the database>",
    password: "<password>"
    database: "<name of the database>",
    port: <port, optional, default 5432>
}
```

## Getting a RedEntities instance

Given a configuration json object, you get a new Red Entities instance with:

```js
const RedEntities = require("redentities")( config );
```

Some samples of config files:

```js
const config = {
    provider: "postgresql",
    user: "postgres",
    host: "localhost",
    database: "redentitiestest",
    password: "12345"
}
```

```js
const config = {
    provider: "mysql",
    host: "localhost",
    user: "myuser",
    password: "mypassword"
}
```

```js
const config {
    provider: "sqlite",
    databasepath: "/mnt/files/mydatabase.db"
}
```