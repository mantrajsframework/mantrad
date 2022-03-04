# 09 Red Entities query shortcuts

Red Entities has been designed to minimize the code needed to access data, in a regular and coherent way, avoidin sql syntax directly with all its dialects depending on the provider.

There exists four *shorcuts* or *selectors* to write sql sentences efficiently and quickly.

Given 

```js
const db = await RedEntities.Entities(sampleSchema);
```

, you have these shorcuts:

* S() -> to create select queries
* I() -> to create insert queries
* U() -> to create update queries
* D() -> to create delete queries

Extremely easy to use and extremely efficient for developers to write CRUD functions.

Selectors are properties of entity instance of db object; in the sample, there's a 'user' entity (table):

* db.users.S()
* db.users.I()
* db.users.U()
* db.users.D()