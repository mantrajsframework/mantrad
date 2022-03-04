# 11 Red Entities select sentences: S() selector

Selecting rows with Red Entities syntax is fast using S() selector.

Specific fields to retrieve are provided as parameter in S() selector; if no one is indicated, then all fields will be retrieved (select * ...).

## Single row or multiple rows
When using the selector S(), you pull out one or more entities.

When you know that only one row will be retrievied, when use .Single().

If you expect more than on entity, then user .R(); in this case, an array of rows will be retrieved.

## Select an entity given its id

```js
let entity = await db.users.S().SingleById(userId);
```

This is equivalent to:

```js
let entity = await db.users.S().W("ID=?",userId).Single();
```

However, for providers compatibility, it is not recommended to select entities by using this kind of where clause: use SingleById instead.

## Select just one field

```js
let entity = await db.users.S("name").SingleById(userId);
```

Only field "name" will be retrieved.

## Select more than one specific fields

Just indicated in S() parameter separated by comma:

```js
const entity = await db.users.S("name,created").SingleById(userId);
```

## Select with conditions

Type the condition in W() selector:

```js
const entities = await db.users.S().W("created < ?", dateTime).Single();
```

## Select count number

Use C() or Count() selector:

```js
const entitiesCount = await db.users.S().W("created < ?", dateTime).C();
```

Total count of users:

```js
const entitiesCount = await db.users.S().C();
```

## Take only n entities

To retrieve, ie., 10 entities, use T() selector:

```js
const entitiesCount = await db.users.S().W("created < ?", dateTime).T(10).R();
```

## Order by a field

To get some entities ordered by a field, just use OB() selector:

```js
const entitiesCount = await db.users.S().W("created < ?", dateTime).OB("name").R();
```

By default, the order is ascending. To order descending:

```js
const entitiesCount = await db.users.S().W("created < ?", dateTime).OB("name", false).R();
```

## Limit entities and offset

To get values paginated, use L() selector:

```js
// Get from 0 position, next 10 entities
let entiies = await db.uses.S().OB("created").L(0,10).R();

// Get from 10 position, next 5 entities
entities = await db.uses.S().OB("created").L(10,5).R();
```