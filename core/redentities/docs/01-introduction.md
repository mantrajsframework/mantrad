# 01 Introduction

Red Entities is a the object-mapper (OM) & sql builder for building quickly model schemes and accessing data with fast and minimal code.

It is the object mapper used by [Mantra Framework](https://www.mantrajs.com).

It has been designed with optimization and extensibility in mind. Future versions will improve and add more database providers.

The key idea behind Red Entities is to aisolate applications from their needs of data persistance, by using simple data models (simple data models with a few of entities and the minimal data types).

This is the one of the keys to build highly scalable applications easy to maintain and evolve, as you can red at Mantra White Paper: [Mantra Development Paradigm](https://www.mantrajs.com/mantradoc/whitepaper).

Current version, supports the following data providers:

* PostgreSQL 8x
* MySql 5x, 8x (like Amazon Aurora and all MySql flavours)
* Sqlite 3.

More providers coming (like Redis, MariaDB, Sql/Azure Sql, etc)

Despite Red Entities is a subproject of [Mantra Framework](https://www.mantrajs.com), you can use it by its own in your projects.

Red Entities is a *no join* Object Mapper. Read this again...

Why?

Because for complex systems that will evolve significantly, hard relational databases are difficult to maintain and evolve. This is, Red Entities implements the concept named as *simple data tables model* for data persistance.

## Design intention

The design intention behind Red Entities is to keep data in data repositories (databases) with minimal design and no relations between entities, avoiding complex sql syntax typing in production code.

This can be sound weird to hear, but this is one of the principles to follow for radical componetization of large applications that will evolve and will be change continuosly with changes in the business layer, database design, etc.

Minimal design in data repositories: Yes, is a principle to afford big projects with models which change constantly. Just use repositories as... a way to store, modify an retrieve data.

Each component in the system should use and manage its own simple data repositories (no more than a few tables by component).

That's the reason that Red Entities doesn't support joins...

If some kind of analytics should be performed over data, then these data should be placed in a way to *allow* data analysis in a different repository, but production data should be placed in a simple storage as posible: fast to insert and fast to retrieve with minimal syntax to do this.

Red Entities follow this software principle: data should be stored according to how that data will be consumed by their clients.

The way you explote your data, determines the way it should be stored.

As said above, this project is part of [Mantra Framework](https://wwww.mantrajs.com), which uses fully Red Entities as its object-mapper data access layer to build its components.

# Documentation index

* [01 Introduction](/docs/01-introduction.md)
* [02 Providers](/docs/02-providers.md)
* [03 Schemas](/docs/03-schemas.md)
* [04 Types](/docs/04-types.md)
* [05 Indexes](/docs/05-indexes.md)
* [06 IDs](/docs/06-ids.md)
* [07 Sample scheme](/docs/07-samplescheme.md)
* [08 Schemes creation](/docs/08-schemescreation.md)
* [09 Query shorcuts](/docs/09-queryshortcuts.md)
* [10 Insert: I() selector](/docs/10-insert.md)
* [11 Select: S() selector](/docs/11-select.md)
* [12 Update: U() selector](/docs/12-update.md)
* [13 Delete: D() selector](/docs/13-delete.md)
* [14 Iterating over entities](/docs/14-iterating.md)
* [15 Advanced topics](/docs/15-advanced-topics.md)
* [16 Recommendations](/docs/16-recommendations.md)